/**
 * Page type: Activity (Sanity type `activity`).
 * Ported from the design export below; its built-in text is replaced by the
 * `content` prop (Sanity, build time). Differences from the export:
 *  - Hero, wide terrain image and photo grid: no media yet -> same-size
 *    "image unavailable" boxes (the export borrowed a waterfall photo).
 *  - Route map: same-size "map unavailable" box instead of the export's
 *    technical stub.
 *  - Fonts come from the frame.
 *  - Dark only, as exported.
 *  - "Also in Activities" / "Nearby Nature" rows are not links yet.
 */
/**
 * KiellandbuPage — Activities cluster · Kiellandbu hike detail · v1
 * Single responsive component: mobile < 600 · tablet 600–1023 · desktop ≥ 1024
 * EP-1.1 export: CTRL-1 applied · isDark hardened · chrome stripped
 * Mapbox replaced with MapboxStub — wire token + swap component in CMS rebuild
 * Slot: activities_kiellandbu_20260521_1100
 */

import { useEffect, useRef, useState, type CSSProperties, type RefObject, type ReactNode } from "react";
import type { ShellPageProps } from "../../shell/SiteShell";

// ── Brand constants (inlined) ─────────────────────────────────────────────────
const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_SS3  = "'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_LBL  = "'Raleway', system-ui, sans-serif";

const SS4_SMOOTHING: CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

// ── Colour tokens (inlined — source defines these locally) ────────────────────
const DARK = {
  bg: "#1A1714", surface: "#222120", rule: "#2C2A28",
  muted: "#6E6A65", body: "#C4BEB4", head: "#EDE9E2", bq: "#7A8B74",
};

// ── Content (Sanity type `activity`, build time) ─────────────────────────────
export interface ActivityContent {
  heroImage: string;   // "" = no image yet
  wideImage: string;
  title: string;
  breadcrumb: string;
  locationLine: string;
  lede: string;
  ledeMobile: string;
  ledeTablet: string;
  stats: Array<{ label: string; value: string }>;
  access: { heading: string; paragraphs: string[] };
  season: { heading: string; paragraphs: string[] };
  onTheRoute: { heading: string; paragraphs: string[] };
  highlightsHeading: string;
  highlights: string[];
  practical: { heading: string; paragraphs: string[] };
  exitsHeading: string;
  exits: Array<{ label: string; sub: string }>;
  nearbyHeading: string;
  nearby: Array<{ label: string; sub: string }>;
}

type Stat = { label: string; value: string };

// Photo that fills its box, or the honest stand-in when there is none.
function Photo({ src, position, label, style }: { src: string; position: string; label: string; style?: CSSProperties }) {
  return src ? (
    <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position }} />
  ) : (
    <Unavailable label={label} style={style} />
  );
}

// Same-size stand-in for media that does not exist yet.
function Unavailable({ label, style }: { label: string; style?: CSSProperties }) {
  return (
    <div style={{
      width: "100%", height: "100%", background: "#222120", boxSizing: "border-box",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT_MONO, fontSize: "0.50rem", letterSpacing: "0.12em",
      textTransform: "uppercase", color: "#6E6A65", ...style,
    }}>
      {label}
    </div>
  );
}

// ── Container width hook ──────────────────────────────────────────────────────
function useContainerWidth(): { ref: RefObject<HTMLDivElement | null>; width: number } {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ text, tk, small }: { text: string; tk: typeof DARK; small?: boolean }) {
  return (
    <div style={{
      fontFamily: FONT_LBL,
      fontSize: small ? "0.56rem" : "0.60rem",
      letterSpacing: "0.13em",
      color: tk.muted,
      textTransform: "uppercase",
      marginBottom: 16,
    }}>
      {text}
    </div>
  );
}

function StatsGrid({ stats, cols, tk, cellPad, valSize }: {
  stats: Stat[];
  cols: string;
  tk: typeof DARK;
  cellPad: string;
  valSize: string;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols,
      gap: 1,
      background: tk.rule,
      border: `1px solid ${tk.rule}`,
      borderRadius: 4,
    }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: tk.surface, padding: cellPad }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: "0.50rem",
            color: tk.muted,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            marginBottom: 5,
          }}>
            {s.label}
          </div>
          <div style={{
            fontFamily: FONT_SS3,
            fontSize: valSize,
            fontWeight: 600,
            color: tk.head,
          }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function Activity({ content }: { content: ActivityContent } & ShellPageProps) {
  const c = content;
  const tk = DARK;

  const { ref: rootRef, width } = useContainerWidth();
  const isMobile  = width > 0 && width < 600;
  const isTablet  = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;

  const hPad      = isMobile ? "1.25rem" : isTablet ? "2.5rem" : "3.75rem";
  const sectionPT = isMobile ? "2rem" : "3rem";

  function Sect({ children, pt, pb }: { children: ReactNode; pt?: string | number; pb?: string | number }) {
    return (
      <div style={{
        maxWidth: isDesktop ? 1200 : undefined,
        margin: "0 auto",
        paddingLeft: hPad,
        paddingRight: hPad,
        paddingTop: pt ?? sectionPT,
        paddingBottom: pb ?? 0,
      }}>
        {children}
      </div>
    );
  }

  const HRule = () => (
    <Sect pt={isMobile ? "2rem" : "2.5rem"} pb={0}>
      <div style={{ borderBottom: `1px solid ${tk.rule}` }} />
    </Sect>
  );

  return (
    <div ref={rootRef} data-scroll="root" style={{ ...SS4_SMOOTHING, background: tk.bg, minHeight: "100vh", fontFamily: FONT_SS3, color: tk.body, position: "relative" }}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      {isDesktop ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 580 }}>
          {/* Left: terrain photograph */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <Photo src={c.heroImage} position="center 28%" label="Image unavailable" style={{ minHeight: 580 }} />
            <div style={{
              position: "absolute",
              top: 0, right: 0, bottom: 0, left: 0,
              background: `linear-gradient(to right, transparent 68%, ${tk.bg} 100%)`,
            }} />
            <div style={{
              position: "absolute",
              bottom: 28,
              left: 36,
              fontFamily: FONT_MONO,
              fontSize: "0.48rem",
              color: "#EDE9E2",
              opacity: 0.40,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              {c.locationLine}
            </div>
          </div>

          {/* Right: clarity capsule */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "3.75rem 3.75rem 3.75rem 3rem",
          }}>
            <div style={{
              fontFamily: FONT_LBL,
              fontSize: "0.58rem",
              letterSpacing: "0.13em",
              color: tk.muted,
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              {c.breadcrumb}
            </div>
            <h1 style={{
              fontFamily: FONT_SS4,
              fontWeight: 300,
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 48, "wght" 300',
              fontSize: "3.2rem",
              lineHeight: 1.08,
              color: tk.head,
              margin: "0 0 1.25rem",
            }}>
              {c.title}
            </h1>
            <p style={{
              fontFamily: FONT_SS3,
              fontSize: "0.95rem",
              lineHeight: 1.72,
              color: tk.body,
              margin: "0 0 2.25rem",
              maxWidth: 400,
            }}>
              {c.lede}
            </p>
            <StatsGrid
              stats={c.stats}
              cols="repeat(3, 1fr)"
              tk={tk}
              cellPad="0.9rem 1.1rem"
              valSize="1.05rem"
            />
          </div>
        </div>

      ) : (
        <>
          <div style={{
            position: "relative",
            height: isMobile ? 520 : 560,
            overflow: "hidden",
          }}>
            <Photo src={c.heroImage} position="center 28%" label="Image unavailable" style={{ alignItems: "flex-start", paddingTop: "30%" }} />
            <div style={{
              position: "absolute",
              top: 0, right: 0, bottom: 0, left: 0,
              background: "linear-gradient(to bottom, rgba(20,18,14,0.08) 0%, rgba(20,18,14,0.72) 58%, #1A1714 100%)",
            }} />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: `0 ${hPad} ${isMobile ? "1.75rem" : "2.25rem"}`,
            }}>
              <div style={{
                fontFamily: FONT_LBL,
                fontSize: "0.58rem",
                letterSpacing: "0.13em",
                color: "#EDE9E2",
                opacity: 0.55,
                marginBottom: 10,
                textTransform: "uppercase",
              }}>
                {c.breadcrumb}
              </div>
              <h1 style={{
                fontFamily: FONT_SS4,
                fontWeight: 300,
                fontStyle: "italic",
                fontVariationSettings: '"opsz" 34, "wght" 300',
                fontSize: isMobile ? "2.1rem" : "2.6rem",
                lineHeight: 1.1,
                color: "#EDE9E2",
                margin: `0 0 ${isMobile ? "0.85rem" : "1.1rem"}`,
              }}>
                {c.title}
              </h1>
              <p style={{
                fontFamily: FONT_SS3,
                fontSize: isMobile ? "0.87rem" : "0.95rem",
                lineHeight: 1.65,
                color: "#EDE9E2",
                opacity: 0.85,
                margin: 0,
                maxWidth: isMobile ? 300 : 480,
              }}>
                {isMobile ? c.ledeMobile : c.ledeTablet}
              </p>
            </div>
          </div>

          <Sect pt={isMobile ? "1.5rem" : "2rem"} pb={0}>
            <StatsGrid
              stats={c.stats.slice(0, 4)}
              cols={isMobile ? "1fr 1fr" : "repeat(4, 1fr)"}
              tk={tk}
              cellPad={isMobile ? "0.85rem 1rem" : "1.1rem 1.25rem"}
              valSize={isMobile ? "1rem" : "1.1rem"}
            />
          </Sect>
        </>
      )}

      {/* ── ACCESS + SEASONALITY ─────────────────────────────────────────── */}
      <Sect>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "1.5rem" : isTablet ? "2.5rem" : "4rem",
        }}>
          <div>
            <SectionLabel text={c.access.heading} tk={tk} />
            {c.access.paragraphs.map((p, i, all) => (
              <p key={i} style={{ fontFamily: FONT_SS3, fontSize: "0.9rem", lineHeight: 1.72, color: tk.body, margin: i < all.length - 1 ? "0 0 0.6rem" : 0 }}>{p}</p>
            ))}
          </div>
          <div>
            <SectionLabel text={c.season.heading} tk={tk} />
            {c.season.paragraphs.map((p, i, all) => (
              <p key={i} style={{ fontFamily: FONT_SS3, fontSize: "0.9rem", lineHeight: 1.72, color: tk.body, margin: i < all.length - 1 ? "0 0 0.6rem" : 0 }}>{p}</p>
            ))}
          </div>
        </div>
      </Sect>

      <HRule />

      {/* ── WIDE TERRAIN IMAGE ────────────────────────────────────────────── */}
      <div style={{
        height: isMobile ? 240 : isTablet ? 320 : 400,
        overflow: "hidden", position: "relative",
        margin: `${isMobile ? "2rem" : "2.75rem"} 0`,
      }}>
        <Photo src={c.wideImage} position="center 44%" label="Image unavailable" />
      </div>

      {/* ── ON THE ROUTE ──────────────────────────────────────────────────── */}
      <Sect pt={0}>
        <SectionLabel text={c.onTheRoute.heading} tk={tk} />
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: isMobile ? "1.25rem" : isTablet ? "2.5rem" : "3rem",
        }}>
          {c.onTheRoute.paragraphs.slice(0, isMobile ? 2 : 3).map((p, i) => (
            <p key={i} style={{ fontFamily: FONT_SS3, fontSize: "0.92rem", lineHeight: 1.8, color: tk.body, margin: 0 }}>{p}</p>
          ))}
        </div>
      </Sect>

      <HRule />

      {/* ── ALONG THE ROUTE (highlights) ─────────────────────────────────── */}
      <Sect>
        <SectionLabel text={c.highlightsHeading} tk={tk} />
        {isDesktop ? (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${c.highlights.length || 1}, 1fr)`, gap: 0 }}>
            {c.highlights.map((h, i) => (
              <div key={i} style={{
                borderLeft: i > 0 ? `1px solid ${tk.rule}` : "none",
                paddingLeft: i > 0 ? "1.75rem" : 0,
                paddingRight: i < c.highlights.length - 1 ? "1.75rem" : 0,
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: "0.65rem", color: tk.bq, marginBottom: 10 }}>→</div>
                <div
                  style={{ fontFamily: FONT_SS3, fontSize: "0.87rem", lineHeight: 1.62, color: tk.body }}
                >
                  {h}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr 1fr" : "1fr",
            gap: isTablet ? "0 2.5rem" : 0,
          }}>
            {c.highlights.slice(0, isMobile ? 3 : 4).map((h, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "0.75rem",
                padding: "0.875rem 0",
                borderBottom: `1px solid ${tk.rule}`,
                alignItems: "flex-start",
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: "0.65rem", color: tk.bq, marginTop: 2, flexShrink: 0 }}>→</div>
                <div
                  style={{ fontFamily: FONT_SS3, fontSize: "0.87rem", lineHeight: 1.62, color: tk.body }}
                >
                  {h}
                </div>
              </div>
            ))}
          </div>
        )}
      </Sect>

      {/* ── PHOTO GRID ────────────────────────────────────────────────────── */}
      <Sect pt={isMobile ? "2rem" : "2.5rem"}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: "0.75rem",
        }}>
          {(isMobile ? [1, 2, 3] : [1, 2, 3, 4]).map(n => (
            <div
              key={n}
              style={{
                background: tk.surface,
                border: `1px solid ${tk.rule}`,
                borderRadius: 4,
                height: isMobile ? 180 : isTablet ? 200 : 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{
                fontFamily: FONT_MONO,
                fontSize: "0.50rem",
                color: tk.muted,
                letterSpacing: "0.08em",
                textAlign: "center",
                padding: "0 0.75rem",
              }}>
                IMAGE UNAVAILABLE
              </span>
            </div>
          ))}
        </div>
      </Sect>

      {/* ── MAP ───────────────────────────────────────────────────────────── */}
      <Sect pt={isMobile ? "2rem" : "2.5rem"}>
        <SectionLabel text="Route Map" tk={tk} />
        <div style={{ height: isMobile ? 300 : isTablet ? 310 : 360, border: "1px solid rgba(196,190,180,0.10)", borderRadius: "0.3rem", overflow: "hidden" }}>
          <Unavailable label="Map unavailable" style={{ background: "#111010" }} />
        </div>
      </Sect>

      <HRule />

      {/* ── PRACTICAL NOTES ───────────────────────────────────────────────── */}
      <Sect>
        <SectionLabel text={c.practical.heading} tk={tk} />
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "1rem" : "4rem",
        }}>
          {c.practical.paragraphs.map((p, i) => (
            <p key={i} style={{ fontFamily: FONT_SS3, fontSize: "0.9rem", lineHeight: 1.72, color: tk.body, margin: 0 }}>{p}</p>
          ))}
        </div>
      </Sect>

      <HRule />

      {/* ── LATERAL EXITS ─────────────────────────────────────────────────── */}
      <Sect>
        <SectionLabel text={c.exitsHeading} tk={tk} />
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: 0,
          marginBottom: "2.5rem",
        }}>
          {c.exits.map((link, i) => (
            <div key={i} style={{
              borderTop: `1px solid ${tk.rule}`,
              borderLeft: (isDesktop && i > 0) ? `1px solid ${tk.rule}` : "none",
              padding: isDesktop
                ? `1.1rem ${i < 2 ? "2rem" : "0"} 1.1rem ${i > 0 ? "2rem" : "0"}`
                : "1rem 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.50rem",
                  color: tk.muted,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}>
                  {link.sub}
                </div>
                <div style={{ fontFamily: FONT_SS3, fontSize: "0.92rem", color: tk.head }}>{link.label}</div>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: "0.85rem", color: tk.bq }}>→</div>
            </div>
          ))}
        </div>

        <SectionLabel text={c.nearbyHeading} tk={tk} />
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 0,
          paddingBottom: "3.5rem",
        }}>
          {c.nearby.map((link, i) => (
            <div key={i} style={{
              borderLeft: i > 0 ? `1px solid ${tk.rule}` : "none",
              paddingLeft: i > 0 ? (isMobile ? "1rem" : "1.75rem") : 0,
              paddingRight: i < 3 ? (isMobile ? "1rem" : "1.75rem") : 0,
            }}>
              <div style={{
                fontFamily: FONT_MONO,
                fontSize: "0.48rem",
                color: tk.muted,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}>
                {link.sub}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: FONT_SS3, fontSize: "0.87rem", color: tk.head }}>{link.label}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: "0.80rem", color: tk.bq }}>→</div>
              </div>
            </div>
          ))}
        </div>
      </Sect>
    </div>
  );
}

