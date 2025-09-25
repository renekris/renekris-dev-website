const { chromium, firefox, webkit } = require('@playwright/test');
const os = require('os');
const path = require('path');
const fs = require('fs').promises;

/**
 * Global setup for Playwright tests
 * Handles browser installation, context preparation, and shared resources
 */
async function globalSetup(config) {
  console.log('🚀 Starting Playwright global setup...');

  const startTime = Date.now();
  const setupResults = {
    startTime,
    browsers: {},
    performance: {},
    environment: {
      cpuCount: os.cpus().length,
      memoryGB: Math.floor(os.totalmem() / (1024 * 1024 * 1024)),
      platform: os.platform(),
      nodeVersion: process.version,
    }
  };

  try {
    // Ensure test results directories exist
    await ensureDirectories();

    // Pre-warm browsers and create shared contexts
    await prepareBrowsers(setupResults);

    // Setup performance monitoring
    await setupPerformanceMonitoring(setupResults);

    // Cache test data and shared resources
    await prepareTestData(setupResults);

    setupResults.duration = Date.now() - startTime;

    // Store setup results for other tests to access
    await fs.writeFile(
      path.join(config.outputDir, 'setup-results.json'),
      JSON.stringify(setupResults, null, 2)
    );

    console.log(`✅ Global setup completed in ${setupResults.duration}ms`);
    console.log(`📊 Setup summary: ${JSON.stringify(setupResults.performance, null, 2)}`);

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

/**
 * Ensure all required directories exist
 */
async function ensureDirectories() {
  const directories = [
    'test-results',
    'test-results/artifacts',
    'test-results/html-report',
    'test-results/performance',
    'test-results/cache',
  ];

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
    }
  }
}

/**
 * Pre-warm browsers and prepare shared contexts
 */
async function prepareBrowsers(setupResults) {
  console.log('🌐 Preparing browsers...');

  const browserTypes = [
    { name: 'chromium', type: chromium },
    { name: 'firefox', type: firefox },
    { name: 'webkit', type: webkit },
  ];

  for (const { name, type } of browserTypes) {
    const browserStart = Date.now();

    try {
      // Launch browser to pre-warm it
      const browser = await type.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-background-timer-throttling',
          '--memory-pressure-off',
        ],
      });

      // Create a test context to verify browser is working
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        serviceWorkers: 'block',
        reducedMotion: 'reduce',
      });

      const page = await context.newPage();

      // Simple navigation test to verify browser functionality
      await page.goto('data:text/html,<html><body>Test</body></html>');
      await page.waitForLoadState('networkidle');

      await context.close();
      await browser.close();

      const duration = Date.now() - browserStart;
      setupResults.browsers[name] = {
        status: 'ready',
        warmupTime: duration,
      };

      console.log(`  ✅ ${name} browser ready (${duration}ms)`);

    } catch (error) {
      console.warn(`  ⚠️  ${name} browser preparation failed:`, error.message);
      setupResults.browsers[name] = {
        status: 'failed',
        error: error.message,
      };
    }
  }
}

/**
 * Setup performance monitoring infrastructure
 */
async function setupPerformanceMonitoring(setupResults) {
  console.log('📊 Setting up performance monitoring...');

  const performanceConfig = {
    enableResourceTiming: true,
    enableUserTiming: true,
    enableNavigationTiming: true,
    enableMemoryMonitoring: true,
    thresholds: {
      pageLoadTime: 3000,
      firstContentfulPaint: 2000,
      largestContentfulPaint: 4000,
      cumulativeLayoutShift: 0.25,
      firstInputDelay: 300,
    },
  };

  // Create performance monitoring setup script
  const performanceScript = `
    // Performance monitoring setup
    window.performanceMetrics = {
      startTime: performance.now(),
      metrics: {},

      recordMetric: function(name, value) {
        this.metrics[name] = value;
        console.log('Performance metric:', name, value);
      },

      getMetrics: function() {
        return {
          ...this.metrics,
          duration: performance.now() - this.startTime,
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          } : null,
        };
      }
    };

    // Track Core Web Vitals
    if (typeof PerformanceObserver !== 'undefined') {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            window.performanceMetrics.recordMetric('FCP', entry.startTime);
          }
          if (entry.name === 'largest-contentful-paint') {
            window.performanceMetrics.recordMetric('LCP', entry.startTime);
          }
        });
      }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      new PerformanceObserver((list) => {
        let cls = 0;
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        });
        window.performanceMetrics.recordMetric('CLS', cls);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  `;

  await fs.writeFile(
    'test-results/performance/performance-setup.js',
    performanceScript
  );

  await fs.writeFile(
    'test-results/performance/config.json',
    JSON.stringify(performanceConfig, null, 2)
  );

  setupResults.performance.monitoringSetup = 'completed';
}

/**
 * Prepare shared test data and cache common resources
 */
async function prepareTestData(setupResults) {
  console.log('📦 Preparing test data...');

  const testData = {
    timestamp: new Date().toISOString(),
    baseUrls: {
      production: 'https://renekris.dev',
      staging: 'https://staging.renekris.dev',
      local: 'http://localhost:3000',
    },
    testUser: {
      // Add any test user data if needed
    },
    apiEndpoints: [
      '/health',
      '/api/minecraft-status',
    ],
    expectedElements: {
      header: 'h1',
      tagline: '.tagline',
      statusSection: '.status-overview',
      serviceCards: '.service-card',
      footer: 'footer',
    },
  };

  await fs.writeFile(
    'test-results/cache/test-data.json',
    JSON.stringify(testData, null, 2)
  );

  setupResults.performance.testDataSetup = 'completed';
}

module.exports = globalSetup;