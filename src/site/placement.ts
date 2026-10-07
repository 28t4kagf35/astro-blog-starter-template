// Where each kind of page sits in the site, as the small line above a hero
// title. One list for the whole site, so the wording cannot drift between pages.
// ("Explore" is left out: the menu already says it. Activity keeps the label from its own content, which includes its category.
// Culture & History has none for now.)
export const PLACEMENT = {
  waterfall: "Waterfalls",
  learn: "Nature · Learn",
  experience: "Nature · Experience",
} as const;
