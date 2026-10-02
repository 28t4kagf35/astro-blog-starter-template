/**
 * SiteNav — vosswaterfalls.no · Site navigation shell element
 * Export slot: sitenav_20260812_1800
 * Type: TYPE 2 SHELL ELEMENT
 *
 * Three states:
 *   ghost  — transparent bar, white text, sits over hero at scroll-zero
 *   glass  — frosted dark bar, appears on scroll
 *   open   — full-screen dark overlay (mobile hamburger / any breakpoint trigger)
 *
 * Layout:
 *   desktop/tablet  [VOSS WATERFALLS]   NORWAY · EXPLORE · ACTIVITIES · THE CABIN   [♪]
 *   mobile          [VOSS WATERFALLS]                                                 [♪]  [≡]
 *
 * Host integration:
 *   <SiteNav
 *     isDark={isDark}
 *     onIsDarkChange={setIsDark}
 *     audioPlaying={audioPlaying}
 *     onAudioToggle={() => audioToggleRef.current?.()}
 *   />
 *
 * All brand constants are inlined below — no workspace alias imports.
 */

import { useState, useEffect, useRef, type CSSProperties } from "react";

// ── Brand constants (inlined from @/lib/brand) ────────────────────────────────
const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_SS3  = "'Source Sans 3', system-ui, sans-serif";   // eslint-disable-line @typescript-eslint/no-unused-vars
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

// No-op — fonts are loaded via <link> in the host shell <head>.
// Kept for call-site compatibility; remove once host confirms font preload.
function useLoadBrandFonts(): void {}

// ── Types ─────────────────────────────────────────────────────────────────────
export type NavScrollState = "ghost" | "veil" | "soft" | "glass";

// All props are documented in host-contract.json.
interface SiteNavProps {
  scrollState?: NavScrollState;
  isMobile?: boolean;
  isTablet?: boolean;
  defaultMenuOpen?: boolean;
  overlayItemStyle?: CSSProperties;
  overlayGlass?: { bg?: string; blur?: string };
  wordmarkFont?: "ss4" | "raleway";
  wordmarkTracking?: string;
  hidden?: boolean;
  isDark?: boolean;
  onIsDarkChange?: (_: boolean) => void;
  onAudioToggle?: () => void;
  audioPlaying?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = ["NORWAY", "EXPLORE", "THE CABIN", "ACTIVITIES"] as const;

// Where each top-level item goes. The Explore panel's own items (Nature,
// Culture & History, Waterfalls) are not links yet.
const NAV_HREFS: Record<typeof NAV_ITEMS[number], string> = {
  "NORWAY": "/",
  "EXPLORE": "/explore",
  "THE CABIN": "/cabin",
  "ACTIVITIES": "/activities",
};

const EXPLORE_CLUSTERS: { title: string; children: string[] }[] = [
  { title: "NATURE",            children: ["OBSERVE", "LEARN", "EXPERIENCE"] },
  { title: "CULTURE & HISTORY", children: [] },
  { title: "WATERFALLS",        children: [] },
];

const GLASS_BG   = "rgba(19, 20, 22, 0.48)";
const OVERLAY_BG = "rgba(19, 20, 22, 0.93)";
const BAR_H        = 56;
const MOBILE_BAR_H = 68;

// ── Component ─────────────────────────────────────────────────────────────────
export function SiteNav({
  scrollState      = "soft",
  isMobile         = false,
  defaultMenuOpen  = false,
  overlayItemStyle = {},
  overlayGlass     = {},
  wordmarkFont     = "raleway",
  wordmarkTracking = "0.30em",
  hidden           = false,
  isDark:          isDarkProp,
  onIsDarkChange,
  onAudioToggle,
  audioPlaying,
}: SiteNavProps) {
  useLoadBrandFonts();

  const [menuOpen,     setMenuOpen]     = useState(defaultMenuOpen);
  const [exploreOpen,  setExploreOpen]  = useState(false);
  const [audioOn,      setAudioOn]      = useState(false);
  const [isDarkInt,    setIsDarkInt]    = useState(true);

  const navRef        = useRef<HTMLDivElement>(null);
  const exploreRef    = useRef<HTMLAnchorElement>(null);
  const hoverOpenRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [exploreLeft, setExploreLeft] = useState<number | null>(null);

  const isDark           = isDarkProp !== undefined ? isDarkProp : isDarkInt;
  const handleDarkToggle = () => onIsDarkChange ? onIsDarkChange(!isDark) : setIsDarkInt(d => !d);

  const overlayOpen = menuOpen && isMobile;

  useEffect(() => {
    if (!menuOpen) setExploreOpen(false);
  }, [menuOpen]);

  // Measure EXPLORE span position for pixel-perfect panel alignment
  useEffect(() => {
    function measure() {
      if (!exploreRef.current) return;
      const rect = exploreRef.current.getBoundingClientRect();
      setExploreLeft(rect.left);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  useEffect(() => {
    if (!exploreRef.current) return;
    const rect = exploreRef.current.getBoundingClientRect();
    setExploreLeft(rect.left);
  }, [exploreOpen]);

  // ── Hover helpers — 500ms open delay, 150ms close grace ──────────────────
  function onExploreMouseEnter() {
    if (isMobile) return;
    if (hoverCloseRef.current) { clearTimeout(hoverCloseRef.current); hoverCloseRef.current = null; }
    hoverOpenRef.current = setTimeout(() => setExploreOpen(true), 500);
  }
  function onExploreMouseLeave() {
    if (isMobile) return;
    if (hoverOpenRef.current) { clearTimeout(hoverOpenRef.current); hoverOpenRef.current = null; }
    hoverCloseRef.current = setTimeout(() => setExploreOpen(false), 150);
  }
  // Moving onto any other top-level item releases the open panel.
  function onOtherItemMouseEnter() {
    if (hoverOpenRef.current)  { clearTimeout(hoverOpenRef.current);  hoverOpenRef.current  = null; }
    if (hoverCloseRef.current) { clearTimeout(hoverCloseRef.current); hoverCloseRef.current = null; }
    setExploreOpen(false);
  }
  function onPanelMouseEnter() {
    if (hoverCloseRef.current) { clearTimeout(hoverCloseRef.current); hoverCloseRef.current = null; }
  }
  function onPanelMouseLeave() {
    hoverCloseRef.current = setTimeout(() => setExploreOpen(false), 150);
  }

  // ── Bar appearance ────────────────────────────────────────────────────────
  const BAR_LOOK = {
    ghost: { bg: "transparent",          blur: "none",        border: "transparent" },
    veil:  { bg: "rgba(19,20,22,0.14)",  blur: "none",        border: "transparent" },
    soft:  { bg: "rgba(19,20,22,0.28)",  blur: "blur(5px)",   border: "transparent" },
    glass: { bg: GLASS_BG,               blur: "blur(22px)",  border: "transparent" },
  } as const;
  const look = overlayOpen ? BAR_LOOK.ghost : BAR_LOOK[scrollState];

  // ── Styles ────────────────────────────────────────────────────────────────
  const barStyle: CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    height: isMobile ? MOBILE_BAR_H : BAR_H,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: isMobile ? "1.25rem" : "2rem",
    zIndex: 1000,
    transition: "background 280ms ease-out, backdrop-filter 280ms ease-out, border-color 280ms ease-out, transform 416ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform:            hidden ? "translateY(-100%)" : "translateY(0)",
    background:           exploreOpen ? "rgba(19,20,22,0.58)" : look.bg,
    backdropFilter:       look.blur,
    WebkitBackdropFilter: look.blur,
    borderBottom:         `1px solid ${look.border}`,
  };

  const wordmark: CSSProperties = {
    ...SS4_SMOOTHING,
    fontFamily: FONT_SS4,
    fontSize: "1.35rem",
    fontWeight: 300,
    fontStyle: "italic",
    fontVariationSettings: SS4_OPSZ_TEXT,
    letterSpacing: "0.01em",
    color: DARK.head,
    cursor: "pointer",
    userSelect: "none",
    lineHeight: 1,
  };

  const wordmarkRaleway: CSSProperties = {
    fontFamily: FONT_LBL,
    fontSize: "0.92rem",
    fontWeight: 300,
    fontStyle: "normal",
    textTransform: "uppercase",
    letterSpacing: wordmarkTracking,
    color: DARK.head,
    cursor: "pointer",
    userSelect: "none",
    lineHeight: 1,
  };

  const navItem: CSSProperties = {
    fontFamily: FONT_LBL,
    fontSize: "0.76rem",
    fontWeight: 400,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    lineHeight: 1,
    color: DARK.head,
    opacity: 0.78,
    cursor: "pointer",
    userSelect: "none",
    transition: "opacity 160ms",
  };

  const monoCtrl: CSSProperties = {
    fontFamily: FONT_LBL,
    fontSize: "0.76rem",
    fontWeight: 400,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: DARK.head,
    opacity: 0.78,
    cursor: "pointer",
    userSelect: "none",
  };

  const overlayNavItem: CSSProperties = {
    ...SS4_SMOOTHING,
    fontFamily: FONT_SS4,
    fontSize: "1.85rem",
    fontWeight: 300,
    fontStyle: "italic",
    fontVariationSettings: SS4_OPSZ_DISPLAY,
    letterSpacing: "-0.01em",
    textTransform: "none",
    color: DARK.head,
    lineHeight: 1.15,
    cursor: "pointer",
    userSelect: "none",
  };

  // Desktop EXPLORE panel cluster titles: exactly the bar's own text style.
  const panelClusterTitle: CSSProperties = { ...navItem, lineHeight: 1.2 };

  const overlaySubItem: CSSProperties = {
    fontFamily: FONT_LBL,
    fontSize: "0.72rem",
    fontWeight: 400,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: DARK.head,
    opacity: 0.78,
    lineHeight: 1.6,
    cursor: "pointer",
    userSelect: "none",
  };

  const overlaySubSubItem: CSSProperties = {
    fontFamily: FONT_LBL,
    fontSize: "0.62rem",
    fontWeight: 400,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: DARK.head,
    opacity: 0.45,
    lineHeight: 1.6,
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <div ref={navRef} data-scroll onMouseEnter={onPanelMouseEnter} onMouseLeave={onPanelMouseLeave} style={SS4_SMOOTHING}>

      {/* ── Nav bar ────────────────────────────────────────────────────────── */}
      <div style={barStyle}>

        {/* Wordmark */}
        {!overlayOpen && (
          wordmarkFont === "raleway" ? (
            <span style={wordmarkRaleway}>Voss Waterfalls</span>
          ) : (
            <span style={wordmark}>
              {isMobile ? "Voss Waterfalls" : (
                <>
                  <span style={{ fontSize: "1.65rem", letterSpacing: "-0.03em" }}>V</span>oss{" "}
                  <span style={{ fontSize: "1.65rem", letterSpacing: "-0.03em" }}>W</span>aterfalls
                </>
              )}
            </span>
          )
        )}
        {overlayOpen && <span />}

        {/* Centre nav items — desktop/tablet only */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "2.6rem" }}>
            {NAV_ITEMS.map((item) => {
              const isExplore = item === "EXPLORE";
              const opacity = exploreOpen ? (isExplore ? 1 : 0.5) : 0.78;
              return (
                <a
                  key={item}
                  href={NAV_HREFS[item]}
                  ref={isExplore ? exploreRef : undefined}
                  style={{ ...navItem, textDecoration: "none", opacity, transition: "opacity 280ms ease-out" }}
                  onMouseEnter={isExplore ? onExploreMouseEnter : onOtherItemMouseEnter}
                >
                  {item}
                </a>
              );
            })}
          </div>
        )}

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "0" : "1.4rem" }}>

          {/* Audio toggle */}
          {(!isMobile || overlayOpen) && (
            <button
              onClick={() => { setAudioOn(v => !v); onAudioToggle?.(); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, opacity: 1, width: isMobile ? 44 : "auto", height: isMobile ? 44 : "auto", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              title={audioOn ? "Mute ambient audio" : "Play ambient audio"}
            >
              <AudioIcon color={DARK.head} on={audioPlaying !== undefined ? audioPlaying : audioOn} />
            </button>
          )}

          {/* Dark / light toggle */}
          {(overlayOpen || !isMobile) && (
            <button
              onClick={handleDarkToggle}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: 0.72 }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <DarkLightIcon color={DARK.head} isDark={isDark} />
            </button>
          )}

          {/* Hamburger / close — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              title={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <CloseIcon color={DARK.head} /> : <HamburgerIcon color={DARK.head} />}
            </button>
          )}
        </div>
      </div>

      {/* ── EXPLORE click-dismiss backdrop — desktop / tablet ─────────────────
          Sits below bar (z 999) and drop panel (z 999); clicking it closes
          the panel without a document-level event listener.               */}
      {!isMobile && exploreOpen && (
        <div
          onClick={() => setExploreOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 998, cursor: "default" }}
          aria-hidden="true"
        />
      )}

      {/* ── EXPLORE drop panel — desktop / tablet ─────────────────────────── */}
      {!isMobile && (
        <div
          onMouseEnter={onPanelMouseEnter}
          onMouseLeave={onPanelMouseLeave}
          style={{
            position: "fixed",
            top: BAR_H,
            left: 0, right: 0,
            background: "rgba(19,20,22,0.58)",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            zIndex: 999,
            opacity: exploreOpen ? 1 : 0,
            transition: "opacity 200ms ease-out",
            pointerEvents: exploreOpen ? "all" : "none",
          }}
        >
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            padding: "2.4rem 0 2.4rem",
            paddingLeft: exploreLeft != null ? `${exploreLeft}px` : "calc(50% - 5rem)",
          }}>
            {EXPLORE_CLUSTERS.map(cluster => (
              <span key={cluster.title} style={{ ...panelClusterTitle, cursor: "pointer", display: "block", paddingBlock: "0.55rem" }}>
                {cluster.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile overlay ──────────────────────────────────────────────────── */}
      {isMobile && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: overlayGlass.bg ?? OVERLAY_BG,
            backdropFilter: overlayGlass.blur ?? "blur(20px)",
            WebkitBackdropFilter: overlayGlass.blur ?? "blur(20px)",
            display: "flex", flexDirection: "column",
            padding: `${MOBILE_BAR_H}px 2rem 0`,
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "all" : "none",
            transition: "opacity 320ms ease-out",
          }}
        >
          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}>
            {NAV_ITEMS.map(item => (
              <div key={item}>
                <a
                  href={NAV_HREFS[item]}
                  style={{ ...overlayNavItem, ...overlayItemStyle, textDecoration: "none" }}
                >
                  {item}
                </a>

                {item === "EXPLORE" && (
                  <div style={{
                    overflow: "hidden",
                    maxHeight: exploreOpen ? "300px" : "0",
                    opacity: exploreOpen ? 1 : 0,
                    transition: "max-height 280ms ease-out, opacity 220ms ease-out",
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.0rem", paddingTop: "1.6rem" }}>
                      {EXPLORE_CLUSTERS.map(cluster => (
                        <div key={cluster.title}>
                          <span style={overlaySubItem}>{cluster.title}</span>
                          {cluster.children.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", paddingTop: "0.5rem", paddingLeft: "1rem" }}>
                              {cluster.children.map(child => (
                                <span key={child} style={overlaySubSubItem}>{child}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "2.4rem", paddingBottom: "2.4rem" }}>
            <span style={{ fontFamily: FONT_LBL, fontSize: "0.92rem", fontWeight: 300, letterSpacing: "0.30em", color: DARK.head, opacity: 0.30, textTransform: "uppercase" }}>
              vosswaterfalls.no
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function AudioIcon({ color, on }: { color: string; on: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M1.5 5.25v4.5H4.5L8.5 13.5v-12L4.5 5.25H1.5z" stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
      {on && (
        <>
          <path d="M10.5 5.25c.9.65 1.4 1.5 1.4 2.25s-.5 1.6-1.4 2.25" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M12.5 3.5c1.5 1.1 2.2 2.5 2.2 4s-.7 2.9-2.2 4" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <line x1="0" y1="1"  x2="22" y2="1"  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="7"  x2="22" y2="7"  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="13" x2="22" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="2" y1="2" x2="14" y2="14" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="14" y1="2" x2="2"  y2="14" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function DarkLightIcon({ color, isDark }: { color: string; isDark: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      style={{ transform: isDark ? "none" : "scaleX(-1)", transformOrigin: "center", transition: "transform 300ms ease" }}
    >
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.2" />
      <path d="M8 2 A6 6 0 0 1 8 14 Z" fill={color} />
    </svg>
  );
}
