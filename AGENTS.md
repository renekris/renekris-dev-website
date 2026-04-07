# renekris-v2-website AGENTS.md

## Purpose

This file captures the project-specific context needed to continue work in `renekris-v2-website/` without re-discovering the same decisions.

## Project Snapshot

- Stack: Astro 6, TypeScript strict mode, Tailwind CSS 4, Bun
- Site type: static Cloudflare Pages portfolio site
- Dev server: `bun dev`
- Build: `bun run build`
- Preview built output: `bun run preview`
- Full verification: `bun run lint && bun run typecheck && bun run build && bun run validate:dist && bun run test:e2e`

## Important Working Rules

- `renekris-dev-website/` is a standalone git repository. Commit from this repository root.
- Prefer static Astro output and minimal client JavaScript.
- Do not re-introduce inline `style=` attributes or inline runtime scripts in Astro components unless CSP is intentionally updated and re-validated.
- If changing built HTML behavior, rerun `bun run validate:dist` after `bun run build`.
- Keep generated artifacts out of git: `dist/`, `playwright-report/`, and `test-results/` are ignored and should stay that way.
- `ThemeToggle.astro` is rendered twice in `src/components/Navigation.astro` (desktop and mobile). Any toggle behavior changes must keep both instances in sync.
- Resume/CV source now lives in `cv/`. Build and edit the LaTeX CV from that folder instead of the website root.

## Key Files

- `cv/resume.tex` - LaTeX CV source
- `cv/profile_picture.jpg` - local profile image used by the LaTeX CV
- `src/content/site.ts` - single source of truth for site copy, contact data, SEO facts, footer text
- `src/layouts/BaseLayout.astro` - page shell, external script includes, navigation + reveal/scroll/theme bootstrapping
- `src/styles/global.css` - theme variables, component classes, responsive rules, motion behavior
- `src/components/SEO.astro` - metadata and JSON-LD
- `public/_headers` - Cloudflare security headers and CSP
- `public/scripts/*.js` - externalized browser scripts used to satisfy strict CSP
- `scripts/validate-dist.mjs` - validates built output against CSP and sitemap expectations
- `tests/smoke.spec.ts` - Playwright smoke coverage
- `DEPLOYMENT.md` - Cloudflare Pages cutover/runbook

## Known Gotchas

- `src/content/site.ts` is the only content source. Do not hardcode page copy in components.
- `cv/` is intentionally separate from the Astro site. Keep LaTeX-generated files inside `cv/` and do not move them back to the root.
- The current LaTeX resume expects `profile_picture.jpg` to sit next to `resume.tex` inside `cv/`.
- Keep phone numbers out of rendered HTML and JSON-LD unless you intentionally want them indexed. The current pattern is to expose email/social links publicly and share phone details on request.
- `src/components/SEO.astro` emits inline JSON-LD scripts. If those schemas change, the SHA-256 hashes in `public/_headers` must still pass `bun run validate:dist`.
- The site no longer ships a static OG image. If you add one later, update `src/content/site.ts`, `src/components/SEO.astro`, and `DEPLOYMENT.md` together.
- `public/_headers` only takes effect on Cloudflare Pages, not on local dev or preview.
- `src/styles/global.css` is already large; prefer component-scoped styles or carefully-named utility classes before expanding it further.
- Tests rely on existing `data-testid` hooks. Preserve them when refactoring hero, contact, navigation, or theme UI.

## Current State

- Recent website commits:
  - `24d1811 fix(site): harden website release output`
  - `457bb29 feat(site): add renekris-v2-website with all tasks complete`
- Recent hardening work removed inline shipped code, added `validate:dist`, fixed sitemap alignment, sanitized `tel:` links, and replaced the React theme island with static Astro + external scripts.
- Recent resume work moved the tracked LaTeX CV into `cv/`, copied the profile image into that folder, and ignores generated `cv/*.pdf` / auxiliary files.
- The footer source link should point to the standalone deployment repository (`renekris/renekris-dev-website`).
- Current working tree has no uncommitted changes inside `renekris-v2-website/` unless a new session adds them.

## Verification Expectations

Before considering website changes done, run:

1. `bun run lint`
2. `bun run typecheck`
3. `bun run build`
4. `bun run validate:dist`
5. `bun run test:e2e`

If you touch `public/_headers`, `public/robots.txt`, `src/components/SEO.astro`, `src/layouts/BaseLayout.astro`, or `public/scripts/*.js`, all five checks are mandatory.

For resume-only edits, run from `cv/`:

1. `latexmk -pdf resume.tex`
2. Review the generated `cv/resume.pdf`

## Deployment Notes

- Canonical deployment path is the Cloudflare dashboard deploy interface backed by this standalone repository.
- Production branch is `main`; `dev` is the preview branch. Deployment details live in `DEPLOYMENT.md`.

## Practical Reminder

- For local live-reload/HMR development, use `bun dev` from `renekris-dev-website/` and open `http://localhost:4321`.
