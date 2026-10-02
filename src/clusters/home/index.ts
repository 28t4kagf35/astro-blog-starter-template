// Home ("/"), from the Sanity document `homePage`.
import type { SitePage } from "../../site/pages";
import type { HomeContent } from "../../page-types/home";
import { sanityFetch } from "../../site/sanity";

type Section = { key: string; heading?: string; label?: string; paragraphs?: string[]; items?: string[] };
type HomeDoc = { heroHeadline?: string; heroSubtitle?: string; evidenceQuote?: string; evidenceAttribution?: string; sections?: Section[] };

export async function homePages(): Promise<SitePage[]> {
  const d = await sanityFetch<HomeDoc | null>(
    `*[_type == "homePage"][0]{ heroHeadline, heroSubtitle, evidenceQuote, evidenceAttribution,
      sections[]{key, heading, label, paragraphs, items} }`,
  );
  if (!d) return [];
  const sec = (key: string): Section => d.sections?.find((s) => s.key === key) ?? { key };
  const door = (key: string) => ({ label: sec(key).heading ?? "", note: sec(key).label ?? "", tagline: sec(key).paragraphs?.[0] ?? "" });
  const depth = sec("B2_DEPTH");
  const content: HomeContent = {
    heroLabel: sec("B1_WORLD").label ?? "",
    heroHeadline: d.heroHeadline ?? "",
    heroSubtitle: d.heroSubtitle ?? "",
    heroSubtitleMobile: sec("B1_WORLD").paragraphs?.[0] ?? d.heroSubtitle ?? "",
    depthHeading: depth.heading ?? "",
    mosaicLabels: depth.items ?? [],
    depthStatement: depth.paragraphs?.[0] ?? "",
    depthAside: depth.paragraphs?.[1] ?? "",
    doorsHeading: depth.paragraphs?.[2] ?? "",
    doors: ["B3_DOOR_WATERFALLS", "B3_DOOR_LAND", "B3_DOOR_CABIN"].map(door).filter((x) => x.label),
    evidenceLabel: sec("B4_EVIDENCE").label ?? "",
    evidenceQuote: d.evidenceQuote ?? "",
    evidenceAttribution: d.evidenceAttribution ?? "",
    evidenceCta: sec("B4_EVIDENCE").items?.[0] ?? "",
    seasonLead: sec("B5_SEASON").heading ?? "",
    seasonLines: sec("B5_SEASON").paragraphs ?? [],
    footerNav: sec("B5_FOOTER_NAV").items ?? [],
  };
  return [{
    path: "",
    type: "home",
    title: "Voss Waterfalls",
    description: (d.heroSubtitle ?? "").replace(/\n/g, " "),
    listLabel: "Home",
    content,
  }];
}
