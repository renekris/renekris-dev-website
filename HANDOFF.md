# Quick Handoff

Work in this folder:

`/home/renekris/Development/kodu-server/renekris-v2-website`

## Goal

Use the existing Renekris website GitHub repo as the canonical repo, but make the current Astro site (this folder) become the real root/main website version on GitHub.

## Current truth

- This folder is the v2 Astro site and is the version to keep.
- The old v1 site lives at `../docker/kodu/renekris-dev-website/` and should be treated as legacy.
- Do not make v2 fit inside the old v1 structure.
- Preferred direction: the old website repo should become the v2 repo.

## Already done here

- Phone number exposure was removed from visible HTML and JSON-LD.
- Footer source link now points at the monorepo path.
- `AGENTS.md` in this folder contains project-specific gotchas and verification steps.
- Verification already passed earlier for the current website state:
  - `bun run lint`
  - `bun run typecheck`
  - `bun run build`
  - `bun run validate:dist`
  - `bun run test:e2e`

## What the next agent should do

1. Plan the migration from the old website repo/root to this Astro site.
2. Decide how to preserve v1 history cleanly:
   - archive branch/tag, or
   - `legacy/` folder, or
   - separate archive repo.
3. Prepare the repo-root layout that GitHub visitors should see.
4. Update deployment/docs so Cloudflare Pages points at the final root layout.
5. If asked, perform the git migration carefully without rewriting published history.

## Constraints

- Avoid destructive git history rewrites.
- Do not expose the personal phone number in rendered HTML or JSON-LD again.
- Keep the v2 Astro site as the canonical version.
- If editing SEO.astro or `_headers`, rerun full verification.

## Useful commands

From this folder for live dev/HMR:

`bun dev`

Full verification:

`bun run lint && bun run typecheck && bun run build && bun run validate:dist && bun run test:e2e`
