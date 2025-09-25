/**
 * Environment-specific test configurations
 * Provides different test strategies based on environment and context
 */

const environments = {
  development: {
    name: 'development',
    baseURL: 'http://localhost:3000',
    browsers: ['chromium'],
    workers: 'auto',
    retries: 1,
    timeout: 30000,
    trace: 'off',
    video: 'off',
    screenshot: 'only-on-failure',
    testMatch: [
      '**/homepage.spec.js',
      '**/performance.spec.js',
      '**/accessibility.spec.js',
    ],
    skipTests: [
      '**/visual-regression.spec.js', // Skip visual tests in dev
    ],
    performance: {
      enableMetrics: true,
      thresholds: {
        pageLoadTime: 5000, // More lenient for local dev
        firstContentfulPaint: 3000,
        largestContentfulPaint: 6000,
      },
    },
  },

  staging: {
    name: 'staging',
    baseURL: 'https://staging.renekris.dev',
    browsers: ['chromium', 'firefox'],
    workers: 4,
    retries: 2,
    timeout: 30000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    testMatch: [
      '**/homepage.spec.js',
      '**/performance.spec.js',
      '**/accessibility.spec.js',
      '**/integration.spec.js',
      '**/mobile-responsive.spec.js',
    ],
    skipTests: [
      // Don't skip any tests in staging
    ],
    performance: {
      enableMetrics: true,
      thresholds: {
        pageLoadTime: 3000,
        firstContentfulPaint: 2000,
        largestContentfulPaint: 4000,
      },
    },
    healthChecks: {
      endpoints: [
        '/health',
        '/api/minecraft-status',
      ],
      timeout: 10000,
    },
  },

  production: {
    name: 'production',
    baseURL: 'https://renekris.dev',
    browsers: ['chromium', 'firefox', 'webkit'],
    workers: 6,
    retries: 3,
    timeout: 45000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    testMatch: [
      '**/homepage.spec.js',
      '**/performance.spec.js',
      '**/accessibility.spec.js',
      '**/integration.spec.js',
      '**/mobile-responsive.spec.js',
      '**/visual-regression.spec.js',
    ],
    skipTests: [
      // All tests run in production
    ],
    performance: {
      enableMetrics: true,
      thresholds: {
        pageLoadTime: 3000,
        firstContentfulPaint: 1800,
        largestContentfulPaint: 3500,
        cumulativeLayoutShift: 0.1,
        firstInputDelay: 100,
      },
    },
    healthChecks: {
      endpoints: [
        '/health',
        '/api/minecraft-status',
      ],
      timeout: 15000,
      retries: 3,
    },
  },

  ci: {
    name: 'ci',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://staging.renekris.dev',
    browsers: ['chromium', 'firefox'],
    workers: 6,
    retries: 3,
    timeout: 60000, // Longer timeout for CI
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    testMatch: [
      '**/homepage.spec.js',
      '**/performance.spec.js',
      '**/accessibility.spec.js',
      '**/integration.spec.js',
    ],
    skipTests: [
      '**/visual-regression.spec.js', // Skip visual tests in CI unless explicitly requested
    ],
    performance: {
      enableMetrics: true,
      thresholds: {
        pageLoadTime: 5000, // More lenient for CI environment
        firstContentfulPaint: 3000,
        largestContentfulPaint: 6000,
      },
    },
    optimization: {
      browserPrewarm: true,
      contextReuse: true,
      parallelization: 'aggressive',
    },
  },

  quickTest: {
    name: 'quickTest',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://renekris.dev',
    browsers: ['chromium'],
    workers: 4,
    retries: 1,
    timeout: 15000,
    trace: 'off',
    video: 'off',
    screenshot: 'only-on-failure',
    testMatch: [
      '**/homepage.spec.js',
    ],
    skipTests: [
      '**/visual-regression.spec.js',
      '**/performance.spec.js',
      '**/mobile-responsive.spec.js',
    ],
    performance: {
      enableMetrics: false,
    },
    optimization: {
      browserPrewarm: false,
      contextReuse: true,
      parallelization: 'moderate',
    },
  },

  performanceOnly: {
    name: 'performanceOnly',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://renekris.dev',
    browsers: ['chromium'],
    workers: 2, // Lower worker count for consistent performance measurement
    retries: 1,
    timeout: 60000,
    trace: 'off',
    video: 'off',
    screenshot: 'off',
    testMatch: [
      '**/performance.spec.js',
    ],
    skipTests: [
      '**/homepage.spec.js',
      '**/visual-regression.spec.js',
      '**/accessibility.spec.js',
      '**/integration.spec.js',
      '**/mobile-responsive.spec.js',
    ],
    performance: {
      enableMetrics: true,
      detailedAnalysis: true,
      thresholds: {
        pageLoadTime: 3000,
        firstContentfulPaint: 1800,
        largestContentfulPaint: 3500,
        cumulativeLayoutShift: 0.1,
        firstInputDelay: 100,
        timeToInteractive: 4000,
      },
    },
  },

  visualRegression: {
    name: 'visualRegression',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://renekris.dev',
    browsers: ['chromium', 'firefox', 'webkit'],
    workers: 3, // Moderate parallelization for consistent screenshots
    retries: 2,
    timeout: 45000,
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'on',
    testMatch: [
      '**/visual-regression.spec.js',
    ],
    skipTests: [
      '**/performance.spec.js', // Skip performance tests
    ],
    performance: {
      enableMetrics: false,
    },
    visual: {
      threshold: 0.2,
      updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true',
    },
  },

  mobileOnly: {
    name: 'mobileOnly',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://renekris.dev',
    browsers: ['mobile-chrome', 'mobile-safari'],
    workers: 2,
    retries: 2,
    timeout: 45000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    testMatch: [
      '**/mobile-responsive.spec.js',
      '**/homepage.spec.js',
    ],
    skipTests: [
      '**/visual-regression.spec.js',
      '**/performance.spec.js', // Mobile performance tests need special handling
    ],
    performance: {
      enableMetrics: true,
      thresholds: {
        pageLoadTime: 5000, // More lenient for mobile
        firstContentfulPaint: 3000,
        largestContentfulPaint: 6000,
      },
    },
  },
};

/**
 * Get environment configuration by name
 */
function getEnvironmentConfig(envName) {
  const env = environments[envName];
  if (!env) {
    throw new Error(`Unknown environment: ${envName}. Available: ${Object.keys(environments).join(', ')}`);
  }
  return env;
}

/**
 * Get current environment based on various factors
 */
function getCurrentEnvironment() {
  // Check explicit environment variable
  if (process.env.TEST_ENV) {
    return process.env.TEST_ENV;
  }

  // Check if running in CI
  if (process.env.CI) {
    return 'ci';
  }

  // Check if quick test is requested
  if (process.env.QUICK_TEST === 'true') {
    return 'quickTest';
  }

  // Check NODE_ENV
  if (process.env.NODE_ENV) {
    const nodeEnv = process.env.NODE_ENV;
    if (environments[nodeEnv]) {
      return nodeEnv;
    }
  }

  // Check base URL to determine environment
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL;
  if (baseUrl) {
    if (baseUrl.includes('localhost')) {
      return 'development';
    } else if (baseUrl.includes('staging')) {
      return 'staging';
    } else if (baseUrl.includes('renekris.dev')) {
      return 'production';
    }
  }

  // Default to development
  return 'development';
}

/**
 * Merge environment config with custom overrides
 */
function mergeConfig(baseConfig, overrides = {}) {
  return {
    ...baseConfig,
    ...overrides,
    performance: {
      ...baseConfig.performance,
      ...overrides.performance,
    },
    optimization: {
      ...baseConfig.optimization,
      ...overrides.optimization,
    },
  };
}

/**
 * Get test files to run based on environment and filters
 */
function getTestFiles(envConfig) {
  const { testMatch, skipTests } = envConfig;

  // Start with all matching files
  let files = testMatch || ['**/*.spec.js'];

  // Apply skip filters
  if (skipTests && skipTests.length > 0) {
    files = files.filter(file => {
      return !skipTests.some(skipPattern => {
        const pattern = skipPattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
        return new RegExp(pattern).test(file);
      });
    });
  }

  return files;
}

/**
 * Validate environment configuration
 */
function validateEnvironmentConfig(config) {
  const required = ['name', 'baseURL', 'browsers', 'workers'];
  const missing = required.filter(field => !config[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required configuration fields: ${missing.join(', ')}`);
  }

  // Validate browser list
  const validBrowsers = ['chromium', 'firefox', 'webkit', 'mobile-chrome', 'mobile-safari', 'tablet'];
  const invalidBrowsers = config.browsers.filter(b => !validBrowsers.includes(b));

  if (invalidBrowsers.length > 0) {
    throw new Error(`Invalid browsers: ${invalidBrowsers.join(', ')}. Valid: ${validBrowsers.join(', ')}`);
  }

  return true;
}

module.exports = {
  environments,
  getEnvironmentConfig,
  getCurrentEnvironment,
  mergeConfig,
  getTestFiles,
  validateEnvironmentConfig,
};