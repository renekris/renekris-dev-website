const fs = require('fs');
// const { performance } = require('perf_hooks');

/**
 * Comprehensive Performance Monitoring System
 * Tracks deployment times, pipeline duration, resource usage, and cost tracking for CI/CD
 */

// Configuration
const PERFORMANCE_CONFIG = {
    metrics: {
        deployment: {
            phases: ['build', 'test', 'security-scan', 'deploy', 'health-check', 'verification'],
            thresholds: {
                build: 300000, // 5 minutes
                test: 180000, // 3 minutes
                'security-scan': 120000, // 2 minutes
                deploy: 240000, // 4 minutes
                'health-check': 60000, // 1 minute
                verification: 90000 // 1.5 minutes
            }
        },
        pipeline: {
            totalThreshold: 900000, // 15 minutes total
            parallelismThreshold: 0.7 // 70% parallel efficiency
        },
        resources: {
            cpu: {
                thresholds: { warning: 80, critical: 95 },
                samples: 100
            },
            memory: {
                thresholds: { warning: 85, critical: 95 },
                samples: 100
            },
            disk: {
                thresholds: { warning: 80, critical: 90 },
                samples: 50
            },
            network: {
                thresholds: { warning: 100, critical: 200 }, // MB/s
                samples: 50
            }
        }
    },
    storage: {
        metricsFile: '/tmp/performance-metrics.json',
        retentionDays: 30,
        maxEntries: 1000
    },
    cost: {
        ratesPerMinute: {
            'github-runner': 0.008, // $0.008 per minute
            'container-build': 0.005,
            'security-scan': 0.003,
            'deployment': 0.002
        }
    }
};

// Performance state tracking
let performanceState = {
    currentDeployment: null,
    metrics: {
        deployments: [],
        pipelines: [],
        resources: {
            cpu: [],
            memory: [],
            disk: [],
            network: []
        },
        costs: {
            daily: [],
            monthly: []
        }
    },
    baselines: {
        deployment: null,
        pipeline: null,
        resources: null
    },
    alerts: []
};

/**
 * Load performance metrics from disk
 */
function loadPerformanceMetrics() {
    try {
        if (fs.existsSync(PERFORMANCE_CONFIG.storage.metricsFile)) {
            const data = fs.readFileSync(PERFORMANCE_CONFIG.storage.metricsFile, 'utf8');
            performanceState = { ...performanceState, ...JSON.parse(data) };
            console.log('Loaded performance metrics from disk');
        }
    } catch (error) {
        console.warn('Failed to load performance metrics:', error.message);
    }
}

/**
 * Save performance metrics to disk
 */
function savePerformanceMetrics() {
    try {
        // Clean old entries before saving
        cleanOldMetrics();

        fs.writeFileSync(
            PERFORMANCE_CONFIG.storage.metricsFile,
            JSON.stringify(performanceState, null, 2)
        );
    } catch (error) {
        console.warn('Failed to save performance metrics:', error.message);
    }
}

/**
 * Clean old metrics based on retention policy
 */
function cleanOldMetrics() {
    const retentionTime = Date.now() - (PERFORMANCE_CONFIG.storage.retentionDays * 24 * 60 * 60 * 1000);

    // Clean deployment metrics
    performanceState.metrics.deployments = performanceState.metrics.deployments
        .filter(d => new Date(d.timestamp).getTime() > retentionTime)
        .slice(0, PERFORMANCE_CONFIG.storage.maxEntries);

    // Clean pipeline metrics
    performanceState.metrics.pipelines = performanceState.metrics.pipelines
        .filter(p => new Date(p.timestamp).getTime() > retentionTime)
        .slice(0, PERFORMANCE_CONFIG.storage.maxEntries);

    // Clean resource metrics
    Object.keys(performanceState.metrics.resources).forEach(resource => {
        performanceState.metrics.resources[resource] = performanceState.metrics.resources[resource]
            .filter(r => new Date(r.timestamp).getTime() > retentionTime)
            .slice(0, PERFORMANCE_CONFIG.metrics.resources[resource]?.samples || 100);
    });
}

/**
 * Start deployment performance tracking
 */
function startDeploymentTracking(deploymentId, environment, metadata = {}) {
    const deployment = {
        id: deploymentId,
        environment,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        endTime: null,
        totalDuration: null,
        phases: {},
        metadata: {
            version: metadata.version || 'unknown',
            imageTag: metadata.imageTag || 'unknown',
            branch: metadata.branch || 'unknown',
            actor: metadata.actor || 'unknown',
            workflowRunId: metadata.workflowRunId || 'unknown',
            ...metadata
        },
        performance: {
            cpu: [],
            memory: [],
            network: []
        },
        status: 'in_progress',
        costs: {
            estimated: 0,
            actual: 0
        }
    };

    performanceState.currentDeployment = deployment;
    console.log(`Started performance tracking for deployment: ${deploymentId}`);

    return deployment;
}

/**
 * Track deployment phase performance
 */
function trackDeploymentPhase(phase, startTime, endTime, metadata = {}) {
    if (!performanceState.currentDeployment) {
        console.warn(`No active deployment to track phase: ${phase}`);
        return;
    }

    const duration = endTime - startTime;
    const threshold = PERFORMANCE_CONFIG.metrics.deployment.thresholds[phase];

    const phaseData = {
        phase,
        startTime,
        endTime,
        duration,
        threshold,
        exceedsThreshold: threshold && duration > threshold,
        metadata,
        timestamp: new Date().toISOString()
    };

    performanceState.currentDeployment.phases[phase] = phaseData;

    // Calculate estimated cost for this phase
    const costRate = PERFORMANCE_CONFIG.cost.ratesPerMinute['github-runner'];
    const phaseCost = (duration / 60000) * costRate;
    performanceState.currentDeployment.costs.estimated += phaseCost;

    console.log(`Tracked deployment phase: ${phase} (${duration}ms)`);

    if (phaseData.exceedsThreshold) {
        addPerformanceAlert('phase_threshold_exceeded', {
            phase,
            duration,
            threshold,
            deploymentId: performanceState.currentDeployment.id
        });
    }

    savePerformanceMetrics();
}

/**
 * Complete deployment performance tracking
 */
function completeDeploymentTracking(status = 'completed', metadata = {}) {
    if (!performanceState.currentDeployment) {
        console.warn('No active deployment to complete');
        return null;
    }

    const deployment = performanceState.currentDeployment;
    deployment.endTime = Date.now();
    deployment.totalDuration = deployment.endTime - deployment.startTime;
    deployment.status = status;
    deployment.completionMetadata = metadata;

    // Calculate parallel efficiency
    const totalPhaseTime = Object.values(deployment.phases).reduce((sum, phase) => sum + phase.duration, 0);
    deployment.parallelEfficiency = totalPhaseTime > 0 ? deployment.totalDuration / totalPhaseTime : 0;

    // Check thresholds
    const totalThreshold = PERFORMANCE_CONFIG.metrics.pipeline.totalThreshold;
    deployment.exceedsTotalThreshold = deployment.totalDuration > totalThreshold;

    const parallelThreshold = PERFORMANCE_CONFIG.metrics.pipeline.parallelismThreshold;
    deployment.lowParallelism = deployment.parallelEfficiency < parallelThreshold;

    // Add to metrics
    performanceState.metrics.deployments.unshift(deployment);
    performanceState.currentDeployment = null;

    // Update baselines
    updateDeploymentBaseline(deployment);

    // Generate alerts for performance issues
    if (deployment.exceedsTotalThreshold) {
        addPerformanceAlert('deployment_duration_exceeded', {
            duration: deployment.totalDuration,
            threshold: totalThreshold,
            deploymentId: deployment.id
        });
    }

    if (deployment.lowParallelism) {
        addPerformanceAlert('low_parallelism', {
            efficiency: deployment.parallelEfficiency,
            threshold: parallelThreshold,
            deploymentId: deployment.id
        });
    }

    console.log(`Completed deployment tracking: ${deployment.id} (${deployment.totalDuration}ms)`);
    savePerformanceMetrics();

    return deployment;
}

/**
 * Track pipeline performance
 */
function trackPipelinePerformance(pipelineData) {
    const pipeline = {
        id: pipelineData.id || `pipeline-${Date.now()}`,
        type: pipelineData.type || 'ci-cd',
        timestamp: new Date().toISOString(),
        duration: pipelineData.duration,
        jobs: pipelineData.jobs || [],
        parallelJobs: pipelineData.parallelJobs || 0,
        totalJobs: pipelineData.totalJobs || 0,
        failedJobs: pipelineData.failedJobs || 0,
        environment: pipelineData.environment,
        branch: pipelineData.branch,
        triggeredBy: pipelineData.triggeredBy,
        costs: calculatePipelineCosts(pipelineData),
        performance: {
            queueTime: pipelineData.queueTime || 0,
            executionTime: pipelineData.executionTime || pipelineData.duration,
            parallelEfficiency: pipelineData.parallelJobs > 0 ?
                (pipelineData.totalJobs / pipelineData.parallelJobs) : 0
        }
    };

    performanceState.metrics.pipelines.unshift(pipeline);

    // Update baseline
    updatePipelineBaseline(pipeline);

    console.log(`Tracked pipeline performance: ${pipeline.id}`);
    savePerformanceMetrics();

    return pipeline;
}

/**
 * Calculate pipeline costs
 */
function calculatePipelineCosts(pipelineData) {
    const costs = {
        build: 0,
        test: 0,
        securityScan: 0,
        deployment: 0,
        total: 0
    };

    if (pipelineData.jobs) {
        pipelineData.jobs.forEach(job => {
            const duration = job.duration || 0;
            const minutes = duration / 60000;
            const rate = PERFORMANCE_CONFIG.cost.ratesPerMinute[job.type] ||
                        PERFORMANCE_CONFIG.cost.ratesPerMinute['github-runner'];

            const cost = minutes * rate;
            costs[job.type] = (costs[job.type] || 0) + cost;
            costs.total += cost;
        });
    }

    return costs;
}

/**
 * Monitor system resource usage
 */
function monitorResourceUsage() {
    const timestamp = new Date().toISOString();

    // CPU monitoring
    const cpuUsage = process.cpuUsage();
    const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds

    performanceState.metrics.resources.cpu.push({
        timestamp,
        usage: cpuPercent,
        user: cpuUsage.user / 1000000,
        system: cpuUsage.system / 1000000
    });

    // Memory monitoring
    const memUsage = process.memoryUsage();
    const memPercent = (memUsage.rss / (process.env.CONTAINER_MEMORY_LIMIT || 1024 * 1024 * 1024)) * 100;

    performanceState.metrics.resources.memory.push({
        timestamp,
        usage: memPercent,
        rss: memUsage.rss,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external
    });

    // Check thresholds
    checkResourceThresholds('cpu', cpuPercent);
    checkResourceThresholds('memory', memPercent);

    // Add to current deployment if active
    if (performanceState.currentDeployment) {
        performanceState.currentDeployment.performance.cpu.push(cpuPercent);
        performanceState.currentDeployment.performance.memory.push(memPercent);
    }

    // Cleanup old entries
    const cpuSamples = PERFORMANCE_CONFIG.metrics.resources.cpu.samples;
    if (performanceState.metrics.resources.cpu.length > cpuSamples) {
        performanceState.metrics.resources.cpu = performanceState.metrics.resources.cpu.slice(0, cpuSamples);
    }

    const memorySamples = PERFORMANCE_CONFIG.metrics.resources.memory.samples;
    if (performanceState.metrics.resources.memory.length > memorySamples) {
        performanceState.metrics.resources.memory = performanceState.metrics.resources.memory.slice(0, memorySamples);
    }
}

/**
 * Check resource thresholds and generate alerts
 */
function checkResourceThresholds(resource, value) {
    const thresholds = PERFORMANCE_CONFIG.metrics.resources[resource]?.thresholds;
    if (!thresholds) return;

    if (value > thresholds.critical) {
        addPerformanceAlert('resource_critical', {
            resource,
            value,
            threshold: thresholds.critical,
            severity: 'critical'
        });
    } else if (value > thresholds.warning) {
        addPerformanceAlert('resource_warning', {
            resource,
            value,
            threshold: thresholds.warning,
            severity: 'warning'
        });
    }
}

/**
 * Update deployment baseline
 */
function updateDeploymentBaseline(deployment) {
    const recentDeployments = performanceState.metrics.deployments
        .filter(d => d.status === 'completed' && d.environment === deployment.environment)
        .slice(0, 10);

    if (recentDeployments.length > 0) {
        const avgDuration = recentDeployments.reduce((sum, d) => sum + d.totalDuration, 0) / recentDeployments.length;
        const avgEfficiency = recentDeployments.reduce((sum, d) => sum + d.parallelEfficiency, 0) / recentDeployments.length;

        performanceState.baselines.deployment = {
            environment: deployment.environment,
            averageDuration: avgDuration,
            averageEfficiency: avgEfficiency,
            sampleSize: recentDeployments.length,
            lastUpdated: new Date().toISOString()
        };
    }
}

/**
 * Update pipeline baseline
 */
function updatePipelineBaseline(pipeline) {
    const recentPipelines = performanceState.metrics.pipelines
        .filter(p => p.type === pipeline.type)
        .slice(0, 20);

    if (recentPipelines.length > 0) {
        const avgDuration = recentPipelines.reduce((sum, p) => sum + p.duration, 0) / recentPipelines.length;
        const avgCost = recentPipelines.reduce((sum, p) => sum + p.costs.total, 0) / recentPipelines.length;

        performanceState.baselines.pipeline = {
            type: pipeline.type,
            averageDuration: avgDuration,
            averageCost: avgCost,
            sampleSize: recentPipelines.length,
            lastUpdated: new Date().toISOString()
        };
    }
}

/**
 * Add performance alert
 */
function addPerformanceAlert(type, data) {
    const alert = {
        id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type,
        timestamp: new Date().toISOString(),
        severity: data.severity || 'warning',
        data,
        acknowledged: false
    };

    performanceState.alerts.unshift(alert);

    // Keep only recent alerts
    if (performanceState.alerts.length > 100) {
        performanceState.alerts = performanceState.alerts.slice(0, 100);
    }

    console.log(`Performance alert: ${type} - ${JSON.stringify(data)}`);
}

/**
 * Get performance dashboard data
 */
function getPerformanceDashboard() {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    // const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const recentDeployments = performanceState.metrics.deployments
        .filter(d => new Date(d.timestamp).getTime() > oneDayAgo);

    const recentPipelines = performanceState.metrics.pipelines
        .filter(p => new Date(p.timestamp).getTime() > oneDayAgo);

    return {
        timestamp: new Date().toISOString(),
        summary: {
            activeDeployment: performanceState.currentDeployment?.id || null,
            deploymentsToday: recentDeployments.length,
            pipelinesToday: recentPipelines.length,
            activeAlerts: performanceState.alerts.filter(a => !a.acknowledged).length
        },
        deployments: {
            recent: recentDeployments.slice(0, 10),
            averageDuration: recentDeployments.length > 0
                ? recentDeployments.reduce((sum, d) => sum + d.totalDuration, 0) / recentDeployments.length
                : 0,
            successRate: recentDeployments.length > 0
                ? (recentDeployments.filter(d => d.status === 'completed').length / recentDeployments.length) * 100
                : 0
        },
        pipelines: {
            recent: recentPipelines.slice(0, 10),
            averageDuration: recentPipelines.length > 0
                ? recentPipelines.reduce((sum, p) => sum + p.duration, 0) / recentPipelines.length
                : 0,
            totalCost: recentPipelines.reduce((sum, p) => sum + p.costs.total, 0)
        },
        resources: {
            current: {
                cpu: performanceState.metrics.resources.cpu.slice(-1)[0],
                memory: performanceState.metrics.resources.memory.slice(-1)[0]
            },
            trends: {
                cpu: performanceState.metrics.resources.cpu.slice(-20),
                memory: performanceState.metrics.resources.memory.slice(-20)
            }
        },
        baselines: performanceState.baselines,
        alerts: performanceState.alerts.filter(a => !a.acknowledged).slice(0, 10)
    };
}

/**
 * Initialize performance monitoring
 */
function initializePerformanceMonitoring() {
    loadPerformanceMetrics();

    // Start resource monitoring
    setInterval(monitorResourceUsage, 30000); // Every 30 seconds

    // Save metrics periodically
    setInterval(savePerformanceMetrics, 300000); // Every 5 minutes

    console.log('Performance monitoring system initialized');
}

module.exports = {
    initializePerformanceMonitoring,
    startDeploymentTracking,
    trackDeploymentPhase,
    completeDeploymentTracking,
    trackPipelinePerformance,
    monitorResourceUsage,
    getPerformanceDashboard,
    addPerformanceAlert,
    PERFORMANCE_CONFIG
};