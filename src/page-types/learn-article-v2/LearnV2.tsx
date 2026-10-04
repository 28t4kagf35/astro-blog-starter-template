// V2 WORKING COPY of ../learn-article/LearnArticle.tsx, for side-by-side comparison at /learn-v2. Design changes go here only.
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

import { useEffect, useRef, useState, type CSSProperties } from "react";

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

const PROSE_MAX = 680;

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
  // Font loading — display=block (FONT-6)
  useEffect(() => {
    const id = "brand-fonts-learn";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id   = id;
    link.rel  = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300" +
      "&family=Spectral:ital,opsz,wght@0,7..18,300;1,7..18,300" +
      "&family=IBM+Plex+Mono:wght@400" +
      "&family=Raleway:wght@300;400" +
      "&display=block";
    document.head.appendChild(link);
  }, []);

  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  // Pass 2/3: canon gutters and section spacing
  const PAD_H  = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem";
  const SEC = isMobile ? "3.5rem" : isTablet ? "4.5rem" : "5.5rem";
  const lblSz  = isMobile ? "0.82rem" : isTablet ? "0.94rem" : "1.06rem";
  const h1Sz   = isMobile ? "1.5rem"  : isTablet ? "1.9rem"  : "2.4rem";
  const heroBot = SEC;
  const h2Sz   = isMobile ? "1.4rem"  : isTablet ? "1.7rem"  : "2rem";
  const bodySz = isMobile ? "0.95rem" : isTablet ? "1.0rem"  : "1.05rem";
  const shortSz = isMobile ? "0.95rem" : isTablet ? "1.05rem" : "1.1rem";
  const bqSz   = isMobile ? "1.0rem"  : isTablet ? "1.1rem"  : "1.2rem";

  const [titleVisible, setTitleVisible] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const tk = isDark ? DARK : LIGHT;

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 200);
    const t2 = setTimeout(() => setQuoteVisible(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div data-scroll="root" style={{ ...SS4_SMOOTHING,
      background: tk.bg,
      minHeight:  "100vh",
      overflowY:  "auto",
      overflowX:  "hidden",
      transition: "background 0.35s ease",
    }}>

      {/* ── HERO — full-bleed ── */}
      <div style={{ position: "relative", width: "100%", height: isMobile ? "80vh" : isTablet ? "88vh" : "100vh", minHeight: isMobile ? "420px" : isTablet ? "540px" : "640px", overflow: "hidden" }}>
{content.heroImage ? (
          <img
            data-bb-field="heroImage"
            src={content.heroImage}
            srcSet={heroSrcSet(content.heroImage)}
            sizes="100vw"
            fetchPriority="high"
            alt={content.title}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        ) : (
          <div data-bb-field="heroImage" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: DARK.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: DARK.muted }}>image unavailable</span>
          </div>
        )}
        <div style={{
          position:   "absolute",
          top: 0, right: 0, bottom: 0, left: 0,
          background: "linear-gradient(to top, rgba(26,23,20,1) 0%, rgba(26,23,20,0.86) 12%, rgba(0,0,0,0.5) 28%, rgba(0,0,0,0.08) 50%, transparent 65%)",
        }} />

        <div style={{
          position:      "absolute",
          bottom:        0,
          left:          "50%",
          transform:     "translateX(-50%)",
          width:         "100%",
          maxWidth:      PROSE_MAX,
          padding:       `3rem ${PAD_H} ${heroBot}`,
          display:       "flex",
          flexDirection: "column",
          gap:           "22px",
        }}>
          <p style={{
            margin:        0,
            fontFamily:    FONT_LBL,
            fontSize:      lblSz,
            fontWeight:    400,
            color:         "rgba(237,233,226,0.72)",
            letterSpacing: "0.13em",
            textTransform: "uppercase" as const,
            lineHeight:    1.4,
            opacity:       titleVisible ? 1 : 0,
            transform:     titleVisible ? "translateY(0)" : "translateY(0.8rem)",
            transition:    "opacity 1.1s ease-in-out, transform 1.1s ease-in-out",
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
            color:                 "#EDE9E2",
            lineHeight:            1.2,
            letterSpacing:         "-0.01em",
            maxWidth:              580,
            opacity:               quoteVisible ? 1 : 0,
            transform:             quoteVisible ? "translateY(0)" : "translateY(1rem)",
            transition:            "opacity 1.4s ease-in-out, transform 1.4s ease-in-out",
          }}>
            {content.title}
          </h1>
        </div>
      </div>

      {/* ── ARTICLE BODY ── */}
      <div
        ref={articleRef}
        style={{
          maxWidth:     PROSE_MAX,
          margin:       "0 auto",
          paddingTop:   SEC,
          paddingLeft:  PAD_H,
          paddingRight: PAD_H,
        }}
      >
{content.subtitle && (
        <h2 style={{
          margin:                "0 0 44px",
          fontFamily:            FONT_SS4,
          fontSize:              h2Sz,
          fontWeight:            300,
          fontStyle:             "italic",
          fontVariationSettings: SS4_OPSZ_DISPLAY,
          color:                 tk.head,
          lineHeight:            1.2,
          letterSpacing:         "-0.01em",
        }}>
          {content.subtitle}
        </h2>
        )}

        {content.body.map((block, i) => {
          if (block.kind === "break") {
            return <div key={i} style={{ width: 48, height: 1, background: tk.rule, margin: "44px 0" }} />;
          }
          const text = block.text ?? "";
          if (block.kind === "heading") {
            return (
              <h3 key={i} style={{
                margin:                "44px 0 22px",
                fontFamily:            FONT_SS4,
                fontSize:              bqSz,
                fontWeight:            300,
                fontStyle:             "italic",
                fontVariationSettings: SS4_OPSZ_DISPLAY,
                color:                 tk.head,
                lineHeight:            1.3,
              }}>
                {text}
              </h3>
            );
          }

          const isShort     = isShortLine(text);
          const nextBlock   = content.body[i + 1];
          const nextIsShort = nextBlock?.kind === "paragraph" && isShortLine(nextBlock.text ?? "");

          return (
            <p key={i} style={{
              margin:        `0 0 ${isShort && nextIsShort ? "4px" : "22px"}`,
              fontFamily:    FONT_SPEC,
              fontSize:      isShort ? shortSz : bodySz,
              fontStyle:     isShort ? "italic" : "normal",
              fontWeight:    300,
              color:         isShort ? tk.head : tk.body,
              lineHeight:    isShort ? 1.6 : 1.88,
              letterSpacing: "0.01em",
              whiteSpace:    "pre-line",
            }}>
              {text}
            </p>
          );
        })}

        <div style={{ width: "100%", height: 1, background: tk.rule, marginTop: SEC }} />
      </div>

      <div style={{ height: SEC }} />
    </div>
  );
}
