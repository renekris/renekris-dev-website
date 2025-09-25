const healthMonitor = require('./health-monitor');
const deploymentMonitor = require('./deployment-monitor');
const notificationSystem = require('./notification-system');
const rollbackAutomation = require('./rollback-automation');
const performanceMonitor = require('./performance-monitor');

/**
 * Comprehensive Monitoring Dashboard Integration
 * Orchestrates all monitoring systems and provides unified dashboard and API endpoints
 */

// Integration state
let integrationState = {
    initialized: false,
    systems: {
        health: false,
        deployment: false,
        notification: false,
        rollback: false,
        performance: false
    },
    alerts: [],
    dashboardData: null,
    lastUpdate: null
};

/**
 * Initialize all monitoring systems
 */
function initializeMonitoringSystems() {
    console.log('🚀 Initializing comprehensive monitoring systems...');

    try {
        // Initialize health monitoring
        healthMonitor.startPeriodicHealthCheck();
        integrationState.systems.health = true;
        console.log('✅ Health monitoring system initialized');

        // Initialize deployment monitoring
        deploymentMonitor.initializeDeploymentTracking();
        integrationState.systems.deployment = true;
        console.log('✅ Deployment monitoring system initialized');

        // Initialize notification system
        notificationSystem.initializeNotificationSystem();
        integrationState.systems.notification = true;
        console.log('✅ Notification system initialized');

        // Initialize rollback automation
        rollbackAutomation.initializeRollbackSystem();
        integrationState.systems.rollback = true;
        console.log('✅ Rollback automation system initialized');

        // Initialize performance monitoring
        performanceMonitor.initializePerformanceMonitoring();
        integrationState.systems.performance = true;
        console.log('✅ Performance monitoring system initialized');

        integrationState.initialized = true;
        console.log('🎉 All monitoring systems initialized successfully');

        // Start integrated monitoring loop
        startIntegratedMonitoring();

    } catch (error) {
        console.error('❌ Failed to initialize monitoring systems:', error);
        integrationState.initialized = false;
    }
}

/**
 * Start integrated monitoring and alerting
 */
function startIntegratedMonitoring() {
    // Update dashboard data periodically
    setInterval(updateDashboardData, 30000); // Every 30 seconds

    // Process cross-system alerts
    setInterval(processCrossSystemAlerts, 60000); // Every minute

    // Health check integration
    setInterval(integratedHealthCheck, 120000); // Every 2 minutes

    console.log('🔄 Integrated monitoring loop started');
}

/**
 * Update comprehensive dashboard data
 */
async function updateDashboardData() {
    try {
        const [
            healthReport,
            deploymentStatus,
            rollbackStatus,
            performanceDashboard,
            notificationStats
        ] = await Promise.all([
            healthMonitor.generateHealthReport(),
            deploymentMonitor.getDeploymentStatus(),
            rollbackAutomation.getRollbackStatus(),
            performanceMonitor.getPerformanceDashboard(),
            notificationSystem.getNotificationStats()
        ]);

        integrationState.dashboardData = {
            timestamp: new Date().toISOString(),
            systems: integrationState.systems,
            health: {
                overall: healthReport.status,
                dependencies: healthReport.dependencies,
                readiness: healthReport.readiness,
                checks: healthReport.checks
            },
            deployment: {
                current: deploymentStatus.current,
                metrics: deploymentStatus.metrics,
                recentHistory: deploymentStatus.recentHistory.slice(0, 5),
                activeAlerts: deploymentStatus.activeAlerts.slice(0, 5)
            },
            rollback: {
                status: rollbackStatus.inCooldown ? 'cooldown' : 'ready',
                lastRollback: rollbackStatus.lastRollback,
                metrics: rollbackStatus.metrics,
                activeTriggers: rollbackStatus.activeTriggers
            },
            performance: {
                summary: performanceDashboard.summary,
                deployments: performanceDashboard.deployments,
                resources: performanceDashboard.resources,
                alerts: performanceDashboard.alerts.slice(0, 5)
            },
            notifications: notificationStats,
            summary: generateDashboardSummary(healthReport, deploymentStatus, rollbackStatus, performanceDashboard)
        };

        integrationState.lastUpdate = new Date().toISOString();

    } catch (error) {
        console.error('Failed to update dashboard data:', error);
    }
}

/**
 * Generate dashboard summary
 */
function generateDashboardSummary(health, deployment, rollback, performance) {
    const summary = {
        overallStatus: 'healthy',
        criticalIssues: 0,
        warnings: 0,
        activeDeployment: !!deployment.current,
        rollbackReady: !rollback.inCooldown,
        systemsOperational: Object.values(integrationState.systems).every(s => s),
        lastDeployment: deployment.recentHistory[0] || null,
        performanceScore: calculatePerformanceScore(performance)
    };

    // Determine overall status
    if (health.status === 'unhealthy') {
        summary.overallStatus = 'critical';
        summary.criticalIssues++;
    } else if (health.status === 'degraded') {
        summary.overallStatus = 'warning';
        summary.warnings++;
    }

    // Count alerts
    const allAlerts = [
        ...deployment.activeAlerts,
        ...performance.alerts
    ];

    summary.criticalIssues += allAlerts.filter(a => a.severity === 'critical').length;
    summary.warnings += allAlerts.filter(a => a.severity === 'warning').length;

    if (summary.criticalIssues > 0) {
        summary.overallStatus = 'critical';
    } else if (summary.warnings > 0 && summary.overallStatus === 'healthy') {
        summary.overallStatus = 'warning';
    }

    return summary;
}

/**
 * Calculate performance score (0-100)
 */
function calculatePerformanceScore(performance) {
    let score = 100;

    // Deployment success rate impact (30%)
    const successRate = performance.deployments.successRate || 0;
    score -= (100 - successRate) * 0.3;

    // Resource usage impact (25%)
    const cpuUsage = performance.resources.current.cpu?.usage || 0;
    const memoryUsage = performance.resources.current.memory?.usage || 0;
    const avgResourceUsage = (cpuUsage + memoryUsage) / 2;
    if (avgResourceUsage > 80) {
        score -= (avgResourceUsage - 80) * 0.25;
    }

    // Alert count impact (25%)
    const alertCount = performance.alerts.length;
    score -= Math.min(alertCount * 5, 25);

    // Recent deployment time impact (20%)
    const avgDeploymentTime = performance.deployments.averageDuration || 0;
    const deploymentThreshold = 600000; // 10 minutes
    if (avgDeploymentTime > deploymentThreshold) {
        const overtime = (avgDeploymentTime - deploymentThreshold) / deploymentThreshold;
        score -= Math.min(overtime * 20, 20);
    }

    return Math.max(0, Math.round(score));
}

/**
 * Process cross-system alerts and trigger actions
 */
async function processCrossSystemAlerts() {
    try {
        const healthData = healthMonitor.getCurrentHealthData();
        const deploymentStatus = deploymentMonitor.getDeploymentStatus();

        // Check for rollback triggers
        if (deploymentStatus.current) {
            const deployment = deploymentStatus.current;

            // Health check failures
            const recentHealthChecks = deployment.healthChecks.slice(-5);
            const healthFailures = recentHealthChecks.filter(check => !check.success).length;

            if (healthFailures >= 3) {
                console.log('🚨 Triggering rollback due to health check failures');
                await rollbackAutomation.executeRollback(
                    `Health check failures: ${healthFailures}/5`,
                    'critical',
                    deployment.environment
                );

                // Send notification
                notificationSystem.notifyRollbackTriggered({
                    deploymentId: deployment.id,
                    reason: 'health_check_failures',
                    details: `${healthFailures} consecutive health check failures`,
                    environment: deployment.environment
                });
            }
        }

        // Check for performance degradation
        const performanceDashboard = performanceMonitor.getPerformanceDashboard();
        const criticalPerformanceAlerts = performanceDashboard.alerts.filter(a =>
            a.severity === 'critical' && !a.acknowledged
        );

        if (criticalPerformanceAlerts.length > 0) {
            for (const alert of criticalPerformanceAlerts) {
                notificationSystem.notifyPerformanceDegradation({
                    metric: alert.data.resource || alert.type,
                    currentValue: alert.data.value,
                    threshold: alert.data.threshold,
                    deploymentId: deploymentStatus.current?.id
                });
            }
        }

    } catch (error) {
        console.error('Error processing cross-system alerts:', error);
    }
}

/**
 * Integrated health check across all systems
 */
async function integratedHealthCheck() {
    try {
        const healthReport = await healthMonitor.generateHealthReport();

        // Record deployment health check if deployment is active
        const deploymentStatus = deploymentMonitor.getDeploymentStatus();
        if (deploymentStatus.current) {
            deploymentMonitor.recordHealthCheck(
                '/health',
                healthReport.status !== 'unhealthy',
                Date.now()
            );
        }

        // Check for service recovery
        if (healthReport.status === 'healthy' && integrationState.lastHealthStatus === 'unhealthy') {
            notificationSystem.notifyServiceRecovery({
                previousIssue: 'System health issues',
                recoveryTime: Date.now() - (integrationState.lastUnhealthyTime || Date.now())
            });
        }

        // Track health status for recovery detection
        if (healthReport.status === 'unhealthy' && integrationState.lastHealthStatus !== 'unhealthy') {
            integrationState.lastUnhealthyTime = Date.now();
        }

        integrationState.lastHealthStatus = healthReport.status;

    } catch (error) {
        console.error('Integrated health check failed:', error);
    }
}

/**
 * Get comprehensive monitoring status
 */
function getMonitoringStatus() {
    return {
        initialized: integrationState.initialized,
        systems: integrationState.systems,
        dashboard: integrationState.dashboardData,
        lastUpdate: integrationState.lastUpdate,
        uptime: process.uptime(),
        version: process.env.APP_VERSION || '1.0.0'
    };
}

/**
 * Handle manual rollback trigger
 */
async function triggerManualRollback(reason, environment, actor) {
    try {
        console.log(`Manual rollback triggered by ${actor}: ${reason}`);

        const result = await rollbackAutomation.executeRollback(
            `Manual rollback: ${reason}`,
            'normal',
            environment
        );

        // Send notification
        notificationSystem.notifyRollbackTriggered({
            deploymentId: 'manual',
            reason: 'manual_trigger',
            details: `Manually triggered by ${actor}: ${reason}`,
            environment,
            actor
        });

        return result;

    } catch (error) {
        console.error('Manual rollback failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Handle manual deployment success notification
 */
function notifyDeploymentComplete(deploymentData) {
    try {
        deploymentMonitor.markDeploymentSuccessful();

        notificationSystem.notifyDeploymentSuccess({
            deploymentId: deploymentData.id,
            environment: deploymentData.environment,
            version: deploymentData.version,
            imageTag: deploymentData.imageTag,
            duration: deploymentData.duration,
            actor: deploymentData.actor,
            branch: deploymentData.branch
        });

        console.log(`Deployment success notification sent for: ${deploymentData.id}`);

    } catch (error) {
        console.error('Failed to send deployment success notification:', error);
    }
}

/**
 * Handle manual deployment failure notification
 */
function notifyDeploymentFailed(deploymentData, error) {
    try {
        deploymentMonitor.markDeploymentFailed(deploymentData.reason, error);

        notificationSystem.notifyDeploymentFailure({
            deploymentId: deploymentData.id,
            environment: deploymentData.environment,
            reason: deploymentData.reason,
            duration: deploymentData.duration,
            actor: deploymentData.actor,
            branch: deploymentData.branch
        });

        console.log(`Deployment failure notification sent for: ${deploymentData.id}`);

    } catch (error) {
        console.error('Failed to send deployment failure notification:', error);
    }
}

/**
 * Get system health summary for external monitoring
 */
async function getHealthSummary() {
    try {
        const healthReport = await healthMonitor.generateHealthReport();
        const deploymentStatus = deploymentMonitor.getDeploymentStatus();
        const rollbackStatus = rollbackAutomation.getRollbackStatus();

        return {
            status: healthReport.status,
            timestamp: new Date().toISOString(),
            checks: {
                health: healthReport.status !== 'unhealthy',
                deployment: !deploymentStatus.current || deploymentStatus.current.status !== 'failed',
                rollback: !rollbackStatus.inCooldown,
                systems: Object.values(integrationState.systems).every(s => s)
            },
            metrics: {
                uptime: process.uptime(),
                deploymentSuccessRate: deploymentStatus.metrics.successRate,
                rollbackCount: rollbackStatus.metrics.totalRollbacks,
                lastDeployment: deploymentStatus.recentHistory[0]?.timestamp || null
            }
        };

    } catch (error) {
        console.error('Failed to get health summary:', error);
        return {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        };
    }
}

module.exports = {
    initializeMonitoringSystems,
    updateDashboardData,
    getMonitoringStatus,
    triggerManualRollback,
    notifyDeploymentComplete,
    notifyDeploymentFailed,
    getHealthSummary,
    processCrossSystemAlerts
};