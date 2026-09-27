// Shared between the static (build-time, prerendered) Tvindefossen page and
// the /dynamic (on-demand) comparison page: the Sanity fetch and the two
// image-URL strategies being A/B'd for the media-pipeline test.

const SANITY_PROJECT = "h6p17t07"; // vssw-sept2026
const SANITY_DATASET = "production";
const QUERY = `*[_type == "waterfall" && name == "Tvindefossen"][0]{
  name, tagline, heroImagePosition, lede, spiceActive, experiential,
  practicalBody, quickFacts[]{label, sub}, planDetails[]{label, body},
  closeupPhoto, widePhoto, nextFall, continueCards
}`;

export async function fetchTvindefossenDoc() {
  const url =
    `https://${SANITY_PROJECT}.api.sanity.io/v2025-02-19/data/query/${SANITY_DATASET}` +
    `?query=${encodeURIComponent(QUERY)}&perspective=published`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status} ${await res.text()}`);
  const doc = (await res.json()).result;
  if (!doc) throw new Error("Sanity: Tvindefossen waterfall document not found");
  return doc;
}

export const R2_BASE = "https://pub-fd4b2549c703402ea7ec95adbd09f66d.r2.dev";

export const HERO_WIDTHS = [640, 1080, 1600, 2400];
export const HEADON_WIDTHS = [640, 1080, 1600, 2000];
export const CLOSE_WIDTHS = [480, 800, 1200];
export const CLOSE_SIZES = "(min-width: 900px) 45vw, 100vw";

export type ImgSet = { src: string; srcSet?: string; sizes?: string };
export type Role = "hero" | "headon" | "close";

// Pre-baked, build-time-generated responsive variants served straight from R2.
export function buildStaticImage(role: Role, widths: number[]): ImgSet {
  const srcSet = widths.map((w) => `${R2_BASE}/tvindefossen-${role}-${w}.webp ${w}w`).join(", ");
  return {
    src: `${R2_BASE}/tvindefossen-${role}-${widths[widths.length - 1]}.jpg`,
    srcSet,
    sizes: "100vw",
  };
}

// One clean original per role, resized/reformatted on request via the /img/
// Worker route (cf.image), so the browser negotiates format via Accept.
export function buildDynamicImage(role: Role, widths: number[]): ImgSet {
  const original = `tvindefossen-${role}-original.jpg`;
  const srcSet = widths.map((w) => `/img/${w}/${original} ${w}w`).join(", ");
  return {
    src: `/img/${widths[widths.length - 1]}/${original}`,
    srcSet,
    sizes: "100vw",
  };
}
