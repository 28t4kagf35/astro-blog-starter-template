// Cluster: Nature (sitemap v2: /explore/nature/learn/<slug>,
// /explore/nature/experience/<slug>, /explore/nature/observe).
import type { SitePage } from "../../site/pages";
import { sanityFetch, requireSlugs } from "../../site/sanity";

export const NATURE_PATH = "explore/nature";

type ArticleDoc = { title: string; slug: string; subtitle?: string; body?: Array<{ kind: "paragraph" | "heading" | "break"; text?: string }> };

const articleQuery = (type: string) =>
  `*[_type == "${type}"] | order(title asc){ title, "slug": slug.current, subtitle, body[]{kind, text} }`;

const firstParagraph = (d: ArticleDoc) => d.body?.find((b) => b.kind === "paragraph" && b.text)?.text;

export async function learnPages(): Promise<SitePage[]> {
  const docs = requireSlugs("learnArticle", await sanityFetch<ArticleDoc[]>(articleQuery("learnArticle")));
  return docs.map((d): SitePage => ({
    path: `${NATURE_PATH}/learn/${d.slug}`,
    type: "learnArticle",
    title: `${d.title} — Voss Waterfalls`,
    description: firstParagraph(d),
    listLabel: `Learn — ${d.title}`,
    content: { clusterLabel: "Learn", title: d.title, subtitle: d.subtitle ?? undefined, heroImage: "", body: d.body ?? [] },
  }));
}

export async function experiencePages(): Promise<SitePage[]> {
  const docs = requireSlugs("experienceArticle", await sanityFetch<ArticleDoc[]>(articleQuery("experienceArticle")));
  return docs.map((d): SitePage => ({
    path: `${NATURE_PATH}/experience/${d.slug}`,
    type: "experienceArticle",
    title: `${d.title} — Voss Waterfalls`,
    description: firstParagraph(d),
    listLabel: `Experience — ${d.title}`,
    content: { clusterLabel: "Experience · Voss", title: d.title, subtitle: d.subtitle ?? undefined, heroImage: "", body: d.body ?? [] },
  }));
}

export async function observePages(): Promise<SitePage[]> {
  const doc = await sanityFetch<{ title?: string; blocks?: Array<{ _key: string; caption?: string; mediaFilename?: string }> } | null>(
    `*[_type == "observePage"][0]{ title, blocks[]{ _key, caption, mediaFilename } }`,
  );
  if (!doc) return [];
  const title = doc.title ?? "Observe";
  return [
    {
      path: `${NATURE_PATH}/observe`,
      type: "observeFeed",
      title: `${title} — Voss Waterfalls`,
      description: doc.blocks?.[0]?.caption,
      listLabel: `${title} — feed`,
      content: {
        blocks: (doc.blocks ?? []).map((b) => ({ id: b._key, image: "", mediaFilename: b.mediaFilename, caption: b.caption ?? "" })),
      },
    },
  ];
}
