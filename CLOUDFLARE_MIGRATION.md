# Cloudflare Pages Migration Guide

## Overview
Successfully migrated from Docker-based deployment to Cloudflare Pages for better performance and simpler deployment.

## Required Environment Variables

### GitHub Secrets
Add these secrets to your GitHub repository settings:

1. `CLOUDFLARE_API_TOKEN`
   - Get from Cloudflare dashboard → My Profile → API Tokens
   - Required permissions: Account:Cloudflare Pages:Edit, Zone:Zone:Read, Zone:Page Rules:Edit

2. `CLOUDFLARE_ACCOUNT_ID`
   - Get from Cloudflare dashboard → Right sidebar → Account ID

### Cloudflare Pages Environment Variables
Set these in Cloudflare Pages dashboard → Settings → Environment Variables:

#### Production Environment:
- `NODE_ENV`: `production`
- `VITE_API_URL`: `https://api.renekris.dev`

#### Preview Environment:
- `NODE_ENV`: `staging`
- `VITE_API_URL`: `https://api-staging.renekris.dev`

## Deployment Commands

### Local Development
```bash
# Deploy to preview environment
npm run deploy:preview

# Deploy to production
npm run deploy:production
```

### Automatic Deployment
- **dev branch** → Preview environment
- **main branch** → Production environment

## Key Changes Made

1. **Removed Docker-based CI/CD** - Eliminated complex container workflows
2. **Added Cloudflare Pages configuration** - `wrangler.toml` optimized for Pages
3. **Created routing rules** - `_redirects` file for SPA routing
4. **Added security headers** - `_headers` file for security
5. **Simplified deployment** - Single command deployment vs complex Docker Swarm

## Benefits

- ✅ **Faster deployments** - No container building required
- ✅ **Better performance** - Edge caching and CDN built-in
- ✅ **Zero egress costs** - No bandwidth charges
- ✅ **Simplified workflow** - Push to deploy
- ✅ **Automatic HTTPS** - Built-in SSL/TLS
- ✅ **Global CDN** - Automatic edge distribution

## Migration Checklist

- [x] Remove GitHub CI/CD workflows
- [x] Configure wrangler.toml for Pages
- [x] Add _redirects for SPA routing
- [x] Add _headers for security
- [x] Create deployment scripts
- [x] Set up GitHub Actions workflow
- [ ] Configure Cloudflare API tokens
- [ ] Set environment variables in Cloudflare dashboard
- [ ] Test deployment to preview environment
- [ ] Test deployment to production environment

## Next Steps

1. Configure the required secrets in GitHub
2. Set up environment variables in Cloudflare Pages dashboard
3. Test deployment by pushing to dev branch
4. Verify preview deployment works correctly
5. Deploy to production from main branch when ready