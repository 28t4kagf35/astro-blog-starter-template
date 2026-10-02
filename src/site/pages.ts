// The site's page list: every address the front controller
// (src/pages/[...path].astro) builds, gathered from the clusters.
// A page type appears here only once it is registered in the front controller.
import type { WaterfallContent } from "../page-types/waterfall";
import type { MasterGuideContent } from "../page-types/master-guide";
import type { LearnArticleContent } from "../page-types/learn-article";
import { waterfallsClusterPages } from "../clusters/waterfalls";
import type { ExperienceArticleContent } from "../page-types/experience-article";
import type { CultureFeedContent } from "../page-types/culture-feed";
import type { ObserveFeedContent } from "../page-types/observe-feed";
import { learnPages, experiencePages, observePages } from "../clusters/nature";
import { cultureHistoryPages } from "../clusters/culture-history";
import type { ActivityContent } from "../page-types/activity";
import { activityPages } from "../clusters/activities";
import type { HomeContent } from "../page-types/home";
import { homePages } from "../clusters/home";
import type { CabinContent } from "../page-types/cabin";
import { cabinPages } from "../clusters/cabin";

type Base = { path: string; title: string; description?: string; listLabel: string };

export type SitePage =
  | (Base & { type: "waterfall"; content: WaterfallContent })
  | (Base & { type: "masterGuide"; content: MasterGuideContent })
  | (Base & { type: "learnArticle"; content: LearnArticleContent })
  | (Base & { type: "experienceArticle"; content: ExperienceArticleContent })
  | (Base & { type: "cultureFeed"; content: CultureFeedContent })
  | (Base & { type: "observeFeed"; content: ObserveFeedContent })
  | (Base & { type: "activity"; content: ActivityContent })
  | (Base & { type: "home"; content: HomeContent })
  | (Base & { type: "cabin"; content: CabinContent })
  | (Base & { type: "previewIndex"; content: { links: Array<{ href: string; label: string }> } });

export const PAGE_TYPES = ["waterfall", "masterGuide", "learnArticle", "experienceArticle", "cultureFeed", "observeFeed", "activity", "home", "cabin", "previewIndex"] as const;

export async function buildSitePages(): Promise<SitePage[]> {
  const pages: SitePage[] = [
    ...(await homePages()),
    ...(await waterfallsClusterPages()),
    ...(await learnPages()),
    ...(await experiencePages()),
    ...(await observePages()),
    ...(await cultureHistoryPages()),
    ...(await activityPages()),
    ...(await cabinPages()),
  ];

  // "/preview": a plain list of every page, for walking the site before the
  // menu and the links between pages exist.
  pages.push({
    path: "preview",
    type: "previewIndex",
    title: "Voss Waterfalls — preview",
    listLabel: "Preview index",
    content: { links: pages.map((p) => ({ href: `/${p.path}`, label: p.listLabel })) },
  });

  const seen = new Map<string, string>();
  for (const p of pages) {
    if (seen.has(p.path)) {
      throw new Error(`Two pages claim the address "/${p.path}": "${seen.get(p.path)}" and "${p.title}".`);
    }
    seen.set(p.path, p.title);
  }
  return pages;
}
