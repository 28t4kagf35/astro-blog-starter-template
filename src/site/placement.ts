// Where each kind of page sits in the site, as the small line above a hero
// title. One list for the whole site, so the wording cannot drift between pages.
// (Activity keeps the label from its own content, which includes its category.
// Culture & History has none for now.)
export const PLACEMENT = {
  waterfall: "Explore · Waterfalls",
  learn: "Explore · Nature · Learn",
  experience: "Explore · Nature · Experience",
} as const;
