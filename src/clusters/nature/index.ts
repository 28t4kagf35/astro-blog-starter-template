// Cluster: Nature (sitemap v2: /explore/nature/learn/<slug>,
// /explore/nature/experience/<slug>, /explore/nature/observe).
import type { SitePage } from "../../site/pages";
import { sanityFetch, requireSlugs } from "../../site/sanity";
import { mediaSrc } from "../../site/media";

export const NATURE_PATH = "explore/nature";

type ArticleDoc = { title: string; slug: string; subtitle?: string; heroId?: string; body?: Array<{ kind: "paragraph" | "heading" | "break"; text?: string }> };

const articleQuery = (type: string) =>
  `*[_type == "${type}"] | order(title asc){ title, "slug": slug.current, subtitle, "heroId": heroImage.asset->_id, body[]{kind, text} }`;

const firstParagraph = (d: ArticleDoc) => d.body?.find((b) => b.kind === "paragraph" && b.text)?.text;

export async function learnPages(): Promise<SitePage[]> {
  const docs = requireSlugs("learnArticle", await sanityFetch<ArticleDoc[]>(articleQuery("learnArticle")));
  return docs.map((d): SitePage => ({
    path: `${NATURE_PATH}/learn/${d.slug}`,
    type: "learnArticle",
    title: `${d.title} — Voss Waterfalls`,
    description: firstParagraph(d),
    listLabel: `Learn — ${d.title}`,
    content: { clusterLabel: "Learn", title: d.title, subtitle: d.subtitle ?? undefined, heroImage: mediaSrc(d.heroId), body: d.body ?? [] },
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
    content: { clusterLabel: "Experience · Voss", title: d.title, subtitle: d.subtitle ?? undefined, heroImage: mediaSrc(d.heroId), body: d.body ?? [] },
  }));
}

// Width / height of a page image, read from its Sanity asset id ("image-<hash>-<w>x<h>-<ext>").
const ratioOf = (assetId?: string): number | undefined => {
  const m = assetId?.match(/-(\d+)x(\d+)-[a-z]+$/);
  return m ? Number(m[1]) / Number(m[2]) : undefined;
};

export async function observePages(): Promise<SitePage[]> {
  const doc = await sanityFetch<{ title?: string; blocks?: Array<{ _key: string; caption?: string; mediaFilename?: string; section?: string; imageId?: string }> } | null>(
    `*[_type == "observePage"][0]{ title, blocks[]{ _key, caption, mediaFilename, section, "imageId": image.asset->_id } }`,
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
        // The live feed shows approved, captioned blocks only. Uncaptioned pictures added for design work
        // (Sanity section "Design set") are carried in `allBlocks` for the experimental feed pages.
        blocks: (doc.blocks ?? []).filter((b) => (b.caption ?? "").trim() !== "").map((b) => ({ id: b._key, image: mediaSrc(b.imageId), mediaFilename: b.mediaFilename, caption: b.caption ?? "", section: b.section, ratio: ratioOf(b.imageId) })),
        allBlocks: (doc.blocks ?? []).map((b) => ({ id: b._key, image: mediaSrc(b.imageId), mediaFilename: b.mediaFilename, caption: b.caption ?? "", section: b.section, ratio: ratioOf(b.imageId) })),
      } as { blocks: Array<{ id: string; image: string; mediaFilename?: string; caption: string; section?: string; ratio?: number }> },
    },
  ];
}
