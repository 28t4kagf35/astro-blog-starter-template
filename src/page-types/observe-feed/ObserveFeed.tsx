/**
 * Page type: Observe feed (Sanity type `observePage`).
 * An ever-growing up/down feed of close-ups: picture + tagline, no explainers.
 * Ported from the design export below; its built-in blocks are replaced by the
 * `content` prop (Sanity, build time). Differences from the export:
 *  - Images: none yet -> same-size "image unavailable" boxes that name the
 *    intended media file (from Sanity), to help media matching.
 *  - The export's "spark" prompts (questions linking elsewhere) have no Sanity
 *    field and are explainers: omitted.
 *  - The sticky orientation bar is removed (the site navbar sits there).
 *  - Dark only, as exported.
 * All blocks are baked into the page; images load lazily. When the feed
 * outgrows one page, later blocks can be cut into build-time portions.
 */
/**
 * ObservePage — Observe cluster · fully responsive · v3
 * Derived from ObserveMobile45 (v2) — the authoritative design source.
 * Desktop adaptation: 92vh viewport-fill blocks (same feed concept, wider canvas).
 * Mobile: 4/5 portrait aspect ratio · Tablet/Desktop: 92vh height.
 * Brand system: SS4 italic captions · LBL spark labels · MONO nav
 * EP-1.1 export: CTRL-1 applied · isDark hardened · chrome stripped
 * Slot: observe_20260521_1100
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";

// ── Brand constants (inlined) ─────────────────────────────────────────────────
const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_SS3  = "'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_LBL  = "'Raleway', system-ui, sans-serif";

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
};

// ── Content shape (supplied from Sanity) ──────────────────────────────────────
export type ObserveFeedBlock = {
  id: string;
  image: string;          // "" = no image yet
  mediaFilename?: string; // intended media file, shown on the placeholder
  caption: string;
};
export interface ObserveFeedContent {
  blocks: ObserveFeedBlock[];
}
type Block = ObserveFeedBlock;

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

// ── ObserveBlock ──────────────────────────────────────────────────────────────
function ObserveBlock({ block, isMobile }: { block: Block; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [captionVisible, setCaptionVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          setCaptionVisible(true);
        } else {
          setCaptionVisible(false);
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mobile: portrait 4/5 (fills the phone screen naturally)
  // Tablet/Desktop: 92vh viewport-fill (same endless-feed concept, wider canvas)
  const blockStyle: CSSProperties = isMobile
    ? { position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden", flexShrink: 0 }
    : { position: "relative", width: "100%", height: "92vh",       minHeight: 480,     overflow: "hidden", flexShrink: 0 };

  // Caption padding: tighter on mobile, more generous on desktop
  const captionPad = isMobile ? "2rem 1.5rem 2.2rem" : "2.5rem 3rem 3.2rem";

  // Caption font size: fixed on mobile, fluid clamp on desktop
  const captionSize = isMobile ? "1.0rem" : "clamp(1rem, 1.4vw, 1.18rem)";

  // Max width of caption text: narrower on mobile, wider on desktop
  const captionMax = isMobile ? 320 : 560;

  return (
    <div ref={ref} style={blockStyle}>
      {block.image ? (
        <img
          src={block.image}
          alt=""
          loading="lazy"
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
        />
      ) : (
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: DARK.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: DARK.muted, textAlign: "center", lineHeight: 1.8 }}>
            image unavailable{block.mediaFilename ? <><br />{block.mediaFilename}</> : null}
          </span>
        </div>
      )}

      {/* scrim — from ObserveMobile45 (warmer dark ground colour) */}
      <div style={{
        position: "absolute",
        top: 0, right: 0, bottom: 0, left: 0,
        background: "linear-gradient(to top, rgba(26,23,20,0.92) 0%, rgba(26,23,20,0.65) 22%, rgba(26,23,20,0.18) 46%, transparent 60%)",
      }} />

      {/* caption + spark */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: captionPad,
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
        transform: captionVisible ? "translateY(0)" : "translateY(1.2rem)",
        opacity: captionVisible ? 1 : 0,
        transition: "opacity 0.9s ease, transform 0.9s ease",
      }}>
        {/* field-note caption — SS4 italic, intimate */}
        <p style={{
          fontFamily: FONT_SS4,
          fontSize: captionSize,
          fontWeight: 300,
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 11, "wght" 300',
          color: "rgba(237,233,226,0.88)",
          margin: 0,
          lineHeight: 1.62,
          letterSpacing: "0.01em",
          maxWidth: captionMax,
        }}>
          {block.caption}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ObserveFeed({ content }: { content: ObserveFeedContent }) {
  const blocks = content.blocks;
  // Font loading — display=block (FONT-6)
  useEffect(() => {
    const id = "brand-fonts-observe";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id   = id;
    link.rel  = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300" +
      "&family=Source+Sans+3:wght@300;400" +
      "&family=IBM+Plex+Mono:wght@400" +
      "&family=Raleway:wght@300;400" +
      "&display=block";
    document.head.appendChild(link);
  }, []);

  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";

  // Gap between blocks: tighter on mobile (3.5rem), more breath on desktop (18vh)
  const blockGap = isMobile ? "3.5rem" : "18vh";

  return (
    <div data-scroll="root" style={{ ...SS4_SMOOTHING, background: DARK.bg, minHeight: "100vh", overflowY: "auto", overflowX: "hidden", scrollBehavior: "smooth" }}>

      {/* ── Feed blocks ── */}
      <div style={{ paddingTop: isMobile ? "5rem" : "calc(56px + 6vh)" }}>
        {blocks.map((block, i) => (
          <div key={block.id}>
            <ObserveBlock block={block} isMobile={isMobile} />
            {i < blocks.length - 1 && (
              <div style={{ height: blockGap, background: DARK.bg }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{
        borderTop: `1px solid ${DARK.rule}`,
        padding: isMobile ? "1.8rem 1.25rem" : "2rem 2.5rem",
        display: "flex",
        justifyContent: "space-between",
        marginTop: isMobile ? "3rem" : "6vh",
      }}>
        <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: "0.54rem", color: DARK.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Observe
        </p>
        <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: "0.54rem", color: DARK.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Voss · Hardanger
        </p>
      </div>
    </div>
  );
}
