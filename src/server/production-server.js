const http = require('http');
const fs = require('fs');
const path = require('path');
const monitoringDashboard = require('./monitoring-dashboard-integration');
const performanceMonitor = require('./performance-monitor');

const PORT = 8080;

// Function to make HTTP request using Node.js built-in http module
function httpGet(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Function to fetch status from Uptime Kuma
async function fetchUptimeKumaStatus() {
    try {
        console.log('Server-side: Fetching status from Uptime Kuma...');

        const uptimeHost = process.env.UPTIME_KUMA_HOST || '192.168.1.236';
        const uptimePort = process.env.UPTIME_KUMA_PORT || '3001';

        const config = await httpGet(`http://${uptimeHost}:${uptimePort}/api/status-page/services`);
        const heartbeatData = await httpGet(`http://${uptimeHost}:${uptimePort}/api/status-page/heartbeat/services`);

        console.log('Server-side: Successfully fetched Uptime Kuma data');

        return {
            monitors: config.publicGroupList[0].monitorList,
            heartbeats: heartbeatData.heartbeatList,
            uptimes: heartbeatData.uptimeList
        };
    } catch (error) {
        console.error('Server-side: Failed to fetch Uptime Kuma status:', error);
        return null;
    }
}

// Initialize comprehensive monitoring systems
console.log('🚀 Starting production server with comprehensive monitoring...');

// Initialize all monitoring systems
monitoringDashboard.initializeMonitoringSystems();

// Start deployment tracking for current deployment
const deploymentId = `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
performanceMonitor.startDeploymentTracking(deploymentId, process.env.NODE_ENV || 'development', {
    version: process.env.APP_VERSION || '1.0.0',
    imageTag: process.env.IMAGE_TAG || 'unknown',
    branch: process.env.BRANCH || 'unknown',
    actor: process.env.ACTOR || 'system',
    workflowRunId: process.env.WORKFLOW_RUN_ID || 'unknown'
});

console.log(`🔍 Deployment tracking started: ${deploymentId}`);

const server = http.createServer(async (req, res) => {
    const startTime = Date.now();

    // Comprehensive health check endpoint
    if (req.url === '/health') {
        try {
            const healthSummary = await monitoringDashboard.getHealthSummary();
            const responseTime = Date.now() - startTime;
            const statusCode = healthSummary.status === 'error' || healthSummary.status === 'unhealthy' ? 503 : 200;

            res.writeHead(statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'X-Health-Status': healthSummary.status,
                'X-Response-Time': responseTime.toString(),
                'X-Deployment-Id': deploymentId
            });
            res.end(JSON.stringify(healthSummary, null, 2));
        } catch (error) {
            console.error('Health check failed:', error);
            const responseTime = Date.now() - startTime;

            res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                status: 'error',
                message: 'Health check system failure',
                timestamp: new Date().toISOString(),
                responseTime,
                error: error.message
            }));
        }
        return;
    }

    // Readiness probe endpoint
    if (req.url === '/ready') {
        try {
            const monitoringStatus = monitoringDashboard.getMonitoringStatus();
            const responseTime = Date.now() - startTime;
            const isReady = monitoringStatus.initialized && monitoringStatus.systems;

            const statusCode = isReady ? 200 : 503;

            res.writeHead(statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Ready-Status': isReady ? 'ready' : 'not_ready',
                'X-Response-Time': responseTime.toString()
            });

            res.end(JSON.stringify({
                status: isReady ? 'ready' : 'not_ready',
                timestamp: new Date().toISOString(),
                responseTime,
                systems: monitoringStatus.systems,
                message: isReady ? 'All systems operational' : 'Systems still initializing'
            }, null, 2));
        } catch (error) {
            console.error('Readiness check failed:', error);
            const responseTime = Date.now() - startTime;

            res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                status: 'error',
                message: 'Readiness check system failure',
                timestamp: new Date().toISOString(),
                responseTime,
                error: error.message
            }));
        }
        return;
    }

    // Liveness probe endpoint
    if (req.url === '/live') {
        const responseTime = Date.now() - startTime;
        const livenessData = {
            status: 'alive',
            pid: process.pid,
            uptime: Math.round(process.uptime()),
            timestamp: new Date().toISOString(),
            responseTime,
            memory: {
                heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
                unit: 'MB'
            },
            deploymentId
        };

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Liveness-Status': 'alive',
            'X-Process-Uptime': Math.round(process.uptime()).toString(),
            'X-Response-Time': responseTime.toString()
        });
        res.end(JSON.stringify(livenessData, null, 2));
        return;
    }

    // Comprehensive monitoring dashboard API
    if (req.url === '/api/monitoring-dashboard') {
        try {
            const monitoringStatus = monitoringDashboard.getMonitoringStatus();
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(JSON.stringify(monitoringStatus, null, 2));
        } catch (error) {
            console.error('Failed to get monitoring dashboard:', error);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Failed to get monitoring dashboard' }));
        }
        return;
    }

    // Performance dashboard API
    if (req.url === '/api/performance-dashboard') {
        try {
            const performanceDashboard = performanceMonitor.getPerformanceDashboard();
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(JSON.stringify(performanceDashboard, null, 2));
        } catch (error) {
            console.error('Failed to get performance dashboard:', error);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Failed to get performance dashboard' }));
        }
        return;
    }

    // Manual rollback trigger endpoint
    if (req.url === '/api/trigger-rollback' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { reason, environment, actor } = JSON.parse(body);

                if (!reason) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Reason is required' }));
                    return;
                }

                const result = await monitoringDashboard.triggerManualRollback(
                    reason,
                    environment || process.env.NODE_ENV || 'development',
                    actor || 'api'
                );

                res.writeHead(result.success ? 200 : 500, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(result, null, 2));
            } catch (error) {
                console.error('Manual rollback trigger failed:', error);
                res.writeHead(500, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return;
    }

    // Handle API endpoint for status
    if (req.url === '/api/status') {
        const statusData = await fetchUptimeKumaStatus();
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify(statusData || { error: 'Unable to fetch status' }));
        return;
    }

    // Handle API endpoint for Minecraft server status
    if (req.url === '/api/minecraft-status') {
        try {
            const containerizedPath = path.join('/opt', 'monitoring', 'minecraft-server-status.json');
            const legacyPath = path.join('/opt', 'renekris-infrastructure', 'minecraft-server-status.json');

            let statusFile = containerizedPath;
            if (!fs.existsSync(containerizedPath) && fs.existsSync(legacyPath)) {
                statusFile = legacyPath;
            }

            const statusData = fs.readFileSync(statusFile, 'utf8');
            const minecraftStatus = JSON.parse(statusData);

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(JSON.stringify(minecraftStatus));
        } catch (error) {
            console.error('Error reading Minecraft status:', error);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(JSON.stringify({
                online: false,
                players: { online: 0, max: 20 },
                motd: null,
                error: 'Status unavailable'
            }));
        }
        return;
    }

    // Handle root path
    if (req.url === '/' || req.url === '/index.html') {
        req.url = '/index.html';
    }

    // Serve static files from the build directory
    const requestPath = req.url === '/' ? '/index.html' : req.url;

    const buildDir = fs.existsSync(path.join(__dirname, 'build'))
        ? path.join(__dirname, 'build')
        : path.join(__dirname, '../../build');

    const filePath = path.join(buildDir, requestPath);
    const extname = String(path.extname(filePath)).toLowerCase();

    // MIME types
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                const indexPath = path.join(buildDir, 'index.html');
                fs.readFile(indexPath, (indexError, indexContent) => {
                    if (indexError) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 Not Found</h1>', 'utf-8');
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/html',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(indexContent, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            res.end(content, 'utf-8');
        }
    });
});

// Graceful shutdown with comprehensive cleanup
function gracefulShutdown(signal) {
    console.log(`\\n🛑 Received ${signal}, shutting down server gracefully...`);

    // Complete current deployment tracking
    try {
        performanceMonitor.completeDeploymentTracking('shutdown', {
            signal,
            reason: 'Server shutdown'
        });

        // Notify about deployment completion
        monitoringDashboard.notifyDeploymentComplete({
            id: deploymentId,
            environment: process.env.NODE_ENV || 'development',
            version: process.env.APP_VERSION || '1.0.0',
            imageTag: process.env.IMAGE_TAG || 'unknown',
            duration: Math.round(process.uptime() * 1000),
            actor: 'system',
            branch: process.env.BRANCH || 'unknown'
        });

        console.log('✅ Monitoring systems cleaned up');
    } catch (error) {
        console.error('❌ Error during monitoring cleanup:', error);
    }

    server.close(() => {
        console.log('🔒 Server closed successfully');
        process.exit(0);
    });

    // Force exit after 30 seconds
    setTimeout(() => {
        console.log('⏰ Force exiting after timeout...');
        process.exit(1);
    }, 30000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions with monitoring
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    try {
        performanceMonitor.completeDeploymentTracking('failed', {
            error: error.message,
            reason: 'Uncaught exception'
        });
        monitoringDashboard.notifyDeploymentFailed({
            id: deploymentId,
            environment: process.env.NODE_ENV || 'development',
            reason: 'uncaught_exception',
            duration: Math.round(process.uptime() * 1000),
            actor: 'system',
            branch: process.env.BRANCH || 'unknown'
        }, error);
    } catch (e) {
        console.error('Error recording uncaught exception:', e);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
    try {
        performanceMonitor.addPerformanceAlert('unhandled_rejection', {
            reason: reason.toString(),
            promise: promise.toString(),
            severity: 'warning'
        });
    } catch (error) {
        console.error('Error recording unhandled rejection:', error);
    }
});

server.listen(PORT, () => {
    console.log('\\n🎉 Production server with comprehensive monitoring started!');
    console.log('\\n📊 Monitoring Endpoints:');
    console.log(`   🏥 Health: http://localhost:${PORT}/health`);
    console.log(`   ✅ Ready: http://localhost:${PORT}/ready`);
    console.log(`   💓 Live: http://localhost:${PORT}/live`);
    console.log(`   📈 Dashboard: http://localhost:${PORT}/api/monitoring-dashboard`);
    console.log(`   🚀 Performance: http://localhost:${PORT}/api/performance-dashboard`);
    console.log(`   🔄 Rollback: http://localhost:${PORT}/api/trigger-rollback (POST)`);
    console.log('\\n🎛️  Monitoring Features:');
    console.log('   ✅ Comprehensive health checks with dependency validation');
    console.log('   📊 Real-time performance monitoring and alerting');
    console.log('   🚨 Automated rollback triggers with sophisticated validation');
    console.log('   📧 Multi-channel notifications (Webhook, Slack, Discord)');
    console.log('   📈 Deployment tracking with cost analysis');
    console.log('   🔍 Cross-system correlation and intelligent alerting');
    console.log('\\nPress Ctrl+C to stop the server');

    // Record successful server start
    console.log(`\\n🔍 Deployment ID: ${deploymentId}`);
    console.log(`🏷️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📦 Version: ${process.env.APP_VERSION || '1.0.0'}`);
    console.log(`🏗️  Image: ${process.env.IMAGE_TAG || 'unknown'}`);
});