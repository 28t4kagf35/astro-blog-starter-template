// The 15 story pages of Culture v5, built from the same cards as the index (preview: /culture-v5/<story>).
import type { SitePage } from "../../site/pages";
import { ORDER, type CultureCardV5 } from "../culture-feed-v5/CultureFeedV5";
import type { CultureStoryV5Content } from "./CultureStoryV5";

const BASE = "culture-v5";

function snippet(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= 155) return t;
  const cut = t.slice(0, 155);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 100)).replace(/[,.;:\-–—\s]+$/, "") + "…";
}

export function cultureStoryV5Pages(cards: CultureCardV5[]): SitePage[] {
  const rank = (slug: string) => { const i = ORDER.indexOf(slug); return i < 0 ? ORDER.length : i; };
  const stories = [...cards].sort((a, b) => rank(a.slug) - rank(b.slug));
  return stories.map((s, i): SitePage => {
    const ref = (c?: CultureCardV5) => (c ? { slug: c.slug, title: c.title } : undefined);
    const content: CultureStoryV5Content = {
      story: s, index: i + 1, total: stories.length, prev: ref(stories[i - 1]), next: ref(stories[i + 1]), basePath: `/${BASE}`,
    };
    return {
      path: `${BASE}/${s.slug}`,
      type: "cultureStoryV5",
      title: `${s.title} — Culture & History — Voss Waterfalls`,
      description: snippet(s.teaser[0]),
      listLabel: `Culture v5 — ${s.title}`,
      content,
    };
  });
}
