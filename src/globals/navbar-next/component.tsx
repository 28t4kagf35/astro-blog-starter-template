/**
 * SiteNavNext: experiment based on navbar 1.2.0 (see CHANGELOG.md).
 * Shown only on the -v2 sandbox pages. Desktop: one surface (bar + drawer),
 * slides down. Mobile: the main items slide up when Explore opens.
 */
import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { NavScrollState } from "../navbar/component";

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const FONT_LBL = "'Raleway', system-ui, sans-serif";
const SS4_OPSZ_DISPLAY = '"opsz" 36, "wght" 300';
const SS4_SMOOTHING: CSSProperties = { WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" };

const DARK = {
  bg: "#1A1714", surface: "#222120", rule: "#2C2A28", muted: "#6E6A65",
  body: "#C4BEB4", head: "#EDE9E2", bq: "#7A8B74", accent: "#D43535",
} as const;

// ── Where things go ──────────────────────────────────────────────────────────
type Leaf = { label: string; href?: string };
type Cluster = { label: string; href?: string; children?: Leaf[] };
type TopLabel = "NORWAY" | "EXPLORE" | "THE CABIN" | "ACTIVITIES";

const TOP: { label: TopLabel; href: string }[] = [
  { label: "NORWAY", href: "/" },
  { label: "EXPLORE", href: "/explore" },
  { label: "THE CABIN", href: "/cabin" },
  { label: "ACTIVITIES", href: "/activities" },
];

// Nature has no page of its own; Learn and Experience have no index page yet.
const EXPLORE: Cluster[] = [
  { label: "CULTURE & HISTORY", href: "/explore/culture-history" },
  { label: "NATURE", children: [
    { label: "OBSERVE", href: "/explore/nature/observe" },
    { label: "LEARN" },
    { label: "EXPERIENCE" },
  ] },
  { label: "WATERFALLS", href: "/explore/waterfalls" },
];

const norm = (p: string) => (p.replace(/\/+$/, "") || "/");

/** Which top-level section the current address belongs to. */
function sectionOf(path: string): TopLabel | null {
  const p = norm(path);
  if (p === "/" || p === "/home-v2") return "NORWAY";
  if (p.startsWith("/explore") || ["/learn-v2", "/experience-v2", "/culture-v2", "/observe-v2", "/tvindefossen-v2"].includes(p)) return "EXPLORE";
  if (p.startsWith("/cabin")) return "THE CABIN";
  if (p.startsWith("/activit")) return "ACTIVITIES";
  return null;
}

/** Which Explore sub-item the current address belongs to. */
function subOf(path: string): string | null {
  const p = norm(path);
  if (p.startsWith("/explore/culture-history") || p === "/culture-v2") return "CULTURE & HISTORY";
  if (p.startsWith("/explore/waterfalls") || p === "/tvindefossen-v2") return "WATERFALLS";
  if (p.startsWith("/explore/nature/observe") || p === "/observe-v2") return "OBSERVE";
  if (p.startsWith("/explore/nature/learn") || p === "/learn-v2") return "LEARN";
  if (p.startsWith("/explore/nature/experience") || p === "/experience-v2") return "EXPERIENCE";
  return null;
}

// Two solid colours for every nav item, main or sub (no transparency, so the
// colour does not shift with what is behind it): resting, and lit (hover/current).
const REST = "#A8A49E";
const LIT = DARK.head;
// Mobile main words (large italic) rest at a softer white; lit = full.
const MAIN_REST = "#CFCBC5";

const GLASS_BG = "rgba(19,20,22,0.48)";
const OPEN_BG = "rgba(19,20,22,0.50)";
const OVERLAY_BG = "rgba(19,20,22,0.56)";
const BAR_H = 56;
const MOBILE_BAR_H = 68;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

interface Props {
  scrollState?: NavScrollState;
  isMobile?: boolean;
  hidden?: boolean;
  isDark?: boolean;
  onIsDarkChange?: (_: boolean) => void;
  onAudioToggle?: () => void;
  audioPlaying?: boolean;
  currentPath?: string;
}

/** Small red square in front of the current item (a mark, never a fill). */
function Mark({ on, size = 7 }: { on: boolean; size?: number }) {
  return (
    <span aria-hidden="true" style={{
      position: "absolute", left: 0, top: "50%", width: size, height: size, marginTop: -size / 2,
      background: DARK.accent, opacity: on ? 1 : 0, transition: "opacity 200ms ease-out",
    }} />
  );
}

/** Animates between zero height and the content's own height. */
function Collapse({ open, children, slow }: { open: boolean; children: ReactNode; slow?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0, transition: slow ? `grid-template-rows 420ms ${EASE}, opacity 310ms ease-out` : `grid-template-rows 320ms ${EASE}, opacity 240ms ease-out` }}>
      <div style={{ overflow: "hidden", minHeight: 0 }}>{children}</div>
    </div>
  );
}

export function SiteNavNext({
  scrollState = "soft", isMobile = false, hidden = false, isDark: isDarkProp, onIsDarkChange,
  onAudioToggle, audioPlaying, currentPath = "",
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [natureOpen, setNatureOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [isDarkInt, setIsDarkInt] = useState(true);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [exploreLeft, setExploreLeft] = useState<number | null>(null);

  const exploreRef = useRef<HTMLAnchorElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = isDarkProp !== undefined ? isDarkProp : isDarkInt;
  const toggleDark = () => (onIsDarkChange ? onIsDarkChange(!isDark) : setIsDarkInt((d) => !d));
  const overlayOpen = menuOpen && isMobile;
  const section = sectionOf(currentPath);
  const sub = subOf(currentPath);

  useEffect(() => {
    // On a page inside Explore, the open menu shows where you are: Explore is
    // opened (and Nature, for Observe / Learn / Experience) as the menu appears.
    if (menuOpen) {
      if (isMobile && section === "EXPLORE") {
        setExploreOpen(true);
        if (sub === "OBSERVE" || sub === "LEARN" || sub === "EXPERIENCE") setNatureOpen(true);
      }
      return;
    }
    // On close, nothing moves: the whole menu fades out as one, and the folded
    // state is restored only once it is fully invisible.
    const t = setTimeout(() => { setExploreOpen(false); setNatureOpen(false); }, 650);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);
  useEffect(() => {
    const measure = () => { if (exploreRef.current) setExploreLeft(exploreRef.current.getBoundingClientRect().left); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  const clear = () => {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };
  // Pointer devices: open after 120 ms, close after a 200 ms grace.
  const onExploreEnter = () => { if (isMobile) return; clear(); openTimer.current = setTimeout(() => setExploreOpen(true), 120); setHoverKey("EXPLORE"); };
  const onOtherEnter = (k: string) => { clear(); setExploreOpen(false); setHoverKey(k); };
  const onShellLeave = () => { clear(); setHoverKey(null); closeTimer.current = setTimeout(() => setExploreOpen(false), 200); };
  const onShellEnter = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };
  // Touch: pressing an item lights it, as hover does for a pointer.
  const press = (k: string) => ({
    onTouchStart: () => setHoverKey(k),
    onTouchEnd: () => { setTimeout(() => setHoverKey(null), 280); },
    onTouchCancel: () => setHoverKey(null),
  });
  const touchOnly = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const BAR_LOOK = {
    ghost: { bg: "transparent", blur: "none" },
    veil: { bg: "rgba(19,20,22,0.14)", blur: "none" },
    soft: { bg: "rgba(19,20,22,0.28)", blur: "blur(5px)" },
    glass: { bg: GLASS_BG, blur: "blur(22px)" },
  } as const;
  const look = overlayOpen ? BAR_LOOK.ghost : BAR_LOOK[scrollState];
  const drawerOpen = !isMobile && exploreOpen;

  // One surface: the bar and the drawer share this background, so there is no seam.
  const shellStyle: CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    background: drawerOpen ? OPEN_BG : look.bg,
    backdropFilter: drawerOpen ? "blur(22px)" : look.blur,
    WebkitBackdropFilter: drawerOpen ? "blur(22px)" : look.blur,
    transition: `background 260ms ease-out, transform 416ms ${EASE}`,
    transform: hidden ? "translateY(-100%)" : "translateY(0)",
    boxSizing: "border-box",
  };
  const barRow: CSSProperties = {
    height: isMobile ? MOBILE_BAR_H : BAR_H, boxSizing: "border-box",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    paddingInline: isMobile ? "1.25rem" : "2rem",
  };
  const wordmark: CSSProperties = {
    fontFamily: FONT_LBL, fontSize: "0.92rem", fontWeight: 300, textTransform: "uppercase",
    letterSpacing: "0.30em", color: DARK.head, userSelect: "none", lineHeight: 1,
  };
  const navItem: CSSProperties = {
    fontFamily: FONT_LBL, fontSize: "0.76rem", fontWeight: 400, letterSpacing: "0.14em",
    textTransform: "uppercase", lineHeight: 1, color: DARK.head, userSelect: "none",
    textDecoration: "none", position: "relative", display: "inline-block", paddingBlock: "6px",
    paddingLeft: "1.3rem",
  };
  const overlayNavItem: CSSProperties = {
    ...SS4_SMOOTHING, fontFamily: FONT_SS4, fontSize: "1.85rem", fontWeight: 300, fontStyle: "italic",
    fontVariationSettings: SS4_OPSZ_DISPLAY, letterSpacing: "-0.01em", textTransform: "none",
    color: DARK.head, lineHeight: 1.15, textDecoration: "none", position: "relative", display: "inline-block",
    paddingLeft: "1.4rem", marginLeft: "-1.4rem", transition: "color 200ms ease-out",
  };

  /** One link in the desktop drawer. */
  const panelLink = (item: Leaf, small?: boolean) => {
    const key = "p:" + item.label;
    const active = sub === item.label;
    const hover = hoverKey === key;
    const style: CSSProperties = {
      ...navItem, fontSize: small ? "0.7rem" : "0.76rem", paddingBlock: small ? "0.55rem" : "0.85rem",
      color: active || hover ? LIT : REST,
      transition: "color 200ms ease-out", cursor: item.href ? "pointer" : "default",
    };
    return item.href ? (
      <a key={item.label} href={item.href} style={style} aria-current={active ? "page" : undefined}
         onMouseEnter={() => setHoverKey(key)} onMouseLeave={() => setHoverKey("EXPLORE")}><Mark on={active} size={small ? 5 : 6} />{item.label}</a>
    ) : (
      <span key={item.label} style={style} title="Coming"
        onMouseEnter={() => setHoverKey(key)} onMouseLeave={() => setHoverKey("EXPLORE")}>{item.label}</span>
    );
  };

  /** One row in the mobile sub-list. */
  const mobileSub = (item: Leaf, level: 1 | 2) => {
    const key = "m:" + item.label;
    const active = sub === item.label;
    const hover = hoverKey === key;
    const style: CSSProperties = {
      fontFamily: FONT_LBL, fontSize: level === 1 ? "0.86rem" : "0.76rem", fontWeight: 400,
      letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
      display: "inline-block", position: "relative", paddingBlock: level === 1 ? "0.8rem" : "0.7rem",
      paddingLeft: "1.1rem", marginLeft: "-1.1rem",
      color: active || hover ? LIT : REST,
      transition: "color 200ms ease-out",
    };
    const enter = () => setHoverKey(key);
    const touch = press(key);
    const leave = () => setHoverKey(null);
    return item.href ? (
      <a key={item.label} href={item.href} style={style} aria-current={active ? "page" : undefined} onMouseEnter={enter} onMouseLeave={leave} {...touch}>
        <Mark on={active} size={level === 1 ? 6 : 5} />{item.label}
      </a>
    ) : (
      <span key={item.label} style={style} onMouseEnter={enter} onMouseLeave={leave} {...touch}>{item.label}</span>
    );
  };

  return (
    <div data-scroll style={{ ...SS4_SMOOTHING, WebkitTapHighlightColor: "transparent" }}>
      {/* click-away layer behind the open drawer */}
      {!isMobile && exploreOpen && (
        <div onClick={() => setExploreOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998 }} aria-hidden="true" />
      )}

      <div style={shellStyle} onMouseEnter={onShellEnter} onMouseLeave={onShellLeave}>
        <div style={barRow}>
          {overlayOpen ? <span /> : <span style={wordmark}>Voss Waterfalls</span>}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "2.6rem" }}>
              {TOP.map((t) => {
                const isExplore = t.label === "EXPLORE";
                const active = section === t.label;
                const hover = hoverKey === t.label;
                const color = active || hover || (isExplore && exploreOpen) ? LIT : REST;
                return (
                  <a
                    key={t.label}
                    href={t.href}
                    ref={isExplore ? exploreRef : undefined}
                    aria-current={active ? "page" : undefined}
                    style={{ ...navItem, color, transition: "color 200ms ease-out" }}
                    onMouseEnter={isExplore ? onExploreEnter : () => onOtherEnter(t.label)}
                    onClick={isExplore ? (e) => { if (touchOnly() && !exploreOpen) { e.preventDefault(); setExploreOpen(true); } } : undefined}
                  >
                    <Mark on={active} />{t.label}
                  </a>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : "1.4rem" }}>
            {(!isMobile || overlayOpen) && (
              <button onClick={() => { setAudioOn((v) => !v); onAudioToggle?.(); }}
                onMouseEnter={() => setHoverKey("c:audio")} onMouseLeave={() => setHoverKey(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, width: isMobile ? 44 : "auto", height: isMobile ? 44 : "auto", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                title={audioOn ? "Mute ambient audio" : "Play ambient audio"}>
                <AudioIcon color={hoverKey === "c:audio" ? LIT : REST} on={audioPlaying !== undefined ? audioPlaying : audioOn} />
              </button>
            )}
            {(overlayOpen || !isMobile) && (
              <button onClick={toggleDark}
                onMouseEnter={() => setHoverKey("c:dark")} onMouseLeave={() => setHoverKey(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
                <DarkLightIcon color={hoverKey === "c:dark" ? LIT : REST} isDark={isDark} />
              </button>
            )}
            {isMobile && (
              <button onClick={() => setMenuOpen((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                title={menuOpen ? "Close menu" : "Open menu"}>
                {menuOpen ? <CloseIcon color={DARK.head} /> : <HamburgerIcon color={DARK.head} />}
              </button>
            )}
          </div>
        </div>

        {/* Desktop drawer: part of the same surface, grows down out of the bar */}
        {!isMobile && (
          <Collapse open={exploreOpen}>
            <div style={{ display: "flex", flexDirection: "column", padding: "0.6rem 0 2rem", paddingLeft: exploreLeft != null ? `${exploreLeft}px` : "calc(50% - 5rem)" }}>
              {EXPLORE.map((c) => (
                <div key={c.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  {panelLink(c)}
                  {c.children && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingLeft: "1.1rem", paddingBottom: "0.3rem" }}>
                      {c.children.map((ch) => panelLink(ch, true))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Collapse>
        )}
      </div>

      {/* Mobile overlay: the bottom of the list is fixed; opening Explore only pushes the lines above it upward */}
      {isMobile && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999, background: OVERLAY_BG,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", padding: `${MOBILE_BAR_H}px 2rem 0 3.1rem`,
          overflowY: "auto", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "all" : "none",
          transition: "opacity 480ms ease-out",
        }}>
          <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {TOP.map((t) => {
              const isExplore = t.label === "EXPLORE";
              const active = section === t.label;
              return (
                <div key={t.label}>
                  <a
                    href={t.href}
                    aria-current={active ? "page" : undefined}
                    style={{ ...overlayNavItem, color: active || (isExplore && exploreOpen) || hoverKey === "m:" + t.label ? LIT : MAIN_REST }}
                    onMouseEnter={() => setHoverKey("m:" + t.label)}
                    onMouseLeave={() => setHoverKey(null)}
                    {...press("m:" + t.label)}
                    onClick={isExplore ? (e) => { if (!exploreOpen) { e.preventDefault(); setExploreOpen(true); } } : undefined}
                  >
                    <Mark on={active} size={8} />{t.label}
                  </a>
                  {isExplore && (
                    <Collapse slow open={exploreOpen}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingTop: "1rem", paddingLeft: "1.1rem" }}>
                        {EXPLORE.map((c) => (
                          <div key={c.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            {c.href ? mobileSub(c, 1) : (
                              <span
                                role="button" tabIndex={0}
                                onClick={() => setNatureOpen((v) => !v)}
                                onMouseEnter={() => setHoverKey("m:NATURE")} onMouseLeave={() => setHoverKey(null)} {...press("m:NATURE")}
                                style={{ fontFamily: FONT_LBL, fontSize: "0.86rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: natureOpen || hoverKey === "m:NATURE" ? LIT : REST, paddingBlock: "0.8rem", transition: "color 200ms ease-out", cursor: "pointer", userSelect: "none", display: "inline-block", paddingLeft: "1.1rem", marginLeft: "-1.1rem" }}
                              >
                                {c.label}
                              </span>
                            )}
                            {c.children && (
                              <Collapse slow open={natureOpen}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingLeft: "1.1rem" }}>
                                  {c.children.map((ch) => mobileSub(ch, 2))}
                                </div>
                              </Collapse>
                            )}
                          </div>
                        ))}
                      </div>
                    </Collapse>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ flexGrow: 0, flexShrink: 1, flexBasis: "26dvh" }} />
          <div style={{ paddingBottom: "2.4rem", paddingTop: "1rem" }}>
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
