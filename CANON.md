# Canon register: vosswaterfalls.no v2

A piece becomes canon only when the owner says it is right and gives a GO.
Each canon version is recorded here and tagged in git (`canon/<piece>-v<N>`).
A later change to a canon piece is visible against its tag; a new canon
version goes through the same gate again.

| Piece | Version | Tag | Approved |
|---|---|---|---|
| Navbar | v1 | `canon/navbar-v1` | 2026-10-01 19:29 (+02:00) |

## Navbar v1

**Approved:** 2026-10-01, by the owner, after review on the live preview
(Tvindefossen first, then all pages), with a GO.

**Reference:** the canon Replit mockup `/__mockup/preview/nav/SiteNavDesktop`,
measured on 2026-10-01.

**What is canon**
- Look: one constant bar, never transparent: "soft",
  `rgba(19, 20, 22, 0.28)` + `blur(5px)`, at every scroll position.
- Hides after scrolling down past one viewport height.
- Reveals after scrolling up an accumulated 20% of the viewport height.
- Mobile breakpoint: viewport < 768px.
- Component: SiteNav from the webglobals export
  (`replit-cloudflare-adapter-shell`), unchanged.

**Files** (moved on 2026-10-02 into the globals structure; content unchanged,
same git blob ids as at approval)
- `src/globals/navbar/component.tsx`: `da4b9ccf876c1504633aeefd5edbaf5037d42d9e`
- `src/globals/navbar/behavior.ts`: `aba32a6f0fdd85b03d5390eb4f26d2459a9a1e3a`

**Locked as** navbar 1.0.0 in `globals.lock.json`; the build fails if the
files in `src/globals/navbar/` differ from the lock.

**Where it applies:** every page. The shell (`src/shell/SiteShell.tsx`) is the
only place the navbar is mounted, and every page type goes through the shell.
