# navbar: changelog

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
