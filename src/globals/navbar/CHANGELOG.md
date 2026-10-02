# navbar: changelog

## 1.2.0 (draft, awaiting owner approval; based on 1.0.0, includes 1.0.1 and 1.1.0)

- The four top-level items are links: NORWAY to `/`, EXPLORE to `/explore`,
  THE CABIN to `/cabin`, ACTIVITIES to `/activities`. On desktop, hovering
  EXPLORE still opens the panel; clicking it follows the link.
- The Explore panel's items (Nature, Culture & History, Waterfalls) and the
  mobile menu's sub-list are not links yet. On mobile, tapping EXPLORE follows
  the link, so its sub-list no longer opens.

## 1.1.0 (draft, awaiting owner approval; based on 1.0.0, includes 1.0.1)

- Desktop EXPLORE panel: the cluster titles now use exactly the bar's own text
  style (Raleway, 0.76rem, same tracking and colour). 1.0.1 had them larger and
  brighter, which was never designed.
- Language labels are removed from the code (the desktop selector and the
  mobile language row): launch is English only. They are recoverable from the
  tagged canon version `canon/navbar-v1` and from version 1.0.1 in git.
  The contract files (`host-contract.json`, `declarations.json`,
  `HOW_TO_APPLY.md`) are the source documents and still describe the selector.
- Includes everything in 1.0.1 below.

## 1.0.1 (draft, awaiting owner approval; based on 1.0.0)

- Desktop EXPLORE panel: the cluster titles are set in Raleway (uppercase,
  same tracking as the bar), not Source Serif italic. The mobile menu keeps
  its serif italic items, as designed.
- Desktop: moving the mouse onto any other top-level item releases the open
  panel (before, it stayed open until the mouse left the whole navbar).
- Note: the design source (webglobals export) still has the serif panel
  titles; this repository carries the corrected version.

## 1.0.0 (canon, approved 2026-10-01)

- SiteNav from the webglobals export (`replit-cloudflare-adapter-shell`), unchanged.
- Behaviour: one constant "soft" bar (`rgba(19,20,22,0.28)` + `blur(5px)`),
  never transparent; hides after scrolling down one viewport height; reveals
  after scrolling up 20% of a viewport; mobile below 768px.
