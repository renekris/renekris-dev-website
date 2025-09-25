const fs = require('fs').promises;
const path = require('path');

/**
 * Custom Playwright reporter for performance monitoring and analysis
 */
class PerformanceReporter {
  constructor(options = {}) {
    this.options = {
      outputFile: 'test-results/performance/performance-report.json',
      enableRealTimeLogging: true,
      trackMemoryUsage: true,
      trackTimings: true,
      ...options,
    };

    this.results = {
      summary: {
        startTime: null,
        endTime: null,
        totalDuration: 0,
        testCount: 0,
        workerCount: 0,
      },
      tests: [],
      workers: {},
      performance: {
        memory: [],
        timings: [],
        browserMetrics: {},
      },
      insights: [],
    };

    this.workerMetrics = new Map();
    this.browserStartTimes = new Map();
  }

  onBegin(config, suite) {
    this.results.summary.startTime = Date.now();
    this.results.summary.workerCount = config.workers;
    this.results.testCount = suite.allTests().length;

    if (this.options.enableRealTimeLogging) {
      console.log(`🚀 Starting ${this.results.testCount} tests with ${config.workers} workers`);
    }

    // Create performance directory
    this.ensurePerformanceDirectory();

    // Start memory monitoring if enabled
    if (this.options.trackMemoryUsage) {
      this.startMemoryMonitoring();
    }
  }

  onTestBegin(test, result) {
    const projectName = test.parent.project().name;
    const testId = `${projectName}-${test.title}`;

    // Track browser startup time
    if (!this.browserStartTimes.has(projectName)) {
      this.browserStartTimes.set(projectName, Date.now());
    }

    // Initialize test metrics
    const testMetrics = {
      id: testId,
      title: test.title,
      projectName: projectName,
      file: test.location.file,
      line: test.location.line,
      startTime: Date.now(),
      workerId: result.workerIndex,
      retryCount: result.retry,
      status: 'running',
    };

    this.results.tests.push(testMetrics);

    // Track worker metrics
    if (!this.workerMetrics.has(result.workerIndex)) {
      this.workerMetrics.set(result.workerIndex, {
        id: result.workerIndex,
        testsRun: 0,
        totalTime: 0,
        currentTest: testId,
        startTime: Date.now(),
      });
    }

    const workerMetric = this.workerMetrics.get(result.workerIndex);
    workerMetric.currentTest = testId;
    workerMetric.testsRun++;

    if (this.options.enableRealTimeLogging) {
      console.log(`  🧪 Starting: ${test.title} (${projectName}) [Worker ${result.workerIndex}]`);
    }
  }

  onTestEnd(test, result) {
    const projectName = test.parent.project().name;
    const testId = `${projectName}-${test.title}`;
    const endTime = Date.now();

    // Find and update test metrics
    const testMetrics = this.results.tests.find(t => t.id === testId);
    if (testMetrics) {
      testMetrics.endTime = endTime;
      testMetrics.duration = endTime - testMetrics.startTime;
      testMetrics.status = result.status;
      testMetrics.errors = result.errors;

      // Collect performance data from the test if available
      if (result.attachments) {
        const performanceAttachment = result.attachments.find(a => a.name === 'performance-metrics');
        if (performanceAttachment) {
          try {
            testMetrics.performanceMetrics = JSON.parse(performanceAttachment.body.toString());
          } catch (error) {
            // Ignore parsing errors
          }
        }
      }

      // Update worker metrics
      const workerMetric = this.workerMetrics.get(result.workerIndex);
      if (workerMetric) {
        workerMetric.totalTime += testMetrics.duration;
        workerMetric.currentTest = null;
      }

      // Track browser-specific metrics
      if (!this.results.performance.browserMetrics[projectName]) {
        this.results.performance.browserMetrics[projectName] = {
          testCount: 0,
          totalDuration: 0,
          averageDuration: 0,
          passRate: 0,
          failureCount: 0,
          passCount: 0,
        };
      }

      const browserMetrics = this.results.performance.browserMetrics[projectName];
      browserMetrics.testCount++;
      browserMetrics.totalDuration += testMetrics.duration;
      browserMetrics.averageDuration = browserMetrics.totalDuration / browserMetrics.testCount;

      if (result.status === 'passed') {
        browserMetrics.passCount++;
      } else {
        browserMetrics.failureCount++;
      }
      browserMetrics.passRate = browserMetrics.passCount / browserMetrics.testCount;

      // Log real-time results
      if (this.options.enableRealTimeLogging) {
        const statusEmoji = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
        const duration = (testMetrics.duration / 1000).toFixed(2);
        console.log(`  ${statusEmoji} ${test.title} (${projectName}) - ${duration}s`);

        // Warn about slow tests
        if (testMetrics.duration > 10000) {
          console.log(`    🐌 Slow test warning: ${test.title} took ${duration}s`);
        }
      }
    }
  }

  onStdOut(chunk, test, result) {
    // Parse performance metrics from console output if available
    const output = chunk.toString();
    if (output.includes('Performance metric:')) {
      try {
        const metricMatch = output.match(/Performance metric: (\w+) (\d+(?:\.\d+)?)/);
        if (metricMatch) {
          const [, name, value] = metricMatch;
          const projectName = test?.parent?.project()?.name || 'unknown';

          if (!this.results.performance.timings[projectName]) {
            this.results.performance.timings[projectName] = [];
          }

          this.results.performance.timings[projectName].push({
            testTitle: test?.title || 'unknown',
            metric: name,
            value: parseFloat(value),
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
  }

  onEnd(result) {
    this.results.summary.endTime = Date.now();
    this.results.summary.totalDuration = this.results.summary.endTime - this.results.summary.startTime;

    // Stop memory monitoring
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
    }

    // Convert worker metrics to array
    this.results.workers = Array.from(this.workerMetrics.values());

    // Generate insights
    this.generateInsights();

    // Save detailed results
    this.saveResults();

    // Print summary
    this.printSummary();
  }

  async ensurePerformanceDirectory() {
    try {
      await fs.mkdir('test-results/performance', { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  startMemoryMonitoring() {
    if (!this.options.trackMemoryUsage) return;

    this.memoryMonitorInterval = setInterval(() => {
      const memUsage = process.memoryUsage();
      this.results.performance.memory.push({
        timestamp: Date.now(),
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
      });
    }, 5000); // Every 5 seconds
  }

  generateInsights() {
    const insights = [];

    // Analyze test durations
    const durations = this.results.tests.map(t => t.duration).filter(d => d > 0);
    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      const slowTests = this.results.tests.filter(t => t.duration > avgDuration * 2);

      insights.push({
        type: 'duration',
        message: `Average test duration: ${(avgDuration / 1000).toFixed(2)}s`,
        data: { avgDuration, maxDuration, slowTestCount: slowTests.length },
      });

      if (slowTests.length > 0) {
        insights.push({
          type: 'warning',
          message: `${slowTests.length} tests are significantly slower than average`,
          data: { slowTests: slowTests.map(t => ({ title: t.title, duration: t.duration })) },
        });
      }
    }

    // Analyze worker efficiency
    if (this.results.workers.length > 1) {
      const workerEfficiency = this.results.workers.map(w => ({
        id: w.id,
        testsPerSecond: w.testsRun / (w.totalTime / 1000),
        utilization: w.totalTime / this.results.summary.totalDuration,
      }));

      const avgUtilization = workerEfficiency.reduce((a, b) => a + b.utilization, 0) / workerEfficiency.length;

      insights.push({
        type: 'parallelization',
        message: `Average worker utilization: ${(avgUtilization * 100).toFixed(1)}%`,
        data: { workerEfficiency, avgUtilization },
      });

      if (avgUtilization < 0.6) {
        insights.push({
          type: 'recommendation',
          message: 'Consider reducing worker count or improving test parallelization',
          data: { currentWorkers: this.results.workers.length, recommendedWorkers: Math.ceil(this.results.workers.length * 0.8) },
        });
      }
    }

    // Browser performance analysis
    const browserPerformance = Object.entries(this.results.performance.browserMetrics);
    if (browserPerformance.length > 1) {
      const fastest = browserPerformance.reduce((a, b) => a[1].averageDuration < b[1].averageDuration ? a : b);
      const slowest = browserPerformance.reduce((a, b) => a[1].averageDuration > b[1].averageDuration ? a : b);

      insights.push({
        type: 'browser-comparison',
        message: `Fastest browser: ${fastest[0]} (${(fastest[1].averageDuration / 1000).toFixed(2)}s avg)`,
        data: { fastest: fastest[0], slowest: slowest[0] },
      });
    }

    this.results.insights = insights;
  }

  async saveResults() {
    try {
      await fs.writeFile(
        this.options.outputFile,
        JSON.stringify(this.results, null, 2)
      );

      // Also save a simplified version for quick analysis
      const summary = {
        timestamp: new Date().toISOString(),
        duration: this.results.summary.totalDuration,
        testCount: this.results.tests.length,
        workerCount: this.results.summary.workerCount,
        insights: this.results.insights,
        browserMetrics: this.results.performance.browserMetrics,
      };

      await fs.writeFile(
        'test-results/performance/summary.json',
        JSON.stringify(summary, null, 2)
      );
    } catch (error) {
      console.error('Failed to save performance results:', error);
    }
  }

  printSummary() {
    const duration = (this.results.summary.totalDuration / 1000).toFixed(2);
    const avgTestDuration = this.results.tests.length > 0 ?
      (this.results.tests.reduce((sum, t) => sum + (t.duration || 0), 0) / this.results.tests.length / 1000).toFixed(2) :
      0;

    console.log('\n📊 Performance Summary:');
    console.log(`  ⏱️  Total Duration: ${duration}s`);
    console.log(`  🧪 Tests Run: ${this.results.tests.length}`);
    console.log(`  👥 Workers Used: ${this.results.summary.workerCount}`);
    console.log(`  📈 Average Test Duration: ${avgTestDuration}s`);

    if (this.results.insights.length > 0) {
      console.log('\n💡 Performance Insights:');
      this.results.insights.forEach(insight => {
        const emoji = insight.type === 'warning' ? '⚠️' : insight.type === 'recommendation' ? '💡' : '📊';
        console.log(`  ${emoji} ${insight.message}`);
      });
    }

    console.log(`\n📁 Detailed report: ${this.options.outputFile}`);
  }
}

module.exports = PerformanceReporter;