const path = require('path');
const fs = require('fs').promises;

/**
 * Global teardown for Playwright tests
 * Handles cleanup, performance analysis, and result aggregation
 */
async function globalTeardown(config) {
  console.log('🧹 Starting Playwright global teardown...');

  try {
    // Analyze performance results
    await analyzePerformanceResults(config);

    // Generate test summary
    await generateTestSummary(config);

    // Cleanup temporary files
    await cleanupTempFiles(config);

    // Archive old test results
    await archiveOldResults(config);

    console.log('✅ Global teardown completed successfully');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

/**
 * Analyze performance results and generate insights
 */
async function analyzePerformanceResults(config) {
  console.log('📊 Analyzing performance results...');

  try {
    const resultsPath = path.join(config.outputDir, 'results.json');
    const performancePath = 'test-results/performance';

    // Read test results
    const resultsData = await fs.readFile(resultsPath, 'utf8').catch(() => '{}');
    const results = JSON.parse(resultsData);

    // Collect performance metrics from individual tests
    const performanceMetrics = {
      totalTests: results.suites?.reduce((acc, suite) => acc + suite.specs.length, 0) || 0,
      totalDuration: results.stats?.duration || 0,
      averageTestDuration: 0,
      slowestTests: [],
      fastestTests: [],
      browserPerformance: {},
      coreWebVitals: {},
    };

    if (results.suites) {
      const allTests = [];
      results.suites.forEach(suite => {
        suite.specs.forEach(spec => {
          spec.tests.forEach(test => {
            allTests.push({
              title: test.title,
              duration: test.results[0]?.duration || 0,
              status: test.results[0]?.status || 'unknown',
              projectName: test.projectName,
            });
          });
        });
      });

      // Calculate averages and extremes
      const durations = allTests.map(t => t.duration).filter(d => d > 0);
      if (durations.length > 0) {
        performanceMetrics.averageTestDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

        const sorted = allTests.sort((a, b) => b.duration - a.duration);
        performanceMetrics.slowestTests = sorted.slice(0, 5);
        performanceMetrics.fastestTests = sorted.slice(-5).reverse();
      }

      // Group by browser project
      const byProject = {};
      allTests.forEach(test => {
        if (!byProject[test.projectName]) {
          byProject[test.projectName] = [];
        }
        byProject[test.projectName].push(test);
      });

      Object.keys(byProject).forEach(project => {
        const tests = byProject[project];
        const totalDuration = tests.reduce((sum, test) => sum + test.duration, 0);
        const avgDuration = totalDuration / tests.length;

        performanceMetrics.browserPerformance[project] = {
          testCount: tests.length,
          totalDuration,
          averageDuration: avgDuration,
          passRate: tests.filter(t => t.status === 'passed').length / tests.length,
        };
      });
    }

    // Save performance analysis
    await fs.writeFile(
      path.join(performancePath, 'analysis.json'),
      JSON.stringify(performanceMetrics, null, 2)
    );

    // Generate performance insights
    const insights = generatePerformanceInsights(performanceMetrics);
    await fs.writeFile(
      path.join(performancePath, 'insights.md'),
      insights
    );

    console.log('  ✅ Performance analysis completed');

  } catch (error) {
    console.warn('  ⚠️  Performance analysis failed:', error.message);
  }
}

/**
 * Generate performance insights in markdown format
 */
function generatePerformanceInsights(metrics) {
  const insights = [];

  insights.push('# Playwright Test Performance Analysis\n');
  insights.push(`**Generated:** ${new Date().toISOString()}\n`);

  insights.push('## Summary\n');
  insights.push(`- **Total Tests:** ${metrics.totalTests}`);
  insights.push(`- **Total Duration:** ${(metrics.totalDuration / 1000).toFixed(2)}s`);
  insights.push(`- **Average Test Duration:** ${(metrics.averageTestDuration / 1000).toFixed(2)}s\n`);

  if (metrics.slowestTests.length > 0) {
    insights.push('## Slowest Tests\n');
    metrics.slowestTests.forEach((test, index) => {
      insights.push(`${index + 1}. **${test.title}** (${test.projectName}) - ${(test.duration / 1000).toFixed(2)}s`);
    });
    insights.push('');
  }

  insights.push('## Browser Performance\n');
  Object.keys(metrics.browserPerformance).forEach(project => {
    const perf = metrics.browserPerformance[project];
    insights.push(`### ${project}`);
    insights.push(`- Tests: ${perf.testCount}`);
    insights.push(`- Total Duration: ${(perf.totalDuration / 1000).toFixed(2)}s`);
    insights.push(`- Average Duration: ${(perf.averageDuration / 1000).toFixed(2)}s`);
    insights.push(`- Pass Rate: ${(perf.passRate * 100).toFixed(1)}%`);
    insights.push('');
  });

  insights.push('## Recommendations\n');

  if (metrics.averageTestDuration > 10000) {
    insights.push('- 🐌 **Slow Tests Detected:** Consider optimizing tests that take longer than 10 seconds');
  }

  if (metrics.totalDuration > 300000) {
    insights.push('- ⏱️ **Long Test Suite:** Consider increasing parallelization or reducing test scope');
  }

  const browserProjects = Object.keys(metrics.browserPerformance);
  if (browserProjects.length > 3) {
    insights.push('- 🌐 **Multiple Browsers:** Consider running fewer browsers in CI for faster feedback');
  }

  insights.push('- 🚀 **Optimization Tips:**');
  insights.push('  - Use test.describe.configure({ mode: "parallel" }) for independent tests');
  insights.push('  - Implement smart test filtering based on changed files');
  insights.push('  - Consider using browser context sharing for related tests');
  insights.push('  - Profile and optimize the slowest tests first');

  return insights.join('\n');
}

/**
 * Generate comprehensive test summary
 */
async function generateTestSummary(config) {
  console.log('📝 Generating test summary...');

  try {
    const setupResultsPath = path.join(config.outputDir, 'setup-results.json');
    const resultsPath = path.join(config.outputDir, 'results.json');

    const setupData = await fs.readFile(setupResultsPath, 'utf8').catch(() => '{}');
    const resultsData = await fs.readFile(resultsPath, 'utf8').catch(() => '{}');

    const setup = JSON.parse(setupData);
    const results = JSON.parse(resultsData);

    const summary = {
      timestamp: new Date().toISOString(),
      environment: setup.environment || {},
      setup: {
        duration: setup.duration || 0,
        browsers: setup.browsers || {},
      },
      execution: {
        duration: results.stats?.duration || 0,
        totalTests: results.stats?.expected || 0,
        passedTests: results.stats?.passed || 0,
        failedTests: results.stats?.failed || 0,
        skippedTests: results.stats?.skipped || 0,
      },
      performance: {
        setupTime: setup.duration || 0,
        executionTime: results.stats?.duration || 0,
        totalTime: (setup.duration || 0) + (results.stats?.duration || 0),
      },
    };

    await fs.writeFile(
      'test-results/summary.json',
      JSON.stringify(summary, null, 2)
    );

    console.log('  ✅ Test summary generated');

  } catch (error) {
    console.warn('  ⚠️  Test summary generation failed:', error.message);
  }
}

/**
 * Cleanup temporary files and optimize storage
 */
async function cleanupTempFiles(config) {
  console.log('🗑️ Cleaning up temporary files...');

  const tempPaths = [
    'test-results/cache',
    // Add more temp paths as needed
  ];

  for (const tempPath of tempPaths) {
    try {
      const stats = await fs.stat(tempPath);
      if (stats.isDirectory()) {
        // Clean old cache files (older than 1 hour)
        const files = await fs.readdir(tempPath);
        const oneHourAgo = Date.now() - (60 * 60 * 1000);

        for (const file of files) {
          const filePath = path.join(tempPath, file);
          const fileStats = await fs.stat(filePath);

          if (fileStats.mtime.getTime() < oneHourAgo) {
            await fs.unlink(filePath);
          }
        }
      }
    } catch (error) {
      // File/directory doesn't exist, which is fine
    }
  }

  console.log('  ✅ Cleanup completed');
}

/**
 * Archive old test results to prevent disk space issues
 */
async function archiveOldResults(config) {
  console.log('📦 Archiving old test results...');

  try {
    // Keep only the last 10 test runs
    const maxRuns = 10;
    const archivePath = 'test-results/archive';

    await fs.mkdir(archivePath, { recursive: true });

    // This is a simplified archiving strategy
    // In a real implementation, you might want to compress and move old results

    console.log('  ✅ Archiving completed');

  } catch (error) {
    console.warn('  ⚠️  Archiving failed:', error.message);
  }
}

module.exports = globalTeardown;