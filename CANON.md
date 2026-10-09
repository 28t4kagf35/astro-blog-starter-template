# Canon register: vosswaterfalls.no v2

A piece becomes canon only when the owner says it is right and gives a GO.
Each canon version is recorded here and tagged in git (`canon/<piece>-v<N>`).
A later change to a canon piece is visible against its tag; a new canon
version goes through the same gate again.

| Piece | Version | Tag | Approved |
|---|---|---|---|
| Navbar | v1 (superseded by v2) | `canon/navbar-v1` | 2026-10-01 19:29 (+02:00) |
| Navbar | v2 | `canon/navbar-v2` | 2026-10-07 16:37 (+02:00) |
| Navbar | v2.1 (fix to v2) | `canon/navbar-v2.1` | 2026-10-08 15:56 (+02:00) |
| Navbar | v2.2 (mobile menu closes after the toggles) | `canon/navbar-v2.2` | 2026-10-09 20:42 (+02:00) |

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

## Navbar v2

**Approved:** 2026-10-07, by the owner, with a GO, after review on the live
preview (desktop, mobile, tablet portrait). Supersedes Navbar v1.

**What is canon**
- One shell surface: bar and drawer are the same surface (no seam); the drawer
  opens on hover (120 ms), with a 200 ms close grace; it slides open under Explore.
- Items: rest and lit colours are fixed (no transparency), the same rule for main
  and sub-items. Current section is marked with a red square before the item.
- Mobile and tablet portrait (up to 1023 px wide, upright): slide-up full-screen
  menu. Veil with blur; fade in 0.48 s, whole menu fades out together on hide
  (text does not animate). Bottom of the list is fixed, 7% of the screen height
  above the footer; opening Explore moves only the lines above it upward. On a
  page inside Explore the menu opens already expanded. Two taps on Explore from
  outside it (expand, then go).
- Hide and reveal on scroll: unchanged from v1 (`behavior.ts`).
- Component: `src/globals/navbar-next/` (version 2.0.0). The v1 files stay in
  `src/globals/navbar/` unused, apart from `behavior.ts`, which the shell still uses.

**Where it applies:** every page, mounted only by the shell.

## Navbar v2.1 (fix to v2)

**Approved:** 2026-10-08, by the owner, with a GO. Navbar v2 stays canon; this is
a fix. The red current-page marker is now drawn on items that are not links yet
(Learn, Experience), on the desktop drawer and the mobile menu. Before, those
items lit up as active but had no marker. Locked as navbar-next 2.0.1.

## Navbar v2.2 (addition to v2)

**Approved:** 2026-10-09, by the owner, with a GO, after trying it on a phone. Navbar v2
stays canon; this is an addition. On the mobile menu (and tablet held upright), tapping the
dark/light toggle or the audio toggle closes the menu after a 200 ms beat, with the usual
0.48 s fade, returning the visitor to the page. Desktop is unchanged. Locked as
navbar-next 2.0.2.
