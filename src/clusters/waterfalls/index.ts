// Cluster: Waterfalls (sitemap v2: /explore/waterfalls = Master Guide,
// /explore/waterfalls/<slug> = detail pages). Everything only this cluster
// shares lives here: its addresses and how its pages are loaded from Sanity.
import type { SitePage } from "../../site/pages";
import { fetchAllWaterfalls, toContent } from "./detail";
import { fetchMasterGuide } from "./guide";

export const WATERFALLS_PATH = "explore/waterfalls";

export async function waterfallsClusterPages(): Promise<SitePage[]> {
  const [docs, guide] = await Promise.all([fetchAllWaterfalls(), fetchMasterGuide()]);
  return [
    {
      path: WATERFALLS_PATH,
      type: "masterGuide",
      title: `${guide.heroHeadline} — Voss Waterfalls`,
      description: guide.heroSubtitle,
      listLabel: `Master Guide — ${guide.heroHeadline}`,
      content: guide,
    },
    ...docs.map((doc): SitePage => {
      const content = toContent(doc);
      return {
        path: `${WATERFALLS_PATH}/${doc.slug}`,
        type: "waterfall",
        title: `${content.name} — Voss Waterfalls`,
        description: content.lede,
        listLabel: content.name,
        content,
      };
    }),
  ];
}
