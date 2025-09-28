const http = require('http');
const fs = require('fs');
const path = require('path');

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

// Function to fetch status from monitoring system
async function fetchMonitoringStatus() {
    try {
        console.log('Server-side: Fetching status from monitoring system...');
        
        // Placeholder for external monitoring system integration
        console.log('Server-side: Monitoring system integration not configured');
        
        return {
            status: 'not_configured',
            message: 'External monitoring system not configured'
        };
    } catch (error) {
        console.error('Server-side: Failed to fetch monitoring status:', error);
        return null;
    }
}

// Health check state tracking
let isReady = false;
let healthCheckData = {
    dependencies: {
        monitoring: false,
        fileSystem: false
    },
    lastCheck: null
};

// Function to check dependencies health
async function checkDependencies() {
    const checks = {
        monitoring: false,
        fileSystem: false
    };

    // Check monitoring system connectivity
    try {
        // Placeholder - would check external monitoring system here
        checks.monitoring = true;
    } catch (error) {
        console.error('Monitoring system health check failed:', error.message);
    }

    // Check file system access
    try {
        const testPath = '/opt/monitoring';
        if (fs.existsSync(testPath) || fs.existsSync('/app')) {
            checks.fileSystem = true;
        }
    } catch (error) {
        console.error('File system health check failed:', error.message);
    }

    return checks;
}

// Periodic health check
setInterval(async () => {
    healthCheckData.dependencies = await checkDependencies();
    healthCheckData.lastCheck = new Date().toISOString();
}, 30000); // Check every 30 seconds

// Initial check on startup
setTimeout(async () => {
    healthCheckData.dependencies = await checkDependencies();
    healthCheckData.lastCheck = new Date().toISOString();
    isReady = true;
    console.log('Server is ready to handle requests');
}, 2000);

const server = http.createServer(async (req, res) => {
    // Enhanced health check endpoint
    if (req.url === '/health') {
        const deploymentSlot = process.env.DEPLOYMENT_SLOT || 'unknown';
        const environment = process.env.NODE_ENV || 'development';
        const version = process.env.APP_VERSION || '1.0.0';

        // Basic health status
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment,
            version,
            slot: deploymentSlot,
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                unit: 'MB'
            },
            dependencies: healthCheckData.dependencies,
            lastDependencyCheck: healthCheckData.lastCheck
        };

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(JSON.stringify(healthStatus));
        return;
    }

    // Readiness probe endpoint - checks if service is ready to accept traffic
    if (req.url === '/ready') {
        if (!isReady) {
            res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                status: 'not_ready',
                message: 'Service is still initializing'
            }));
            return;
        }

        // Check critical dependencies
        const allHealthy = Object.values(healthCheckData.dependencies).every(v => v === true);

        if (allHealthy) {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                status: 'ready',
                timestamp: new Date().toISOString()
            }));
        } else {
            res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                status: 'degraded',
                dependencies: healthCheckData.dependencies,
                message: 'Some dependencies are unhealthy'
            }));
        }
        return;
    }

    // Liveness probe endpoint - simple check that process is alive
    if (req.url === '/live') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
            status: 'alive',
            pid: process.pid,
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // Handle API endpoint for status
    if (req.url === '/api/status') {
        const statusData = await fetchMonitoringStatus();
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
            // Read status from the monitoring service's shared volume
            // Try containerized path first, fallback to legacy paths
            const containerizedPath = path.join('/app', 'public', 'minecraft-server-status.json');
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
    // Handle root path and ensure proper file serving
    const requestPath = req.url === '/' ? '/index.html' : req.url;
    
    // In Docker: __dirname = /app, build = /app/build
    // In local dev: __dirname = /project/src/server, build = /project/build
    const buildDir = fs.existsSync(path.join(__dirname, 'build')) 
        ? path.join(__dirname, 'build')  // Docker path
        : path.join(__dirname, '../../build');  // Local dev path
        
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
                // For React Router: serve index.html for non-API routes
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
                'Access-Control-Allow-Origin': '*', // Allow CORS for API calls
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Local development server running at http://localhost:${PORT}`);
    console.log(`View the website at: http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});