# footer-next: changelog

## 1.0.7 (candidate: Footer v1.1, awaiting the owner's approval)

- Vignette strength down by 30%: dark 0.36 to 0.25, light 0.20 to 0.14. Shape unchanged.

## 1.0.6 (candidate: Footer v1.1, awaiting the owner's approval)

- Vignette is now radial: one oval, clear in the middle 60%, shading to the edge on all four sides,
  the top included (1.0.5 had straight fades on the left, right and bottom only). Strength as before
  (dark 0.36, light 0.20); the corners get the full strength.

## 1.0.5 (candidate: Footer v1.1, awaiting the owner's approval)

- Vignette the other way: a larger clear centre, the shade hugging the edges. Sides fade over 20% of
  the width (1.0.4: 34%), bottom over 26% (was 42%). Strength eased a little: dark 0.44 to 0.36,
  light 0.24 to 0.20.

## 1.0.4 (candidate: Footer v1.1, awaiting the owner's approval)

- Vignette stronger and reaching further in: dark 0.30 to 0.44, light 0.16 to 0.24; sides fade over
  34% of the width (was 28%), bottom over 42% of the height (was 35%). Still not on the top.

## 1.0.3 (candidate: Footer v1.1, awaiting the owner's approval)

- Dark map back to the canon v1 values (land #191715, Voss #1E1C1A); the 1.0.1/1.0.2 bump is undone
  (the difference was phone lighting). Light unchanged.
- Trial: a faint vignette, a soft shade on the left, right and bottom edges (never the top) that
  pulls the eye to the centre. One removable layer (`.fn-vig`) over the map and under the type;
  strength is the `vig` colour in each palette (dark 0.30 black, light 0.16 warm dark). To drop it,
  delete the layer and the `.fn-vig` rule.

## 1.0.2 (candidate: Footer v1.1, awaiting the owner's approval)

- Dark map bumped a few percent, by perceived lightness, so its steps match the light map's
  (light: land about 4.2 units from the footer, Voss about 3.6 further; dark was about 2.4 and 2.5,
  now about 4.2 and 3.9). Dark land #191715 to #1C1A18, Voss #1E1C1A to #232120. Light unchanged.
  (1.0.1 overshot: it matched raw colour numbers and came out too strong.)

## 1.0.0 (canon: Footer v1, approved 2026-10-09)

Same code as 0.6.4, promoted to canon after review on phone (dark and light). Shown on the
-v2 pages for now. Tag: `canon/footer-v1`.

## 0.6.4 (draft, builds on 0.6.3)

- Dark map closer to the footer still, so its contrast is as low as the light map's:
  land #1C1A18 to #191715, Voss #23211F to #1E1C1A (edge still = footer #131210).

## 0.6.3 (draft, builds on 0.6.2)

- The thin rule above the "Voss, Norway" row is removed, so no line runs across the map.
  Spacing is unchanged. (The rule colour stays in the palette in case a version of it returns.)

## 0.6.2 (draft, builds on 0.6.1)

- Dark map brought closer to the light one: the land sits only a small step from the footer, so
  the map reads as relief in the footer and not as a map on a backdrop. Dark land #221F1C to
  #1C1A18, Voss #2D2A26 to #23211F (edge still = footer #131210). Light is unchanged.

## 0.6.1 (draft, builds on 0.6.0)

- Light footer moved about a quarter of the way toward the dark one and neutralised (less warm),
  so both footers feel like the same quiet closing statement. Dark is unchanged.
- Light values: footer #B9B6B0, rule #A3A09A, wordmark #3E3B36, links and small text #4A4742
  (about 4.5:1), underline #8F8C86, map land #AEABA5, Voss #A5A29C, edge = footer.
  Vf mark (black) at 45% on light, 40% (off-white) on dark.
- Previous light values (0.6.0), if a lighter step is wanted: footer #E6E1D8, rule #D2CCC1,
  wordmark #5C5850, links #666259, underline #BDB8AE, land #D6D1C8, Voss #CBC6BD.

## 0.6.0 (draft, builds on 0.5.12)

- Light variant. The shell passes light or dark and the footer fades between palettes (0.35s,
  like the pages). Colours are now CSS variables.
- Light values: footer #E6E1D8 (a warm stone one step darker than the page #F4F2EE), rule #D2CCC1,
  wordmark #5C5850, links and small text #666259 (about 4.7:1, at the readability minimum),
  underline #BDB8AE, map land #D6D1C8, Voss #CBC6BD (a step darker than the land, toward the
  foreground; the step is the same size as in dark), map edge = footer.
- Vf mark: the black version at the same 40% opacity on light pages; off-white on dark.
- Dark values unchanged.

## 0.5.12 (draft, builds on 0.5.11)

- Vf mark opacity set to 40% (was 32%), now that it is smaller on phones.

## 0.5.11 (draft, builds on 0.5.10)

- Vf mark dimmed from 45% to 32% to sit with the type. On phones it is 20% smaller (45px high
  instead of 56px); tablet and desktop keep 56px.

## 0.5.10 (draft, builds on 0.5.9)

- The Vf mark sits on the right on every screen size, with its bottom edge level with the
  "Voss, Norway · © 2026" line (the row no longer stacks on phones).

## 0.5.9 (draft, builds on 0.5.8)

- Fix: on phones the Vf mark was stretched across the whole row (a column layout stretches
  an image to full width). It now keeps its own proportions at every size.

## 0.5.8 (draft, builds on 0.5.7)

- Contrast between Voss and the rest of the map reduced once more (Voss #34302B to #2D2A26; the rest stays #221F1C).

## 0.5.7 (draft, builds on 0.5.6)

- Contrast between Voss and the rest of the map reduced (Voss #48433E to #34302B; the rest stays #221F1C).
  The step is now smaller than the original (#3A352F).

## 0.5.6 (draft, builds on 0.5.5)

- Voss region lightened by about 7% of the range toward white (#3A352F to #48433E). The rest of the map is unchanged.

## 0.5.5 (draft, builds on 0.5.4)

- Map dimmed by five points (opacity 90% to 85%).

## 0.5.4 (draft, builds on 0.5.3)

- Vf mark dimmed back down to 45%. Text unchanged.

## 0.5.3 (draft, builds on 0.5.2)

- Vf mark raised to 62% so it stands out from the map.
- Fonts dimmed further: wordmark #7D7972, links and small text #726E68 (about 3.7:1, below the
  4.5:1 minimum for small text; must be settled before canon).

## 0.5.2 (draft, builds on 0.5.1)

- Fonts dimmed a bit more on request: wordmark #85817A, links and small text #7A766F
  (about 4.1:1, now below the 4.5:1 minimum for small text; to be reviewed before canon).
  Vf mark raised back to 42%.

## 0.5.1 (draft, builds on 0.5.0)

- Dimmer again: wordmark #8F8A82, links and small text #827E77 (about 4.6:1 on the footer
  background, just above the 4.5:1 minimum; do not go lower), underline #2E2C28, Vf mark 30%.

## 0.5.0 (draft, builds on 0.4.0)

- More room above the wordmark (desktop 7rem, tablet 6rem, phone 5rem top padding).
- Dimmer: wordmark #A39E96, links and small text #8F8A82 (about 5.4:1 on the footer
  background, above the 4.5:1 minimum), underline dimmer, Vf mark at 45% opacity.

## 0.4.0 (draft, builds on 0.3.0)

- Mood line removed for now. Its cluster wording (nature, waterfalls, culture, cabin,
  activities, home; three lines each, placeholder) is in 0.3.0 if we want it back.
- Links now: Home, Explore, The Cabin, Contact, Compliance. Contact and Compliance are plain
  text until their pages exist. Activities and the Explore sub-pages are no longer in the footer.
- "Book the cabin" removed. The Vf mark sits in its place (visual try-out; not a link yet).
  Light and dark versions are in public/brand.

## 0.3.0 (draft, builds on 0.2.0)

- A mood line is back (sage left border, no red). It matches the cluster the visitor is in
  (nature, waterfalls, culture, cabin, activities, home) and one of three lines is picked at
  random per visit. Placeholder wording.
- The footer links now follow the main menu order: Culture & History, Observe, Learn,
  Experience, Waterfalls, The Cabin, Activities.
- The shell passes the current address to the footer so it knows the cluster.

## 0.2.0 (draft, builds on 0.1.0)

- Red line and the placeholder quote removed. No red in the footer for now.
- Background is darker than the page (like the mobile menu's register), not lighter.
- Links use the waterfall detail behaviour: dim underline at 3px offset that fades on hover.
- The wordmark is a link to the home page.
- A faint map of Vestland sits behind the footer with Voss picked out lighter, in warm greys.
  Drawn from Kartverket municipality data (see map.ts). Decorative, hidden from screen readers.
- Link list kept as a calm placeholder until the cluster cards come.

## 0.1.0 (draft, first version)

- New footer, dark only, shown on the -v2 pages only. A short red mark, the wordmark,
  one placeholder line of curiosity (sage left border), the places to wander next
  (Waterfalls, Observe, Learn, Experience, Culture & History, The Cabin, Activities),
  and a last row with "Voss, Norway", the year and a "Book the cabin" link.
- Learn and Experience are plain text until their index pages exist.
- Link text uses the body and head colours, not the faint grey.
- Privacy and cookie links are left out on purpose for now.
