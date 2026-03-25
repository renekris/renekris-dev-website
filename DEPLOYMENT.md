# Cloudflare Pages Deployment Runbook

A complete guide for deploying the V2 website to production using GitHub Actions and Cloudflare Pages Direct Upload.

---

## Overview

This runbook documents the exact steps to deploy `renekris-v2-website` to Cloudflare Pages. The primary deployment method is GitHub Actions running `wrangler pages deploy` against the built `dist/` artifact.

---

## Configuration Values

Use these exact values when configuring the Cloudflare Pages project:

| Setting                | Value                  |
| ---------------------- | ---------------------- |
| **Pages project name** | `renekris-v2-website`  |
| **Deploy artifact**    | `dist`                 |
| **Production branch**  | `main`                 |
| **Preview branch**     | `dev`                  |
| **Production domain**  | `renekris.dev`         |
| **Preview domain**     | `staging.renekris.dev` |

### Branch Strategy

| Branch      | Deployment Type | URL Pattern                                           |
| ----------- | --------------- | ----------------------------------------------------- |
| `main`      | Production      | `https://renekris.dev`                                |
| `dev`       | Preview         | `https://dev.renekris-v2-website.pages.dev`           |
| PR branches | Preview         | `https://<branch-name>.renekris-v2-website.pages.dev` |

---

## Pre-Deployment Checklist

Before initiating the first deployment, verify:

1. All implementation tasks (1-11) are complete
2. CI pipeline passes on `main` branch
3. Resume PDF exists at `public/resume/rene-kristofer-pohlak-cv.pdf`
4. OG image exists at `public/og/og-image.png`
5. Security headers are configured in `public/_headers`
6. `astro.config.mjs` has `site: 'https://renekris.dev'`
7. Domain `renekris.dev` is configured in Cloudflare DNS

---

## Deployment Steps

### Step 1: Create the Pages Project

1. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account and go to **Workers & Pages**
3. Click **Create application** > **Pages**
4. Create a Pages project named `renekris-v2-website`

### Step 2: Add GitHub Secrets

In GitHub repository settings, add:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token must have **Cloudflare Pages: Edit** permission for the target account.

### Step 3: Deploy from CI

1. Push to `main` or `dev`
2. GitHub Actions will run lint, typecheck, build, dist validation, and E2E tests
3. The `deploy-pages` job will upload the verified `dist/` artifact with `wrangler pages deploy`
4. `main` deploys production and `dev` deploys preview
5. Run `bun run validate:dist` locally before shipping changes to `_headers`, `robots.txt`, or inline schemas

### Step 4: Do Not Use Workers Build Deploy for This Config

This repository is configured for Cloudflare Pages deploys.

- `wrangler pages deploy dist ...` ✅ supported
- `wrangler deploy` ❌ wrong for the current `wrangler.jsonc`

If Cloudflare is running `npx wrangler deploy`, it is treating this as a Workers project instead of a Pages project and will fail with "Missing entry-point to Worker script or to assets directory".

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
- [ ] OG image URL is: `/og/og-image.png`
- [ ] Twitter card type is: `summary_large_image`
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
- [ ] `/_astro/*`, `/resume/*`, `/og/*` have 1-year immutable cache

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

1. In Cloudflare Dashboard, go to your Pages project
2. Click **Custom domains** > **Set up a custom domain**
3. Enter: `renekris.dev`
4. Click **Continue**

### Step 2: DNS Configuration

Cloudflare will automatically configure DNS if the domain is already in your account:

- A record or CNAME will be created pointing to the Pages deployment
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
2. Select the `renekris-v2-website` project
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

If Pages becomes unavailable, redirect DNS to a static host:

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

1. Go to **Analytics** tab in Pages project
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
2. **Bun availability**: Cloudflare Pages supports Bun natively
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

The remaining manual setup is to create the Cloudflare Pages project once and add the GitHub repository secrets used by CI-driven deployments:

- `CLOUDFLARE_API_TOKEN` — API token with **Cloudflare Pages: Edit** permission for the target account
- `CLOUDFLARE_ACCOUNT_ID` — target Cloudflare account ID

After that, pushes to `main` and `dev` will deploy automatically from GitHub Actions using `wrangler pages deploy`.

---

## Appendix: Wrangler CLI Fallback

**Status: Primary CI deployment path / Admin fallback**

Wrangler Pages deploy is the primary automated deployment path for this repository. It can also be used manually for emergency overrides.

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

# Deploy to Pages
cd renekris-v2-website
wrangler pages deploy dist --project-name=renekris-v2-website --branch=main
```

### GitHub Actions Deployment

The CI workflow in `.github/workflows/ci.yml` now deploys automatically after lint, typecheck, build, dist validation, and E2E tests pass.

- `main` branch → production deployment
- `dev` branch → preview deployment

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### When to Use Wrangler

- Git Integration is temporarily unavailable
- Deploying a hotfix branch directly to production
- Bulk asset uploads that exceed Git limits
- CI/CD pipeline integration for automated deployments from GitHub Actions
- Emergency rollbacks when Dashboard is inaccessible

### Wrangler Configuration

Create `wrangler.toml` if needed for advanced configuration:

```toml
name = "renekris-v2-website"
compatibility_date = "2025-03-24"

[build]
command = "bun run build"
```

**Warning**: If Cloudflare Pages Git Integration is still enabled for the same project, it can race with or overwrite CI-driven Wrangler deployments. Use one primary deployment path per Pages project.

---

## References

- [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Preview Deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages Headers](https://developers.cloudflare.com/pages/configuration/headers/)

---

## Change Log

| Date       | Version | Changes                  |
| ---------- | ------- | ------------------------ |
| 2026-03-24 | 1.0     | Initial runbook creation |
