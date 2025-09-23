# Renekris Development Website

A modern React-based landing page with integrated status monitoring and health endpoints. This repository contains only the website source code - infrastructure and deployment configurations are managed separately in a private repository.

**Live Site:** [https://renekris.dev](https://renekris.dev)

## Features

- **Modern React Application**: Built with React 18 and modern JavaScript
- **Real-time Status Monitoring**: Integrated API endpoints for service status
- **Health Endpoints**: Built-in health checks for deployment verification
- **Responsive Design**: Mobile-first approach with modern CSS
- **Professional Portfolio**: Clean, developer-focused presentation

## Tech Stack

- **Frontend**: React 18, JavaScript (ES6+), CSS3
- **Build**: Create React App, npm
- **Testing**: Jest (unit tests), Playwright (E2E tests)
- **Container**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions for automated deployment

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for containerized development)

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```
Visit http://localhost:3000 to view the application.

### Available Scripts

```bash
npm start       # Start development server
npm test        # Run unit tests
npm run build   # Build for production
npm run test:e2e # Run Playwright E2E tests
```

### Testing
```bash
# Unit tests with Jest
npm test

# E2E tests with Playwright
npm run test:e2e

# Run tests with coverage
npm test -- --coverage
```

## Docker Development

```bash
# Build Docker image
docker build -t renekris-web .

# Run container
docker run -p 3000:80 renekris-web

# Test health endpoint
curl http://localhost:3000/health
```

## Deployment

The website deploys automatically via GitHub Actions when changes are pushed to the main branch. The deployment process:

1. **Automated Testing**: All tests must pass before deployment
2. **Docker Build**: Creates optimized production container
3. **Rolling Deployment**: Zero-downtime updates to production
4. **Health Verification**: Automatic rollback if health checks fail

## API Endpoints

- **`/health`**: Health check endpoint for load balancers
- **`/api/status`**: Service status information (proxied from monitoring)

## Project Structure

```
src/
├── components/          # React components
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles

public/
├── index.html          # HTML template
└── favicon.ico         # Site icon

tests/
├── e2e/                # Playwright E2E tests
└── unit/               # Jest unit tests

.github/workflows/       # GitHub Actions CI/CD
├── deploy-website.yml  # Production deployment
└── test.yml           # Test automation

Dockerfile              # Container configuration
package.json            # Dependencies and scripts
```

## Environment Configuration

The application supports environment-based configuration:

```bash
# Development
NODE_ENV=development

# Production (set automatically in CI/CD)
NODE_ENV=production
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `npm test && npm run test:e2e`
4. Submit a pull request

### Code Quality

- ESLint for code linting
- Prettier for code formatting  
- Jest for unit testing
- Playwright for E2E testing
- GitHub Actions for CI/CD

## Infrastructure

This website is part of a larger infrastructure setup that includes:
- **Reverse Proxy**: Traefik for routing and SSL termination
- **Container Orchestration**: Docker Swarm for high availability
- **Monitoring**: Uptime Kuma for service monitoring
- **DNS**: Cloudflare for domain management

Infrastructure configurations are managed in a separate private repository for security.
# Test deployment pipeline - trigger staging build from dev branch
