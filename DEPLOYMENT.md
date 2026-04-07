# Cloudflare Deployment Runbook

A complete guide for deploying the V2 website to production using the Cloudflare deploy interface with Workers static assets.

---

## Overview

This runbook documents the exact steps to deploy the site through the Cloudflare dashboard. Cloudflare builds the repository with `bun run build` and then runs `wrangler deploy`, which serves the static Astro output from `dist/` using Workers static assets.

---

## Configuration Values

Use these exact values when configuring the Cloudflare project:

| Setting               | Value                  |
| --------------------- | ---------------------- |
| **Project name**      | `renekris-dev-website` |
| **Build command**     | `bun run build`        |
| **Deploy command**    | `npx wrangler deploy`  |
| **Asset directory**   | `dist`                 |
| **Production branch** | `main`                 |
| **Preview branch**    | `dev`                  |
| **Production domain** | `renekris.dev`         |
| **Preview domain**    | `staging.renekris.dev` |

### Branch Strategy

| Branch      | Deployment Type | URL Pattern                                       |
| ----------- | --------------- | ------------------------------------------------- |
| `main`      | Production      | `https://renekris.dev`                            |
| `dev`       | Preview         | Cloudflare preview URL for `renekris-dev-website` |
| PR branches | Preview         | Cloudflare preview URL for the branch deployment  |

---

## Pre-Deployment Checklist

Before initiating the first deployment, verify:

1. All implementation tasks (1-11) are complete
2. CI pipeline passes on `main` branch
3. Resume PDF exists at `public/resume/rene-kristofer-pohlak-cv.pdf`
4. Security headers are configured in `public/_headers`
5. `astro.config.mjs` has `site: 'https://renekris.dev'`
6. Domain `renekris.dev` is configured in Cloudflare DNS

---

## Deployment Steps

### Step 1: Create the Cloudflare Project

1. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account and go to **Workers & Pages**
3. Click **Create application** and choose the deploy interface that supports repository builds
4. Create or reuse the project named `renekris-dev-website`

### Step 2: Configure Build and Deploy Commands

Use these values in the dashboard build settings:

- **Build command**: `bun run build`
- **Deploy command**: `npx wrangler deploy`
- **Root directory**: `/`

`wrangler.jsonc` supplies the rest of the deployment configuration:

- `name: renekris-dev-website`
- `compatibility_date: 2026-03-26`
- `assets.directory: ./dist`

### Step 3: Deploy from the Dashboard

1. Push to `main` or `dev`
2. Cloudflare will build the repository with `bun run build`
3. Cloudflare will deploy the built site with `npx wrangler deploy`
4. `main` deploys production and `dev` deploys preview
5. Run `bun run validate:dist` locally before shipping changes to `_headers`, `robots.txt`, or inline schemas

### Step 4: GitHub Actions Remains a Quality Gate

GitHub Actions still runs lint, typecheck, build, dist validation, and E2E tests, but it no longer deploys. The Cloudflare dashboard is the deployment source of truth.

---

## Preview Validation Checklist

After the first deployment, verify each item before proceeding to production:

### Core Functionality

- [ ] Homepage loads without console errors
- [ ] No 404 errors in network tab for critical assets
- [ ] Page loads in under 3 seconds on fast connection

### Theme System

- [ ] Theme toggle button is visible and clickable
- [ ] Light/dark mode switches correctly
- [ ] Theme preference persists after page reload
- [ ] Theme matches system preference on first visit (if no saved preference)
- [ ] Smooth transition between themes (200ms)

### Hero Section

- [ ] Name displays: "Rene Kristofer Pohlak"
- [ ] Role displays: "Developer & Infrastructure Engineer"
- [ ] Tagline displays correctly
- [ ] Location shows: "Tallinn, Estonia"
- [ ] Tech stack badges visible: JavaScript, Python, C#, React, Node.js
- [ ] Gradient background renders correctly

### Resume Download

- [ ] Resume button is visible in hero section
- [ ] Button text reads: "View Resume"
- [ ] Clicking button initiates download of `/resume/rene-kristofer-pohlak-cv.pdf`
- [ ] PDF file is accessible and not corrupted
- [ ] Download works in both light and dark themes

### Contact Section

- [ ] Email displays: `renekrispohlak@gmail.com`
- [ ] Email link uses `mailto:` protocol
- [ ] LinkedIn link points to: `https://www.linkedin.com/in/rene-kristofer-pohlak-668832114/`
- [ ] GitHub link points to: `https://github.com/renekris`
- [ ] Phone number is not displayed directly in the page source
- [ ] Availability text shows: "Open to remote & hybrid opportunities"
- [ ] All contact links are clickable

### SEO Metadata

- [ ] Page title is: "Rene Kristofer Pohlak - IT Professional | JavaScript, Python, C# Developer"
- [ ] Meta description contains: "Self-motivated IT professional with experience in web development"
- [ ] Canonical URL is: `https://renekris.dev`
- [ ] No stale `og:image` metadata points at removed assets
- [ ] Twitter card type is: `summary`
- [ ] Author meta tag is: "Rene Kristofer Pohlak"
- [ ] Keywords meta includes: "Rene Kristofer Pohlak, IT professional, JavaScript developer"
- [ ] JSON-LD structured data is present in page source
- [ ] Sitemap index is accessible at `/sitemap-index.xml`
- [ ] Robots.txt is accessible at `/robots.txt`

### Security Headers

Verify all headers are present using browser DevTools or `curl -I`:

- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` restricts camera, microphone, geolocation
- [ ] `Content-Security-Policy` is present and valid
- [ ] `Strict-Transport-Security` (HSTS) with 1-year max-age
- [ ] `/robots.txt` and `/sitemap*.xml` have 1-hour cache
- [ ] `/_astro/*` and `/resume/*` have 1-year immutable cache

### Mobile Responsiveness

Test on actual devices or browser dev tools:

- [ ] Layout adapts to 320px width (small phones)
- [ ] Layout adapts to 768px width (tablets)
- [ ] Layout adapts to 1440px width (desktops)
- [ ] No horizontal scrolling on mobile
- [ ] Text remains readable at all sizes
- [ ] Touch targets are at least 44x44px
- [ ] Theme toggle is accessible on mobile

### Accessibility

- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] No reduced motion issues (test with `prefers-reduced-motion`)

---

## Custom Domain Setup

### Step 1: Add Custom Domain

1. In Cloudflare Dashboard, go to your `renekris-dev-website` project
2. Click **Custom domains** > **Set up a custom domain**
3. Enter: `renekris.dev`
4. Click **Continue**

### Step 2: DNS Configuration

Cloudflare will automatically configure DNS if the domain is already in your account:

- A record or CNAME will be created pointing to the Worker deployment
- SSL certificate will be provisioned automatically

### Step 3: Verify

- [ ] `https://renekris.dev` loads the site
- [ ] SSL certificate is valid
- [ ] HTTP redirects to HTTPS
- [ ] `www.renekris.dev` redirects to apex domain (if configured)

---

## Rollback Procedures

### Rollback to Previous Deployment

If a deployment causes issues, roll back immediately:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages
2. Select the `renekris-dev-website` project
3. Go to the **Deployments** tab
4. Find the last known good deployment
5. Click the three-dot menu (…) > **Rollback to this deployment**
6. Confirm the rollback

The rollback is instantaneous. The previous version will be live within seconds.

### Pause Deployments

To temporarily stop automatic deployments:

1. Go to project settings in Cloudflare Dashboard
2. Under **Build** settings, click **Pause deployments**
3. Or disconnect the Git repository temporarily

To resume: Click **Resume deployments** or reconnect the repository.

### DNS Fallback

If the Cloudflare deployment becomes unavailable, redirect DNS to a static host:

1. Go to Cloudflare DNS settings for `renekris.dev`
2. Change the A/AAAA or CNAME record to point to your backup host
3. Set TTL to 300 seconds (5 minutes) for quick changes
4. Purge Cloudflare cache if needed

---

## Monitoring

### Build Notifications

Configure build notifications in Cloudflare Dashboard:

1. Go to project settings > **Notifications**
2. Enable notifications for:
   - Build failures
   - Successful deployments
   - Rollback events

### Analytics

Monitor site performance:

1. Go to **Analytics** tab in the project dashboard
2. Review:
   - Request volume
   - Bandwidth usage
   - Error rates
   - Cache hit ratios

---

## Troubleshooting

### Build Failures

If the build fails, check:

1. **Node version**: Cloudflare uses Node 22+ (matches our `engines` field)
2. **Bun availability**: the Cloudflare build environment must detect Bun and run `bun run build`
3. **Lockfile**: Ensure `bun.lock` is committed to the repository
4. **Dependencies**: Run `bun install --frozen-lockfile` locally to verify
5. **Built output validation**: Run `bun run validate:dist` to confirm CSP and sitemap alignment

Common fixes:

```bash
# Update lockfile locally
bun install

# Test build locally
bun run build

# Verify dist output
ls -la dist/
```

### Missing Assets

If assets return 404:

1. Verify files exist in `public/` directory
2. Check build output includes them in `dist/`
3. Review `_headers` file for incorrect path patterns
4. Check Cloudflare cache (purge if needed)

### Security Header Issues

If headers are missing:

1. Verify `public/_headers` file exists
2. Check syntax (no trailing spaces, proper indentation)
3. Test locally with `bun run preview` and check response headers
4. Note: `_headers` only works on Cloudflare, not in local dev

---

## Final Manual Action

The remaining manual setup is entirely in Cloudflare Dashboard:

1. Open the `renekris-dev-website` project
2. Set **Build command** to `bun run build`
3. Set **Deploy command** to `npx wrangler deploy`
4. Keep the root directory at `/`
5. Retry the build on `main`

After that, pushes to `main` and `dev` will deploy automatically from the Cloudflare interface using the repo's `wrangler.jsonc`.

---

## Appendix: Wrangler CLI Fallback

**Status: Same deployment path as Cloudflare dashboard / Admin fallback**

The Cloudflare dashboard and the manual CLI path now use the same deployment model: `wrangler deploy` serving the static `dist/` directory via Workers static assets.

### Prerequisites

```bash
# Install Wrangler globally
bun add -g wrangler

# Authenticate with Cloudflare
wrangler login
```

### Manual Deployment

```bash
# Build the project first
bun run build

# Deploy with Workers static assets
wrangler deploy
```

### When to Use Wrangler

- Deploying locally without using the Cloudflare dashboard
- Validating the same deployment path before changing dashboard settings
- Emergency redeploys when the dashboard UI is inaccessible

### Wrangler Configuration

The committed `wrangler.jsonc` is the source of truth:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "renekris-dev-website",
  "compatibility_date": "2026-03-26",
  "assets": {
    "directory": "./dist",
  },
}
```

**Warning**: Do not switch the dashboard back to a Pages/Git-integration deployment flow unless you also migrate the repo config back from Workers static assets.

---

## References

- [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/)
- [Migrate from Pages to Workers static assets](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages)
- [Cloudflare custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

---

## Change Log

| Date       | Version | Changes                  |
| ---------- | ------- | ------------------------ |
| 2026-03-24 | 1.0     | Initial runbook creation |
