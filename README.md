# renekris.dev Website

Professional website and infrastructure status dashboard showcasing full-stack development and DevOps capabilities.

**Live Site:** [https://renekris.dev](https://renekris.dev)

## Features

- **Real-time Status Monitoring**: Integrated with Uptime Kuma API for live service status updates
- **Infrastructure Dashboard**: Shows real-time status of game servers, web services, and monitoring systems
- **Responsive Design**: Mobile-first approach with modern CSS grid and flexbox layouts
- **Professional Portfolio**: Clean, developer-focused presentation of technical services

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Monitoring**: Uptime Kuma API integration
- **Testing**: Playwright for end-to-end testing
- **Infrastructure**: Docker, Caddy reverse proxy, Proxmox VE
- **Security**: UFW firewall, Fail2ban, automatic HTTPS

## Development

### Local Setup
```bash
npm install
npm start
```
Visit http://localhost:8080 to view locally.

### Testing
```bash
npm test
```

### Deployment
The site deploys automatically to production infrastructure via custom deployment scripts.

## Architecture

The website integrates with a comprehensive monitoring system that tracks:
- Website uptime and response times
- Minecraft game server status
- Tarkov SPT server availability  
- Management interface health

Status updates refresh automatically every 30 seconds with graceful fallback when monitoring is unavailable.

## Project Structure

```
├── simple-site.html          # Main website
├── server.js                 # Local development server
├── tests/                    # Playwright test suite
├── package.json              # Dependencies and scripts
└── docker-compose-secure.yml # Production containerization
```

## Infrastructure Integration

This website showcases practical DevOps and infrastructure management skills including:
- API integration and real-time data fetching
- Professional monitoring and alerting systems
- Container orchestration and reverse proxy configuration
- Automated deployment pipelines
- Security best practices implementation