// Cluster: Explore (the cluster home at /explore). A placeholder grid of its
// sub-clusters. Nature is a container holding Observe, Learn and Experience.
// Page counts come from Sanity. Learn and Experience have no index page yet.
import type { SitePage } from "../../site/pages";
import { sanityFetch } from "../../site/sanity";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export async function explorePages(): Promise<SitePage[]> {
  const counts = await sanityFetch<{ falls: number; culture: number; learn: number; experience: number }>(
    `{ "falls": count(*[_type == "waterfall"]), "culture": count(*[_type == "cultureArticle"]), "learn": count(*[_type == "learnArticle"]), "experience": count(*[_type == "experienceArticle"]) }`,
  );
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
          { label: "Waterfalls", note: `The Voss waterfall guide and ${plural(counts.falls, "waterfall", "waterfalls")}.`, href: "/explore/waterfalls" },
          {
            label: "Nature",
            note: "Observe, learn, experience.",
            children: [
              { label: "Observe", note: "A growing feed of what lives here.", href: "/explore/nature/observe" },
              { label: "Learn", note: plural(counts.learn, "article", "articles") + "." },
              { label: "Experience", note: plural(counts.experience, "article", "articles") + "." },
            ],
          },
          { label: "Culture & History", note: `${plural(counts.culture, "quick, curious fact", "quick, curious facts")} about Norway and Voss.`, href: "/explore/culture-history" },
        ],
      },
    },
  ];
}
