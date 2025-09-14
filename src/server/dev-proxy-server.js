const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const http = require('http');
const httpProxy = require('http-proxy-middleware');
const fs = require('fs');

// Configuration with environment variables and error handling
const PORT = process.env.DEV_PANEL_PORT || process.env.PORT || 3000;
const REACT_DEV_PORT = process.env.REACT_DEV_PORT || 3001;
const WEB_SERVER_IP = process.env.WEB_SERVER_IP;
const UPTIME_KUMA_PORT = process.env.UPTIME_KUMA_PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!WEB_SERVER_IP) {
    console.error('ERROR: WEB_SERVER_IP environment variable is required');
    console.error('Please check your .env file in the project root');
    process.exit(1);
}

// Create proxy middleware
const reactProxy = httpProxy.createProxyMiddleware({
    target: `http://localhost:${REACT_DEV_PORT}`,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying for React dev server
});

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
        console.log('Dev-proxy: Fetching status from Uptime Kuma...');
        
        // Use environment variables for Uptime Kuma configuration
        const uptimeHost = WEB_SERVER_IP; // Uptime Kuma runs on the web server
        const uptimePort = UPTIME_KUMA_PORT;
        
        // Use internal HTTP since we're server-side (no mixed content issues)
        const config = await httpGet(`http://${uptimeHost}:${uptimePort}/api/status-page/services`);
        const heartbeatData = await httpGet(`http://${uptimeHost}:${uptimePort}/api/status-page/heartbeat/services`);
        
        console.log('Dev-proxy: Successfully fetched Uptime Kuma data');
        
        return {
            monitors: config.publicGroupList[0].monitorList,
            heartbeats: heartbeatData.heartbeatList,
            uptimes: heartbeatData.uptimeList
        };
    } catch (error) {
        console.error('Dev-proxy: Failed to fetch Uptime Kuma status:', error);
        return null;
    }
}

const server = http.createServer(async (req, res) => {
    // Health check endpoint for blue-green deployment
    if (req.url === '/health') {
        const deploymentSlot = process.env.DEPLOYMENT_SLOT || 'development';
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
            // Read status from the infrastructure service's status file
            // Use environment-based path configuration
            const isDevelopment = NODE_ENV !== 'production';
            const infraBasePath = process.env.INFRASTRUCTURE_BASE_PATH || 
                (isDevelopment 
                    ? path.join(__dirname, '..', '..', '..', 'renekris-infrastructure')
                    : '/opt/renekris-infrastructure');
            const statusFile = path.join(infraBasePath, 'minecraft-server-status.json');
                
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
                error: 'Status unavailable (dev mode)'
            }));
        }
        return;
    }

    // Proxy all other requests to React dev server
    reactProxy(req, res);
});

server.listen(PORT, () => {
    console.log(`Development proxy server running at http://localhost:${PORT}`);
    console.log(`Proxying React dev server from http://localhost:${REACT_DEV_PORT}`);
    console.log(`API endpoints available at:`);
    console.log(`  - http://localhost:${PORT}/health`);
    console.log(`  - http://localhost:${PORT}/api/status`);
    console.log(`  - http://localhost:${PORT}/api/minecraft-status`);
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down development proxy server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nShutting down development proxy server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});