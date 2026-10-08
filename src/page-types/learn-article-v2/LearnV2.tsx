// V2 WORKING COPY of ../learn-article/LearnArticle.tsx, for side-by-side comparison at /learn-v2. Design changes go here only.
// Pass 5 ("looking closer"): same family as Experience v2 (compact hero, lede, centred 600px sleek body, sub-quotes), but calmer:
// no bands, no chapter numbers, a reading-time line, thin rules between sections, "Keep looking" closing.
/**
 * Page type: Learn article (Sanity type `learnArticle`).
 * Ported from the design export below; its built-in article is replaced by the
 * `content` prop (Sanity, build time). Differences from the export:
 *  - Hero image: no image yet -> same-size "image unavailable" box.
 *  - Hero pull quote and inline species photos have no Sanity field: the hero
 *    shows the cluster label + the title; inline photos are omitted.
 *  - "Short line" styling uses a length rule instead of a hardcoded list.
 *  - isDark comes from the shell (the export had it fixed to dark).
 *
 * microworlds_20260521_1100 — "Micro Worlds of Voss"
 * Learn cluster · long-form article · responsive · 3 breakpoints
 * EP-1.1 export: CTRL-1 applied · isDark hardened · chrome stripped
 * Slot: learn_20260521_1100
 */

import { PLACEMENT } from "../../site/placement";
import { Hero } from "../../site/Hero";
import { useEffect, useState, type CSSProperties } from "react";
import { useArticleFonts, useBodyVariant, bodyFontStyle, NextCard } from "../../site/article";

// ── Brand constants (inlined) ─────────────────────────────────────────────────
const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_SPEC = "'Spectral', Georgia, serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_LBL  = "'Raleway', system-ui, sans-serif";

const SS4_OPSZ_DISPLAY = '"opsz" 36, "wght" 300';
const SS4_OPSZ_TEXT    = '"opsz" 11, "wght" 300';

const SS4_SMOOTHING: CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

const DARK = {
  bg:      "#1A1714",
  surface: "#222120",
  rule:    "#2C2A28",
  muted:   "#6E6A65",
  body:    "#C4BEB4",
  head:    "#EDE9E2",
  bq:      "#7A8B74",
  accent:  "#D43535",
} as const;

const LIGHT = {
  bg:      "#F4F2EE",
  surface: "#EBE7DF",
  rule:    "#D6D2CB",
  muted:   "#8E8A84",
  body:    "#201E18",
  head:    "#111010",
  bq:      "#A4AE9C",
  accent:  "#D43535",
} as const;

// ── Content shape (supplied from Sanity) ──────────────────────────────────────
export type LearnV2Block = { kind: "paragraph" | "heading" | "break"; text?: string };
export interface LearnV2Content {
  clusterLabel: string;
  title: string;
  subtitle?: string;
  heroImage: string;
  body: LearnV2Block[];
}

// A paragraph this short is set as an emphasised line (the export listed such
// lines by hand for its one article).
const isShortLine = (t: string) => t.length <= 60 && !t.includes("\n");


// ── Breakpoint hook ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const get = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    return w >= 1024 ? "desktop" : w >= 600 ? "tablet" : "mobile";
  };
  const [bp, setBp] = useState<"desktop" | "tablet" | "mobile">("desktop"); // SSR-safe: real value set on mount
  useEffect(() => {
    const h = () => setBp(get());
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

// ── Component ─────────────────────────────────────────────────────────────────
// v2 (pass 1, images): the build downloads four widths of every Sanity image;
// the hero offers all of them and the browser picks one.
const HERO_WIDTHS = [640, 1080, 1600, 2400];
const heroSrcSet = (src: string): string | undefined =>
  src.endsWith("-1600.webp") ? HERO_WIDTHS.map((w) => `${src.replace("-1600.webp", `-${w}.webp`)} ${w}w`).join(", ") : undefined;

export function LearnV2({ content, isDark = true }: { content: LearnV2Content; isDark?: boolean }) {
  useArticleFonts("brand-fonts-learn-v2");
  const bodyVariant = useBodyVariant();

  const bp        = useBreakpoint();
  const isMobile  = bp === "mobile";
  const isTablet  = bp === "tablet";
  const isDesktop = bp === "desktop";

  const PAD_H = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem";
  const SEC   = isMobile ? "3.5rem" : isTablet ? "4.5rem" : "5.5rem";
  const bodySz  = isMobile ? "1.05rem" : isTablet ? "1.1rem" : "1.15rem";
  const lineSz  = isMobile ? "1.12rem" : isTablet ? "1.2rem" : "1.25rem";
  const ledeSz  = isMobile ? "1.3rem"  : isTablet ? "1.45rem" : "1.6rem";
  const headSz  = isMobile ? "1.35rem" : isTablet ? "1.6rem" : "1.85rem";
  const bodyMax = isMobile ? "100%" : "600px";
  const tk = isDark ? DARK : LIGHT;
  const bodyFont = bodyFontStyle(bodyVariant, bodySz);

  // Reading time from the text itself (about 200 words a minute).
  const words = [content.subtitle ?? "", ...content.body.map((b) => b.text ?? "")].join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  // Group consecutive short lines into one quiet sequence; everything else keeps its order.
  type Item = { kind: "heading" | "break" | "lines" | "paragraph"; text?: string; lines?: string[] };
  const items: Item[] = [];
  for (const b of content.body) {
    if (b.kind === "break") { items.push({ kind: "break" }); continue; }
    if (b.kind === "heading") { items.push({ kind: "heading", text: b.text ?? "" }); continue; }
    const t = b.text ?? "";
    if (isShortLine(t)) {
      const last = items[items.length - 1];
      if (last && last.kind === "lines") last.lines!.push(t); else items.push({ kind: "lines", lines: [t] });
    } else {
      items.push({ kind: "paragraph", text: t });
    }
  }

  const firstHeading = items.findIndex((it) => it.kind === "heading");

  return (
    <div data-scroll="root" style={{ ...SS4_SMOOTHING, background: tk.bg, minHeight: "100vh", overflowX: "hidden", transition: "background 0.35s ease" }}>

      {/* ── HERO — shared with the other v2 pages, a calmer height for an article ── */}
      <Hero compact image={content.heroImage} srcSet={heroSrcSet(content.heroImage)} position="center" alt={content.title} title={content.title} placement={PLACEMENT.learn} isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />

      {/* ── ARTICLE: one calm page, a centred 600px column on desktop ── */}
      <div data-bb-field="bodyText" style={{ padding: `${isMobile ? "2.2rem" : isTablet ? "2.6rem" : "2.8rem"} 0 ${SEC}` }}>
        <div style={{ maxWidth: isDesktop ? "calc(600px + 2rem)" : "none", margin: "0 auto", padding: `0 ${PAD_H}`, boxSizing: "border-box" }}>

          {content.subtitle && (
            <div style={{ marginBottom: isMobile ? "2.4rem" : "3.2rem" }}>
              <div style={{ width: 28, height: 2, background: tk.accent, marginBottom: "1.4rem" }} />
              <p style={{ margin: 0, fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 28', fontStyle: "italic", fontWeight: 300, fontSize: ledeSz, lineHeight: 1.45, letterSpacing: "-0.003em", color: tk.head }}>{content.subtitle}</p>
              <p style={{ margin: "1.1rem 0 0", fontFamily: FONT_MONO, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.5, color: tk.muted }}>{minutes} min read</p>
            </div>
          )}

          <div style={{ maxWidth: bodyMax }}>
            {items.map((it, i) => {
              if (it.kind === "break") return <div key={i} style={{ width: 48, height: 1, background: tk.rule, margin: "2.4rem 0" }} />;
              if (it.kind === "heading") {
                return (
                  <div key={i} style={{ marginTop: i === firstHeading && i === 0 ? 0 : "3.6rem", paddingTop: i === 0 ? 0 : "2.2rem", borderTop: i === 0 ? "none" : `1px solid ${tk.rule}`, marginBottom: "1.5rem" }}>
                    <h2 style={{ margin: 0, fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 36, "wght" 300', fontStyle: "italic", fontWeight: 300, fontSize: headSz, lineHeight: 1.2, letterSpacing: "-0.005em", color: tk.head }}>{it.text}</h2>
                  </div>
                );
              }
              if (it.kind === "lines") {
                return (
                  <div key={i} style={{ margin: "2.6rem 0", paddingLeft: isMobile ? "1.1rem" : "1.5rem", borderLeft: `2px solid ${tk.bq}` }}>
                    {it.lines!.map((line, j) => (
                      <p key={j} style={{ margin: j === 0 ? 0 : "0.8rem 0 0", fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 16', fontStyle: "italic", fontWeight: 400, fontSize: lineSz, lineHeight: 1.55, color: tk.head }}>{line}</p>
                    ))}
                  </div>
                );
              }
              return <p key={i} style={{ margin: "0 0 1.6rem", ...bodyFont, color: tk.body, whiteSpace: "pre-line" }}>{it.text}</p>;
            })}
          </div>

          {/* ── Closing ── */}
          <div style={{ marginTop: SEC, paddingTop: "2.2rem", borderTop: `1px solid ${tk.rule}` }}>
            <p style={{ margin: "0 0 1.2rem", fontFamily: FONT_LBL, fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.6, color: tk.muted }}>Keep looking</p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              {["Observe · see it closer", "Experience · go and feel it"].map((label, i) => <NextCard key={i} label={label} tk={tk} bg={tk.bg} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
