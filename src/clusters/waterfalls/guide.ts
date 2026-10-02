// Waterfalls Master Guide (/explore/waterfalls): fetched from Sanity at BUILD
// time and mapped onto the finished guide component's content shape.
// Tvindefossen's card uses its real R2 image. The other images come from Sanity:
// for now the design's mockup photos (borrowed Tvindefossen shots, titled
// PLACEHOLDER in the media library), so the page can be judged for style.

import type { MasterGuideContent, GuideFall } from "../../page-types/master-guide/MasterGuide";
import { R2_BASE } from "../../lib/tvindefossen";
import { sanityFetch } from "../../site/sanity";
import { mediaSrc } from "../../site/media";


const QUERY = `*[_type == "masterGuide"][0]{
  "heroId": heroImage.asset->_id, "cabinId": cabinImage.asset->_id,
  heroHeadline, heroSubtitle, heroCtaLabel, orientHeadline, orientLead,
  cabinHeadline, cabinIntro, cabinCtaLabel, closingStatement,
  sections[]{key, label, heading, paragraphs, items},
  falls[]{ "imageId": image.asset->_id, "name": waterfall->name, "slug": waterfall->slug.current, tier, imagePosition,
           micro, blurb, distinguishing, chooserCue, spiceLabel, tags, group, labels },
  chooserTypes[]{ label, copy, "falls": falls[]->name }
}`;

const TVINDE_CARD_IMAGE = `${R2_BASE}/tvinde-hero-1600.webp`;

export async function fetchMasterGuide(): Promise<MasterGuideContent> {
  const d = await sanityFetch<any>(QUERY);
  if (!d) throw new Error("Sanity: masterGuide document not found");

  const falls: GuideFall[] = (d.falls ?? []).filter((f: any) => f.slug).map((f: any) => ({
    name: f.name,
    slug: f.slug,
    tier: f.tier ?? "support",
    image: f.slug === "tvindefossen" ? TVINDE_CARD_IMAGE : mediaSrc(f.imageId),
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
    heroImage: { src: mediaSrc(d.heroId) },
    heroHeadline: d.heroHeadline ?? "",
    heroSubtitle: d.heroSubtitle ?? "",
    heroCtaLabel: d.heroCtaLabel ?? "",
    orientHeadline: d.orientHeadline ?? "",
    orientLead: d.orientLead ?? "",
    cabinImage: { src: mediaSrc(d.cabinId) },
    cabinHeadline: d.cabinHeadline ?? "",
    cabinIntro: d.cabinIntro ?? "",
    cabinCtaLabel: d.cabinCtaLabel ?? "",
    closingStatement: d.closingStatement ?? "",
    falls,
    chooserTypes: (d.chooserTypes ?? []).map((c: any) => ({ label: c.label ?? "", copy: c.copy ?? "", falls: (c.falls ?? []).filter(Boolean) })),
    sections: d.sections ?? [],
  };
}
