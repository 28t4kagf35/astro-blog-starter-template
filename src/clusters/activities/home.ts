// The Activities cluster home at /activities: a simplified placeholder grid.
// Only Kiellandbu exists at launch; the other activities are not authored yet.
import type { SitePage } from "../../site/pages";

export async function activitiesHomePages(): Promise<SitePage[]> {
  return [
    {
      path: "activities",
      type: "activitiesHome",
      title: "Activities — Voss Waterfalls",
      listLabel: "Activities — cluster home",
      content: {
        heading: "Activities",
        intro: "Placeholder: things to do around Voss.",
        tiles: [{ label: "Kiellandbu", note: "A ridge hike close to Hamlagrø.", href: "/activities/kiellandbu" }],
        footnote: "More activities are on the way.",
      },
    },
  ];
}
