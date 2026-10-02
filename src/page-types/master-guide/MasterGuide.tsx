/**
 * Day 4 port (Oct 1): design export kept as-is; only the built-in data
 * (FALLS, CHOOSER_TYPES, CONTENT and inline copy) is replaced by the `content`
 * prop, supplied from Sanity at build time. Missing images render as same-size
 * "image unavailable" boxes. Links point to /explore/waterfalls/<slug>.
 *
 * WaterfallsMasterGuideAligned.tsx
 *
 * Brand-aligned variant of WaterfallsMasterGuide.
 * Structure, content, and data are identical to the original.
 *
 * Changes from original:
 *   - DARK / LIGHT imported from @/lib/brand (not defined locally)
 *   - All type roles replaced with named exports from @/lib/brand
 *   - SectionLabel: T_SECTION_LABEL + 0.82rem override + 1.6rem margin (per component-rules)
 *   - Band divider paddingTop: SEC (per component-rules — must equal section top padding)
 *   - h1: T_PAGE_TITLE + T_SCALE_DISPLAY.pageTitle[bp]
 *   - All inline fontFamily/fontSize/fontWeight literals removed
 */

/**
 * EP-1.1 design-only export derived from the current Waterfalls Master Guide native source.
 * Layout, content, fields, and responsive structure follow the byte-preserved source in native-canon/.
 */

import { Stretch } from "../../site/Stretch";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const SS4 = "'Source Serif 4', Georgia, serif";
const SS3 = "'Source Sans 3', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', monospace";
const LBL = "'Raleway', system-ui, sans-serif";
const FONT_LBL = LBL;
const SS4_OPSZ_DISPLAY = '"opsz" 36, "wght" 300';
const SS4_OPSZ_TEXT = '"opsz" 11, "wght" 300';
const T_PAGE_TITLE: CSSProperties = { fontFamily: SS4, fontSize: "3.8rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_DISPLAY, lineHeight: 1.06, letterSpacing: "-0.01em" };
const T_SECTION_TITLE: CSSProperties = { fontFamily: SS4, fontSize: "2.4rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_DISPLAY, lineHeight: 1.1, letterSpacing: "-0.01em" };
const T_PULL_QUOTE: CSSProperties = { fontFamily: SS4, fontSize: "1.22rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_TEXT, lineHeight: 1.60, letterSpacing: "0.012em" };
const T_SUB_QUOTE: CSSProperties = { fontFamily: SS4, fontSize: "1.08rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_TEXT, lineHeight: 1.60, letterSpacing: "0.01em" };
const T_BODY_FUNCTIONAL: CSSProperties = { fontFamily: SS3, fontSize: "1rem", fontWeight: 300, fontStyle: "normal", lineHeight: 1.82, letterSpacing: "0.02em" };
const T_BODY_SMALL: CSSProperties = { fontFamily: SS3, fontSize: "0.88rem", fontWeight: 300, fontStyle: "normal", lineHeight: 1.70, letterSpacing: "0.01em" };
const T_TAGLINE: CSSProperties = { fontFamily: LBL, fontSize: "1.06rem", fontWeight: 400, letterSpacing: "0.13em", textTransform: "uppercase", lineHeight: 1.4 };
const T_SECTION_LABEL: CSSProperties = { fontFamily: LBL, fontSize: "0.76rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.6 };
const T_CARD_LABEL: CSSProperties = { fontFamily: LBL, fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.6 };
const T_MONO_CAPTION: CSSProperties = { fontFamily: MONO, fontSize: "0.68rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.50 };
const T_MONO_TINY: CSSProperties = { fontFamily: MONO, fontSize: "0.58rem", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.40 };
const T_SCALE_DISPLAY = { pageTitle: { desktop: "3.8rem", tablet: "3.2rem", mobile: "2.6rem" }, sectionTitle: { desktop: "2.4rem", tablet: "2.0rem", mobile: "1.7rem" } } as const;
const T_SCALE_BODY = { desktop: "1rem", mobile: "0.95rem" } as const;
const T_SCALE_TEXT = { pullQuote: { desktop: "1.22rem", tablet: "1.18rem", mobile: "1.08rem" }, subQuote: { desktop: "1.08rem", tablet: "1.04rem", mobile: "1.0rem" } } as const;
const DARK = { bg: "#1A1714", surface: "#222120", rule: "#2C2A28", muted: "#6E6A65", body: "#C4BEB4", head: "#EDE9E2", bq: "#7A8B74", accent: "#D43535" } as const;
const LIGHT = { bg: "#F4F2EE", surface: "#EBE7DF", rule: "#D6D2CB", muted: "#8E8A84", body: "#201E18", head: "#111010", bq: "#A4AE9C", accent: "#D43535" } as const;
const SS4_SMOOTHING: CSSProperties = { WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" };
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300" +
  "&family=Source+Sans+3:wght@300;400" +
  "&family=IBM+Plex+Mono:wght@400" +
  "&family=Raleway:wght@300;400" +
  "&display=block";

type ColorTokens = typeof DARK;

const BASE_URL = "/explore/waterfalls";

/* ─── content shape (supplied from Sanity) ──────────────────────────── */
export type GuideFall = {
  name: string; slug: string; tier: string; image: string; imagePosition: string;
  micro: string; blurb: string; distinguishing: string; chooserCue: string;
  spice: string; tags: string[]; group: string; labels: string[];
};
export type ChooserType = { label: string; copy: string; falls: string[] };
export type CopySection = { key: string; label?: string; heading?: string; paragraphs?: string[]; items?: string[] };

export interface MasterGuideContent {
  heroImage:        { src: string };
  heroHeadline:     string;
  heroSubtitle:     string;
  heroCtaLabel:     string;
  orientHeadline:   string;
  orientLead:       string;
  cabinImage:       { src: string };
  cabinHeadline:    string;
  cabinIntro:       string;
  cabinCtaLabel:    string;
  closingStatement: string;
  falls:            GuideFall[];
  chooserTypes:     ChooserType[];
  sections:         CopySection[];
}

// Same-size honest placeholder for an image slot with no image.
function Unavailable({ tk, style }: { tk: typeof DARK | typeof LIGHT; style?: CSSProperties }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: tk.surface, ...style }}>
      <span style={{ ...T_MONO_CAPTION, color: tk.muted }}>image unavailable</span>
    </div>
  );
}

/* ─── hooks ──────────────────────────────────────────────────────────── */
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

function useFadeIn(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, sv] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { sv(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible: v };
}
function Fade({ children, delay = 0, dur = 1.2 }: { children: ReactNode; delay?: number; dur?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(0.6rem)", transition: `opacity ${dur}s ease ${delay}s, transform ${dur}s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// Band kicker — 0.82rem override distinguishes from card labels (0.76rem base), per component-rules
function SectionLabel({ children, color }: { children: ReactNode; color: string }) {
  return <p style={{ margin: "0 0 1.1rem", ...T_SECTION_LABEL, fontSize: "0.82rem", color }}>{children}</p>;
}

/* ─── sub-components ─────────────────────────────────────────────────── */
function WaterfallCard({ fall, tk, isMobile, isTablet }: { fall: GuideFall; tk: typeof DARK | typeof LIGHT; isMobile: boolean; isTablet: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`${BASE_URL}/${fall.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "block", textDecoration: "none", background: tk.surface, border: `1px solid ${tk.rule}`, borderRadius: "0.4rem", overflow: "hidden", transition: "border-color 0.22s ease" }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: isMobile ? "16/7" : "3/2", overflow: "hidden", background: tk.rule }}>
        {fall.image ? (
          <img src={fall.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: fall.imagePosition, transition: "transform 0.5s ease", transform: hovered ? "scale(1.03)" : "scale(1)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...T_MONO_TINY, color: tk.muted }}>image unavailable</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "rgba(26,23,20,0.32)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(to top, rgba(26,23,20,0.75) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "0.7rem", left: "0.9rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {fall.labels.slice(0, 2).map(l => (
            <span key={l} style={{ ...T_MONO_TINY, color: "#EDE9E2", background: "rgba(26,23,20,0.6)", padding: "0.2rem 0.5rem", borderRadius: 2 }}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: isMobile ? "0.9rem 1rem" : "1.4rem 1.2rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.9rem" }}>
          <p style={{ margin: 0, ...T_CARD_LABEL, color: tk.head }}>{fall.name}</p>
          <p style={{ margin: 0, ...T_MONO_TINY, color: tk.muted, whiteSpace: "nowrap", paddingLeft: "0.6rem" }}>{fall.spice}</p>
        </div>
        {/* T_SUB_QUOTE at canonical size — card distinguishing line */}
        <p style={{ margin: "0 0 0.8rem", ...T_SUB_QUOTE, color: tk.head }}>{fall.distinguishing}</p>
        <p style={{ margin: "0 0 0.9rem", ...T_BODY_SMALL, letterSpacing: "0.02em", color: tk.body, fontSize: isMobile ? "0.85rem" : undefined }}>{fall.micro}</p>
        <div style={{ height: "1px", background: tk.rule, margin: "1.4rem 0 0.8rem" }} />
        <p style={{ margin: 0, ...T_MONO_TINY, color: tk.muted }}>{fall.chooserCue}</p>
      </div>
    </a>
  );
}

function HeroCard({ fall, tk, isMobile, isTablet }: { fall: GuideFall; tk: typeof DARK | typeof LIGHT; isMobile: boolean; isTablet: boolean }) {
  const nameSize = isMobile ? T_SCALE_DISPLAY.sectionTitle.mobile : isTablet ? T_SCALE_DISPLAY.sectionTitle.tablet : T_SCALE_DISPLAY.sectionTitle.desktop;
  const [hovered, setHovered] = useState(false);
  return (
    <a href={`${BASE_URL}/${fall.slug}`} style={{ display: "block", textDecoration: "none", ...(isMobile ? { background: tk.surface, border: `1px solid ${tk.rule}`, borderRadius: "0.3rem", overflow: "hidden" } : {}) }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: "relative", width: "100%", aspectRatio: isMobile ? "16/9" : isTablet ? "16/9" : "16/7", overflow: "hidden", background: tk.rule, borderRadius: isMobile ? 0 : "0.3rem" }}>
        {fall.image ? (
          <img src={fall.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: fall.imagePosition }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...T_MONO_CAPTION, color: tk.muted }}>image unavailable</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "rgba(26,23,20,0.32)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(to top, rgba(26,23,20,0.96) 0%, rgba(26,23,20,0.5) 28%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: isMobile ? "1rem" : "1.8rem", left: isMobile ? "1rem" : "1.6rem", right: isMobile ? "1rem" : "1.6rem" }}>
          <p style={{ margin: "0 0 0.3rem", ...T_CARD_LABEL, color: "#EDE9E2", opacity: 0.72 }}>{fall.spice}</p>
          <h3 style={{ margin: "0 0 0.5rem", ...T_SECTION_TITLE, fontSize: nameSize, color: "#EDE9E2" }}>{fall.name}</h3>
          {!isMobile && (
            <>
              <p style={{ margin: "0 0 0.8rem", ...T_BODY_FUNCTIONAL, color: "rgba(237,233,226,0.85)", maxWidth: "52ch" }}>{fall.blurb}</p>
              <span style={{ ...T_CARD_LABEL, color: "#EDE9E2", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: hovered ? "transparent" : "#4D4A47", transition: "text-decoration-color 0.2s ease" }}>Read more</span>
            </>
          )}
        </div>
      </div>
      {isMobile && (
        <div style={{ padding: "1rem 1rem 1.15rem" }}>
          <p style={{ margin: "0 0 0.9rem", ...T_BODY_FUNCTIONAL, fontSize: T_SCALE_BODY.mobile, color: tk.body }}>{fall.blurb}</p>
          <span style={{ ...T_CARD_LABEL, color: tk.head, textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: tk.rule }}>Read more</span>
        </div>
      )}
    </a>
  );
}

function ReferenceCard({ fall, tk, isMobile }: { fall: GuideFall; tk: typeof DARK | typeof LIGHT; isMobile: boolean }) {
  return (
    <a
      href={`${BASE_URL}/${fall.slug}`}
      style={{ display: "block", textDecoration: "none", borderTop: `1px solid ${tk.rule}`, paddingTop: "2rem", paddingBottom: "2rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.9rem" }}>
        <p style={{ margin: 0, ...T_CARD_LABEL, color: tk.head }}>{fall.name}</p>
        <p style={{ margin: 0, ...T_MONO_TINY, color: tk.muted, paddingLeft: "0.8rem", whiteSpace: "nowrap" }}>{fall.spice}</p>
      </div>
      <p style={{ margin: "0 0 0.85rem", ...T_SUB_QUOTE, color: tk.head, maxWidth: "48ch" }}>{fall.distinguishing}</p>
      <div style={{ height: "1px", background: tk.rule, margin: "1.1rem 0 0.8rem" }} />
      <p style={{ margin: 0, ...T_MONO_TINY, color: tk.muted }}>→ {fall.chooserCue}</p>
    </a>
  );
}

/* ─── main component ─────────────────────────────────────────────────── */

interface WaterfallPageProps {
  content: MasterGuideContent;
  isDark?: boolean;
  registerAudioToggle?: (toggle: () => void) => void;
  onAudioStateChange?: (playing: boolean) => void;
}

export function WaterfallsMasterGuideAligned({
  content: CONTENT,
  isDark: isDarkProp,
  onAudioStateChange,
}: WaterfallPageProps) {
  const FALLS = CONTENT.falls;
  const CHOOSER_TYPES = CONTENT.chooserTypes;
  const HERO_TRIO = FALLS.filter(f => f.tier === "hero");
  const SECONDARY = FALLS.filter(f => f.tier === "secondary");
  const SUPPORT   = FALLS.filter(f => f.tier === "support");
  const sec = (key: string): CopySection => CONTENT.sections.find(x => x.key === key) ?? { key };
  const para = (key: string, i: number) => sec(key).paragraphs?.[i] ?? "";
  const item = (key: string, i: number) => sec(key).items?.[i] ?? "";
  // "Label — body" / "Label · sub" items, split on the first separator only.
  const split = (t: string, sep: string) => { const k = t.indexOf(sep); return k < 0 ? { label: t, sub: "" } : { label: t.slice(0, k), sub: t.slice(k + sep.length) }; };
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const isDesktop = bp === "desktop";

  const [isDarkInt] = useState(true);
  const isDark = isDarkProp !== undefined ? isDarkProp : isDarkInt;
  const tk = isDark ? DARK : LIGHT;

  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

  const [cleared, setCleared] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setCleared(true))); }, []);
  useEffect(() => { const t = setTimeout(() => setTextVisible(true), 400); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (document.querySelector(`link[data-brand-fonts]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    link.setAttribute("data-brand-fonts", "1");
    document.head.appendChild(link);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }, []);

  // Tvindefossen audio is not approved as collection-level Guide audio.
  useEffect(() => { onAudioStateChange?.(false); }, [onAudioStateChange]);

  const [activeChooser, setActiveChooser] = useState<number | null>(null);

  const PAD = isMobile ? "0 1.25rem" : isTablet ? "0 1.4rem" : "0 1rem";
  const COL = "860px";
  const SEC = isMobile ? "3.5rem" : isTablet ? "4.5rem" : "5.5rem";
  const h1Size = isMobile ? T_SCALE_DISPLAY.pageTitle.mobile : isTablet ? T_SCALE_DISPLAY.pageTitle.tablet : T_SCALE_DISPLAY.pageTitle.desktop;
  const h2Size = isMobile ? T_SCALE_DISPLAY.sectionTitle.mobile : isTablet ? T_SCALE_DISPLAY.sectionTitle.tablet : T_SCALE_DISPLAY.sectionTitle.desktop;

  return (
    <div ref={containerRef} data-scroll style={{ width: "100%", background: tk.bg, minHeight: "100%", overflowY: "auto", overflowX: "hidden", fontFamily: SS3, transition: "background 0.35s ease, color 0.35s ease", ...SS4_SMOOTHING }}>
      <style>{`@keyframes apMGA{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.2)}}.apMGA{animation:apMGA 2.2s ease-in-out infinite} a{color:inherit}`}</style>



      {/* ── B1 HERO ─────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", height: isMobile ? "82vh" : isTablet ? "90vh" : "100vh", minHeight: isMobile ? 520 : 640, overflow: "hidden" }}>
        {CONTENT.heroImage.src ? <img src={CONTENT.heroImage.src} data-bb-field="heroImage" alt="" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }} /> : <Unavailable tk={tk} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />}
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(to top, rgba(26,23,20,1) 0%, rgba(26,23,20,0.86) 12%, rgba(0,0,0,0.5) 28%, rgba(0,0,0,0.08) 50%, transparent 65%)", pointerEvents: "none" }} />
        {/* blur reveal */}
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: cleared ? "rgba(14,12,10,0)" : "rgba(14,12,10,0.58)", opacity: cleared ? 0 : 1, transition: "background-color 2.8s ease, opacity 2.8s ease", pointerEvents: "none", zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: isMobile ? "2.2rem" : isTablet ? "3rem" : "4rem", left: isDesktop ? "50%" : 0, transform: isDesktop ? "translateX(-50%)" : "none", width: "100%", maxWidth: isDesktop ? COL : "none", zIndex: 3, padding: PAD, boxSizing: "border-box", opacity: textVisible ? 1 : 0, transition: "opacity 1.4s ease" }}>
          <h1 data-bb-field="heroHeadline" style={{ margin: "0 0 1rem", ...T_PAGE_TITLE, fontSize: h1Size, color: "#EDE9E2", maxWidth: "14ch" }}>{CONTENT.heroHeadline}</h1>
          <p data-bb-field="heroSubtitle" style={{ margin: "0 0 1.6rem", ...T_BODY_FUNCTIONAL, fontSize: isMobile ? T_SCALE_BODY.mobile : undefined, color: "rgba(237,233,226,0.85)", maxWidth: "50ch" }}>
            {CONTENT.heroSubtitle}
          </p>
          <button onClick={() => clusterRef.current?.scrollIntoView({ behavior: "smooth" })} data-bb-field="heroCtaLabel" style={{ background: "none", border: "1px solid rgba(237,233,226,0.4)", cursor: "pointer", padding: "0.65rem 1.3rem", ...T_CARD_LABEL, color: "#EDE9E2", borderRadius: 2 }}>
            {CONTENT.heroCtaLabel}
          </button>
        </div>
      </div>

      {/* ── B2 ORIENTATION ───────────────────────────────────────────────── */}
      <div style={{ padding: isDesktop ? `5rem 1rem 0` : isTablet ? "4rem 1.4rem 0" : "3rem 1.25rem 0", maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          {isDesktop ? (
            <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <SectionLabel color={tk.body}>{sec("ABOUT").heading}</SectionLabel>
                <h2 data-bb-field="orientHeadline" style={{ margin: "0 0 1.4rem", ...T_SECTION_TITLE, fontSize: "1.5rem", color: tk.head }}>{CONTENT.orientHeadline}</h2>
                <p data-bb-field="orientLead" style={{ margin: 0, ...T_SUB_QUOTE, color: tk.head }}>{CONTENT.orientLead}</p>
              </div>
              <div style={{ paddingTop: "2.8rem" }}>
                <p style={{ margin: "0 0 1.3rem", ...T_BODY_FUNCTIONAL, color: tk.body }}>
                  {para("ABOUT", 0)}
                </p>
                <p style={{ margin: "0 0 1.3rem", ...T_BODY_FUNCTIONAL, color: tk.body }}>
                  {para("ABOUT", 1)}
                </p>
                <p style={{ margin: 0, ...T_BODY_FUNCTIONAL, color: tk.body }}>
                  {para("ABOUT", 2)}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <SectionLabel color={tk.body}>{sec("ABOUT").heading}</SectionLabel>
              <h2 data-bb-field="orientHeadline" style={{ margin: "0 0 1.2rem", ...T_SECTION_TITLE, fontSize: h2Size, color: tk.head }}>{CONTENT.orientHeadline}</h2>
              <p data-bb-field="orientLead" style={{ margin: "0 0 1.1rem", ...T_SUB_QUOTE, fontSize: isMobile ? "1rem" : undefined, color: tk.head }}>{CONTENT.orientLead}</p>
              <p style={{ margin: "0 0 1rem", ...T_BODY_FUNCTIONAL, fontSize: isMobile ? T_SCALE_BODY.mobile : undefined, color: tk.body }}>
                {para("ABOUT_SHORT", 0)}
              </p>
              <p style={{ margin: 0, ...T_BODY_FUNCTIONAL, fontSize: isMobile ? T_SCALE_BODY.mobile : undefined, color: tk.body }}>
                {para("ABOUT_SHORT", 1)}
              </p>
            </div>
          )}
        </Fade>
      </div>

      {/* support facts strip */}
      <div style={{ padding: isDesktop ? "3rem 1rem 0" : isTablet ? "2.5rem 1.4rem 0" : "2rem 1.25rem 0", maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade delay={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", borderTop: `1px solid ${tk.rule}`, paddingTop: "1.4rem", gap: "1.2rem" }}>
            {(sec("STATS").items ?? []).map(t => split(t, " · ")).map(({ label, sub }) => (
              <div key={label}>
                <span style={{ ...T_CARD_LABEL, color: tk.head, display: "block", marginBottom: "0.6rem" }}>{label}</span>
                <p style={{ margin: 0, ...T_BODY_SMALL, letterSpacing: "0.02em", color: tk.body }}>{sub}</p>
              </div>
            ))}
          </div>
        </Fade>
      </div>

      {/* ── B3 CHOOSER ───────────────────────────────────────────────────── */}
      <div style={{ padding: isDesktop ? `${SEC} 1rem 0` : isTablet ? `${SEC} 1.4rem 0` : `${SEC} 1.25rem 0`, maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          <div style={{ borderTop: `1px solid ${tk.rule}`, paddingTop: SEC }}>
            <SectionLabel color={tk.body}>{sec("CHOOSER_INTRO").label}</SectionLabel>
            <h2 style={{ margin: "0.5rem 0 1.2rem", ...T_SECTION_TITLE, fontSize: h2Size, color: tk.head, maxWidth: "20ch" }}>{sec("CHOOSER_INTRO").heading}</h2>
            <p style={{ margin: `0 0 ${isMobile ? "1.6rem" : "2.2rem"}`, ...T_BODY_FUNCTIONAL, fontSize: isMobile ? T_SCALE_BODY.mobile : undefined, color: tk.body, maxWidth: "52ch" }}>
              {para("CHOOSER_INTRO", 0)}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr 1fr", border: `1px solid ${tk.rule}`, borderRadius: "0.4rem", overflow: "hidden" }}>
              {CHOOSER_TYPES.map((ct, i) => {
                const cols = isMobile ? 1 : isTablet ? 2 : 4;
                const isRight = (i + 1) % cols !== 0;
                const isBottomRow = i >= CHOOSER_TYPES.length - cols;
                const isActive = activeChooser === i;
                return (
                  <div
                    key={ct.label}
                    onClick={() => setActiveChooser(isActive ? null : i)}
                    style={{
                      padding: isMobile ? "1rem" : "1.2rem 1.2rem 1.5rem",
                      borderRight: isRight ? `1px solid ${tk.rule}` : "none",
                      borderBottom: !isBottomRow ? `1px solid ${tk.rule}` : "none",
                      background: isActive ? tk.rule : tk.surface,
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <p style={{ margin: "0 0 0.6rem", ...T_CARD_LABEL, color: tk.head }}>{ct.label}</p>
                    {isActive && (
                      <>
                        <p style={{ margin: "0 0 0.6rem", ...T_BODY_SMALL, letterSpacing: "0.02em", color: tk.body }}>{ct.copy}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                          {ct.falls.map(name => (
                            <a key={name} href={`${BASE_URL}/${FALLS.find(f => f.name === name)?.slug}`} style={{ ...T_MONO_TINY, color: tk.head, background: tk.bg, padding: "0.2rem 0.55rem", borderRadius: 2, textDecoration: "none" }}>{name}</a>
                          ))}
                        </div>
                      </>
                    )}
                    {!isActive && <p style={{ margin: 0, ...T_BODY_SMALL, letterSpacing: "0.02em", color: tk.body }}>{ct.falls.join(" · ")}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </Fade>
      </div>

      {/* ── B4 HERO TRIO ─────────────────────────────────────────────────── */}
      <div style={{ padding: isDesktop ? `${SEC} 1rem 0` : isTablet ? `${SEC} 1.4rem 0` : `${SEC} 1.25rem 0`, maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          <div style={{ borderTop: `1px solid ${tk.rule}`, paddingTop: SEC }}>
            <SectionLabel color={tk.body}>{item("TIER_LABELS", 0)}</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1.8rem" : "2.5rem" }}>
              {HERO_TRIO.map((fall, i) => (
                <Fade key={fall.name} delay={i * 0.1}>
                  <HeroCard fall={fall} tk={tk} isMobile={isMobile} isTablet={isTablet} />
                </Fade>
              ))}
            </div>
          </div>
        </Fade>
      </div>

      {/* secondary features */}
      <div ref={clusterRef} style={{ padding: isDesktop ? `${SEC} 1rem 0` : isTablet ? `${SEC} 1.4rem 0` : `${SEC} 1.25rem 0`, maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          <div style={{ borderTop: `1px solid ${tk.rule}`, paddingTop: SEC }}>
            <SectionLabel color={tk.body}>{item("TIER_LABELS", 1)}</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "1.2rem" : "1.4rem" }}>
              {SECONDARY.map((fall, i) => (
                <Fade key={fall.name} delay={i * 0.08}>
                  <WaterfallCard fall={fall} tk={tk} isMobile={isMobile} isTablet={isTablet} />
                </Fade>
              ))}
            </div>
          </div>
        </Fade>
      </div>

      {/* ── B5 FULL CLUSTER by group ─────────────────────────────────────── */}
      <div style={{ padding: isDesktop ? `${SEC} 1rem 0` : isTablet ? `${SEC} 1.4rem 0` : `${SEC} 1.25rem 0`, maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          <div style={{ borderTop: `1px solid ${tk.rule}`, paddingTop: SEC }}>
            <SectionLabel color={tk.body}>{item("TIER_LABELS", 2)}</SectionLabel>
            <p style={{ margin: `0 0 ${isMobile ? "1rem" : "1.4rem"}`, ...T_SUB_QUOTE, color: tk.head, maxWidth: "44ch" }}>
              {para("SUPPORT_INTRO", 0)}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr", gap: 0 }}>
              {SUPPORT.map((fall, i) => (
                <Fade key={fall.name} delay={i * 0.07}>
                  <div style={{ paddingRight: isDesktop ? (i < 2 ? "2.5rem" : 0) : 0 }}>
                    <ReferenceCard fall={fall} tk={tk} isMobile={isMobile} />
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </Fade>
      </div>

      {/* ── GUIDE SUPPORT — Seasonality & Access ─────────────────────────── */}
      <div style={{ padding: isDesktop ? `${SEC} 1rem 0` : isTablet ? `${SEC} 1.4rem 0` : `${SEC} 1.25rem 0`, maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          <div style={{ borderTop: `1px solid ${tk.rule}`, paddingTop: SEC }}>
            <SectionLabel color={tk.body}>{sec("PLANNING").label}</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr", gap: isMobile ? "1.4rem" : "2rem" }}>
              {(sec("PLANNING").items ?? []).map(t => { const p = split(t, " — "); return { label: p.label, body: p.sub }; }).map(({ label, body }) => (
                <div key={label}>
                  <p style={{ margin: "0 0 0.6rem", ...T_CARD_LABEL, color: tk.head }}>{label}</p>
                  <p style={{ margin: 0, ...T_BODY_SMALL, letterSpacing: "0.02em", color: tk.body }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </div>

      {/* ── B6 CABIN FUNNEL ──────────────────────────────────────────────── */}
      <div style={{ padding: isDesktop ? `${SEC} 1rem 0` : isTablet ? `${SEC} 1.4rem 0` : `${SEC} 1.25rem 0`, maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          <div style={{ borderTop: `1px solid ${tk.rule}`, paddingTop: SEC }}>
            <div style={{ background: tk.surface, border: `1px solid ${tk.rule}`, borderRadius: "0.4rem", overflow: "hidden" }}>
              <div style={{ width: "100%", aspectRatio: isMobile ? "16/9" : "16/5", overflow: "hidden", position: "relative", background: "#2C2A28" }}>
                {CONTENT.cabinImage.src ? <img src={CONTENT.cabinImage.src} data-bb-field="cabinImage" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} /> : <Unavailable tk={tk} />}
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "rgba(26,23,20,0.32)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(to top, rgba(26,23,20,0.72) 0%, transparent 55%)", pointerEvents: "none" }} />
              </div>
              <div style={{ padding: isMobile ? "1.4rem 1.25rem 1.6rem" : isTablet ? "1.8rem 1.5rem 2rem" : "1.4rem 1.2rem 1.8rem" }}>
                {isDesktop ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "start" }}>
                    <div>
                      <SectionLabel color={tk.body}>{sec("STAY").label}</SectionLabel>
                      <h2 data-bb-field="cabinHeadline" style={{ margin: "0 0 1rem", ...T_SECTION_TITLE, fontSize: "1.6rem", color: tk.head }}>{CONTENT.cabinHeadline}</h2>
                      <p data-bb-field="cabinIntro" style={{ margin: 0, ...T_SUB_QUOTE, color: tk.head }}>{CONTENT.cabinIntro}</p>
                    </div>
                    <div style={{ paddingTop: "2.6rem" }}>
                      <p style={{ margin: "0 0 1.2rem", ...T_BODY_FUNCTIONAL, color: tk.body }}>
                        {para("STAY", 0)}
                      </p>
                      <p style={{ margin: "0 0 1.6rem", ...T_BODY_FUNCTIONAL, color: tk.body }}>
                        {para("STAY", 1)}
                      </p>
                      <a href="/cabin" data-bb-field="cabinCtaLabel" style={{ ...T_CARD_LABEL, color: tk.body, textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: isDark ? "#4D4A47" : "#B2AEA8", transition: "text-decoration-color 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.textDecorationColor = "transparent")} onMouseLeave={e => (e.currentTarget.style.textDecorationColor = isDark ? "#4D4A47" : "#B2AEA8")}>{CONTENT.cabinCtaLabel}</a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <SectionLabel color={tk.body}>{sec("STAY").label}</SectionLabel>
                    <h2 data-bb-field="cabinHeadline" style={{ margin: "0 0 0.9rem", ...T_SECTION_TITLE, fontSize: h2Size, color: tk.head }}>{CONTENT.cabinHeadline}</h2>
                    <p data-bb-field="cabinIntro" style={{ margin: "0 0 1rem", ...T_SUB_QUOTE, fontSize: isMobile ? "0.96rem" : undefined, color: tk.head }}>{CONTENT.cabinIntro}</p>
                    <p style={{ margin: "0 0 1.2rem", ...T_BODY_FUNCTIONAL, fontSize: isMobile ? T_SCALE_BODY.mobile : undefined, color: tk.body }}>
                      {para("STAY_SHORT", 0)}
                    </p>
                    <a href="/cabin" data-bb-field="cabinCtaLabel" style={{ ...T_CARD_LABEL, color: tk.body, textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: isDark ? "#4D4A47" : "#B2AEA8", transition: "text-decoration-color 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.textDecorationColor = "transparent")} onMouseLeave={e => (e.currentTarget.style.textDecorationColor = isDark ? "#4D4A47" : "#B2AEA8")}>{CONTENT.cabinCtaLabel} →</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Fade>
      </div>

      {/* ── CLOSE ────────────────────────────────────────────────────────── */}
      <div style={{ padding: isDesktop ? "5rem 1rem 0" : isTablet ? "4rem 1.4rem 0" : "3.5rem 1.25rem 0", maxWidth: isDesktop ? COL : "none", margin: isDesktop ? "0 auto" : 0 }}>
        <Fade>
          <div style={{ borderTop: `1px solid ${tk.rule}`, paddingTop: SEC }}>
            <p data-bb-field="closingStatement" style={{ margin: "0 0 2.4rem", ...T_SECTION_TITLE, fontSize: h2Size, color: tk.head, maxWidth: "32ch" }}>{CONTENT.closingStatement}</p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", borderTop: `1px solid ${tk.rule}` }}>
              {[
                { label: "Observe", sub: item("ONWARD", 0), href: "/explore/nature/observe" },
                { label: "Hiking", sub: item("ONWARD", 1), href: "/activities/kiellandbu" },
                { label: "The cabin", sub: item("ONWARD", 2), href: "/cabin" },
              ].map(({ label, sub, href }, i) => (
                <div key={label} style={{ position: "relative",
                  padding: isMobile ? "1.1rem 0" : "1.4rem 1.8rem 1.4rem 0",
                  borderRight: !isMobile && i < 2 ? `1px solid ${tk.rule}` : "none",
                  paddingLeft: !isMobile && i > 0 ? "1.8rem" : 0,
                  cursor: "pointer",
                }}>
                  <Stretch href={href} label={label} />
                  <p style={{ margin: "0 0 0.6rem", ...T_CARD_LABEL, color: tk.head }}>{label}</p>
                  <p style={{ margin: 0, ...T_BODY_SMALL, letterSpacing: "0.02em", color: tk.body }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </div>
      <div style={{ height: isMobile ? "10vh" : "16vh" }} />
    </div>
  );
}
