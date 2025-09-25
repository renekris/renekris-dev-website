/**
 * Performance testing utilities for Playwright
 * Provides comprehensive performance monitoring and analysis capabilities
 */

const fs = require('fs').promises;
const path = require('path');

class PerformanceUtils {
  constructor(page, testName = 'unknown') {
    this.page = page;
    this.testName = testName;
    this.metrics = {};
    this.startTime = Date.now();
    this.navigationMetrics = {};
    this.resourceMetrics = [];
    this.customMetrics = {};
  }

  /**
   * Initialize performance monitoring for a page
   */
  async initializeMonitoring() {
    // Inject performance monitoring script
    await this.page.addInitScript(() => {
      // Core Web Vitals tracking
      window.performanceMonitor = {
        metrics: {},
        observers: [],

        // Record a custom metric
        recordMetric(name, value, timestamp = performance.now()) {
          this.metrics[name] = { value, timestamp };
          console.log(`Performance metric: ${name} ${value}`);
        },

        // Get all collected metrics
        getMetrics() {
          return {
            ...this.metrics,
            navigation: performance.getEntriesByType('navigation')[0],
            paint: performance.getEntriesByType('paint'),
            resource: performance.getEntriesByType('resource'),
            memory: performance.memory ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            } : null,
          };
        },

        // Initialize Core Web Vitals observers
        initCoreWebVitals() {
          // First Contentful Paint
          if (typeof PerformanceObserver !== 'undefined') {
            const paintObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                  this.recordMetric('FCP', entry.startTime);
                }
              });
            });
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.push(paintObserver);

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                this.recordMetric('LCP', entry.startTime);
              });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(lcpObserver);

            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                  this.recordMetric('CLS', clsValue);
                }
              });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(clsObserver);

            // First Input Delay (approximate)
            const fidObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                this.recordMetric('FID', entry.processingStart - entry.startTime);
              });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.push(fidObserver);
          }
        },

        // Clean up observers
        cleanup() {
          this.observers.forEach(observer => observer.disconnect());
          this.observers = [];
        }
      };

      // Auto-initialize monitoring
      window.performanceMonitor.initCoreWebVitals();
    });
  }

  /**
   * Measure page load performance
   */
  async measurePageLoad(url, options = {}) {
    const {
      waitUntil = 'networkidle',
      timeout = 30000,
      enableResourceTiming = true,
    } = options;

    const loadStartTime = Date.now();

    // Navigate to page with performance timing
    const response = await this.page.goto(url, {
      waitUntil,
      timeout,
    });

    const loadEndTime = Date.now();
    const loadTime = loadEndTime - loadStartTime;

    // Collect navigation timing
    const navigationTiming = await this.page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return nav ? {
        domainLookupStart: nav.domainLookupStart,
        domainLookupEnd: nav.domainLookupEnd,
        connectStart: nav.connectStart,
        connectEnd: nav.connectEnd,
        requestStart: nav.requestStart,
        responseStart: nav.responseStart,
        responseEnd: nav.responseEnd,
        domContentLoadedEventStart: nav.domContentLoadedEventStart,
        domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
        loadEventStart: nav.loadEventStart,
        loadEventEnd: nav.loadEventEnd,
        transferSize: nav.transferSize,
        encodedBodySize: nav.encodedBodySize,
        decodedBodySize: nav.decodedBodySize,
      } : null;
    });

    // Collect resource timing if enabled
    let resourceTiming = [];
    if (enableResourceTiming) {
      resourceTiming = await this.page.evaluate(() => {
        return performance.getEntriesByType('resource').map(resource => ({
          name: resource.name,
          duration: resource.duration,
          transferSize: resource.transferSize,
          encodedBodySize: resource.encodedBodySize,
          decodedBodySize: resource.decodedBodySize,
          initiatorType: resource.initiatorType,
        }));
      });
    }

    // Wait for Core Web Vitals to be collected
    await this.page.waitForTimeout(1000);

    // Collect Core Web Vitals
    const coreWebVitals = await this.page.evaluate(() => {
      return window.performanceMonitor ? window.performanceMonitor.getMetrics() : {};
    });

    this.navigationMetrics = {
      url,
      loadTime,
      responseStatus: response?.status(),
      navigationTiming,
      coreWebVitals,
      resourceTiming,
      timestamp: new Date().toISOString(),
    };

    return this.navigationMetrics;
  }

  /**
   * Measure custom interaction performance
   */
  async measureInteraction(interactionName, interactionFn) {
    const startTime = performance.now();

    // Record start metric
    await this.page.evaluate((name, time) => {
      if (window.performanceMonitor) {
        window.performanceMonitor.recordMetric(`${name}_start`, time);
      }
    }, interactionName, startTime);

    // Execute the interaction
    const result = await interactionFn();

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Record end metric
    await this.page.evaluate((name, time, dur) => {
      if (window.performanceMonitor) {
        window.performanceMonitor.recordMetric(`${name}_end`, time);
        window.performanceMonitor.recordMetric(`${name}_duration`, dur);
      }
    }, interactionName, endTime, duration);

    this.customMetrics[interactionName] = {
      duration,
      startTime,
      endTime,
      result,
    };

    return { duration, result };
  }

  /**
   * Measure memory usage
   */
  async measureMemoryUsage() {
    const memoryInfo = await this.page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memoryInfo) {
      this.metrics.memory = memoryInfo;
    }

    return memoryInfo;
  }

  /**
   * Monitor network activity
   */
  async monitorNetworkActivity(duration = 5000) {
    const networkActivity = [];

    // Listen to network events
    this.page.on('request', request => {
      networkActivity.push({
        type: 'request',
        url: request.url(),
        method: request.method(),
        timestamp: Date.now(),
      });
    });

    this.page.on('response', response => {
      networkActivity.push({
        type: 'response',
        url: response.url(),
        status: response.status(),
        timestamp: Date.now(),
      });
    });

    // Wait for specified duration
    await this.page.waitForTimeout(duration);

    return networkActivity;
  }

  /**
   * Analyze performance against thresholds
   */
  analyzePerformance(thresholds = {}) {
    const defaultThresholds = {
      pageLoadTime: 3000,
      firstContentfulPaint: 2000,
      largestContentfulPaint: 4000,
      cumulativeLayoutShift: 0.25,
      firstInputDelay: 300,
    };

    const mergedThresholds = { ...defaultThresholds, ...thresholds };
    const analysis = {
      passed: true,
      failures: [],
      warnings: [],
      metrics: {},
    };

    // Analyze page load time
    if (this.navigationMetrics.loadTime) {
      analysis.metrics.pageLoadTime = this.navigationMetrics.loadTime;
      if (this.navigationMetrics.loadTime > mergedThresholds.pageLoadTime) {
        analysis.passed = false;
        analysis.failures.push({
          metric: 'pageLoadTime',
          value: this.navigationMetrics.loadTime,
          threshold: mergedThresholds.pageLoadTime,
          message: `Page load time ${this.navigationMetrics.loadTime}ms exceeds threshold ${mergedThresholds.pageLoadTime}ms`,
        });
      }
    }

    // Analyze Core Web Vitals
    const cwv = this.navigationMetrics.coreWebVitals?.metrics || {};

    if (cwv.FCP) {
      analysis.metrics.FCP = cwv.FCP.value;
      if (cwv.FCP.value > mergedThresholds.firstContentfulPaint) {
        analysis.passed = false;
        analysis.failures.push({
          metric: 'FCP',
          value: cwv.FCP.value,
          threshold: mergedThresholds.firstContentfulPaint,
          message: `First Contentful Paint ${cwv.FCP.value}ms exceeds threshold ${mergedThresholds.firstContentfulPaint}ms`,
        });
      }
    }

    if (cwv.LCP) {
      analysis.metrics.LCP = cwv.LCP.value;
      if (cwv.LCP.value > mergedThresholds.largestContentfulPaint) {
        analysis.passed = false;
        analysis.failures.push({
          metric: 'LCP',
          value: cwv.LCP.value,
          threshold: mergedThresholds.largestContentfulPaint,
          message: `Largest Contentful Paint ${cwv.LCP.value}ms exceeds threshold ${mergedThresholds.largestContentfulPaint}ms`,
        });
      }
    }

    if (cwv.CLS) {
      analysis.metrics.CLS = cwv.CLS.value;
      if (cwv.CLS.value > mergedThresholds.cumulativeLayoutShift) {
        analysis.passed = false;
        analysis.failures.push({
          metric: 'CLS',
          value: cwv.CLS.value,
          threshold: mergedThresholds.cumulativeLayoutShift,
          message: `Cumulative Layout Shift ${cwv.CLS.value} exceeds threshold ${mergedThresholds.cumulativeLayoutShift}`,
        });
      }
    }

    if (cwv.FID) {
      analysis.metrics.FID = cwv.FID.value;
      if (cwv.FID.value > mergedThresholds.firstInputDelay) {
        analysis.warnings.push({
          metric: 'FID',
          value: cwv.FID.value,
          threshold: mergedThresholds.firstInputDelay,
          message: `First Input Delay ${cwv.FID.value}ms exceeds threshold ${mergedThresholds.firstInputDelay}ms`,
        });
      }
    }

    return analysis;
  }

  /**
   * Save performance results to file
   */
  async saveResults(outputPath = null) {
    const results = {
      testName: this.testName,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      navigationMetrics: this.navigationMetrics,
      customMetrics: this.customMetrics,
      resourceMetrics: this.resourceMetrics,
      analysis: this.analyzePerformance(),
    };

    const filePath = outputPath || path.join('test-results', 'performance', `${this.testName}-${Date.now()}.json`);

    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(results, null, 2));
      console.log(`Performance results saved to: ${filePath}`);
    } catch (error) {
      console.warn(`Failed to save performance results: ${error.message}`);
    }

    return results;
  }

  /**
   * Cleanup performance monitoring
   */
  async cleanup() {
    await this.page.evaluate(() => {
      if (window.performanceMonitor) {
        window.performanceMonitor.cleanup();
      }
    });
  }
}

/**
 * Utility function to create performance monitor for a test
 */
function createPerformanceMonitor(page, testName) {
  return new PerformanceUtils(page, testName);
}

/**
 * Performance test decorator
 */
function withPerformanceMonitoring(testFn, testName, thresholds = {}) {
  return async (testInfo) => {
    const page = testInfo.page || testInfo;
    const monitor = new PerformanceUtils(page, testName);

    try {
      await monitor.initializeMonitoring();
      const result = await testFn(testInfo, monitor);
      const analysis = monitor.analyzePerformance(thresholds);

      if (!analysis.passed) {
        const failures = analysis.failures.map(f => f.message).join(', ');
        throw new Error(`Performance thresholds exceeded: ${failures}`);
      }

      await monitor.saveResults();
      return result;
    } finally {
      await monitor.cleanup();
    }
  };
}

module.exports = {
  PerformanceUtils,
  createPerformanceMonitor,
  withPerformanceMonitoring,
};