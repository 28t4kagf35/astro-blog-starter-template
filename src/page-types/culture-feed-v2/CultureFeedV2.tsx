/**
 * Page type: Culture & History snack-card feed (Sanity type `cultureArticle`).
 * Ported from the design export below (hero + cards with a downward expand);
 * its built-in entries are replaced by the `content` prop (Sanity, build time).
 *
 * Feed behaviour (ideated Oct 2 2026, to be judged in rendering):
 *  - One vertical column on every screen. Desktop/tablet: a narrow centred
 *    column (FEED_MAX) instead of the export's two-column grid ("Option A").
 *  - Soft scroll snap per card (proximity); switched off while a card is open.
 *  - Downward expand in place; all text is in the page (baked at build time).
 *  - Deep links: /explore/culture-history/<slug> renders the same feed, opened
 *    at that card (scrolled to it, expanded).
 *  - Left/right arrow keys move to the previous/next card.
 *  - Images: none yet -> same-size "image unavailable" boxes.
 *  - isDark comes from the shell (the export had it fixed to dark).
 *  - Hero title, labels and footer labels are the export's own text.
 */
/**
 * culture_20260521_1100 — Culture & History cluster
 * Single responsive component: mobile <600 · tablet 600–1023 · desktop ≥1024
 * 15 articles · brand tokens · dark default · fade-in cards
 * Export: EP-1.1
 *   1. @/lib/brand inlined
 *   2. CTRL-1 applied — mobile nav, tablet/desktop chrome stripped; isDark hardened to true
 *   3. backdropFilter stripped x4 (COMPAT-2)
 *   4. useLoadBrandFonts replaced with font injection useEffect
 *   5. CONTENT interface + const added for heroImage (B1_HERO)
 */

import { Hero } from "../../site/Hero";
import { mediaSrcSet } from "../../site/media";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// ── Inlined brand tokens ───────────────────────────────────────────────────────

const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_SS3  = "'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_LBL  = "'Raleway', system-ui, sans-serif";

const SS4_OPSZ_DISPLAY = '"opsz" 36, "wght" 300';

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

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300" +
  "&family=Source+Sans+3:wght@300;400" +
  "&family=IBM+Plex+Mono:wght@400" +
  "&family=Raleway:wght@300;400" +
  "&display=block";

// ── Content shape (supplied from Sanity) ──────────────────────────────────────
export type CultureCardV2 = {
  slug: string;
  title: string;
  teaser: string[];
  expanded: string[];
  image: string;
  imagePosition: string;
};
export interface CultureFeedV2Content {
  heroImage: { src: string; position: string };
  cards: CultureCardV2[];
  /** Deep link: open the feed at this card. */
  focusSlug?: string;
}

const FEED_MAX = 860; // px: the reading column (canon)

function Unavailable({ tk }: { tk: typeof DARK | typeof LIGHT }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: tk.surface }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: tk.muted }}>image unavailable</span>
    </div>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useBreakpoint() {
  const get = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    return w >= 1024 ? "desktop" : w >= 600 ? "tablet" : "mobile";
  };
  const [bp, setBp] = useState<"desktop" | "tablet" | "mobile">("desktop"); // SSR-safe: real value set on mount
  useEffect(() => {
    const h = () => setBp(get());
    h();
    globalThis.addEventListener("resize", h);
    return () => globalThis.removeEventListener("resize", h);
  }, []);
  return bp;
}

function useFadeIn(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── ArticleCard ───────────────────────────────────────────────────────────────

function ArticleCard({
  entry,
  tk,
  isMobile,
  isTablet,
  startOpen,
  onOpen,
}: {
  entry: CultureCardV2;
  tk: typeof DARK | typeof LIGHT;
  isMobile: boolean;
  isTablet: boolean;
  startOpen: boolean;
  onOpen: () => void;
}) {
  const { ref, visible } = useFadeIn();
  const [expanded, setExpanded] = useState(startOpen);
  const imgRatio  = isMobile ? "4 / 5" : "3 / 2";
  const titleSz   = isMobile ? "1.32rem" : isTablet ? "1.24rem" : "1.4rem";
  const bodySz    = isMobile ? "0.95rem" : isTablet ? "0.9rem"  : "0.98rem";
  const padH      = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem"; // canon gutters
  const pad       = `1.4rem ${padH} 0`;

  return (
    <div
      ref={ref}
      id={entry.slug}
      data-card
      style={{
        scrollSnapAlign: "start",
        borderTop:  `1px solid ${tk.rule}`,
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(0.8rem)",
        transition: "opacity 1.1s ease, transform 1.1s ease",
      }}
    >
      <div style={{
        position:    "relative",
        width:       "100%",
        aspectRatio: imgRatio,
        overflow:    "hidden",
        background:  tk.surface,
      }}>
{entry.image ? (
          <img
            src={entry.image}
            srcSet={mediaSrcSet(entry.image)}
            sizes="(min-width: 1024px) 860px, 100vw"
            alt=""
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: entry.imagePosition }}
          />
        ) : (
          <Unavailable tk={tk} />
        )}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(to top, rgba(26,23,20,0.55) 0%, transparent 50%)",
        }} />
      </div>

      <div style={{ padding: pad }}>
        <h2 style={{
          margin:                "0 0 0.9rem",
          fontFamily:            FONT_SS4,
          fontSize:              titleSz,
          fontWeight:            300,
          fontStyle:             "italic",
          fontVariationSettings: SS4_OPSZ_DISPLAY,
          color:                 tk.head,
          lineHeight:            1.18,
          letterSpacing:         "-0.01em",
        }}>
          {entry.title}
        </h2>

        <p style={{
          margin:     0,
          fontFamily: FONT_SS3,
          fontSize:   bodySz,
          fontWeight: 300,
          lineHeight: 1.78,
          color:      tk.body,
        }}>
          {entry.teaser[0]}
        </p>
        {entry.teaser.slice(1).map((t, i) => (
          <p key={i} style={{ margin: "0.9rem 0 0", fontFamily: FONT_SS3, fontSize: bodySz, fontWeight: 300, lineHeight: 1.78, color: tk.body }}>{t}</p>
        ))}

        {!expanded && (
          <button
            onClick={() => { setExpanded(true); onOpen(); }}
            style={{
              display:    "flex",
              alignItems: "center",
              width:      "100%",
              margin:     "1rem 0 0",
              padding:    "0.6rem 0",
              background: "none",
              border:     "none",
              cursor:     "pointer",
            }}
          >
            <span style={{
              fontFamily:    FONT_LBL,
              fontSize:      "0.72rem",
              fontWeight:    400,
              color:         tk.body,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
            }}>
              Continue this story ↓
            </span>
          </button>
        )}

        {/* Downward expand. Text is always in the page; the row animates open. */}
        <div style={{
          display:          "grid",
          gridTemplateRows: expanded ? "1fr" : "0fr",
          transition:       "grid-template-rows 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <div style={{ overflow: "hidden", minHeight: 0 }}>
            {entry.expanded.map((t, i) => (
              <p key={i} style={{ margin: "0.9rem 0 0", fontFamily: FONT_SS3, fontSize: bodySz, fontWeight: 300, lineHeight: 1.78, color: tk.body }}>{t}</p>
            ))}
          </div>
        </div>

        <div style={{ height: "3.2rem" }} />
      </div>
    </div>
  );
}

// ── CulturePage ───────────────────────────────────────────────────────────────

export function CultureFeedV2({ content, isDark = true }: { content: CultureFeedV2Content; isDark?: boolean }) {
  useEffect(() => {
    const doc = globalThis["document"];
    if (doc.querySelector("link[data-brand-fonts]")) return;
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    link.setAttribute("data-brand-fonts", "1");
    doc.head.appendChild(link);
  }, []);

  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const tk = isDark ? DARK : LIGHT;

  // Soft snap per card while nothing is open; off once a card is expanded
  // (a tall open card must scroll freely).
  const [anyOpen, setAnyOpen] = useState(Boolean(content.focusSlug));
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollSnapType = anyOpen ? "none" : "y proximity";
    return () => { root.style.scrollSnapType = ""; };
  }, [anyOpen]);

  // Deep link: start at the focused card.
  useEffect(() => {
    if (!content.focusSlug) return;
    document.getElementById(content.focusSlug)?.scrollIntoView({ block: "start" });
  }, [content.focusSlug]);

  // Left/right arrows: previous/next card.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-card]"));
      const y = window.scrollY + 8;
      const tops = cards.map((c) => c.getBoundingClientRect().top + window.scrollY);
      let target: number | undefined;
      if (e.key === "ArrowRight") target = tops.find((t) => t > y);
      else target = [...tops].reverse().find((t) => t < y - 16);
      if (target !== undefined) window.scrollTo({ top: target, behavior: "smooth" });
      else if (e.key === "ArrowLeft") window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [cleared, setCleared]         = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setCleared(true))); }, []);
  useEffect(() => { const t = setTimeout(() => setTextVisible(true), 400); return () => clearTimeout(t); }, []);

  const h1Sz     = isMobile ? "2.6rem"  : isTablet ? "3.2rem" : "4rem";
  const gridCols = "1fr";                                  // one column on every screen
  const maxW     = isMobile ? "none" : `${FEED_MAX}px`;   // reading column on tablet/desktop
  const gridPad  = "0 0";
  // canon gutters; hero and footer text line up with the feed column
  const padH     = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem";
  const colX     = isMobile ? padH : `max(${padH}, calc((100% - ${FEED_MAX}px) / 2 + ${padH}))`;

  return (
    <div data-scroll style={{ ...SS4_SMOOTHING,
      background: tk.bg,
      minHeight:  "100vh",
      overflowX:  "hidden",
      transition: "background 0.35s ease",
    }}>

      {/* ── HERO — shared with the other v2 pages ── */}
      <Hero image={content.heroImage.src} srcSet={mediaSrcSet(content.heroImage.src)} position={content.heroImage.position} title={<>Culture<br />& History</>} tagline="Voss · Hardanger" isMobile={isMobile} isTablet={isTablet} isDesktop={!isMobile && !isTablet} />

      {/* ── ARTICLE GRID ── */}
      <div data-bb-field="entries" style={{ maxWidth: maxW, margin: "0 auto", padding: gridPad }}>
        <div style={{
          display:             "grid",
          gridTemplateColumns: gridCols,
          gap:                 isMobile ? 0 : "0 3px",
        }}>
          {content.cards.map(entry => (
            <ArticleCard
              key={entry.slug}
              entry={entry}
              tk={tk}
              isMobile={isMobile}
              isTablet={isTablet}
              startOpen={entry.slug === content.focusSlug}
              onOpen={() => setAnyOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div data-bb-field="footerRegionLabel" style={{
        borderTop:      `1px solid ${tk.rule}`,
        padding:        `1.8rem ${colX}`,
        display:        "flex",
        justifyContent: "space-between",
      }}>
        <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: "0.58rem", color: tk.muted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
          Culture · History
        </p>
        <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: "0.58rem", color: tk.muted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
          Voss · Hardanger
        </p>
      </div>
    </div>
  );
}
