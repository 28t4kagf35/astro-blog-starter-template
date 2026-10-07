// V2 WORKING COPY of ../experience-article/ExperienceArticle.tsx, for side-by-side comparison at /experience-v2. Design changes go here only.
// Pass 5 ("a walk, in chapters"): lede, chapters in a centred 600px column (desktop; tablet and mobile share the hero's left edge), alternating surfaces,
// sensory lines as sub-quotes, Source Serif 4 body (?body=spectral shows the old Spectral body for comparison).
/**
 * Page type: Experience article (Sanity type `experienceArticle`).
 * Ported from the design export below; its built-in article is replaced by the
 * `content` prop (Sanity, build time). Differences from the export:
 *  - Hero image: no image yet -> "image unavailable" label in the same-size hero.
 *  - The mobile orientation bar is removed (the site navbar sits there).
 *  - A paragraph stored with line breaks renders as the export's short "lines".
 *  - Optional subtitle shown under the title.
 *  - Dark only, as exported (no light tokens in this design).
 *  - "Continue" labels are the export's own text; they are not links yet.
 */
/**
 * ExperienceFirstLight — "First Light on the Ridge"
 * Experience cluster · responsive · 3 breakpoints
 * Gradient hero · dark hardened · EP-1.1 export
 * Derived from firstlight_20260521_1100.tsx
 * Slot: experience_firstlight_20260521_1100
 */

import { PLACEMENT } from "../../site/placement";
import { Hero } from "../../site/Hero";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

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

const ON_IMAGE = {
  head:  "rgba(237,233,226,0.96)",
  body:  "rgba(196,190,180,0.82)",
  muted: "rgba(237,233,226,0.42)",
} as const;

// T_ typography tokens
const T_TAGLINE: CSSProperties = {
  fontFamily:    FONT_LBL,
  fontSize:      "1.06rem",
  fontWeight:    400,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  lineHeight:    1.4,
};
const T_SECTION_LABEL: CSSProperties = {
  fontFamily:    FONT_LBL,
  fontSize:      "0.76rem",
  fontWeight:    400,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  lineHeight:    1.6,
};
const T_CARD_LABEL: CSSProperties = {
  fontFamily:    FONT_LBL,
  fontSize:      "0.72rem",
  fontWeight:    400,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  lineHeight:    1.6,
};
const T_MONO_CAPTION: CSSProperties = {
  fontFamily:    FONT_MONO,
  fontSize:      "0.68rem",
  fontWeight:    400,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  lineHeight:    1.50,
};

// ── Content shape (supplied from Sanity) ──────────────────────────────────────
export type ExperienceV2Block = { kind: "paragraph" | "heading" | "break"; text?: string };
export interface ExperienceV2Content {
  clusterLabel: string;
  title: string;
  subtitle?: string;
  heroImage: string;
  body: ExperienceV2Block[];
}

const HERO_GRADIENT =
  "linear-gradient(175deg, #09090a 0%, #141210 22%, #1e1b12 45%, #2b2619 65%, #1a1610 82%, #0d0c09 100%)";

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

// ── Main component ────────────────────────────────────────────────────────────
// v2 (pass 1, images): the build downloads four widths of every Sanity image;
// the hero offers all of them and the browser picks one.
const HERO_WIDTHS = [640, 1080, 1600, 2400];
const heroSrcSet = (src: string): string | undefined =>
  src.endsWith("-1600.webp") ? HERO_WIDTHS.map((w) => `${src.replace("-1600.webp", `-${w}.webp`)} ${w}w`).join(", ") : undefined;

// One closing card (the export's "Continue" labels are not links yet). Own hover state, so the page does not re-render on hover.
function NextCard({ label, tk, bg }: { label: string; tk: typeof DARK | typeof LIGHT; bg: string }) {
  const [on, setOn] = useState(false);
  const [name, sub] = label.split(" · ");
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{ position: "relative", padding: "1.3rem 1.4rem 1.4rem", border: `1px solid ${on ? tk.muted : tk.rule}`, background: on ? (bg === tk.surface ? tk.bg : tk.surface) : "transparent", transition: "border-color 0.25s ease, background 0.25s ease", cursor: "pointer" }}
    >
      <span style={{ position: "absolute", top: "1.3rem", right: "1.3rem", width: 7, height: 7, background: tk.accent, opacity: on ? 1 : 0, transition: "opacity 0.25s ease" }} />
      <div style={{ ...T_CARD_LABEL, color: on ? tk.head : tk.body, transition: "color 0.25s ease" }}>{name}</div>
      <div style={{ marginTop: "0.6rem", fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 16', fontStyle: "italic", fontWeight: 400, fontSize: "1.05rem", lineHeight: 1.45, color: tk.body }}>{sub}</div>
    </div>
  );
}


export function ExperienceV2({ content, isDark = true }: { content: ExperienceV2Content; isDark?: boolean }) {
  // Font loading — display=block (FONT-6)
  useEffect(() => {
    const id = "brand-fonts-experience-v2";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id   = id;
    link.rel  = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..500;1,8..60,300..500" +
      "&family=Spectral:ital,wght@0,300;1,300" +
      "&family=Source+Sans+3:wght@300;400" +
      "&family=IBM+Plex+Mono:wght@400" +
      "&family=Raleway:wght@400" +
      "&display=block";
    document.head.appendChild(link);
  }, []);

  const bp        = useBreakpoint();
  const isMobile  = bp === "mobile";
  const isTablet  = bp === "tablet";
  const isDesktop = bp === "desktop";

  // Comparison switch for the body face: ?body=sleeker is the default (opsz 48) | sleek | mid | sturdy | sans | spectral.
  const [bodyVariant, setBodyVariant] = useState("default");
  useEffect(() => { setBodyVariant(new URLSearchParams(window.location.search).get("body") ?? "default"); }, []);

  const tk = isDark ? DARK : LIGHT;

  // Canon gutters and section spacing
  const PAD_H = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem";
  const SEC   = isMobile ? "3.5rem" : isTablet ? "4.5rem" : "5.5rem";
  const bodyMax = isMobile ? "100%" : "600px";
  const bodySz  = isMobile ? "1.05rem" : isTablet ? "1.1rem" : "1.15rem";
  const lineSz  = isMobile ? "1.12rem" : isTablet ? "1.2rem" : "1.25rem";
  const ledeSz  = isMobile ? "1.3rem"  : isTablet ? "1.45rem" : "1.6rem";
  const titleSz = isMobile ? "1.65rem" : isTablet ? "1.95rem" : "2.25rem";

  const SS_BODY: Record<string, { opsz: number; wght: number }> = { default: { opsz: 48, wght: 300 }, sleek: { opsz: 32, wght: 320 }, mid: { opsz: 22, wght: 360 }, sturdy: { opsz: 14, wght: 400 } };
  const ss = SS_BODY[bodyVariant] ?? SS_BODY.default;
  const bodyFont: CSSProperties = bodyVariant === "spectral"
    ? { fontFamily: FONT_SPEC, fontWeight: 300, fontSize: bodySz, lineHeight: 2.05, letterSpacing: "0.01em" }
    : bodyVariant === "sans"
    ? { fontFamily: "'Source Sans 3', system-ui, sans-serif", fontWeight: 300, fontSize: bodySz, lineHeight: 1.75, letterSpacing: "0.012em" }
    : { fontFamily: FONT_SS4, fontWeight: ss.wght, fontVariationSettings: `"opsz" ${ss.opsz}`, fontSize: bodySz, lineHeight: 1.8, letterSpacing: "0.003em" };

  // ── Split the body into chapters: a "heading" block starts a new chapter ──
  type Chapter = { title?: string; blocks: ExperienceV2Block[] };
  const chapters: Chapter[] = [];
  let cur: Chapter = { blocks: [] };
  for (const b of content.body) {
    if (b.kind === "heading") {
      if (cur.title !== undefined || cur.blocks.length) chapters.push(cur);
      cur = { title: b.text ?? "", blocks: [] };
    } else {
      cur.blocks.push(b);
    }
  }
  if (cur.title !== undefined || cur.blocks.length) chapters.push(cur);
  const total = chapters.filter((c) => c.title !== undefined).length;

  const renderBlocks = (blocks: ExperienceV2Block[], key: string) =>
    blocks.flatMap((block, i) => {
      if (block.kind === "break") {
        return [<div key={`${key}-${i}`} style={{ width: 48, height: 1, background: tk.rule, margin: "2.4rem 0" }} />];
      }
      const text = block.text ?? "";
      // A paragraph stored with line breaks = the short sensory "lines": one quiet sequence.
      if (text.includes("\n")) {
        return [
          <div key={`${key}-${i}`} style={{ margin: "2.6rem 0", paddingLeft: isMobile ? "1.1rem" : "1.5rem", borderLeft: `2px solid ${tk.bq}` }}>
            {text.split("\n").filter(Boolean).map((line, j) => (
              <p key={j} style={{ margin: j === 0 ? 0 : "0.8rem 0 0", fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 16', fontStyle: "italic", fontWeight: 400, fontSize: lineSz, lineHeight: 1.55, color: tk.head }}>{line}</p>
            ))}
          </div>,
        ];
      }
      return [<p key={`${key}-${i}`} style={{ margin: "0 0 1.6rem", ...bodyFont, color: tk.body }}>{text}</p>];
    });

  // A section is full-bleed (its own background); everything inside shares ONE left edge,
  // the hero text's (the 860 column plus the canon gutter).
  const Section = ({ bg, children, first }: { bg: string; children: ReactNode; first?: boolean }) => (
    <div style={{ background: bg, padding: `${first ? (isMobile ? "2.2rem" : isTablet ? "2.6rem" : "2.8rem") : SEC} 0 ${SEC}`, transition: "background 0.35s ease" }}>
      <div style={{ maxWidth: isDesktop ? "calc(600px + 2rem)" : "none", margin: "0 auto", padding: `0 ${PAD_H}`, boxSizing: "border-box" }}>{children}</div>
    </div>
  );

  let titled = 0;
  let lastBg: string = tk.bg;
  const sections = chapters.map((ch, ci) => {
    const isTitled = ch.title !== undefined;
    const n = isTitled ? titled++ : -1;
    const bg = isTitled ? (n % 2 === 0 ? tk.surface : tk.bg) : tk.bg;
    lastBg = bg;
    const intro = ci === 0 && !isTitled;
    return (
      <Section key={ci} bg={bg} first={ci === 0}>
        {intro && content.subtitle && (
          <div style={{ marginBottom: ch.blocks.length ? (isMobile ? "2.4rem" : "3.2rem") : 0 }}>
            <div style={{ width: 28, height: 2, background: tk.accent, marginBottom: "1.4rem" }} />
            <p style={{ margin: 0, maxWidth: "none", fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 28', fontStyle: "italic", fontWeight: 300, fontSize: ledeSz, lineHeight: 1.45, letterSpacing: "-0.003em", color: tk.head }}>{content.subtitle}</p>
          </div>
        )}
        {isTitled ? (
          <div>
            <p style={{ margin: "0 0 1rem", ...T_MONO_CAPTION, color: tk.muted }}>{String(n + 1).padStart(2, "0")}<span style={{ opacity: 0.6 }}> / {String(total).padStart(2, "0")}</span></p>
            <h2 style={{ margin: "0 0 2rem", maxWidth: "none", fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 36, "wght" 300', fontStyle: "italic", fontWeight: 300, fontSize: titleSz, lineHeight: 1.15, letterSpacing: "-0.005em", color: tk.head }}>{ch.title}</h2>
            <div style={{ maxWidth: bodyMax }}>{renderBlocks(ch.blocks, `c${ci}`)}</div>
          </div>
        ) : ch.blocks.length ? (
          <div style={{ maxWidth: bodyMax }}>{renderBlocks(ch.blocks, `c${ci}`)}</div>
        ) : null}
      </Section>
    );
  });
  // A page with no chapters still shows its lede.
  if (!chapters.length && content.subtitle) {
    sections.push(
      <Section key="lede" bg={tk.bg} first>
        <div style={{ width: 28, height: 2, background: tk.accent, marginBottom: "1.4rem" }} />
        <p style={{ margin: 0, maxWidth: "none", fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 28', fontStyle: "italic", fontWeight: 300, fontSize: ledeSz, lineHeight: 1.45, color: tk.head }}>{content.subtitle}</p>
      </Section>
    );
  }

  // ── Closing block: the export's two "Continue" labels (not links yet) ──
  const closingBg = lastBg === tk.surface ? tk.bg : tk.surface;
  const NEXT = ["Observe · the land up close", "Cabin · where calm has a place"];

  return (
    <div data-scroll="root" style={{ ...SS4_SMOOTHING, background: tk.bg, minHeight: "100vh", transition: "background 0.35s ease" }}>

      {/* ── HERO — shared with the other v2 pages, a calmer height for an article ── */}
      <Hero compact image={content.heroImage} srcSet={heroSrcSet(content.heroImage)} position="center 35%" alt={content.title} title={content.title} placement={PLACEMENT.experience} isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />

      {/* ── BODY ── */}
      <div data-bb-field="bodyText">
        {sections}
      </div>

      {/* ── CLOSING ── */}
      <Section bg={closingBg}>
        <p style={{ margin: "0 0 1.2rem", ...T_SECTION_LABEL, color: tk.muted }}>Continue</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
          {NEXT.map((label, i) => <NextCard key={i} label={label} tk={tk} bg={closingBg} />)}
        </div>
      </Section>
    </div>
  );
}
