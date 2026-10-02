// Cluster: Culture & History (sitemap v2: /explore/culture-history/<slug>).
// A snack-card feed: one feed page at /explore/culture-history, and one
// address per card that opens the same feed at that card.
import type { SitePage } from "../../site/pages";
import type { CultureFeedContent } from "../../page-types/culture-feed";
import { sanityFetch, requireSlugs } from "../../site/sanity";

export const CULTURE_PATH = "explore/culture-history";

type Doc = { title: string; slug: string; teaser?: string[]; expanded?: string[] };

// Sanity has no order field for the cards yet: the design export's card order
// is used; cards it does not list follow alphabetically.
const DESIGN_ORDER = [
  "friluftsliv",
  "trollveggen",
  "sami-hunters-herders-from-pre-history",
  "when-the-cold-are-the-caring",
  "norway-tiny-history",
  "orange-in-the-snow",
  "huldra",
  "norwegian-clothing-local-costume-to-tech-gear",
  "no-such-thing",
  "energy-and-wealth-from-survival-to-surplus",
  "bergen",
  "sheep-in-the-west-reindeer-in-the-north",
  "jul-nisse",
  "voss",
  "a-viking-legacy-that-lives",
];

export async function cultureHistoryPages(): Promise<SitePage[]> {
  const docs = requireSlugs(
    "cultureArticle",
    await sanityFetch<Doc[]>(`*[_type == "cultureArticle"] | order(title asc){ title, "slug": slug.current, teaser, expanded }`),
  );
  const rank = (slug: string) => {
    const i = DESIGN_ORDER.indexOf(slug);
    return i < 0 ? DESIGN_ORDER.length : i;
  };
  docs.sort((a, b) => rank(a.slug) - rank(b.slug));

  const cards = docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    teaser: d.teaser ?? [],
    expanded: d.expanded ?? [],
    image: "",
    imagePosition: "center",
  }));
  const feed = (focusSlug?: string): CultureFeedContent => ({
    heroImage: { src: "", position: "center 25%" },
    cards,
    focusSlug,
  });

  return [
    {
      path: CULTURE_PATH,
      type: "cultureFeed",
      title: "Culture & History — Voss Waterfalls",
      description: "Quick, curious facts about Norway and Voss.",
      listLabel: "Culture & History — feed",
      content: feed(),
    },
    ...docs.map((d): SitePage => ({
      path: `${CULTURE_PATH}/${d.slug}`,
      type: "cultureFeed",
      title: `${d.title} — Culture & History — Voss Waterfalls`,
      description: d.teaser?.[0],
      listLabel: `Culture & History — ${d.title}`,
      content: feed(d.slug),
    })),
  ];
}
