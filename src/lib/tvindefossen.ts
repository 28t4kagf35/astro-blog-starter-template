// Tvindefossen media helpers: image addresses on R2 (pre-baked variants) and
// the on-request /img/ route.

export const R2_BASE = "https://pub-fd4b2549c703402ea7ec95adbd09f66d.r2.dev";

export const HERO_WIDTHS = [640, 1080, 1600, 2400];
export const HEADON_WIDTHS = [640, 1080, 1600, 2000];
export const CLOSE_WIDTHS = [480, 800, 1200];
export const CLOSE_SIZES = "(min-width: 900px) 45vw, 100vw";

export type ImgSet = { src: string; srcSet?: string; sizes?: string };
export type Role = "hero" | "headon" | "close";

// Pre-baked, build-time-generated responsive variants served straight from R2.
// NOTE: bucket objects were uploaded under the "tvinde-" prefix (not the full
// "tvindefossen-" slug) for this test round -- see the doc's media-pipeline
// section for why. Update this prefix if the bucket is ever re-uploaded with
// the full slug (the naming convention we actually want going forward).
const R2_PREFIX = "tvinde";

export function buildStaticImage(role: Role, widths: number[]): ImgSet {
  const srcSet = widths.map((w) => `${R2_BASE}/${R2_PREFIX}-${role}-${w}.webp ${w}w`).join(", ");
  return {
    src: `${R2_BASE}/${R2_PREFIX}-${role}-${widths[widths.length - 1]}.jpg`,
    srcSet,
    sizes: "100vw",
  };
}

// One clean original per role, resized/reformatted on request via the /img/
// Worker route (cf.image), so the browser negotiates format via Accept.
export function buildDynamicImage(role: Role, widths: number[]): ImgSet {
  const original = `${R2_PREFIX}-${role}-original.jpg`;
  const srcSet = widths.map((w) => `/img/${w}/${original} ${w}w`).join(", ");
  return {
    src: `/img/${widths[widths.length - 1]}/${original}`,
    srcSet,
    sizes: "100vw",
  };
}
