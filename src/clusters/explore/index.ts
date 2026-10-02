// Cluster: Explore (the cluster home at /explore). A placeholder grid of its
// sub-clusters for now. Nature has no page yet, so its tile is not a link.
import type { SitePage } from "../../site/pages";

export async function explorePages(): Promise<SitePage[]> {
  return [
    {
      path: "explore",
      type: "exploreHome",
      title: "Explore — Voss Waterfalls",
      listLabel: "Explore — cluster home",
      content: {
        heading: "Explore",
        intro: "Placeholder: the waterfalls, the nature around them, and the stories of the place.",
        tiles: [
          { label: "Waterfalls", note: "The Voss waterfall guide.", href: "/explore/waterfalls" },
          { label: "Nature", note: "Observe, learn, experience." },
          { label: "Culture & History", note: "Quick, curious facts about Norway and Voss.", href: "/explore/culture-history" },
        ],
      },
    },
  ];
}
