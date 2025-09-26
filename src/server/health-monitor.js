const http = require('http');
const fs = require('fs');
const net = require('net');
const { execSync } = require('child_process');

/**
 * Comprehensive Health Monitoring Module
 * Provides detailed health checks for application dependencies and system resources
 */

// Configuration
const HEALTH_CHECK_CONFIG = {
    timeouts: {
        network: 5000,
        database: 3000,
        filesystem: 1000
    },
    thresholds: {
        memory: 90,
        disk: 85,
        response: 2000
    },
    retries: {
        external: 2,
        internal: 1
    }
};

// Health check state tracking
let healthCheckData = {
    dependencies: {},
    lastCheck: null,
    isReady: false,
    initializationStartTime: Date.now()
};

/**
 * Makes HTTP GET request with timeout
 */
function httpGet(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);

        http.get(url, (res) => {
            clearTimeout(timeoutId);
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('error', (error) => {
            clearTimeout(timeoutId);
            reject(error);
        });
    });
}

/**
 * Tests TCP connectivity to a host/port
 */
function testTcpConnection(host, port, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const timer = setTimeout(() => {
            socket.destroy();
            reject(new Error('Connection timeout'));
        }, timeout);

        socket.connect(port, host, () => {
            clearTimeout(timer);
            socket.destroy();
            resolve(true);
        });

        socket.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
    });
}

/**
 * Comprehensive dependency health checks
 */
async function checkDependencies() {
    const checks = {
        uptimeKuma: { status: false, latency: null, error: null, critical: false },
        fileSystem: { status: false, writeable: false, error: null, critical: true },
        minecraftServer: { status: false, latency: null, error: null, critical: false },
        externalApis: { status: true, services: [], error: null, critical: false },
        memory: { status: true, usage: null, threshold: HEALTH_CHECK_CONFIG.thresholds.memory, critical: true },
        disk: { status: true, usage: null, threshold: HEALTH_CHECK_CONFIG.thresholds.disk, critical: false },
        network: { status: true, latency: null, error: null, critical: true }
    };

    // Check Uptime Kuma connectivity with latency measurement
    try {
        const startTime = Date.now();
        const uptimeHost = process.env.UPTIME_KUMA_HOST || '192.168.1.236';
        const uptimePort = process.env.UPTIME_KUMA_PORT || '3001';

        await httpGet(`http://${uptimeHost}:${uptimePort}/api/status-page/services`, HEALTH_CHECK_CONFIG.timeouts.network);

        checks.uptimeKuma.status = true;
        checks.uptimeKuma.latency = Date.now() - startTime;
    } catch (error) {
        checks.uptimeKuma.error = error.message;
        console.error('Uptime Kuma health check failed:', error.message);
    }

    // Check file system access and writability
    try {
        const testPaths = ['/opt/monitoring', '/app', '/tmp'];
        let accessible = false;
        let writeable = false;

        for (const testPath of testPaths) {
            if (fs.existsSync(testPath)) {
                accessible = true;
                try {
                    const testFile = `${testPath}/.health-check-${Date.now()}-${process.pid}`;
                    fs.writeFileSync(testFile, 'test');
                    fs.unlinkSync(testFile);
                    writeable = true;
                    break;
                } catch (writeError) {
                    console.warn(`Cannot write to ${testPath}:`, writeError.message);
                }
            }
        }

        checks.fileSystem.status = accessible;
        checks.fileSystem.writeable = writeable;

        if (!accessible) {
            checks.fileSystem.error = 'No accessible file system paths found';
        } else if (!writeable) {
            checks.fileSystem.error = 'File system is read-only';
        }
    } catch (error) {
        checks.fileSystem.error = error.message;
        console.error('File system health check failed:', error.message);
    }

    // Check Minecraft server connectivity
    try {
        const startTime = Date.now();
        const minecraftHost = process.env.MINECRAFT_HOST || '192.168.1.232';

        await testTcpConnection(minecraftHost, 25565, HEALTH_CHECK_CONFIG.timeouts.network);

        checks.minecraftServer.status = true;
        checks.minecraftServer.latency = Date.now() - startTime;
    } catch (error) {
        checks.minecraftServer.error = error.message;
        console.error('Minecraft server health check failed:', error.message);
    }

    // Check memory usage
    try {
        const memUsage = process.memoryUsage();
        const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
        const rss = Math.round(memUsage.rss / 1024 / 1024);
        const external = Math.round(memUsage.external / 1024 / 1024);

        // Use RSS (Resident Set Size) for system memory usage
        const systemMemPercent = process.env.CONTAINER_MEMORY_LIMIT
            ? (rss / (parseInt(process.env.CONTAINER_MEMORY_LIMIT) / 1024 / 1024)) * 100
            : null;

        checks.memory.usage = {
            heap: { used: usedMB, total: totalMB },
            rss: rss,
            external: external,
            systemPercent: systemMemPercent
        };

        const checkPercent = systemMemPercent || ((usedMB / totalMB) * 100);
        checks.memory.status = checkPercent < checks.memory.threshold;

        if (!checks.memory.status) {
            checks.memory.error = `Memory usage ${checkPercent.toFixed(1)}% exceeds threshold ${checks.memory.threshold}%`;
        }
    } catch (error) {
        checks.memory.error = error.message;
        checks.memory.status = false;
        console.error('Memory health check failed:', error.message);
    }

    // Check disk usage (if available)
    try {
        const diskOutput = execSync('df -h / 2>/dev/null | tail -1', { encoding: 'utf-8', timeout: 2000 });
        const diskParts = diskOutput.trim().split(/\s+/);
        if (diskParts.length >= 5) {
            const usagePercent = parseInt(diskParts[4].replace('%', ''));
            const used = diskParts[2];
            const available = diskParts[3];

            checks.disk.usage = {
                percent: usagePercent,
                used: used,
                available: available
            };
            checks.disk.status = usagePercent < checks.disk.threshold;

            if (!checks.disk.status) {
                checks.disk.error = `Disk usage ${usagePercent}% exceeds threshold ${checks.disk.threshold}%`;
            }
        }
    } catch (error) {
        // Disk check is optional - don't fail if not available
        console.warn('Disk usage check not available:', error.message);
    }

    // Basic network connectivity check
    try {
        const startTime = Date.now();
        // Test internal network connectivity
        await testTcpConnection('127.0.0.1', process.env.PORT || 8080, 2000);
        checks.network.status = true;
        checks.network.latency = Date.now() - startTime;
    } catch (error) {
        checks.network.error = error.message;
        checks.network.status = false;
        console.error('Network health check failed:', error.message);
    }

    return checks;
}

/**
 * Determines overall application health status
 */
function calculateOverallHealth(dependencies) {
    const criticalDependencies = Object.entries(dependencies)
        .filter(([_, dep]) => dep.critical);

    const criticalFailures = criticalDependencies.filter(([_, dep]) => !dep.status);
    const anyFailures = Object.values(dependencies).some(dep => !dep.status);

    if (criticalFailures.length > 0) {
        return 'unhealthy';
    } else if (anyFailures) {
        return 'degraded';
    } else {
        return 'healthy';
    }
}

/**
 * Determines readiness status
 */
function calculateReadinessStatus(dependencies) {
    const criticalForReadiness = ['fileSystem', 'memory', 'network'];
    const criticalHealthy = criticalForReadiness.every(dep =>
        dependencies[dep] && dependencies[dep].status
    );

    const totalDeps = Object.keys(dependencies).length;
    const healthyDeps = Object.values(dependencies).filter(dep => dep.status).length;
    const readinessScore = totalDeps > 0 ? (healthyDeps / totalDeps) * 100 : 0;

    return {
        ready: criticalHealthy && readinessScore >= 75,
        score: readinessScore,
        criticalHealthy,
        summary: { total: totalDeps, healthy: healthyDeps, unhealthy: totalDeps - healthyDeps }
    };
}

/**
 * Generate comprehensive health report
 */
async function generateHealthReport() {
    const currentDependencies = await checkDependencies();
    const overallStatus = calculateOverallHealth(currentDependencies);
    const readiness = calculateReadinessStatus(currentDependencies);

    const deploymentSlot = process.env.DEPLOYMENT_SLOT || 'unknown';
    const environment = process.env.NODE_ENV || 'development';
    const version = process.env.APP_VERSION || '1.0.0';
    const buildTimestamp = process.env.BUILD_TIMESTAMP || 'unknown';
    const imageTag = process.env.IMAGE_TAG || 'unknown';

    return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        deployment: {
            environment,
            version,
            imageTag,
            buildTimestamp,
            slot: deploymentSlot,
            deployedAt: process.env.DEPLOYED_AT || null
        },
        application: {
            uptime: Math.round(process.uptime()),
            pid: process.pid,
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            ready: healthCheckData.isReady,
            initializationTime: healthCheckData.isReady
                ? Math.round((Date.now() - healthCheckData.initializationStartTime) / 1000)
                : null
        },
        performance: {
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
                external: Math.round(process.memoryUsage().external / 1024 / 1024),
                unit: 'MB'
            },
            uptime: process.uptime(),
            eventLoopDelay: process.hrtime ? process.hrtime()[1] / 1000000 : null
        },
        dependencies: currentDependencies,
        readiness: readiness,
        checks: {
            lastRun: new Date().toISOString(),
            criticalPassing: overallStatus !== 'unhealthy',
            allPassing: overallStatus === 'healthy',
            total: Object.keys(currentDependencies).length,
            passing: Object.values(currentDependencies).filter(dep => dep.status).length
        }
    };
}

/**
 * Generate readiness report
 */
async function generateReadinessReport() {
    if (!healthCheckData.isReady) {
        return {
            status: 'not_ready',
            message: 'Service is still initializing',
            timestamp: new Date().toISOString(),
            initializationTime: Math.round((Date.now() - healthCheckData.initializationStartTime) / 1000)
        };
    }

    const currentDependencies = await checkDependencies();
    const readiness = calculateReadinessStatus(currentDependencies);
    const criticalForReadiness = ['fileSystem', 'memory', 'network'];

    if (readiness.ready) {
        return {
            status: 'ready',
            timestamp: new Date().toISOString(),
            readinessScore: Math.round(readiness.score),
            criticalDependencies: criticalForReadiness.map(dep => ({
                name: dep,
                status: currentDependencies[dep] ? currentDependencies[dep].status : false
            })),
            summary: readiness.summary
        };
    } else {
        const statusText = readiness.criticalHealthy ? 'degraded' : 'not_ready';

        return {
            status: statusText,
            timestamp: new Date().toISOString(),
            readinessScore: Math.round(readiness.score),
            message: readiness.criticalHealthy
                ? 'Non-critical dependencies unhealthy'
                : 'Critical dependencies failed',
            failedDependencies: Object.entries(currentDependencies)
                .filter(([_, dep]) => !dep.status)
                .map(([name, dep]) => ({ name, error: dep.error })),
            criticalDependencies: criticalForReadiness.map(dep => ({
                name: dep,
                status: currentDependencies[dep] ? currentDependencies[dep].status : false,
                error: currentDependencies[dep] ? currentDependencies[dep].error : 'Dependency not found'
            }))
        };
    }
}

/**
 * Periodic health check runner
 */
function startPeriodicHealthCheck(intervalMs = 30000) {
    const runHealthCheck = async () => {
        try {
            healthCheckData.dependencies = await checkDependencies();
            healthCheckData.lastCheck = new Date().toISOString();
        } catch (error) {
            console.error('Periodic health check failed:', error);
        }
    };

    // Initial check
    setTimeout(async () => {
        await runHealthCheck();
        healthCheckData.isReady = true;
        console.log('Health monitoring initialized - service ready');
    }, 2000);

    // Periodic checks
    setInterval(runHealthCheck, intervalMs);
}

/**
 * Get current health status
 */
function getCurrentHealthData() {
    return healthCheckData;
}

/**
 * Set readiness status
 */
function setReadyStatus(ready) {
    healthCheckData.isReady = ready;
}

module.exports = {
    generateHealthReport,
    generateReadinessReport,
    checkDependencies,
    calculateOverallHealth,
    calculateReadinessStatus,
    startPeriodicHealthCheck,
    getCurrentHealthData,
    setReadyStatus,
    HEALTH_CHECK_CONFIG
};