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
import type { HomeV2Content } from "../page-types/home-v2";
import type { CultureFeedV2Content } from "../page-types/culture-feed-v2";
import type { ObserveFeedV2Content } from "../page-types/observe-feed-v2";
import type { ActivityV2Content } from "../page-types/activity-v2";
import type { LearnV2Content } from "../page-types/learn-article-v2";
import type { ExperienceV2Content } from "../page-types/experience-article-v2";
import type { CabinV2Content } from "../page-types/cabin-v2";
import { cabinPages } from "../clusters/cabin";
import type { ExploreHomeContent } from "../page-types/explore-home";
import { explorePages } from "../clusters/explore";
import type { ActivitiesHomeContent } from "../page-types/activities-home";
import { activitiesHomePages } from "../clusters/activities/home";

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
  | (Base & { type: "homeV2"; content: HomeV2Content })
  | (Base & { type: "learnV2"; content: LearnV2Content })
  | (Base & { type: "cultureV2"; content: CultureFeedV2Content })
  | (Base & { type: "observeV2"; content: ObserveFeedV2Content })
  | (Base & { type: "activityV2"; content: ActivityV2Content })
  | (Base & { type: "experienceV2"; content: ExperienceV2Content })
  | (Base & { type: "cabinV2"; content: CabinV2Content })
  | (Base & { type: "exploreHome"; content: ExploreHomeContent })
  | (Base & { type: "activitiesHome"; content: ActivitiesHomeContent })
  | (Base & { type: "previewIndex"; content: { links: Array<{ href: string; label: string }> } });

export const PAGE_TYPES = ["waterfall", "masterGuide", "learnArticle", "experienceArticle", "cultureFeed", "observeFeed", "activity", "home", "cabin", "homeV2", "cabinV2", "learnV2", "experienceV2", "cultureV2", "observeV2", "activityV2", "exploreHome", "activitiesHome", "previewIndex"] as const;

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
    ...(await explorePages()),
    ...(await activitiesHomePages()),
  ];

  // Working copies for side-by-side comparison (/home-v2, /cabin-v2): same
  // content as the originals, own page type. Remove when a v2 is approved
  // and swapped in.
  for (const p of [...pages]) {
    if (p.type === "home") pages.push({ ...p, path: "home-v2", type: "homeV2", title: `${p.title} (v2)`, listLabel: `${p.listLabel} (v2)`, content: p.content as HomeV2Content });
    if (p.type === "learnArticle" && !pages.some((x) => x.type === "learnV2")) pages.push({ ...p, path: "learn-v2", type: "learnV2", title: `${p.title} (v2)`, listLabel: `${p.listLabel} (v2)`, content: p.content as unknown as LearnV2Content });
    if (p.type === "experienceArticle" && !pages.some((x) => x.type === "experienceV2")) pages.push({ ...p, path: "experience-v2", type: "experienceV2", title: `${p.title} (v2)`, listLabel: `${p.listLabel} (v2)`, content: p.content as unknown as ExperienceV2Content });
    if (p.type === "cultureFeed" && !pages.some((x) => x.type === "cultureV2")) pages.push({ ...p, path: "culture-v2", type: "cultureV2", title: `${p.title} (v2)`, listLabel: `${p.listLabel} (v2)`, content: p.content as unknown as CultureFeedV2Content });
    if (p.type === "observeFeed" && !pages.some((x) => x.type === "observeV2")) pages.push({ ...p, path: "observe-v2", type: "observeV2", title: `${p.title} (v2)`, listLabel: `${p.listLabel} (v2)`, content: p.content as unknown as ObserveFeedV2Content });
    if (p.type === "activity" && !pages.some((x) => x.type === "activityV2")) pages.push({ ...p, path: "activity-v2", type: "activityV2", title: `${p.title} (v2)`, listLabel: `${p.listLabel} (v2)`, content: p.content as unknown as ActivityV2Content });
    if (p.type === "cabin") pages.push({ ...p, path: "cabin-v2", type: "cabinV2", title: `${p.title} (v2)`, listLabel: `${p.listLabel} (v2)`, content: p.content as CabinV2Content });
  }

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
