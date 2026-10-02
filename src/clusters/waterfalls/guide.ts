// Waterfalls Master Guide (/explore/waterfalls): fetched from Sanity at BUILD
// time and mapped onto the finished guide component's content shape.
// Only Tvindefossen has a real image (R2). The design's borrowed photos for the
// hero, the other cards and the cabin band are not carried over.

import type { MasterGuideContent, GuideFall } from "../../page-types/master-guide/MasterGuide";
import { R2_BASE } from "../../lib/tvindefossen";

const SANITY_PROJECT = "h6p17t07";
const SANITY_DATASET = "production";

const QUERY = `*[_type == "masterGuide"][0]{
  heroHeadline, heroSubtitle, heroCtaLabel, orientHeadline, orientLead,
  cabinHeadline, cabinIntro, cabinCtaLabel, closingStatement,
  sections[]{key, label, heading, paragraphs, items},
  falls[]{ "name": waterfall->name, "slug": waterfall->slug.current, tier, imagePosition,
           micro, blurb, distinguishing, chooserCue, spiceLabel, tags, group, labels },
  chooserTypes[]{ label, copy, "falls": falls[]->name }
}`;

const TVINDE_CARD_IMAGE = `${R2_BASE}/tvinde-hero-1600.webp`;

export async function fetchMasterGuide(): Promise<MasterGuideContent> {
  const url =
    `https://${SANITY_PROJECT}.api.sanity.io/v2025-02-19/data/query/${SANITY_DATASET}` +
    `?query=${encodeURIComponent(QUERY)}&perspective=published`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status} ${await res.text()}`);
  const d = (await res.json()).result;
  if (!d) throw new Error("Sanity: masterGuide document not found");

  const falls: GuideFall[] = (d.falls ?? []).filter((f: any) => f.slug).map((f: any) => ({
    name: f.name,
    slug: f.slug,
    tier: f.tier ?? "support",
    image: f.slug === "tvindefossen" ? TVINDE_CARD_IMAGE : "",
    imagePosition: f.imagePosition ?? "center",
    micro: f.micro ?? "",
    blurb: f.blurb ?? "",
    distinguishing: f.distinguishing ?? "",
    chooserCue: f.chooserCue ?? "",
    spice: f.spiceLabel ?? "",
    tags: f.tags ?? [],
    group: f.group ?? "",
    labels: f.labels ?? [],
  }));

  return {
    heroImage: { src: "" },
    heroHeadline: d.heroHeadline ?? "",
    heroSubtitle: d.heroSubtitle ?? "",
    heroCtaLabel: d.heroCtaLabel ?? "",
    orientHeadline: d.orientHeadline ?? "",
    orientLead: d.orientLead ?? "",
    cabinImage: { src: "" },
    cabinHeadline: d.cabinHeadline ?? "",
    cabinIntro: d.cabinIntro ?? "",
    cabinCtaLabel: d.cabinCtaLabel ?? "",
    closingStatement: d.closingStatement ?? "",
    falls,
    chooserTypes: (d.chooserTypes ?? []).map((c: any) => ({ label: c.label ?? "", copy: c.copy ?? "", falls: (c.falls ?? []).filter(Boolean) })),
    sections: d.sections ?? [],
  };
}
