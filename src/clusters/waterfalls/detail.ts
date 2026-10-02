// All nine waterfall detail pages, fetched from Sanity at BUILD time and
// mapped onto the finished detail component's content shape.
//
// Media: only Tvindefossen has real media in this round (R2 stills + ambient
// audio). Every other waterfall gets empty image sources, which the component
// renders as correctly sized "image unavailable" boxes. No borrowed photos.

import type { WaterfallContent } from "../../page-types/waterfall/WaterfallDetail";
import {
  buildStaticImage,
  HERO_WIDTHS,
  HEADON_WIDTHS,
  CLOSE_WIDTHS,
  CLOSE_SIZES,
} from "../../lib/tvindefossen";

const SANITY_PROJECT = "h6p17t07";
const SANITY_DATASET = "production";

const QUERY = `*[_type == "waterfall"] | order(name asc){
  name, "slug": slug.current, tagline, heroImagePosition, lede, spiceActive,
  experientialLead, experiential, practicalBody,
  quickFacts[]{label, sub}, planDetails[]{label, body},
  closeupPhoto, widePhoto, nextFall, continueCards
}`;

export type WaterfallDoc = Record<string, any> & { slug: string; name: string };

export async function fetchAllWaterfalls(): Promise<WaterfallDoc[]> {
  const url =
    `https://${SANITY_PROJECT}.api.sanity.io/v2025-02-19/data/query/${SANITY_DATASET}` +
    `?query=${encodeURIComponent(QUERY)}&perspective=published`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status} ${await res.text()}`);
  const docs = (await res.json()).result as WaterfallDoc[];
  if (!docs?.length) throw new Error("Sanity: no waterfall documents found");
  const noSlug = docs.filter((d) => !d.slug);
  if (noSlug.length) {
    throw new Error(`Sanity: waterfall without a slug: ${noSlug.map((d) => d.name).join(", ")}. Every published waterfall needs a slug to get an address.`);
  }
  return docs;
}

// Tvindefossen's pin, as it was hardcoded in the export's map stub.
const TVINDE_LOCATION = { lng: 6.488368, lat: 60.725762 };

export function toContent(doc: WaterfallDoc): WaterfallContent {
  const isTvinde = doc.slug === "tvindefossen";
  const hero = isTvinde ? buildStaticImage("hero", HERO_WIDTHS) : { src: "", srcSet: undefined, sizes: undefined };
  const headon = isTvinde ? buildStaticImage("headon", HEADON_WIDTHS) : { src: "", srcSet: undefined, sizes: undefined };
  const close = isTvinde ? buildStaticImage("close", CLOSE_WIDTHS) : { src: "", srcSet: undefined, sizes: undefined };

  // Two pages (Bordalsgjelet, Rjoandefossen) carry a separate experiential lead
  // plus three paragraphs; the component renders four, so the lead goes first.
  const experiential: string[] = [
    ...(doc.experientialLead ? [doc.experientialLead] : []),
    ...(doc.experiential ?? []),
  ];

  // Most designs only had one flat continue-card list (stored under desktop);
  // tablet and mobile fall back to it rather than rendering nothing.
  const cc = doc.continueCards ?? {};
  const desktop = cc.desktop ?? [];

  return {
    name: doc.name,
    tagline: doc.tagline ?? "",
    heroImage: hero.src,
    heroImageSrcSet: hero.srcSet,
    heroImageSizes: hero.sizes,
    heroImagePosition: doc.heroImagePosition ?? "center 40%",
    closeupPhoto: { src: close.src, srcSet: close.srcSet, sizes: isTvinde ? CLOSE_SIZES : undefined, position: doc.closeupPhoto?.position ?? "center" },
    widePhoto: { src: headon.src, srcSet: headon.srcSet, sizes: headon.sizes, caption: doc.widePhoto?.caption ?? "" },
    lede: doc.lede ?? "",
    spiceActive: {
      label: doc.spiceActive?.label ?? "",
      pullQuote: doc.spiceActive?.pullQuote ?? "",
      body: doc.spiceActive?.body ?? "",
    },
    experiential,
    practicalBody: doc.practicalBody ?? "",
    quickFacts: doc.quickFacts ?? [],
    planDetails: doc.planDetails ?? [],
    // As in the export: the next-fall card borrows this page's close-up. On
    // pages without media that is simply the honest placeholder.
    nextFall: {
      name: doc.nextFall?.name ?? "",
      descriptor: doc.nextFall?.descriptor ?? "",
      hero: { src: close.src, srcSet: close.srcSet, sizes: isTvinde ? CLOSE_SIZES : undefined, position: doc.nextFall?.hero?.position ?? "center" },
    },
    continueCards: {
      desktop,
      tablet: cc.tablet ?? desktop,
      mobile: cc.mobile ?? desktop,
    },
    ambientAudio: isTvinde
      ? { webm: "/audio/tvindefossen/tvinde-ambient.webm", mp4: "/audio/tvindefossen/tvinde-ambient.mp4" }
      : { webm: "", mp4: "" },
    location: isTvinde ? TVINDE_LOCATION : undefined,
  };
}
