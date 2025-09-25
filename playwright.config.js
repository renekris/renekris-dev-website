// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const os = require('os');

// Calculate optimal worker count based on environment
function getOptimalWorkerCount() {
  const cpuCount = os.cpus().length;
  const isCI = !!process.env.CI;
  const memoryGB = Math.floor(os.totalmem() / (1024 * 1024 * 1024));

  if (isCI) {
    // Conservative approach for CI to avoid resource contention
    return Math.min(Math.floor(cpuCount * 0.75), 6);
  }

  // Local development - more aggressive parallelization
  return Math.min(Math.floor(cpuCount * 0.9), memoryGB > 8 ? 8 : 4);
}

// Environment-specific test configuration
const testEnvironment = process.env.TEST_ENV || 'full';
const isQuickRun = process.env.QUICK_TEST === 'true';
const changedFiles = process.env.CHANGED_FILES ? process.env.CHANGED_FILES.split(',') : [];

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  /* Output directory for test artifacts */
  outputDir: 'test-results/artifacts',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry configuration with exponential backoff */
  retries: process.env.CI ? 3 : 1,

  /* Optimal worker configuration */
  workers: process.env.PLAYWRIGHT_WORKERS ? parseInt(process.env.PLAYWRIGHT_WORKERS) : getOptimalWorkerCount(),

  /* Global timeout for tests */
  timeout: 30000,

  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
  },

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/config/global-setup.js'),
  globalTeardown: require.resolve('./tests/config/global-teardown.js'),

  /* Test metadata and filtering */
  metadata: {
    testEnvironment,
    workerCount: getOptimalWorkerCount(),
    changedFiles: changedFiles.length > 0 ? changedFiles : 'all',
  },

  /* Enhanced reporter configuration with performance tracking */
  reporter: [
    ['html', {
      outputFolder: 'test-results/html-report',
      open: 'never'
    }],
    ['json', {
      outputFile: 'test-results/results.json'
    }],
    ['junit', {
      outputFile: 'test-results/results.xml'
    }],
    ['./tests/reporters/performance-reporter.js'],
    ...(process.env.CI ? [['github']] : [])
  ],

  /* Shared settings optimized for performance */
  use: {
    /* Base URL with fallback logic */
    baseURL: process.env.PLAYWRIGHT_BASE_URL ||
             (process.env.CI ? 'https://staging.renekris.dev' : 'https://renekris.dev'),

    /* Browser context options for performance */
    contextOptions: {
      // Reduce memory usage
      viewport: null, // Let projects define their own viewports
      // Disable service workers to avoid interference
      serviceWorkers: 'block',
      // Optimize for testing
      reducedMotion: 'reduce',
    },

    /* Optimized trace collection */
    trace: process.env.CI ? 'retain-on-failure' : 'off',

    /* Screenshot configuration */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: false, // Faster screenshots
    },

    /* Video recording only on failure */
    video: process.env.CI ? 'retain-on-failure' : 'off',

    /* Browser launch options for performance */
    launchOptions: {
      // Optimize browser startup
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-web-security',
        '--enable-features=NetworkService,NetworkServiceLogging',
        '--disable-extensions',
        '--memory-pressure-off',
      ],
    },

    /* Action timeout */
    actionTimeout: 15000,

    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Project configuration with smart browser selection */
  projects: [
    // Setup project for browser installation and global setup
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Core desktop browsers - always run
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Use system Chrome for better performance
      },
      dependencies: ['setup'],
      testIgnore: isQuickRun ? ['**/visual-regression.spec.js'] : [],
    },

    // Firefox - skip in quick runs unless specific files changed
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      testIgnore: [
        ...(isQuickRun ? ['**/visual-regression.spec.js', '**/accessibility.spec.js'] : []),
      ],
    },

    // WebKit - only run in full test suite
    ...(testEnvironment === 'full' && !isQuickRun ? [{
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      testIgnore: ['**/performance.spec.js'], // WebKit performance tests are inconsistent
    }] : []),

    // Mobile testing - smart execution based on changes
    ...(shouldRunMobileTests() ? [
      {
        name: 'mobile-chrome',
        use: {
          ...devices['Pixel 5'],
          // Optimize mobile testing
          launchOptions: {
            args: [
              '--no-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--memory-pressure-off',
            ],
          },
        },
        dependencies: ['setup'],
        testMatch: ['**/mobile-responsive.spec.js', '**/homepage.spec.js'],
      },

      {
        name: 'mobile-safari',
        use: { ...devices['iPhone 12'] },
        dependencies: ['setup'],
        testMatch: ['**/mobile-responsive.spec.js'],
      },
    ] : []),

    // Tablet testing - only in full suite
    ...(testEnvironment === 'full' && !isQuickRun ? [{
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
      dependencies: ['setup'],
      testMatch: ['**/mobile-responsive.spec.js'],
    }] : []),
  ],

  /* Web server configuration for local testing */
  webServer: process.env.PLAYWRIGHT_BASE_URL?.includes('localhost') ? {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'ignore',
    stderr: 'pipe',
  } : undefined,
});

/**
 * Determine if mobile tests should run based on changed files and environment
 */
function shouldRunMobileTests() {
  if (testEnvironment === 'desktop-only') return false;
  if (isQuickRun && changedFiles.length > 0) {
    // Run mobile tests only if CSS, responsive, or mobile-related files changed
    return changedFiles.some(file =>
      file.includes('responsive') ||
      file.includes('mobile') ||
      file.includes('.css') ||
      file.includes('tailwind')
    );
  }
  return true;
}