# vosswaterfalls.no v2: orientation

Astro site on Cloudflare Workers; content from Sanity (project `r102svrh`,
private dataset `production`) fetched at build time with the build variable
`SANITY_READ_TOKEN`. A push to `main` deploys.

## How the site is put together

```
src/layouts/SiteLayout.astro   Frame: <head>, noindex, fonts; loads src/styles/site.css
src/shell/                     Shell: mounts the global elements, holds shared state
src/globals/<name>/            Global elements (navbar, …), each versioned on its own
src/clusters/<name>/           What one cluster shares: addresses, data loading
src/page-types/<name>/         Page types; index.tsx = withShell(Component)
src/site/pages.ts              The list of all pages (address, type, content)
src/pages/[...path].astro      Front controller: the one route file for pages
src/pages/404.astro            The 404 page (Astro requires this file); same rules
```

- Every page is rendered by the front controller, inside the frame and the shell.
  A new page type is a folder in `src/page-types/`, pages added in its cluster,
  its type added in `src/site/pages.ts`, and one branch in the front controller.
- Site-wide behaviour (CSS) lives in `src/styles/site.css`.
- Global elements live in `src/globals/`. Only `src/shell` imports them.
  Each has `global.json` (version, source) and a `CHANGELOG.md`.
- `globals.lock.json` pins each global's version and file fingerprint.

## The build check

`scripts/check-architecture.mjs` runs inside every build (see
`astro.config.mjs`) and fails the build when: a global's files differ from the
lock, anything outside `src/shell` imports a global, a second route file
appears, a page type skips `withShell`, or the front controller leaves the frame.
Run it locally with `node scripts/check-architecture.mjs`; `--print` shows the
current fingerprints.

## Canon

`CANON.md` lists the pieces the owner has approved, with their versions. A
global's files change only as a new version approved by the owner; the lock is
updated in the same commit. Canon tags (`canon/<name>-v<N>`) are created by the
GitHub Action `.github/workflows/canon-tags.yml` from the lock file.

## Sources

Designs arrive in `28t4kagf35/DESIGN-EXPORTS-PUSH-COPY` (read-only mirror;
`main` = page designs, `webglobals` = global elements). This repo is the only
place changes are pushed.

## Leftovers

`src/pages/img/`, and the starter's blog/about/rss pages predate
this structure and are listed as allowed leftovers in the build check.
