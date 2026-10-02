/**
 * Page type: Home (Sanity type `homePage`).
 * Ported from the design export (homepage_20260521_1100); its built-in text is
 * replaced by the `content` prop (Sanity, build time). Differences:
 *  - Images come from Sanity (fetched at build); one stored focal position
 *    per image is used wherever the design reuses it. A picture without an
 *    image shows a same-size "image unavailable" box.
 *  - Fonts come from the frame.
 *  - Width is read after load and follows window resizing.
 *  - Doors, "read the article" and the bottom row are not links yet.
 */

import React, { createContext, useContext, useEffect, useState, type CSSProperties } from "react";
import type { ShellPageProps } from "../../shell/SiteShell";

// ── Inlined brand constants ──────────────────────────────────────────────────

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const FONT_SS3 = "'Source Sans 3', system-ui, sans-serif";
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

type ColorTokens = typeof DARK;

const ON_IMAGE = {
  head:  "rgba(237,233,226,0.96)",
  body:  "rgba(196,190,180,0.82)",
  muted: "rgba(237,233,226,0.42)",
} as const;

// ── Content (Sanity type `homePage`, build time) ─────────────────────────────

export interface HomeContent {
  /** Images by picture (from Sanity). A picture without an image shows "image unavailable". */
  images: Record<string, { src: string; srcSet: string; position: string; alt: string }>;
  heroLabel: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroSubtitleMobile: string;
  depthHeading: string;
  mosaicLabels: string[];
  depthStatement: string;
  depthAside: string;
  doorsHeading: string;
  doors: Array<{ label: string; note: string; tagline: string }>;
  evidenceLabel: string;
  evidenceQuote: string;
  evidenceAttribution: string;
  evidenceCta: string;
  seasonLead: string;
  seasonLines: string[];
  footerNav: string[];
}

// Same-size stand-in for images that do not exist yet.
function NoImage({ abs, top }: { abs?: boolean; top?: string }) {
  return (
    <div style={{
      ...(abs ? { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } : { width: "100%", height: "100%" }),
      background: "#222120", boxSizing: "border-box",
      display: "flex", alignItems: top ? "flex-start" : "center", justifyContent: "center", paddingTop: top,
      fontFamily: FONT_MONO, fontSize: "0.58rem", letterSpacing: "0.16em",
      textTransform: "uppercase", color: "#6E6A65",
    }}>
      image unavailable
    </div>
  );
}

const ImgCtx = createContext<HomeContent["images"]>({});

/** The image for one picture on the page, or the honest placeholder. */
function Pic({ slot, abs, top }: { slot: string; abs?: boolean; top?: string }) {
  const img = useContext(ImgCtx)[slot];
  if (!img) return <NoImage abs={abs} top={top} />;
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes="100vw"
      alt={img.alt}
      style={{
        ...(abs ? { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } : {}),
        width: "100%", height: "100%", objectFit: "cover", objectPosition: img.position, display: "block",
      }}
    />
  );
}

const doorSlot = (label: string, c: HomeContent) =>
  label === c.doors[0]?.label ? "waterfalls" : label === c.doors[1]?.label ? "lichen" : "cabin";

const OVERLAY_HERO = "linear-gradient(to bottom, rgba(20,17,14,0.48) 0%, rgba(20,17,14,0.30) 45%, rgba(26,23,20,0.80) 100%)";
const OVERLAY_DOOR = "linear-gradient(to bottom, rgba(14,12,10,0.14) 0%, rgba(14,12,10,0.20) 40%, rgba(14,12,10,0.86) 100%)";

// ── Utilities ────────────────────────────────────────────────────────────────

// Starts as "mobile" (matches the built page) and settles on the real width.
function useBreakpoint() {
  const [bp, setBp] = useState<"desktop" | "tablet" | "mobile">("mobile");
  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      setBp(w >= 1024 ? "desktop" : w >= 600 ? "tablet" : "mobile");
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return bp;
}

function ImageLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position:      "absolute",
      bottom:        "0.65rem",
      left:          "0.75rem",
      fontFamily:    FONT_MONO,
      fontSize:      "0.58rem",
      letterSpacing: "0.16em",
      color:         ON_IMAGE.muted,
      textTransform: "uppercase" as const,
    }}>
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function Home({ content }: { content: HomeContent } & ShellPageProps) {
  const c = content;
  const oneLine = (t: string) => t.replace(/\n/g, " ");
  const [doorW, doorL, doorC] = [c.doors[0], c.doors[1], c.doors[2]];
  const bp        = useBreakpoint();
  const isMobile  = bp === "mobile";
  const isTablet  = bp === "tablet";
  const isDesktop = bp === "desktop";
  const tk: ColorTokens = DARK;

  const padH   = isMobile ? "1.4rem" : isTablet ? "2.5rem" : "3.5rem";
  const h1Hero = isMobile ? "2.2rem" : isTablet ? "3rem"   : "3.8rem";
  const subHero = isMobile ? "0.88rem" : isTablet ? "0.95rem" : "1rem";

  return (
    <ImgCtx.Provider value={c.images}>
    <div data-scroll style={{ ...SS4_SMOOTHING, background: tk.bg, minHeight: "100vh", color: tk.body, overflowX: "hidden" }}>

      {/* ══ B1 · WORLD ══ */}
      <div style={{
        position:       "relative",
        width:          "100%",
        height: "100vh", minHeight: isMobile ? "520px" : "640px",
        overflow:       "hidden",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
      }}>
        <Pic slot="hero" abs top="24vh" />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: OVERLAY_HERO }} />

        <div style={{
          position:      "absolute",
          top:           isMobile ? "1.4rem" : "2.2rem",
          left:          0,
          right:         0,
          textAlign:     "center",
          fontFamily:    FONT_MONO,
          fontSize:      isMobile ? "0.58rem" : "0.68rem",
          letterSpacing: "0.20em",
          color:         ON_IMAGE.muted,
          textTransform: "uppercase" as const,
        }}>
          {c.heroLabel}
        </div>

        <div style={{ position: "relative", textAlign: "center", padding: isMobile ? "0 1.6rem" : "0 3rem" }}>
          <h1
            data-bb-field="heroHeadline"
            style={{
              margin:                "0 0 1.4rem",
              fontFamily:            FONT_SS4,
              fontStyle:             "italic",
              fontSize:              h1Hero,
              fontWeight:            300,
              fontVariationSettings: SS4_OPSZ_DISPLAY,
              lineHeight:            1.06,
              color:                 ON_IMAGE.head,
              letterSpacing:         "-0.01em",
              whiteSpace:            "pre-line" as const,
            }}
          >
            {c.heroHeadline}
          </h1>
          <p
            data-bb-field="heroSubtitle"
            style={{
              margin:        0,
              fontFamily:    FONT_SS3,
              fontSize:      subHero,
              fontWeight:    300,
              color:         "rgba(196,190,180,0.78)",
              letterSpacing: "0.02em",
              lineHeight:    1.7,
              whiteSpace:    "pre-line" as const,
            }}
          >
            {isMobile ? c.heroSubtitleMobile : c.heroSubtitle}
          </p>
        </div>

        <div style={{
          position:      "absolute",
          bottom:        "1.8rem",
          left:          0,
          right:         0,
          textAlign:     "center",
          fontFamily:    FONT_MONO,
          fontSize:      "0.58rem",
          letterSpacing: "0.20em",
          color:         "rgba(237,233,226,0.28)",
          textTransform: "uppercase" as const,
        }}>
          Scroll
        </div>
      </div>

      {/* ══ B2 · DEPTH SIGNAL ══ */}
      <div style={{ background: tk.bg, padding: `4.5rem ${padH} 3.5rem` }}>
        <p style={{
          margin:        "0 0 2rem",
          fontFamily:    FONT_LBL,
          fontSize:      "0.72rem",
          fontWeight:    400,
          letterSpacing: "0.16em",
          color:         tk.muted,
          textTransform: "uppercase" as const,
        }}>
          {c.depthHeading}
        </p>

        {/* Mosaic — tablet/desktop only */}
        {!isMobile && (
          <div style={{
            display:             "grid",
            gridTemplateColumns: isTablet ? "2fr 1fr" : "2.4fr 1fr 1fr",
            gridTemplateRows:    "1fr 1fr",
            gap:                 "3px",
            height:              isTablet ? "360px" : "460px",
            marginBottom:        "2.4rem",
          }}>
            <div style={{ gridColumn: 1, gridRow: "1 / 3", position: "relative", overflow: "hidden" }}>
              <Pic slot="waterfalls" />
              <ImageLabel>{c.mosaicLabels[0]}</ImageLabel>
            </div>
            <div style={{ gridColumn: 2, gridRow: 1, position: "relative", overflow: "hidden" }}>
              <Pic slot="lichen" />
              <ImageLabel>{c.mosaicLabels[1]}</ImageLabel>
            </div>
            {isDesktop && (
              <div style={{ gridColumn: 3, gridRow: 1, position: "relative", overflow: "hidden" }}>
                <Pic slot="culture" />
                <ImageLabel>{c.mosaicLabels[2]}</ImageLabel>
              </div>
            )}
            <div style={{ gridColumn: isTablet ? 2 : "2 / 4", gridRow: 2, position: "relative", overflow: "hidden" }}>
              <Pic slot="cabin" />
              <ImageLabel>{c.mosaicLabels[3]}</ImageLabel>
            </div>
          </div>
        )}

        {/* Mobile: single featured image */}
        {isMobile && (
          <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", overflow: "hidden", marginBottom: "2rem" }}>
            <Pic slot="waterfalls" />
            <ImageLabel>{c.mosaicLabels[0]}</ImageLabel>
          </div>
        )}

        <div style={{
          display:        "flex",
          alignItems:     isMobile ? "flex-start" : "baseline",
          flexDirection:  isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap:            isMobile ? "1rem" : 0,
          borderTop:      `1px solid ${tk.rule}`,
          paddingTop:     "1.4rem",
        }}>
          <p style={{
            margin:                0,
            fontFamily:            FONT_SS4,
            fontStyle:             "italic",
            fontSize:              isMobile ? "1rem" : "1.22rem",
            fontWeight:            300,
            fontVariationSettings: SS4_OPSZ_TEXT,
            color:                 tk.head,
            lineHeight:            1.6,
            maxWidth:              "56ch",
            whiteSpace:            "pre-line" as const,
          }}>
            {isMobile ? oneLine(c.depthStatement) : c.depthStatement}
          </p>
          {!isMobile && (
            <p style={{
              margin:        "0 0 0 2.5rem",
              fontFamily:    FONT_MONO,
              fontSize:      "0.62rem",
              color:         tk.muted,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              textAlign:     "right",
              flexShrink:    0,
              lineHeight:    1.7,
              whiteSpace:    "pre-line" as const,
            }}>
              {c.depthAside}
            </p>
          )}
        </div>
      </div>

      {/* ══ B3 · THREE DOORS ══ */}
      <div style={{ background: tk.bg }}>
        <p style={{
          margin:        0,
          padding:       `3.5rem ${padH} 1.4rem`,
          fontFamily:    FONT_LBL,
          fontSize:      "0.72rem",
          fontWeight:    400,
          letterSpacing: "0.16em",
          color:         tk.muted,
          textTransform: "uppercase" as const,
        }}>
          {c.doorsHeading}
        </p>

        {/* Mobile: full-width stacked doors */}
        {isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {[
              { d: doorW, h: "56vw" },
              { d: doorL, h: "44vw" },
              { d: doorC, h: "44vw" },
            ].filter(x => x.d).map(({ d, h }) => ({ ...d, tagline: oneLine(d.tagline), h })).map(d => (
              <div key={d.label} style={{ position: "relative", overflow: "hidden", height: d.h }}>
                <Pic slot={doorSlot(d.label, c)} abs />
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: OVERLAY_DOOR }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 1.25rem 1.4rem" }}>
                  <p style={{ margin: "0 0 0.4rem", fontFamily: FONT_MONO, fontSize: "0.55rem", letterSpacing: "0.16em", color: ON_IMAGE.muted, textTransform: "uppercase" as const }}>{d.note}</p>
                  <p style={{ margin: "0 0 0.5rem", fontFamily: FONT_LBL, fontWeight: 400, fontSize: "0.92rem", color: ON_IMAGE.head, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{d.label}</p>
                  <p style={{ margin: 0, fontFamily: FONT_SS3, fontSize: "0.82rem", fontWeight: 300, color: "rgba(196,190,180,0.82)", lineHeight: 1.6 }}>{d.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tablet: 1 wide + 2 stacked */}
        {isTablet && (
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "3px", minHeight: "560px" }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <Pic slot="waterfalls" abs />
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: OVERLAY_DOOR }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 1.4rem 1.8rem" }}>
                <p style={{ margin: "0 0 0.55rem", fontFamily: FONT_MONO, fontSize: "0.58rem", letterSpacing: "0.18em", color: ON_IMAGE.muted, textTransform: "uppercase" as const }}>{doorW?.note}</p>
                <p style={{ margin: "0 0 0.6rem", fontFamily: FONT_LBL, fontWeight: 400, fontSize: "1rem", color: ON_IMAGE.head, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>{doorW?.label}</p>
                <p style={{ margin: 0, fontFamily: FONT_SS3, fontSize: "0.88rem", fontWeight: 300, color: "rgba(196,190,180,0.82)", lineHeight: 1.7 }}>{doorW ? oneLine(doorW.tagline) : ""}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {[doorL, doorC].filter(Boolean).map(d => ({ ...d, tagline: oneLine(d.tagline) })).map(d => (
                <div key={d.label} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                  <Pic slot={doorSlot(d.label, c)} abs />
                  <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: OVERLAY_DOOR }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 1.2rem 1.4rem" }}>
                    <p style={{ margin: "0 0 0.4rem", fontFamily: FONT_MONO, fontSize: "0.55rem", letterSpacing: "0.16em", color: ON_IMAGE.muted, textTransform: "uppercase" as const }}>{d.note}</p>
                    <p style={{ margin: "0 0 0.5rem", fontFamily: FONT_LBL, fontWeight: 400, fontSize: "0.92rem", color: ON_IMAGE.head, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{d.label}</p>
                    <p style={{ margin: 0, fontFamily: FONT_SS3, fontSize: "0.82rem", fontWeight: 300, color: "rgba(196,190,180,0.82)", lineHeight: 1.6 }}>{d.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop: original 3-col proportional flex */}
        {isDesktop && (
          <div style={{ display: "flex", gap: "3px" }}>
            {[
              { d: doorW, flex: 2.6 },
              { d: doorL, flex: 1.4 },
              { d: doorC, flex: 1.0 },
            ].filter(x => x.d).map(({ d, flex }) => ({ ...d, flex })).map(d => (
              <div key={d.label} style={{ flex: d.flex, position: "relative", overflow: "hidden", minHeight: "680px" }}>
                <Pic slot={doorSlot(d.label, c)} abs />
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: OVERLAY_DOOR }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 1.4rem 1.8rem" }}>
                  <p style={{ margin: "0 0 0.55rem", fontFamily: FONT_MONO, fontSize: "0.58rem", letterSpacing: "0.18em", color: ON_IMAGE.muted, textTransform: "uppercase" as const }}>{d.note}</p>
                  <p style={{ margin: "0 0 0.6rem", fontFamily: FONT_LBL, fontWeight: 400, fontSize: "1.06rem", color: ON_IMAGE.head, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>{d.label}</p>
                  <p style={{ margin: 0, fontFamily: FONT_SS3, fontSize: "0.88rem", fontWeight: 300, color: "rgba(196,190,180,0.82)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{d.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ B4 · EVIDENCE ══ */}
      <div style={{
        background: tk.surface,
        borderTop:  `1px solid ${tk.rule}`,
        padding:    `4.5rem ${padH}`,
      }}>
        <p style={{
          margin:        "0 0 1.8rem",
          fontFamily:    FONT_LBL,
          fontSize:      "0.72rem",
          fontWeight:    400,
          letterSpacing: "0.16em",
          color:         tk.muted,
          textTransform: "uppercase" as const,
        }}>
          {c.evidenceLabel}
        </p>
        <div style={{
          display:             "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 280px",
          gap:                 isMobile ? "2rem" : "4rem",
          alignItems:          "start",
        }}>
          <div>
            <blockquote
              data-bb-field="evidenceQuote"
              style={{
                margin:                "0 0 1.4rem",
                paddingLeft:           "1.6rem",
                borderLeft:            `2px solid ${tk.bq}`,
                fontFamily:            FONT_SS4,
                fontStyle:             "italic",
                fontSize:              isMobile ? "1rem" : "1.22rem",
                fontWeight:            300,
                fontVariationSettings: SS4_OPSZ_TEXT,
                color:                 tk.head,
                lineHeight:            1.68,
              }}
            >
              {c.evidenceQuote}
            </blockquote>
            <p
              data-bb-field="evidenceAttribution"
              style={{ margin: "0 0 0.4rem", fontFamily: FONT_MONO, fontSize: "0.62rem", color: tk.muted, letterSpacing: "0.14em", textTransform: "uppercase" as const }}
            >
              {c.evidenceAttribution}
            </p>
            <p style={{ margin: 0, fontFamily: FONT_LBL, fontSize: "0.82rem", fontWeight: 400, color: tk.bq, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>
              {c.evidenceCta}
            </p>
          </div>

          <div style={{ position: "relative", overflow: "hidden", height: isMobile ? "200px" : "240px" }}>
            <Pic slot="lichen" />
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, border: `1px solid ${tk.rule}` }} />
          </div>
        </div>
      </div>

      {/* ══ B5 · SEASON + FOOTER ══ */}
      <div style={{
        background: tk.bg,
        borderTop:  `1px solid ${tk.rule}`,
        padding:    `3.5rem ${padH} 3rem`,
      }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: "0.82rem", lineHeight: 2.0, letterSpacing: "0.06em", marginBottom: "3rem" }}>
          <div style={{ color: tk.bq }}>{c.seasonLead}</div>
          {c.seasonLines.map((l, i, all) => (
            <div key={i} style={i === all.length - 1 && all.length > 1 ? { color: tk.muted, marginTop: "0.4rem" } : { color: tk.body }}>{l}</div>
          ))}
        </div>

        <div style={{
          borderTop:      `1px solid ${tk.rule}`,
          paddingTop:     "1.4rem",
          display:        "flex",
          flexDirection:  isMobile ? "column" : "row",
          justifyContent: isMobile ? "flex-start" : "space-between",
          alignItems:     isMobile ? "flex-start" : "center",
          gap:            isMobile ? "1rem" : 0,
        }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: "0.62rem", color: tk.muted, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
            VossWaterfalls.no
          </span>
          <div style={{
            display:       "flex",
            flexWrap:      "wrap" as const,
            gap:           isMobile ? "1rem 1.5rem" : "2rem",
            fontFamily:    FONT_MONO,
            fontSize:      "0.62rem",
            color:         tk.muted,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}>
            {c.footerNav.map(l => (
              <span key={l} style={{ cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
    </ImgCtx.Provider>
  );
}
