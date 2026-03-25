# Renekris V2 Website

A modern Astro-based personal website built with React, Tailwind CSS, and TypeScript.

**Stack**: Astro 6, React 19, Tailwind CSS 4, TypeScript 5

## Prerequisites

- [Bun](https://bun.sh/) 1.2+
- Node.js 22.12+
- Git

## Setup

```bash
# Clone the repository
git clone <repository-url>
cd kodu-server/renekris-v2-website

# Install dependencies
bun install
```

This project lives inside the `kodu-server` monorepo, so run git commands from the parent repo when committing changes.

## Development

```bash
# Start development server
bun dev

# Type check
bun run typecheck

# Lint
bun run lint
```

The dev server runs at `http://localhost:4321`.

## Available Scripts

| Command             | Description                                 |
| ------------------- | ------------------------------------------- |
| `bun dev`           | Start Astro dev server                      |
| `bun run build`     | Build for production (outputs to `./dist/`) |
| `bun run preview`   | Preview production build locally            |
| `bun run lint`      | Run ESLint                                  |
| `bun run typecheck` | Run Astro check and TypeScript              |
| `bun run test:e2e`  | Run Playwright E2E tests                    |

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React/Astro components
│   ├── pages/           # Astro routes
│   └── styles/          # Global styles
├── dist/                # Build output
└── package.json
```

## Deployment

### Primary: GitHub Actions → Cloudflare Pages

The repository CI now handles automatic deployments to Cloudflare Pages after checks pass.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Deployment behavior:

- Push to `main` → production deploy
- Push to `dev` → preview deploy

### Optional: Cloudflare Pages Git Integration

You can still use native Cloudflare Git Integration if you want Cloudflare to build directly from the repository, but it is no longer required for automatic deploys.

### Manual fallback: Wrangler CLI

Use this for manual deployments or emergency overrides.

```bash
# Install Wrangler globally
bun add -g wrangler

# Login to Cloudflare
wrangler login

# Deploy manually
wrangler pages deploy dist --project-name=renekris-v2-website --branch=main
```

Do not use `wrangler deploy` with the current config. This repo is configured for Cloudflare Pages deploys, not direct Workers static-asset deploys.

## CI/CD

GitHub Actions runs on every push and pull request:

1. Install dependencies with Bun
2. Run ESLint
3. Run type checking
4. Build the project
5. Run Playwright E2E tests
6. Deploy to Cloudflare Pages on pushes to `main` and `dev`

See `.github/workflows/ci.yml` for the full configuration.

## License

MIT
