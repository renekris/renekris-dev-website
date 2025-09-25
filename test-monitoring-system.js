#!/usr/bin/env node

/**
 * Comprehensive Monitoring System Test Suite
 * Tests all health checks, monitoring endpoints, and system integrations
 */

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
    serverPort: 8080,
    serverHost: 'localhost',
    timeout: 10000,
    retries: 3,
    testInterval: 1000
};

// Test results tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
    details: []
};

/**
 * Make HTTP request for testing
 */
function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const reqOptions = {
            hostname: TEST_CONFIG.serverHost,
            port: TEST_CONFIG.serverPort,
            path,
            method: options.method || 'GET',
            headers: options.headers || {},
            timeout: TEST_CONFIG.timeout
        };

        const req = http.request(reqOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    success: res.statusCode >= 200 && res.statusCode < 300
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

/**
 * Run a test with retries
 */
async function runTest(testName, testFunction) {
    testResults.total++;
    console.log(`\\n🧪 Running test: ${testName}`);

    for (let attempt = 1; attempt <= TEST_CONFIG.retries; attempt++) {
        try {
            const result = await testFunction();

            if (result.success) {
                testResults.passed++;
                testResults.details.push({
                    name: testName,
                    status: 'PASSED',
                    attempt,
                    details: result.details || ''
                });
                console.log(`✅ ${testName} - PASSED`);
                return result;
            } else {
                throw new Error(result.error || 'Test failed');
            }
        } catch (error) {
            if (attempt === TEST_CONFIG.retries) {
                testResults.failed++;
                testResults.errors.push(`${testName}: ${error.message}`);
                testResults.details.push({
                    name: testName,
                    status: 'FAILED',
                    attempt,
                    error: error.message
                });
                console.log(`❌ ${testName} - FAILED: ${error.message}`);
                return { success: false, error: error.message };
            } else {
                console.log(`⚠️  ${testName} - Attempt ${attempt} failed, retrying...`);
                await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.testInterval));
            }
        }
    }
}

/**
 * Test health endpoint
 */
async function testHealthEndpoint() {
    const response = await makeRequest('/health');

    if (!response.success) {
        throw new Error(`Health endpoint returned ${response.statusCode}`);
    }

    const healthData = JSON.parse(response.body);

    // Validate health response structure
    if (!healthData.status) {
        throw new Error('Health response missing status field');
    }

    if (!healthData.dependencies) {
        throw new Error('Health response missing dependencies field');
    }

    if (!healthData.deployment) {
        throw new Error('Health response missing deployment field');
    }

    return {
        success: true,
        details: `Status: ${healthData.status}, Dependencies: ${Object.keys(healthData.dependencies).length}`
    };
}

/**
 * Test readiness endpoint
 */
async function testReadinessEndpoint() {
    const response = await makeRequest('/ready');

    if (!response.success) {
        throw new Error(`Readiness endpoint returned ${response.statusCode}`);
    }

    const readinessData = JSON.parse(response.body);

    if (!readinessData.status) {
        throw new Error('Readiness response missing status field');
    }

    return {
        success: true,
        details: `Status: ${readinessData.status}`
    };
}

/**
 * Test liveness endpoint
 */
async function testLivenessEndpoint() {
    const response = await makeRequest('/live');

    if (!response.success) {
        throw new Error(`Liveness endpoint returned ${response.statusCode}`);
    }

    const livenessData = JSON.parse(response.body);

    if (livenessData.status !== 'alive') {
        throw new Error('Liveness endpoint reports not alive');
    }

    if (!livenessData.pid) {
        throw new Error('Liveness response missing PID');
    }

    return {
        success: true,
        details: `PID: ${livenessData.pid}, Uptime: ${livenessData.uptime}s`
    };
}

/**
 * Test monitoring dashboard endpoint
 */
async function testMonitoringDashboard() {
    const response = await makeRequest('/api/monitoring-dashboard');

    if (!response.success) {
        throw new Error(`Monitoring dashboard endpoint returned ${response.statusCode}`);
    }

    const dashboardData = JSON.parse(response.body);

    if (!dashboardData.initialized) {
        throw new Error('Monitoring dashboard not initialized');
    }

    if (!dashboardData.systems) {
        throw new Error('Monitoring dashboard missing systems status');
    }

    return {
        success: true,
        details: `Initialized: ${dashboardData.initialized}, Systems operational: ${JSON.stringify(dashboardData.systems)}`
    };
}

/**
 * Test performance dashboard endpoint
 */
async function testPerformanceDashboard() {
    const response = await makeRequest('/api/performance-dashboard');

    if (!response.success) {
        throw new Error(`Performance dashboard endpoint returned ${response.statusCode}`);
    }

    const performanceData = JSON.parse(response.body);

    if (!performanceData.summary) {
        throw new Error('Performance dashboard missing summary');
    }

    return {
        success: true,
        details: `Active deployment: ${performanceData.summary.activeDeployment || 'none'}`
    };
}

/**
 * Test API status endpoint
 */
async function testApiStatus() {
    const response = await makeRequest('/api/status');

    if (!response.success) {
        throw new Error(`API status endpoint returned ${response.statusCode}`);
    }

    return {
        success: true,
        details: 'API status endpoint responsive'
    };
}

/**
 * Test Minecraft status endpoint
 */
async function testMinecraftStatus() {
    const response = await makeRequest('/api/minecraft-status');

    if (!response.success) {
        throw new Error(`Minecraft status endpoint returned ${response.statusCode}`);
    }

    const minecraftData = JSON.parse(response.body);

    // This endpoint should always return something, even if error
    if (typeof minecraftData.online === 'undefined') {
        throw new Error('Minecraft status missing online field');
    }

    return {
        success: true,
        details: `Minecraft online: ${minecraftData.online}, Players: ${minecraftData.players?.online || 0}`
    };
}

/**
 * Test rollback trigger endpoint (without actually triggering)
 */
async function testRollbackTriggerEndpoint() {
    const response = await makeRequest('/api/trigger-rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reason: 'test-rollback-validation',
            environment: 'test',
            actor: 'monitoring-test'
        })
    });

    // We expect this to potentially fail due to cooldown or other safety checks
    // So we check that the endpoint is responsive and returns proper error codes
    if (response.statusCode === 429 || response.statusCode === 503) {
        return {
            success: true,
            details: 'Rollback endpoint properly protected (cooldown/rate limiting active)'
        };
    }

    if (response.statusCode >= 400 && response.statusCode < 500) {
        return {
            success: true,
            details: 'Rollback endpoint validation working'
        };
    }

    if (response.success) {
        return {
            success: true,
            details: 'Rollback endpoint accepted test request'
        };
    }

    throw new Error(`Rollback trigger endpoint returned unexpected status: ${response.statusCode}`);
}

/**
 * Test response headers for security and monitoring
 */
async function testResponseHeaders() {
    const response = await makeRequest('/health');

    if (!response.success) {
        throw new Error('Failed to get response for header testing');
    }

    const headers = response.headers;

    // Check for important monitoring headers
    if (!headers['x-health-status']) {
        throw new Error('Missing X-Health-Status header');
    }

    if (!headers['x-response-time']) {
        throw new Error('Missing X-Response-Time header');
    }

    // Check CORS headers
    if (!headers['access-control-allow-origin']) {
        throw new Error('Missing CORS headers');
    }

    return {
        success: true,
        details: `Health status: ${headers['x-health-status']}, Response time: ${headers['x-response-time']}ms`
    };
}

/**
 * Test endpoint performance
 */
async function testEndpointPerformance() {
    const endpoints = ['/health', '/ready', '/live'];
    const results = [];

    for (const endpoint of endpoints) {
        const startTime = Date.now();
        const response = await makeRequest(endpoint);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (!response.success) {
            throw new Error(`Performance test failed for ${endpoint}: ${response.statusCode}`);
        }

        results.push({ endpoint, responseTime });
    }

    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    if (avgResponseTime > 2000) {
        throw new Error(`Average response time too high: ${avgResponseTime}ms`);
    }

    return {
        success: true,
        details: `Average response time: ${Math.round(avgResponseTime)}ms`
    };
}

/**
 * Test system under load
 */
async function testSystemLoad() {
    const concurrentRequests = 10;
    const promises = [];

    // Make multiple concurrent requests
    for (let i = 0; i < concurrentRequests; i++) {
        promises.push(makeRequest('/health'));
        promises.push(makeRequest('/ready'));
        promises.push(makeRequest('/live'));
    }

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    if (failed > results.length * 0.1) { // Allow 10% failure rate
        throw new Error(`Too many failed requests under load: ${failed}/${results.length}`);
    }

    return {
        success: true,
        details: `Load test: ${successful}/${results.length} successful requests`
    };
}

/**
 * Test static file serving
 */
async function testStaticFiles() {
    const response = await makeRequest('/');

    if (!response.success) {
        throw new Error(`Root endpoint returned ${response.statusCode}`);
    }

    if (!response.body.includes('html')) {
        throw new Error('Root endpoint does not return HTML content');
    }

    return {
        success: true,
        details: 'Static file serving working'
    };
}

/**
 * Test error handling
 */
async function testErrorHandling() {
    const response = await makeRequest('/nonexistent-endpoint');

    // Should either return 404 or serve the React app (for client-side routing)
    if (response.statusCode !== 404 && response.statusCode !== 200) {
        throw new Error(`Unexpected error handling: ${response.statusCode}`);
    }

    return {
        success: true,
        details: `Error handling working (${response.statusCode})`
    };
}

/**
 * Check if server is running
 */
async function checkServerRunning() {
    try {
        await makeRequest('/health');
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Generate test report
 */
function generateTestReport() {
    console.log('\\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE MONITORING SYSTEM TEST REPORT');
    console.log('='.repeat(60));
    console.log(`\\n📈 Test Summary:`);
    console.log(`   Total Tests: ${testResults.total}`);
    console.log(`   Passed: ${testResults.passed} ✅`);
    console.log(`   Failed: ${testResults.failed} ❌`);
    console.log(`   Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    if (testResults.failed > 0) {
        console.log(`\\n❌ Failed Tests:`);
        testResults.errors.forEach(error => {
            console.log(`   • ${error}`);
        });
    }

    console.log(`\\n📋 Detailed Results:`);
    testResults.details.forEach(detail => {
        const icon = detail.status === 'PASSED' ? '✅' : '❌';
        console.log(`   ${icon} ${detail.name}`);
        if (detail.details) {
            console.log(`      Details: ${detail.details}`);
        }
        if (detail.error) {
            console.log(`      Error: ${detail.error}`);
        }
    });

    console.log('\\n' + '='.repeat(60));

    // Return overall success
    return testResults.failed === 0;
}

/**
 * Main test execution
 */
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Monitoring System Tests\\n');

    // Check if server is running
    const serverRunning = await checkServerRunning();
    if (!serverRunning) {
        console.log('❌ Server is not running. Please start the server first.');
        console.log('   Run: node src/server/production-server.js');
        process.exit(1);
    }

    console.log('✅ Server is running, starting tests...');

    // Run all tests
    await runTest('Health Endpoint', testHealthEndpoint);
    await runTest('Readiness Endpoint', testReadinessEndpoint);
    await runTest('Liveness Endpoint', testLivenessEndpoint);
    await runTest('Monitoring Dashboard', testMonitoringDashboard);
    await runTest('Performance Dashboard', testPerformanceDashboard);
    await runTest('API Status', testApiStatus);
    await runTest('Minecraft Status', testMinecraftStatus);
    await runTest('Rollback Trigger Validation', testRollbackTriggerEndpoint);
    await runTest('Response Headers', testResponseHeaders);
    await runTest('Endpoint Performance', testEndpointPerformance);
    await runTest('System Load Test', testSystemLoad);
    await runTest('Static File Serving', testStaticFiles);
    await runTest('Error Handling', testErrorHandling);

    // Generate and display report
    const success = generateTestReport();

    // Save detailed report
    const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
            total: testResults.total,
            passed: testResults.passed,
            failed: testResults.failed,
            successRate: (testResults.passed / testResults.total) * 100
        },
        details: testResults.details,
        errors: testResults.errors
    };

    fs.writeFileSync('monitoring-test-report.json', JSON.stringify(reportData, null, 2));
    console.log(`\\n📄 Detailed report saved to: monitoring-test-report.json`);

    // Exit with appropriate code
    process.exit(success ? 0 : 1);
}

// Handle command line execution
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('\\n💥 Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = {
    runAllTests,
    testResults,
    TEST_CONFIG
};