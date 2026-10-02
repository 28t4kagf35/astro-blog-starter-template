// Cluster: Activities (sitemap v2: /activities/<slug>).
import type { SitePage } from "../../site/pages";
import type { ActivityContent } from "../../page-types/activity";
import { sanityFetch, requireSlugs } from "../../site/sanity";

export const ACTIVITIES_PATH = "activities";

type Section = { key: string; heading?: string; paragraphs?: string[]; items?: string[] };
type ActivityDoc = {
  title: string; slug: string; lede?: string; locationLine?: string;
  stats?: Array<{ label: string; value: string }>; highlights?: string[]; sections?: Section[];
};

// "Label · Sub" as stored in Sanity -> { label, sub }.
const pair = (s: string) => {
  const [label, ...rest] = s.split(" · ");
  return { label, sub: rest.join(" · ") };
};

function toContent(d: ActivityDoc): ActivityContent {
  const sec = (key: string): Section => d.sections?.find((s) => s.key === key) ?? { key };
  const block = (key: string) => ({ heading: sec(key).heading ?? "", paragraphs: sec(key).paragraphs ?? [] });
  const variants = sec("LEDE_VARIANTS").paragraphs ?? [];
  const lede = d.lede ?? "";
  return {
    title: d.title,
    breadcrumb: sec("BREADCRUMB").items?.[0] ?? "",
    locationLine: d.locationLine ?? "",
    lede,
    ledeMobile: variants[0] ?? lede,
    ledeTablet: variants[1] ?? lede,
    stats: d.stats ?? [],
    access: block("ACCESS_DURATION"),
    season: block("SEASON_SUITABILITY"),
    onTheRoute: block("ON_THE_ROUTE"),
    highlightsHeading: sec("ALONG_THE_ROUTE").heading ?? "",
    highlights: d.highlights ?? [],
    practical: block("PRACTICAL"),
    exitsHeading: sec("ALSO_IN_ACTIVITIES").heading ?? "",
    exits: (sec("ALSO_IN_ACTIVITIES").items ?? []).map(pair),
    nearbyHeading: sec("NEARBY_NATURE").heading ?? "",
    nearby: (sec("NEARBY_NATURE").items ?? []).map(pair),
  };
}

export async function activityPages(): Promise<SitePage[]> {
  const docs = requireSlugs("activity", await sanityFetch<ActivityDoc[]>(
    `*[_type == "activity"] | order(title asc){ title, "slug": slug.current, lede, locationLine,
      stats[]{label, value}, highlights, sections[]{key, heading, paragraphs, items} }`,
  ));
  return docs.map((d): SitePage => ({
    path: `${ACTIVITIES_PATH}/${d.slug}`,
    type: "activity",
    title: `${d.title} — Voss Waterfalls`,
    description: d.lede,
    listLabel: `Activity — ${d.title}`,
    content: toContent(d),
  }));
}
