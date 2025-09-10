const http = require('http');
const https = require('https');
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

// Function to fetch status from Uptime Kuma
async function fetchUptimeKumaStatus() {
    try {
        console.log('Server-side: Fetching status from Uptime Kuma...');
        
        // Use configurable host or fallback to hardcoded IP
        const uptimeHost = process.env.UPTIME_KUMA_HOST || '192.168.1.236';
        const uptimePort = process.env.UPTIME_KUMA_PORT || '3001';
        
        // Use internal HTTP since we're server-side (no mixed content issues)
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

const server = http.createServer(async (req, res) => {
    // Health check endpoint for blue-green deployment
    if (req.url === '/health') {
        const deploymentSlot = process.env.DEPLOYMENT_SLOT || 'unknown';
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            status: 'healthy', 
            slot: deploymentSlot,
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }));
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
            // Read status from the monitoring service's shared volume
            // Try new containerized path first, fallback to legacy path
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