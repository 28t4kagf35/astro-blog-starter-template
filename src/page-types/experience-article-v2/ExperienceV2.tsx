// V2 WORKING COPY of ../experience-article/ExperienceArticle.tsx, for side-by-side comparison at /experience-v2. Design changes go here only.
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

import { useEffect, useState, type CSSProperties } from "react";

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

export function ExperienceV2({ content }: { content: ExperienceV2Content }) {
  // Font loading — display=block (FONT-6)
  useEffect(() => {
    const id = "brand-fonts-experience";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id   = id;
    link.rel  = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300" +
      "&family=Spectral:ital,wght@0,300;1,300" +
      "&family=IBM+Plex+Mono:wght@400" +
      "&family=Raleway:wght@400" +
      "&display=block";
    document.head.appendChild(link);
  }, []);

  const bp        = useBreakpoint();
  const isMobile  = bp === "mobile";
  const isTablet  = bp === "tablet";
  const isDesktop = bp === "desktop";

  // CTRL-1: isDark hardened to true; toggle buttons stripped
  const tk = DARK;

  // Pass 2/3: canon gutters and section spacing
  const PAD_H   = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem";
  const SEC = isMobile ? "3.5rem" : isTablet ? "4.5rem" : "5.5rem";
  const COL     = isDesktop ? "680px"  : isTablet ? "600px"  : "100%";
  const heroH   = isMobile ? "52vh"    : isTablet ? "58vh"   : "62vh";
  const heroBot = SEC;
  const h1Sz    = isMobile ? "1.5rem"  : isTablet ? "1.9rem" : "2.4rem";
  const lblSz   = isMobile ? "0.82rem" : isTablet ? "0.94rem" : "1.06rem";
  const bodySz  = isMobile ? "0.95rem" : isTablet ? "1.0rem"  : "1.05rem";
  const shortSz = isMobile ? "0.95rem" : isTablet ? "1.05rem" : "1.1rem";
  const bodyPad = `${SEC} ${PAD_H} 0`;

  const [cleared,     setCleared]     = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setCleared(true)));
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div data-scroll="root" style={{ ...SS4_SMOOTHING, background: tk.bg, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <div style={{
        position:  "relative",
        width:     "100%",
        height:    heroH,
        minHeight: isMobile ? 300 : 380,
        overflow:  "hidden",
      }}>
{content.heroImage ? (
          <img
            data-bb-field="heroImage"
            src={content.heroImage}
            srcSet={heroSrcSet(content.heroImage)}
            sizes="100vw"
            fetchPriority="high"
            alt={content.title}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }}
          />
        ) : (
          <div data-bb-field="heroImage" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: tk.surface, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
            <span style={{ ...T_MONO_CAPTION, color: tk.muted }}>image unavailable</span>
          </div>
        )}

        {/* hero gradient overlay */}
        <div style={{
          position: "absolute",
          top:      0,
          right:    0,
          bottom:   0,
          left:     0,
          background: HERO_GRADIENT,
          opacity:    0.78,
        }} />

        {/* blur-clear entrance animation */}
        <div style={{
          position:             "absolute",
          top:                  0,
          right:                0,
          bottom:               0,
          left:                 0,
          backdropFilter:       cleared ? "blur(0px)" : "blur(12px)",
          WebkitBackdropFilter: cleared ? "blur(0px)" : "blur(12px)",
          backgroundColor:      cleared ? "rgba(14,12,10,0)" : "rgba(14,12,10,0.32)",
          opacity:              cleared ? 0 : 1,
          transition:           "backdrop-filter 2.4s cubic-bezier(.18,0,.38,1), -webkit-backdrop-filter 2.4s cubic-bezier(.18,0,.38,1), opacity 2.4s ease",
          pointerEvents:        "none",
          zIndex:               2,
        }} />

        {/* hero text block */}
        <div style={{
          position:      "absolute",
          bottom:        heroBot,
          left:          isDesktop ? "50%" : 0,
          right:         isDesktop ? "auto" : 0,
          transform:     isDesktop ? "translateX(-50%)" : "none",
          width:         isDesktop ? COL : "100%",
          maxWidth:      isDesktop ? COL : "none",
          padding:       `0 ${PAD_H}`,
          display:       "flex",
          flexDirection: "column",
          gap:           "0.6rem",
          opacity:       textVisible ? 1 : 0,
          transition:    "opacity 1.2s ease",
          zIndex:        3,
        }}>
          <p style={{
            margin:   0,
            ...T_TAGLINE,
            fontSize: lblSz,
            color:    ON_IMAGE.body,
          }}>
            {content.clusterLabel}
          </p>
          <h1 style={{
            margin:                0,
            fontFamily:            FONT_SS4,
            fontSize:              h1Sz,
            fontWeight:            300,
            fontStyle:             "italic",
            fontVariationSettings: SS4_OPSZ_DISPLAY,
            color:                 ON_IMAGE.head,
            lineHeight:            1.2,
            letterSpacing:         "-0.01em",
            maxWidth:              isDesktop ? 580 : "none",
          }}>
            {content.title}
          </h1>
          {content.subtitle && (
            <p style={{ margin: 0, fontFamily: FONT_SS4, fontVariationSettings: SS4_OPSZ_TEXT, fontStyle: "italic", fontWeight: 300, fontSize: shortSz, color: ON_IMAGE.body, lineHeight: 1.6 }}>
              {content.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div data-bb-field="bodyText" style={{
        maxWidth:   isDesktop ? COL : "none",
        margin:     "0 auto",
        padding:    bodyPad,
        opacity:    textVisible ? 1 : 0,
        transition: "opacity 1.4s ease 0.2s",
      }}>
        {content.body.flatMap((block, i) => {
          if (block.kind === "break") {
            return [<div key={i} style={{ width: 48, height: 1, background: tk.rule, margin: "2.8rem 0" }} />];
          }
          const text = block.text ?? "";
          const lineStyle: CSSProperties = {
            margin:                "2.8rem 0",
            fontFamily:            FONT_SS4,
            fontVariationSettings: SS4_OPSZ_TEXT,
            fontSize:              shortSz,
            fontStyle:             "italic",
            fontWeight:            300,
            color:                 tk.head,
            lineHeight:            1.6,
            letterSpacing:         "0.01em",
          };
          if (block.kind === "heading") {
            return [<p key={i} style={lineStyle}>{text}</p>];
          }
          // A paragraph stored with line breaks = the export's short "lines".
          if (text.includes("\n")) {
            return text.split("\n").filter(Boolean).map((line, j) => (
              <p key={`${i}-${j}`} style={lineStyle}>{line}</p>
            ));
          }
          return [
            <p key={i} style={{
              margin:        "0 0 2.2rem",
              fontFamily:    FONT_SPEC,
              fontSize:      bodySz,
              fontWeight:    300,
              color:         tk.body,
              lineHeight:    2.05,
              letterSpacing: "0.01em",
            }}>
              {text}
            </p>,
          ];
        })}

        {/* ── WORMHOLE ── */}
        <div style={{
          marginTop:  "4.5rem",
          paddingTop: "2.4rem",
          borderTop:  `1px solid ${tk.rule}`,
        }}>
          <p style={{
            margin:   "0 0 1.1rem",
            ...T_SECTION_LABEL,
            fontSize: "0.82rem",
            color:    tk.body,
          }}>
            Continue
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {[
              "Observe · the land up close",
              "Cabin · where calm has a place",
            ].map((label, i) => (
              <span
                key={i}
                style={{
                  ...T_CARD_LABEL,
                  color:               tk.body,
                  cursor:              "pointer",
                  textDecoration:      "underline",
                  textUnderlineOffset: "3px",
                  textDecorationColor: "#4D4A47",
                  transition:          "text-decoration-color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecorationColor = "transparent")}
                onMouseLeave={e => (e.currentTarget.style.textDecorationColor = "#4D4A47")}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: SEC }} />
    </div>
  );
}
