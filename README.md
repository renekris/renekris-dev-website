# Renekris Development Website

A modern React-based landing page deployed on Cloudflare Pages with automatic CI/CD from GitHub.

**Live Site:** [https://renekris.dev](https://renekris.dev)  
**Staging Site:** [https://staging.renekris.dev](https://staging.renekris.dev)

## Features

- **Modern React Application**: Built with React 18 and modern JavaScript
- **Cloudflare Pages Deployment**: Zero-downtime deployments with global CDN
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional Portfolio**: Clean, developer-focused presentation
- **Automatic Deployments**: Git-based deployment with preview environments

## Tech Stack

- **Frontend**: React 18, JavaScript (ES6+), Tailwind CSS
- **Build**: Create React App, npm
- **Testing**: Jest (unit tests), Playwright (E2E tests)
- **Deployment**: Cloudflare Pages with GitHub integration
- **CI/CD**: Automatic deployments on push to main/dev branches

## Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

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
npm start              # Start development server
npm test               # Run unit tests
npm run build          # Build for production
npm run test:e2e       # Run Playwright E2E tests
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
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

## Cloudflare Pages Deployment

### Automatic Deployment Workflow

**Production (main branch):**
```bash
git checkout main
git add .
git commit -m "Update production"
git push origin main
# → renekris.dev updates automatically in 1-2 minutes
```

**Staging (dev branch):**
```bash
git checkout dev
git add .
git commit -m "Update staging feature"
git push origin dev
# → staging.renekris.dev updates automatically in 1-2 minutes
```

**Pull Request Previews:**
Every PR gets automatic preview URL: `https://random-chars.renekris-dev-website.pages.dev`

### Manual Deployment (Optional)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy to production
wrangler pages deploy build --branch=main

# Deploy to staging
wrangler pages deploy build --branch=dev --message="Update staging"
```

### Environment Variables

Production (main branch):
- `NODE_ENV=production`
- `REACT_APP_API_URL=https://api.renekris.dev`

Staging (dev branch):
- `NODE_ENV=staging`  
- `REACT_APP_API_URL=https://api-staging.renekris.dev`

## Project Structure

```
src/
├── components/          # React components
│   ├── animations/     # Animation utilities
│   ├── icons/          # Icon components
│   ├── resume/         # Resume components
│   ├── sections/       # Page sections
│   ├── SEO/            # SEO components
│   └── ui/             # UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles

public/
├── index.html          # HTML template
├── CV_Rene_Kristofer_Pohlak.pdf  # Resume PDF
├── robots.txt          # SEO robots file
└── sitemap.xml         # SEO sitemap

tests/
├── e2e/                # Playwright E2E tests
└── unit/               # Jest unit tests

wrangler.toml           # Cloudflare Pages configuration
.env.production         # Production environment variables
.env.staging           # Staging environment variables
package.json            # Dependencies and scripts
```

## Contributing

1. Create a feature branch from `main` or `dev`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `npm test && npm run test:e2e`
4. Submit a pull request

### Code Quality

- ESLint for code linting
- Jest for unit testing
- Playwright for E2E testing
- Automatic deployment on merge

## Cloudflare Pages Benefits

✅ **Zero-downtime deployments** - Instant atomic updates  
✅ **Automatic SSL** - Free certificates for both domains  
✅ **Global CDN** - Your site served from 300+ locations  
✅ **Instant rollbacks** - One-click revert in dashboard  
✅ **Preview deployments** - Every PR gets live URL  
✅ **Branch isolation** - Staging completely separate from production  
✅ **Free hosting** - No server costs for main site  

## Setup Instructions

### First Time Setup

1. **Connect Repository to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
   - Click "Create application" > "Pages" > "Import an existing Git repository"
   - Select this repository

2. **Configure Build Settings:**
   ```
   Production branch: main
   Build command: npm run build
   Build directory: build
   Root directory: / (leave blank)
   ```

3. **Set Custom Domains:**
   - Add `renekris.dev` → points to main branch
   - Add `staging.renekris.dev` → points to dev branch

4. **Environment Variables:**
   - Configure in Pages project → Settings → Environment variables
   - Set production and staging variables as shown above

### Development Workflow

```bash
# Development cycle
git checkout dev
# Make changes
git add .
git commit -m "Update staging feature"
git push origin dev
# → staging.renekris.dev updates automatically

# Ready for production
git checkout main
git merge dev
git push origin main
# → renekris.dev updates automatically
```

## Troubleshooting

### Build Issues
- Ensure `npm run build` works locally
- Check that all dependencies are in package.json
- Verify Node.js version is 20+

### Deployment Issues
- Check Cloudflare Pages build logs
- Verify environment variables are set correctly
- Ensure custom domains are properly configured

### Performance
- Build creates optimized bundles (~96KB gzipped)
- Cloudflare CDN provides global caching
- Automatic image optimization available

For more information, visit [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).
