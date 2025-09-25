const fs = require('fs');
const path = require('path');
const http = require('http');

/**
 * Deployment Monitoring and State Tracking Module
 * Tracks deployment metrics, rollback triggers, and pipeline performance
 */

// Configuration
const DEPLOYMENT_CONFIG = {
    stateFile: '/tmp/deployment-state.json',
    metricsFile: '/tmp/deployment-metrics.json',
    maxHistoryEntries: 100,
    rollbackTriggers: {
        healthCheckFailures: 3,
        errorRate: 0.05, // 5%
        responseTimeThreshold: 5000, // 5 seconds
        memoryThreshold: 95 // 95%
    }
};

// Deployment state tracking
let deploymentState = {
    current: null,
    history: [],
    metrics: {
        totalDeployments: 0,
        successfulDeployments: 0,
        failedDeployments: 0,
        rollbacks: 0,
        averageDeploymentTime: 0,
        lastDeploymentTime: null
    },
    rollbackTriggers: [],
    alerts: []
};

/**
 * Load deployment state from persistent storage
 */
function loadDeploymentState() {
    try {
        if (fs.existsSync(DEPLOYMENT_CONFIG.stateFile)) {
            const data = fs.readFileSync(DEPLOYMENT_CONFIG.stateFile, 'utf8');
            deploymentState = { ...deploymentState, ...JSON.parse(data) };
            console.log('Loaded deployment state from disk');
        }
    } catch (error) {
        console.warn('Failed to load deployment state:', error.message);
    }
}

/**
 * Save deployment state to persistent storage
 */
function saveDeploymentState() {
    try {
        const dir = path.dirname(DEPLOYMENT_CONFIG.stateFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DEPLOYMENT_CONFIG.stateFile, JSON.stringify(deploymentState, null, 2));
    } catch (error) {
        console.warn('Failed to save deployment state:', error.message);
    }
}

/**
 * Initialize deployment tracking
 */
function initializeDeploymentTracking() {
    loadDeploymentState();

    // Record current deployment
    const currentDeployment = {
        id: generateDeploymentId(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
        imageTag: process.env.IMAGE_TAG || 'unknown',
        buildTimestamp: process.env.BUILD_TIMESTAMP || 'unknown',
        commitSha: process.env.COMMIT_SHA || 'unknown',
        branch: process.env.BRANCH || 'unknown',
        actor: process.env.ACTOR || 'unknown',
        workflowRunId: process.env.WORKFLOW_RUN_ID || 'unknown',
        status: 'deploying',
        startTime: Date.now(),
        endTime: null,
        duration: null,
        healthChecks: [],
        errors: [],
        rollbackTriggered: false
    };

    deploymentState.current = currentDeployment;
    deploymentState.metrics.totalDeployments++;

    console.log(`Deployment tracking initialized: ${currentDeployment.id}`);
    saveDeploymentState();

    // Mark deployment as successful after initialization
    setTimeout(() => {
        markDeploymentSuccessful();
    }, 10000); // 10 seconds for basic startup
}

/**
 * Generate unique deployment ID
 */
function generateDeploymentId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `deploy-${timestamp}-${random}`;
}

/**
 * Record deployment success
 */
function markDeploymentSuccessful() {
    if (!deploymentState.current) return;

    const deployment = deploymentState.current;
    deployment.status = 'successful';
    deployment.endTime = Date.now();
    deployment.duration = deployment.endTime - deployment.startTime;

    deploymentState.metrics.successfulDeployments++;
    updateAverageDeploymentTime(deployment.duration);

    // Move to history
    addToHistory(deployment);
    deploymentState.current = null;

    console.log(`Deployment ${deployment.id} marked as successful (${deployment.duration}ms)`);
    saveDeploymentState();
}

/**
 * Record deployment failure
 */
function markDeploymentFailed(reason, error = null) {
    if (!deploymentState.current) return;

    const deployment = deploymentState.current;
    deployment.status = 'failed';
    deployment.endTime = Date.now();
    deployment.duration = deployment.endTime - deployment.startTime;
    deployment.failureReason = reason;

    if (error) {
        deployment.errors.push({
            timestamp: new Date().toISOString(),
            message: error.message || error,
            stack: error.stack || null
        });
    }

    deploymentState.metrics.failedDeployments++;

    // Move to history
    addToHistory(deployment);
    deploymentState.current = null;

    console.log(`Deployment ${deployment.id} marked as failed: ${reason}`);
    saveDeploymentState();
}

/**
 * Record health check result
 */
function recordHealthCheck(endpoint, success, responseTime, error = null) {
    if (!deploymentState.current) return;

    const healthCheck = {
        timestamp: new Date().toISOString(),
        endpoint,
        success,
        responseTime,
        error: error ? error.message : null
    };

    deploymentState.current.healthChecks.push(healthCheck);

    // Check for rollback triggers
    checkRollbackTriggers();

    saveDeploymentState();
}

/**
 * Check if rollback should be triggered
 */
function checkRollbackTriggers() {
    if (!deploymentState.current) return false;

    const deployment = deploymentState.current;
    const recentHealthChecks = deployment.healthChecks.slice(-10); // Last 10 checks

    // Count recent failures
    const failures = recentHealthChecks.filter(check => !check.success).length;
    if (failures >= DEPLOYMENT_CONFIG.rollbackTriggers.healthCheckFailures) {
        triggerRollback('health_check_failures', `${failures} consecutive health check failures`);
        return true;
    }

    // Check response time
    const recentResponseTimes = recentHealthChecks
        .filter(check => check.success && check.responseTime)
        .map(check => check.responseTime);

    if (recentResponseTimes.length > 0) {
        const avgResponseTime = recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length;
        if (avgResponseTime > DEPLOYMENT_CONFIG.rollbackTriggers.responseTimeThreshold) {
            triggerRollback('high_response_time', `Average response time ${avgResponseTime}ms exceeds threshold`);
            return true;
        }
    }

    return false;
}

/**
 * Trigger deployment rollback
 */
function triggerRollback(reason, details) {
    if (!deploymentState.current) return;

    const deployment = deploymentState.current;
    deployment.rollbackTriggered = true;
    deployment.rollbackReason = reason;
    deployment.rollbackDetails = details;
    deployment.rollbackTimestamp = new Date().toISOString();

    deploymentState.metrics.rollbacks++;

    const rollbackEvent = {
        deploymentId: deployment.id,
        timestamp: new Date().toISOString(),
        reason,
        details,
        environment: deployment.environment
    };

    deploymentState.rollbackTriggers.push(rollbackEvent);

    console.log(`Rollback triggered for deployment ${deployment.id}: ${reason} - ${details}`);

    // Add alert
    addAlert('rollback_triggered', `Rollback triggered: ${reason}`, 'critical');

    saveDeploymentState();

    // Trigger actual rollback via GitHub API or webhook
    notifyRollbackRequired(rollbackEvent);
}

/**
 * Add deployment to history
 */
function addToHistory(deployment) {
    deploymentState.history.unshift(deployment);

    // Keep only recent entries
    if (deploymentState.history.length > DEPLOYMENT_CONFIG.maxHistoryEntries) {
        deploymentState.history = deploymentState.history.slice(0, DEPLOYMENT_CONFIG.maxHistoryEntries);
    }
}

/**
 * Update average deployment time
 */
function updateAverageDeploymentTime(duration) {
    const total = deploymentState.metrics.successfulDeployments;
    const current = deploymentState.metrics.averageDeploymentTime;
    const newAverage = ((current * (total - 1)) + duration) / total;
    deploymentState.metrics.averageDeploymentTime = Math.round(newAverage);
}

/**
 * Add alert
 */
function addAlert(type, message, severity = 'info') {
    const alert = {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type,
        message,
        severity,
        acknowledged: false
    };

    deploymentState.alerts.unshift(alert);

    // Keep only recent alerts
    if (deploymentState.alerts.length > 50) {
        deploymentState.alerts = deploymentState.alerts.slice(0, 50);
    }

    console.log(`Alert [${severity}]: ${message}`);
}

/**
 * Notify external systems about rollback requirement
 */
function notifyRollbackRequired(rollbackEvent) {
    // This would integrate with GitHub API or monitoring systems
    console.log('Rollback notification:', JSON.stringify(rollbackEvent, null, 2));

    // Example: POST to monitoring webhook
    if (process.env.ROLLBACK_WEBHOOK_URL) {
        const postData = JSON.stringify({
            event: 'rollback_required',
            deployment: rollbackEvent,
            timestamp: new Date().toISOString()
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        try {
            const req = http.request(process.env.ROLLBACK_WEBHOOK_URL, options);
            req.write(postData);
            req.end();
        } catch (error) {
            console.error('Failed to send rollback notification:', error);
        }
    }
}

/**
 * Get deployment status report
 */
function getDeploymentStatus() {
    return {
        current: deploymentState.current,
        metrics: {
            ...deploymentState.metrics,
            successRate: deploymentState.metrics.totalDeployments > 0
                ? (deploymentState.metrics.successfulDeployments / deploymentState.metrics.totalDeployments) * 100
                : 0,
            failureRate: deploymentState.metrics.totalDeployments > 0
                ? (deploymentState.metrics.failedDeployments / deploymentState.metrics.totalDeployments) * 100
                : 0,
            rollbackRate: deploymentState.metrics.totalDeployments > 0
                ? (deploymentState.metrics.rollbacks / deploymentState.metrics.totalDeployments) * 100
                : 0
        },
        recentHistory: deploymentState.history.slice(0, 10),
        recentRollbacks: deploymentState.rollbackTriggers.slice(0, 5),
        activeAlerts: deploymentState.alerts.filter(alert => !alert.acknowledged).slice(0, 10),
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Get performance metrics
 */
function getPerformanceMetrics() {
    const recentDeployments = deploymentState.history.slice(0, 20);
    const successfulDeployments = recentDeployments.filter(d => d.status === 'successful');

    return {
        averageDeploymentTime: deploymentState.metrics.averageDeploymentTime,
        recentDeploymentTimes: successfulDeployments.map(d => ({
            id: d.id,
            duration: d.duration,
            timestamp: d.timestamp
        })),
        deploymentFrequency: calculateDeploymentFrequency(),
        errorTrends: calculateErrorTrends(),
        performanceTrends: calculatePerformanceTrends()
    };
}

/**
 * Calculate deployment frequency
 */
function calculateDeploymentFrequency() {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const deploymentsLastDay = deploymentState.history.filter(d =>
        new Date(d.timestamp).getTime() > oneDayAgo
    ).length;

    const deploymentsLastWeek = deploymentState.history.filter(d =>
        new Date(d.timestamp).getTime() > oneWeekAgo
    ).length;

    return {
        lastDay: deploymentsLastDay,
        lastWeek: deploymentsLastWeek,
        averagePerDay: deploymentsLastWeek / 7
    };
}

/**
 * Calculate error trends
 */
function calculateErrorTrends() {
    const recentDeployments = deploymentState.history.slice(0, 20);
    const errors = recentDeployments.map(d => ({
        id: d.id,
        timestamp: d.timestamp,
        status: d.status,
        errors: d.errors?.length || 0,
        healthCheckFailures: d.healthChecks?.filter(h => !h.success).length || 0
    }));

    return errors;
}

/**
 * Calculate performance trends
 */
function calculatePerformanceTrends() {
    const recentDeployments = deploymentState.history.slice(0, 20);
    const successful = recentDeployments.filter(d => d.status === 'successful');

    return successful.map(d => ({
        id: d.id,
        timestamp: d.timestamp,
        duration: d.duration,
        avgHealthCheckTime: d.healthChecks?.length > 0
            ? d.healthChecks.reduce((sum, h) => sum + (h.responseTime || 0), 0) / d.healthChecks.length
            : null
    }));
}

/**
 * Acknowledge alert
 */
function acknowledgeAlert(alertId) {
    const alert = deploymentState.alerts.find(a => a.id === alertId);
    if (alert) {
        alert.acknowledged = true;
        alert.acknowledgedAt = new Date().toISOString();
        saveDeploymentState();
    }
}

module.exports = {
    initializeDeploymentTracking,
    markDeploymentSuccessful,
    markDeploymentFailed,
    recordHealthCheck,
    triggerRollback,
    getDeploymentStatus,
    getPerformanceMetrics,
    addAlert,
    acknowledgeAlert,
    DEPLOYMENT_CONFIG
};