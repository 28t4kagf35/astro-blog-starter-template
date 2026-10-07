# navbar-next: changelog

## 0.9.4 (builds on 0.9.3)

- Mobile menu: the bottom line sits much lower (7% of the screen height above the
  footer) and the gap never shrinks, so opening Explore only moves the lines above
  it upward; The Cabin and Activities stay put. A very tall list scrolls.
- Mobile menu: on a page inside Explore (Tvindefossen, etc.) the menu opens already
  expanded, with nothing animating. On other pages, the first tap on Explore
  expands it (animated) and the second goes to the Explore home page.

## 0.9.3 (builds on 0.9.2)

- Mobile menu: the bottom of the list is fixed. Opening Explore (or Nature) animates
  only the submenu growing open; the lines above are pushed upward by it, and
  nothing moves downward or bounces. The shrinking top spacer and the changing gap
  between the main words are gone (one fixed gap, 2rem).

## 0.9.2 (builds on 0.9.1)

- Mobile menu: the text lines expand a little slower: main words slide 0.72s (was 0.57s),
  sub-items open 0.42s (was 0.32s). Desktop unchanged. Fades stay 0.48s.

## 0.9.1 (builds on 0.9.0)

- Mobile menu: reveal back to the 0.8.0 behaviour (the menu fades in while Explore
  and Nature open into place), 50% slower: fade 0.48s (was 0.32s), slide 0.57s
  (was 0.38s).
- Mobile menu: on hide only the whole menu fades out (0.48s); the text does not
  animate. The folded state is restored after the menu is fully invisible.

## 0.9.0 (builds on 0.8.0)

- Mobile menu: slower reveal (0.7s fade-in, was 0.32s).
- Mobile menu: on hide, the whole menu (veil, blur and text) fades out together
  (0.5s); the text no longer moves while it disappears. The menu's shape is reset
  only after it is fully invisible, and a page inside Explore opens with Explore
  already in place.

## 0.8.0 (builds on the canon 0.7.0)

- Mobile menu: pressing an item lights it, the touch equivalent of hover.
- Mobile menu: opened on a page inside Explore, it opens with Explore already
  expanded (and Nature, for Observe / Learn / Experience), so the current page
  shows its red square at once (on Tvindefossen: Explore, then Waterfalls).
- No grey tap flash on touch.
- Mobile menu: the whole column sits further in from the left edge (3.1rem, was 2rem),
  so the red square has room (about 1.7rem from the edge).
- Mobile menu: the large main words rest at a softer white (#CFCBC5); current or
  pressed is full white (#EDE9E2). Sub-items keep the two-colour rule of 0.7.0.

## 0.7.0 (experiment, 2026-10-07)

> **Note, 2026-10-07: this is the new canon navbar.** Still to do for it to apply site-wide: swap it in for the current
> navbar in the shell, and register it in CANON.md with a canon tag. Neither is done
> yet; for now it is shown only on the -v2 pages.

- No transparency on nav text: two solid colours for every item, main or sub:
  resting #A8A49E, lit (hover or current) #EDE9E2. The colour of an item no longer
  changes when the submenu opens, and Culture & History matches the rest.
- The audio and light/dark buttons use the same two colours.
- Learn and Experience (not links yet) use the same colours; their cursor stays a plain arrow.

## 0.6.0 (experiment, 2026-10-07)

- Back to a square (the dot read as a bullet point), slightly smaller than 0.4.0:
  7 px top level, 8 px large mobile items, 5-6 px sub-items.

## 0.5.0 (experiment, 2026-10-07)

- The current-item mark is a round dot, same size as the square was (try-out; 0.4.0 has the square).

## 0.4.0 (experiment, 2026-10-07)

- Expanded menu lighter again: desktop drawer 50% dark, mobile overlay 56%.
- Red square a little bigger (8 px top level, 9 px large mobile items, 6-7 px sub-items)
  and set further from the text.

## 0.3.0 (experiment, 2026-10-07)

- Expanded menu lighter still: desktop drawer 60% dark, mobile overlay 66% (blur keeps text legible).
- Current item: a small red square in front of it (6 px) instead of the left line.
- More air between sub-menu items (desktop and mobile).

## 0.2.0 (experiment, 2026-10-07)

- Expanded menu (desktop drawer and mobile overlay): more transparent, still dark
  (74% and 80%, was 88% and 93%).
- Every nav item lights up on hover, including the sub-items, the not-yet-links
  and the audio and light/dark buttons.
- Current item: a 2px red line on its left edge (as the green line on Tvindefossen's
  indented titles), replacing the underline.

## 0.1.0 (experiment, 2026-10-04)

Shown only on the `-v2` sandbox pages. The real navbar (1.2.0) is untouched.

- Desktop: the Explore panel is one surface with the bar (no seam, no doubled
  colour) and slides down like a drawer. Opens after 120 ms on hover (was 500 ms).
  Items: Culture & History, Nature (with Observe, Learn, Experience beneath), Waterfalls.
- Mobile: tapping EXPLORE opens its sub-list and the main items slide up to make
  room; tapping EXPLORE again follows the link to /explore. Tapping NATURE opens
  Observe, Learn, Experience. No arrows.
- Current section: full brightness with a thin red line under it (red as a line
  mark only). Inside the panel the current sub-page is marked the same way.
- Hover: item brightens to full and shows a faint line (pointer devices only).
- Learn and Experience have no index page yet: shown dimmed, not links.
