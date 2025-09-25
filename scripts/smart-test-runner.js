#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Smart test runner for Playwright
 * Implements intelligent test filtering, execution optimization, and performance analysis
 */

class SmartTestRunner {
  constructor() {
    this.args = process.argv.slice(2);
    this.config = this.parseArguments();
    this.changedFiles = [];
    this.testStrategy = 'full';
  }

  parseArguments() {
    const config = {
      mode: 'auto', // auto, quick, full, changed-only
      environment: process.env.NODE_ENV || 'development',
      parallel: true,
      browsers: ['chromium'], // default to chromium only for quick runs
      grep: null,
      projects: [],
      maxWorkers: null,
      headed: false,
      debug: false,
      trace: false,
      updateSnapshots: false,
      retries: null,
    };

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];

      switch (arg) {
        case '--mode':
          config.mode = this.args[++i];
          break;
        case '--quick':
          config.mode = 'quick';
          break;
        case '--full':
          config.mode = 'full';
          break;
        case '--changed-only':
          config.mode = 'changed-only';
          break;
        case '--browsers':
          config.browsers = this.args[++i].split(',');
          break;
        case '--all-browsers':
          config.browsers = ['chromium', 'firefox', 'webkit', 'mobile-chrome', 'mobile-safari'];
          break;
        case '--desktop-only':
          config.browsers = ['chromium', 'firefox', 'webkit'];
          break;
        case '--mobile-only':
          config.browsers = ['mobile-chrome', 'mobile-safari'];
          break;
        case '--grep':
          config.grep = this.args[++i];
          break;
        case '--workers':
          config.maxWorkers = parseInt(this.args[++i]);
          break;
        case '--headed':
          config.headed = true;
          break;
        case '--debug':
          config.debug = true;
          config.headed = true;
          config.maxWorkers = 1;
          break;
        case '--trace':
          config.trace = true;
          break;
        case '--update-snapshots':
          config.updateSnapshots = true;
          break;
        case '--retries':
          config.retries = parseInt(this.args[++i]);
          break;
        case '--help':
          this.showHelp();
          process.exit(0);
      }
    }

    return config;
  }

  async run() {
    console.log('🚀 Smart Playwright Test Runner');
    console.log(`📋 Mode: ${this.config.mode}`);

    try {
      // Analyze changed files if in git repository
      if (this.config.mode === 'auto' || this.config.mode === 'changed-only') {
        await this.analyzeChangedFiles();
      }

      // Determine test strategy
      this.determineTestStrategy();

      // Prepare environment
      await this.prepareEnvironment();

      // Build test command
      const command = this.buildPlaywrightCommand();

      console.log(`\n🎯 Test Strategy: ${this.testStrategy}`);
      console.log(`🌐 Browsers: ${this.config.browsers.join(', ')}`);
      console.log(`👥 Workers: ${this.config.maxWorkers || 'auto'}`);
      console.log(`⚡ Command: ${command}\n`);

      // Execute tests
      const startTime = Date.now();
      await this.executeTests(command);
      const duration = Date.now() - startTime;

      // Analyze results
      await this.analyzeResults(duration);

      console.log('\n✅ Test execution completed successfully!');

    } catch (error) {
      console.error('\n❌ Test execution failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeChangedFiles() {
    try {
      // Get changed files from git
      const gitOutput = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
      this.changedFiles = gitOutput.trim().split('\n').filter(f => f.length > 0);

      if (this.changedFiles.length === 0) {
        // If no changes from last commit, check working directory
        const workingChanges = execSync('git diff --name-only', { encoding: 'utf8' });
        this.changedFiles = workingChanges.trim().split('\n').filter(f => f.length > 0);
      }

      console.log(`📝 Changed files detected: ${this.changedFiles.length}`);
      if (this.changedFiles.length > 0 && this.changedFiles.length <= 10) {
        this.changedFiles.forEach(file => console.log(`  - ${file}`));
      }

    } catch (error) {
      console.log('⚠️  Not in a git repository or git not available, running full test suite');
      this.changedFiles = [];
    }
  }

  determineTestStrategy() {
    switch (this.config.mode) {
      case 'quick':
        this.testStrategy = 'quick';
        this.config.browsers = ['chromium'];
        break;

      case 'full':
        this.testStrategy = 'full';
        this.config.browsers = ['chromium', 'firefox', 'webkit', 'mobile-chrome', 'mobile-safari'];
        break;

      case 'changed-only':
        this.testStrategy = 'changed-only';
        this.config.browsers = ['chromium'];
        break;

      case 'auto':
      default:
        if (this.changedFiles.length === 0) {
          this.testStrategy = 'full';
        } else if (this.changedFiles.length > 20) {
          this.testStrategy = 'full';
        } else if (this.hasSignificantChanges()) {
          this.testStrategy = 'targeted';
        } else {
          this.testStrategy = 'quick';
        }
        break;
    }

    // Adjust browsers based on changed files
    if (this.testStrategy === 'targeted' || this.testStrategy === 'changed-only') {
      this.adjustBrowsersForChanges();
    }
  }

  hasSignificantChanges() {
    const significantPatterns = [
      /\.(js|jsx|ts|tsx)$/,
      /\.(css|scss|less)$/,
      /package\.json$/,
      /playwright\.config\.js$/,
      /\.spec\.js$/,
      /\.test\.js$/,
    ];

    return this.changedFiles.some(file =>
      significantPatterns.some(pattern => pattern.test(file))
    );
  }

  adjustBrowsersForChanges() {
    const hasStyleChanges = this.changedFiles.some(f =>
      f.includes('.css') || f.includes('.scss') || f.includes('style') || f.includes('tailwind')
    );

    const hasMobileChanges = this.changedFiles.some(f =>
      f.includes('mobile') || f.includes('responsive')
    );

    const hasTestChanges = this.changedFiles.some(f =>
      f.includes('.spec.') || f.includes('.test.')
    );

    if (hasStyleChanges || hasMobileChanges) {
      this.config.browsers = ['chromium', 'firefox', 'mobile-chrome'];
    }

    if (hasTestChanges) {
      // Run tests on all browsers if test files changed
      this.config.browsers = ['chromium', 'firefox', 'webkit'];
    }
  }

  async prepareEnvironment() {
    // Set environment variables for Playwright
    process.env.TEST_ENV = this.testStrategy;
    process.env.QUICK_TEST = this.testStrategy === 'quick' ? 'true' : 'false';
    process.env.CHANGED_FILES = this.changedFiles.join(',');

    // Ensure test directories exist
    const dirs = ['test-results', 'test-results/performance', 'test-results/cache'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Save execution metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      strategy: this.testStrategy,
      changedFiles: this.changedFiles,
      config: this.config,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cpu: require('os').cpus().length,
        memory: Math.floor(require('os').totalmem() / (1024 * 1024 * 1024)),
      },
    };

    fs.writeFileSync(
      'test-results/execution-metadata.json',
      JSON.stringify(metadata, null, 2)
    );
  }

  buildPlaywrightCommand() {
    const command = ['npx', 'playwright', 'test'];

    // Add project filters
    if (this.config.browsers.length > 0) {
      this.config.browsers.forEach(browser => {
        command.push('--project', browser + '-desktop');
      });
    }

    // Add worker configuration
    if (this.config.maxWorkers) {
      command.push('--workers', this.config.maxWorkers.toString());
    }

    // Add execution mode flags
    if (this.config.headed) {
      command.push('--headed');
    }

    if (this.config.debug) {
      command.push('--debug');
    }

    if (this.config.trace) {
      command.push('--trace', 'on');
    }

    if (this.config.updateSnapshots) {
      command.push('--update-snapshots');
    }

    if (this.config.retries !== null) {
      command.push('--retries', this.config.retries.toString());
    }

    // Add grep filter
    if (this.config.grep) {
      command.push('--grep', this.config.grep);
    }

    // Add test file filters for changed-only mode
    if (this.testStrategy === 'changed-only') {
      const testFiles = this.getRelevantTestFiles();
      if (testFiles.length > 0) {
        command.push(...testFiles);
      }
    }

    return command.join(' ');
  }

  getRelevantTestFiles() {
    // Map changed files to relevant test files
    const testFiles = [];

    this.changedFiles.forEach(file => {
      if (file.includes('responsive') || file.includes('mobile')) {
        testFiles.push('tests/mobile-responsive.spec.js');
      }

      if (file.includes('performance') || file.includes('.css')) {
        testFiles.push('tests/performance.spec.js');
      }

      if (file.includes('accessibility') || file.includes('a11y')) {
        testFiles.push('tests/accessibility.spec.js');
      }

      if (file.includes('visual') || file.includes('ui')) {
        testFiles.push('tests/visual-regression.spec.js');
      }

      // Always include homepage tests for significant changes
      if (!testFiles.includes('tests/homepage.spec.js')) {
        testFiles.push('tests/homepage.spec.js');
      }
    });

    return [...new Set(testFiles)]; // Remove duplicates
  }

  async executeTests(command) {
    return new Promise((resolve, reject) => {
      console.log(`▶️  Executing: ${command}\n`);

      const child = spawn('npx', command.split(' ').slice(1), {
        stdio: 'inherit',
        shell: true,
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Tests failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async analyzeResults(duration) {
    console.log(`\n📊 Test execution completed in ${(duration / 1000).toFixed(2)}s`);

    try {
      // Read performance results if available
      const performancePath = 'test-results/performance/summary.json';
      if (fs.existsSync(performancePath)) {
        const performance = JSON.parse(fs.readFileSync(performancePath, 'utf8'));
        console.log(`⚡ Performance summary:`);
        console.log(`  - Test count: ${performance.testCount}`);
        console.log(`  - Worker count: ${performance.workerCount}`);
        console.log(`  - Total duration: ${(performance.duration / 1000).toFixed(2)}s`);

        if (performance.insights && performance.insights.length > 0) {
          console.log(`💡 Performance insights:`);
          performance.insights.forEach(insight => {
            console.log(`  - ${insight.message}`);
          });
        }
      }

      // Read test results
      const resultsPath = 'test-results/results.json';
      if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        if (results.stats) {
          console.log(`📈 Test results:`);
          console.log(`  - Passed: ${results.stats.passed || 0}`);
          console.log(`  - Failed: ${results.stats.failed || 0}`);
          console.log(`  - Skipped: ${results.stats.skipped || 0}`);
        }
      }

    } catch (error) {
      console.warn('⚠️  Could not analyze results:', error.message);
    }
  }

  showHelp() {
    console.log(`
🚀 Smart Playwright Test Runner

Usage: node scripts/smart-test-runner.js [options]

Modes:
  --quick              Run fast tests on Chromium only
  --full               Run complete test suite on all browsers
  --changed-only       Run tests related to changed files only
  --mode <mode>        Specify mode explicitly (auto|quick|full|changed-only)

Browser Selection:
  --browsers <list>    Comma-separated list of browsers
  --all-browsers       Run on all browsers (chromium,firefox,webkit,mobile-chrome,mobile-safari)
  --desktop-only       Run on desktop browsers only
  --mobile-only        Run on mobile browsers only

Execution Options:
  --workers <num>      Number of parallel workers
  --headed             Run tests in headed mode
  --debug              Run tests in debug mode (headed, single worker)
  --trace              Enable tracing
  --grep <pattern>     Run tests matching pattern
  --retries <num>      Number of retries for failed tests
  --update-snapshots   Update visual regression snapshots

Examples:
  node scripts/smart-test-runner.js --quick
  node scripts/smart-test-runner.js --full --all-browsers
  node scripts/smart-test-runner.js --changed-only --workers 4
  node scripts/smart-test-runner.js --grep "homepage" --headed
    `);
  }
}

// Run the smart test runner
if (require.main === module) {
  const runner = new SmartTestRunner();
  runner.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SmartTestRunner;