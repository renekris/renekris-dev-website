const http = require('http');
const https = require('https');
const fs = require('fs');

/**
 * Advanced Rollback Automation System
 * Implements sophisticated health validation, automatic rollback triggers, and deployment strategies
 */

// Configuration
const ROLLBACK_CONFIG = {
    triggers: {
        healthCheckFailures: {
            threshold: 3,
            timeWindow: 300000, // 5 minutes
            enabled: true
        },
        errorRate: {
            threshold: 0.05, // 5%
            sampleSize: 100,
            enabled: true
        },
        responseTime: {
            threshold: 5000, // 5 seconds
            sampleSize: 20,
            enabled: true
        },
        memoryUsage: {
            threshold: 95, // 95%
            enabled: true
        },
        crashLoop: {
            threshold: 3,
            timeWindow: 180000, // 3 minutes
            enabled: true
        }
    },
    strategies: {
        immediate: {
            name: 'Immediate Rollback',
            description: 'Instantly rollback to previous version',
            timeout: 30000
        },
        canary: {
            name: 'Canary Rollback',
            description: 'Gradually rollback traffic from new to old version',
            timeout: 120000,
            steps: [100, 75, 50, 25, 0] // Percentage of traffic to new version
        },
        blueGreen: {
            name: 'Blue-Green Rollback',
            description: 'Switch traffic back to previous environment',
            timeout: 60000
        }
    },
    github: {
        apiUrl: 'https://api.github.com',
        owner: 'renekris',
        repo: 'renekris-infrastructure',
        token: process.env.GITHUB_TOKEN
    },
    monitoring: {
        cooldownPeriod: 600000, // 10 minutes between rollbacks
        maxRollbacksPerHour: 3,
        trackingFile: '/tmp/rollback-tracking.json'
    }
};

// Rollback state tracking
let rollbackState = {
    lastRollback: null,
    rollbackHistory: [],
    activeTriggers: new Map(),
    currentStrategy: null,
    cooldownUntil: null,
    rollbacksThisHour: 0,
    metrics: {
        totalRollbacks: 0,
        successfulRollbacks: 0,
        failedRollbacks: 0,
        averageRollbackTime: 0
    }
};

/**
 * Load rollback tracking data
 */
function loadRollbackState() {
    try {
        if (fs.existsSync(ROLLBACK_CONFIG.monitoring.trackingFile)) {
            const data = fs.readFileSync(ROLLBACK_CONFIG.monitoring.trackingFile, 'utf8');
            const savedState = JSON.parse(data);
            rollbackState = { ...rollbackState, ...savedState };

            // Convert Map back from JSON
            rollbackState.activeTriggers = new Map(savedState.activeTriggers || []);

            console.log('Loaded rollback state from disk');
        }
    } catch (error) {
        console.warn('Failed to load rollback state:', error.message);
    }
}

/**
 * Save rollback tracking data
 */
function saveRollbackState() {
    try {
        const saveData = {
            ...rollbackState,
            activeTriggers: Array.from(rollbackState.activeTriggers.entries())
        };
        fs.writeFileSync(ROLLBACK_CONFIG.monitoring.trackingFile, JSON.stringify(saveData, null, 2));
    } catch (error) {
        console.warn('Failed to save rollback state:', error.message);
    }
}

/**
 * Check if rollback is allowed (not in cooldown, under rate limits)
 */
function isRollbackAllowed() {
    const now = Date.now();

    // Check cooldown period
    if (rollbackState.cooldownUntil && now < rollbackState.cooldownUntil) {
        const remainingCooldown = Math.round((rollbackState.cooldownUntil - now) / 1000);
        console.log(`Rollback in cooldown for ${remainingCooldown} more seconds`);
        return { allowed: false, reason: `Cooldown period (${remainingCooldown}s remaining)` };
    }

    // Check hourly rate limit
    const oneHourAgo = now - (60 * 60 * 1000);
    const recentRollbacks = rollbackState.rollbackHistory.filter(r =>
        new Date(r.timestamp).getTime() > oneHourAgo
    ).length;

    if (recentRollbacks >= ROLLBACK_CONFIG.monitoring.maxRollbacksPerHour) {
        return { allowed: false, reason: `Rate limit exceeded (${recentRollbacks}/${ROLLBACK_CONFIG.monitoring.maxRollbacksPerHour} rollbacks in last hour)` };
    }

    return { allowed: true };
}

/**
 * Determine best rollback strategy based on current conditions
 */
function determineRollbackStrategy(triggerReason, severity) {
    // For critical issues, use immediate rollback
    if (severity === 'critical' || triggerReason.includes('crash') || triggerReason.includes('health')) {
        return ROLLBACK_CONFIG.strategies.immediate;
    }

    // For performance issues, try canary rollback if supported
    if (triggerReason.includes('performance') || triggerReason.includes('response')) {
        return ROLLBACK_CONFIG.strategies.canary;
    }

    // Default to blue-green rollback
    return ROLLBACK_CONFIG.strategies.blueGreen;
}

/**
 * Validate health during rollback process
 */
async function validateHealthDuringRollback(endpoint, expectedStatus = 200, timeout = 10000) {
    return new Promise((resolve) => {
        const startTime = Date.now();

        const makeRequest = (url) => {
            const protocol = url.startsWith('https:') ? https : http;
            const req = protocol.get(url, { timeout }, (res) => {
                const responseTime = Date.now() - startTime;
                const success = res.statusCode === expectedStatus;

                resolve({
                    success,
                    statusCode: res.statusCode,
                    responseTime,
                    endpoint: url
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message,
                    responseTime: Date.now() - startTime,
                    endpoint: url
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'Request timeout',
                    responseTime: Date.now() - startTime,
                    endpoint: url
                });
            });
        };

        makeRequest(endpoint);
    });
}

/**
 * Execute immediate rollback strategy
 */
async function executeImmediateRollback(environment, reason) {
    console.log(`Executing immediate rollback for ${environment}: ${reason}`);

    const rollbackData = {
        id: `rollback-${Date.now()}`,
        timestamp: new Date().toISOString(),
        environment,
        reason,
        strategy: 'immediate',
        status: 'in_progress',
        startTime: Date.now(),
        endTime: null,
        duration: null,
        healthChecks: [],
        errors: []
    };

    try {
        // Trigger GitHub Actions rollback workflow
        const result = await triggerGitHubRollback(environment, reason, 'immediate');

        if (!result.success) {
            throw new Error(`GitHub rollback failed: ${result.error}`);
        }

        rollbackData.workflowRunId = result.workflowRunId;

        // Wait for rollback to complete and validate
        const validationResult = await waitForRollbackCompletion(environment, rollbackData);

        rollbackData.status = validationResult.success ? 'completed' : 'failed';
        rollbackData.endTime = Date.now();
        rollbackData.duration = rollbackData.endTime - rollbackData.startTime;
        rollbackData.healthChecks = validationResult.healthChecks;

        if (!validationResult.success) {
            rollbackData.errors.push(validationResult.error);
        }

        return rollbackData;

    } catch (error) {
        rollbackData.status = 'failed';
        rollbackData.endTime = Date.now();
        rollbackData.duration = rollbackData.endTime - rollbackData.startTime;
        rollbackData.errors.push(error.message);

        console.error('Immediate rollback failed:', error);
        return rollbackData;
    }
}

/**
 * Execute canary rollback strategy
 */
async function executeCanaryRollback(environment, reason) {
    console.log(`Executing canary rollback for ${environment}: ${reason}`);

    const rollbackData = {
        id: `rollback-${Date.now()}`,
        timestamp: new Date().toISOString(),
        environment,
        reason,
        strategy: 'canary',
        status: 'in_progress',
        startTime: Date.now(),
        endTime: null,
        duration: null,
        steps: [],
        healthChecks: [],
        errors: []
    };

    try {
        const canarySteps = ROLLBACK_CONFIG.strategies.canary.steps;

        for (let i = 0; i < canarySteps.length; i++) {
            const percentage = canarySteps[i];

            console.log(`Canary rollback step ${i + 1}/${canarySteps.length}: ${percentage}% new version`);

            const stepResult = await adjustTrafficSplit(environment, percentage);

            rollbackData.steps.push({
                step: i + 1,
                percentage,
                timestamp: new Date().toISOString(),
                success: stepResult.success,
                error: stepResult.error
            });

            if (!stepResult.success) {
                throw new Error(`Canary step ${i + 1} failed: ${stepResult.error}`);
            }

            // Health check after each step
            await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

            const healthResult = await validateHealthDuringRollback(`https://${environment === 'production' ? '' : 'staging.'}renekris.dev/health`);
            rollbackData.healthChecks.push(healthResult);

            if (!healthResult.success) {
                throw new Error(`Health check failed during canary rollback: ${healthResult.error}`);
            }
        }

        rollbackData.status = 'completed';
        rollbackData.endTime = Date.now();
        rollbackData.duration = rollbackData.endTime - rollbackData.startTime;

        return rollbackData;

    } catch (error) {
        rollbackData.status = 'failed';
        rollbackData.endTime = Date.now();
        rollbackData.duration = rollbackData.endTime - rollbackData.startTime;
        rollbackData.errors.push(error.message);

        console.error('Canary rollback failed:', error);

        // Attempt immediate rollback as fallback
        console.log('Attempting immediate rollback as fallback...');
        return await executeImmediateRollback(environment, `Canary rollback failed: ${error.message}`);
    }
}

/**
 * Trigger GitHub Actions rollback workflow
 */
async function triggerGitHubRollback(environment, reason, strategy) {
    if (!ROLLBACK_CONFIG.github.token) {
        return { success: false, error: 'GitHub token not configured' };
    }

    const payload = {
        event_type: strategy === 'immediate' ? 'emergency-rollback' : 'rollback-deployment',
        client_payload: {
            environment,
            rollback_reason: reason,
            strategy,
            priority: strategy === 'immediate' ? 'critical' : 'normal',
            triggered_by: 'automated-system',
            timestamp: new Date().toISOString()
        }
    };

    return new Promise((resolve) => {
        const postData = JSON.stringify(payload);

        const options = {
            hostname: 'api.github.com',
            path: `/repos/${ROLLBACK_CONFIG.github.owner}/${ROLLBACK_CONFIG.github.repo}/dispatches`,
            method: 'POST',
            headers: {
                'Authorization': `token ${ROLLBACK_CONFIG.github.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Renekris-Rollback-System',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('GitHub rollback triggered successfully');
                    resolve({ success: true, statusCode: res.statusCode });
                } else {
                    console.error(`GitHub rollback failed: ${res.statusCode} - ${responseData}`);
                    resolve({ success: false, statusCode: res.statusCode, error: responseData });
                }
            });
        });

        req.on('error', (error) => {
            console.error('GitHub rollback request error:', error);
            resolve({ success: false, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ success: false, error: 'Request timeout' });
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Adjust traffic split for canary rollback (placeholder for actual implementation)
 */
async function adjustTrafficSplit(environment, percentageNewVersion) {
    // This would integrate with your load balancer or service mesh
    // For now, return success (implement based on your infrastructure)
    console.log(`Adjusting traffic split: ${percentageNewVersion}% to new version`);

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true });
        }, 2000);
    });
}

/**
 * Wait for rollback completion and validate
 */
async function waitForRollbackCompletion(environment, rollbackData) {
    const maxWaitTime = 300000; // 5 minutes
    const checkInterval = 15000; // 15 seconds
    const startTime = Date.now();

    const healthChecks = [];

    while (Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));

        const healthResult = await validateHealthDuringRollback(
            `https://${environment === 'production' ? '' : 'staging.'}renekris.dev/health`
        );

        healthChecks.push(healthResult);

        if (healthResult.success) {
            // Additional validation - check multiple endpoints
            const readinessResult = await validateHealthDuringRollback(
                `https://${environment === 'production' ? '' : 'staging.'}renekris.dev/ready`
            );

            healthChecks.push(readinessResult);

            if (readinessResult.success) {
                return { success: true, healthChecks };
            }
        }
    }

    return {
        success: false,
        error: 'Rollback validation timeout',
        healthChecks
    };
}

/**
 * Execute rollback based on trigger
 */
async function executeRollback(triggerReason, severity = 'normal', environment = null) {
    const env = environment || process.env.NODE_ENV || 'development';

    // Check if rollback is allowed
    const allowCheck = isRollbackAllowed();
    if (!allowCheck.allowed) {
        console.log(`Rollback blocked: ${allowCheck.reason}`);
        return { success: false, reason: allowCheck.reason };
    }

    // Determine strategy
    const strategy = determineRollbackStrategy(triggerReason, severity);
    console.log(`Selected rollback strategy: ${strategy.name}`);

    rollbackState.currentStrategy = strategy;

    let rollbackResult;

    try {
        switch (strategy.name) {
            case 'Immediate Rollback':
                rollbackResult = await executeImmediateRollback(env, triggerReason);
                break;
            case 'Canary Rollback':
                rollbackResult = await executeCanaryRollback(env, triggerReason);
                break;
            case 'Blue-Green Rollback':
                rollbackResult = await executeImmediateRollback(env, triggerReason); // Fallback to immediate
                break;
            default:
                rollbackResult = await executeImmediateRollback(env, triggerReason);
        }

        // Update rollback tracking
        rollbackState.rollbackHistory.unshift(rollbackResult);
        rollbackState.lastRollback = rollbackResult;
        rollbackState.cooldownUntil = Date.now() + ROLLBACK_CONFIG.monitoring.cooldownPeriod;
        rollbackState.metrics.totalRollbacks++;

        if (rollbackResult.status === 'completed') {
            rollbackState.metrics.successfulRollbacks++;
        } else {
            rollbackState.metrics.failedRollbacks++;
        }

        // Update average rollback time
        if (rollbackResult.duration) {
            const total = rollbackState.metrics.successfulRollbacks;
            const current = rollbackState.metrics.averageRollbackTime;
            rollbackState.metrics.averageRollbackTime = ((current * (total - 1)) + rollbackResult.duration) / total;
        }

        // Keep only recent history
        if (rollbackState.rollbackHistory.length > 50) {
            rollbackState.rollbackHistory = rollbackState.rollbackHistory.slice(0, 50);
        }

        saveRollbackState();

        console.log(`Rollback ${rollbackResult.status}: ${rollbackResult.id}`);
        return { success: rollbackResult.status === 'completed', rollback: rollbackResult };

    } catch (error) {
        console.error('Rollback execution failed:', error);
        return { success: false, error: error.message };
    } finally {
        rollbackState.currentStrategy = null;
    }
}

/**
 * Get rollback status and metrics
 */
function getRollbackStatus() {
    return {
        currentStrategy: rollbackState.currentStrategy,
        lastRollback: rollbackState.lastRollback,
        cooldownUntil: rollbackState.cooldownUntil,
        inCooldown: rollbackState.cooldownUntil && Date.now() < rollbackState.cooldownUntil,
        metrics: rollbackState.metrics,
        recentHistory: rollbackState.rollbackHistory.slice(0, 10),
        activeTriggers: Array.from(rollbackState.activeTriggers.entries()).map(([key, value]) => ({
            trigger: key,
            ...value
        })),
        configuration: {
            triggers: ROLLBACK_CONFIG.triggers,
            strategies: Object.keys(ROLLBACK_CONFIG.strategies),
            monitoring: {
                cooldownPeriod: ROLLBACK_CONFIG.monitoring.cooldownPeriod,
                maxRollbacksPerHour: ROLLBACK_CONFIG.monitoring.maxRollbacksPerHour
            }
        }
    };
}

/**
 * Initialize rollback automation system
 */
function initializeRollbackSystem() {
    loadRollbackState();

    console.log('Rollback automation system initialized');
    console.log('Available strategies:', Object.keys(ROLLBACK_CONFIG.strategies));
    console.log('GitHub integration:', !!ROLLBACK_CONFIG.github.token);
}

module.exports = {
    initializeRollbackSystem,
    executeRollback,
    getRollbackStatus,
    isRollbackAllowed,
    validateHealthDuringRollback,
    ROLLBACK_CONFIG
};