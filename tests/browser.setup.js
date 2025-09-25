const { test as setup, expect } = require('@playwright/test');
const fs = require('fs').promises;

/**
 * Browser setup tests - run once per browser type
 * Handles browser warming, context preparation, and shared state
 */

setup('prepare browser and context', async ({ page, browserName }) => {
  console.log(`🌐 Setting up ${browserName} browser...`);

  // Warm up the browser with a simple navigation
  await page.goto('data:text/html,<html><body>Browser Setup</body></html>');
  await page.waitForLoadState('networkidle');

  // Verify browser capabilities
  const userAgent = await page.evaluate(() => navigator.userAgent);
  const viewport = page.viewportSize();

  console.log(`  ✅ ${browserName} browser ready`);
  console.log(`  📱 Viewport: ${viewport?.width}x${viewport?.height}`);
  console.log(`  🔍 User Agent: ${userAgent.substring(0, 60)}...`);

  // Test basic functionality
  await page.setContent(`
    <html>
      <head><title>Browser Test</title></head>
      <body>
        <h1>Browser Functionality Test</h1>
        <button id="test-btn">Click Me</button>
        <div id="result"></div>
        <script>
          document.getElementById('test-btn').addEventListener('click', () => {
            document.getElementById('result').textContent = 'Browser is working!';
          });
        </script>
      </body>
    </html>
  `);

  await page.click('#test-btn');
  await expect(page.locator('#result')).toContainText('Browser is working!');

  // Test performance API availability
  const performanceAvailable = await page.evaluate(() => {
    return typeof performance !== 'undefined' &&
           typeof performance.now === 'function' &&
           typeof PerformanceObserver !== 'undefined';
  });

  expect(performanceAvailable).toBeTruthy();

  // Store browser capabilities for tests
  const browserInfo = {
    name: browserName,
    userAgent,
    viewport,
    performanceApiAvailable: performanceAvailable,
    setupTimestamp: Date.now(),
  };

  // Save browser info for other tests to access
  await fs.writeFile(
    `test-results/cache/browser-${browserName}.json`,
    JSON.stringify(browserInfo, null, 2)
  ).catch(() => {
    // Ignore file write errors in setup
  });

  console.log(`  🎉 ${browserName} setup completed successfully`);
});

setup('verify test environment', async ({ page }) => {
  // Verify the base URL is accessible
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'https://renekris.dev';

  console.log(`🌐 Verifying test environment: ${baseURL}`);

  try {
    const response = await page.goto(baseURL, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    expect(response?.status()).toBeLessThan(400);

    // Verify basic page structure
    await expect(page).toHaveTitle(/renekris/i);

    console.log(`  ✅ Test environment verified: ${baseURL}`);

  } catch (error) {
    console.error(`  ❌ Environment verification failed: ${error.message}`);
    throw error;
  }
});

setup('install performance monitoring', async ({ page }) => {
  console.log('📊 Installing performance monitoring...');

  // Load the performance monitoring script
  const performanceScript = await fs.readFile(
    'test-results/performance/performance-setup.js',
    'utf8'
  ).catch(() => {
    console.warn('  ⚠️  Performance setup script not found, skipping...');
    return null;
  });

  if (performanceScript) {
    await page.addInitScript(performanceScript);
    console.log('  ✅ Performance monitoring installed');
  }
});

setup('cache common test data', async ({ page }) => {
  console.log('📦 Caching common test data...');

  // Load and cache test data that will be used across tests
  const testDataPath = 'test-results/cache/test-data.json';

  try {
    const testDataContent = await fs.readFile(testDataPath, 'utf8');
    const testData = JSON.parse(testDataContent);

    // Inject test data into page context for tests to access
    await page.addInitScript((data) => {
      window.testData = data;
    }, testData);

    console.log('  ✅ Test data cached and injected');

  } catch (error) {
    console.warn('  ⚠️  Test data caching failed:', error.message);
  }
});