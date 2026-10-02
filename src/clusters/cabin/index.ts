// Cluster: The Cabin (sitemap v2: /the-cabin), from the Sanity document `cabinPage`.
import type { SitePage } from "../../site/pages";
import type { CabinContent } from "../../page-types/cabin";
import { sanityFetch } from "../../site/sanity";

type Section = { key: string; heading?: string; label?: string; paragraphs?: string[]; items?: string[] };
type CabinDoc = { amenities?: Array<{ title: string; items?: string[] }>; sections?: Section[] };

export async function cabinPages(): Promise<SitePage[]> {
  const d = await sanityFetch<CabinDoc | null>(
    `*[_type == "cabinPage"][0]{ amenities[]{title, items}, sections[]{key, heading, label, paragraphs, items} }`,
  );
  if (!d) return [];
  const sec = (key: string): Section => d.sections?.find((s) => s.key === key) ?? { key };
  const place = sec("B2_PLACE"), rivers = sec("B2_RIVERS"), longing = sec("B4_LONGING");
  const content: CabinContent = {
    heroLabel: sec("B1_ARRIVAL").label ?? "",
    placeHeading: place.heading ?? "",
    placeParagraphs: place.paragraphs ?? [],
    riversHeading: rivers.heading ?? "",
    riversLine: rivers.paragraphs?.[0] ?? "",
    gorgeCaption: rivers.paragraphs?.[1] ?? "",
    cascadeCaption: rivers.paragraphs?.[2] ?? "",
    ritual: sec("B3_RITUAL").paragraphs ?? [],
    longingLine: longing.paragraphs?.[0] ?? "",
    longingClosing: longing.paragraphs?.[1] ?? "",
    insideLabel: sec("B5_MASONRY").items?.[0] ?? "",
    stayLabel: sec("B6_TO_STAY").label ?? "",
    amenitiesHeading: sec("B6_TO_STAY").heading ?? "",
    amenities: (d.amenities ?? []).map((a) => ({ title: a.title, items: a.items ?? [] })),
    guestNote: sec("B6_GUEST_NOTE").paragraphs?.[0] ?? "",
    guestNoteAttribution: sec("B6_GUEST_NOTE").label ?? "",
    closeHeading: sec("B7_CLOSE").heading ?? "",
  };
  return [{
    path: "the-cabin",
    type: "cabin",
    title: "The Cabin — Voss Waterfalls",
    description: place.paragraphs?.[0],
    listLabel: "The Cabin",
    content,
  }];
}
