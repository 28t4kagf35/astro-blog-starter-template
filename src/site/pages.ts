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

type Base = { path: string; title: string; description?: string; listLabel: string };

export type SitePage =
  | (Base & { type: "waterfall"; content: WaterfallContent })
  | (Base & { type: "masterGuide"; content: MasterGuideContent })
  | (Base & { type: "learnArticle"; content: LearnArticleContent })
  | (Base & { type: "experienceArticle"; content: ExperienceArticleContent })
  | (Base & { type: "cultureFeed"; content: CultureFeedContent })
  | (Base & { type: "observeFeed"; content: ObserveFeedContent })
  | (Base & { type: "previewIndex"; content: { links: Array<{ href: string; label: string }> } });

export const PAGE_TYPES = ["waterfall", "masterGuide", "learnArticle", "experienceArticle", "cultureFeed", "observeFeed", "previewIndex"] as const;

export async function buildSitePages(): Promise<SitePage[]> {
  const pages: SitePage[] = [
    ...(await waterfallsClusterPages()),
    ...(await learnPages()),
    ...(await experiencePages()),
    ...(await observePages()),
    ...(await cultureHistoryPages()),
  ];

  // "/" until Home is built: a list of what exists.
  pages.unshift({
    path: "",
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
