# footer-next: changelog

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
