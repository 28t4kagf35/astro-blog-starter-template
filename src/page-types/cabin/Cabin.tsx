/**
 * Page type: The Cabin (Sanity type `cabinPage`).
 * Ported from the design export (cabin_20260521_1100); its built-in text is
 * replaced by the `content` prop (Sanity, build time). Differences:
 *  - Images come from Sanity (fetched at build). A place without an image
 *    shows a same-size "image unavailable" box.
 *  - NO stay planner (not part of this build). The "stay" panel that opened as
 *    a full-screen overlay in the design is a plain section in the page flow
 *    (no scroll takeover, no "Back to The Cabin" bar).
 *  - The design's quotes "Time slowed down…" and "We said very little…" are
 *    not in Sanity and therefore not shown.
 *  - Amenity icons row and the footer lines are the design's own text
 *    (Sanity holds only part of them).
 *  - Fonts come from the frame. Width is read after load.
 */
import React, { createContext, useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import type { ShellPageProps } from "../../shell/SiteShell";

export interface CabinContent {
  /** Images by place on the page (from Sanity). A place without an image shows "image unavailable". */
  images: Record<string, { src: string; srcSet: string; position: string; alt: string }>;
  heroLabel: string;
  placeHeading: string;
  placeParagraphs: string[];
  riversHeading: string;
  riversLine: string;
  gorgeCaption: string;
  cascadeCaption: string;
  ritual: string[];
  longingLine: string;
  longingClosing: string;
  insideLabel: string;
  stayLabel: string;
  amenitiesHeading: string;
  amenities: Array<{ title: string; items: string[] }>;
  guestNote: string;
  guestNoteAttribution: string;
  closeHeading: string;
}

const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_SS3  = "'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_LBL  = "'Raleway', system-ui, sans-serif";
const OPSZ_DISPLAY = '"opsz" 36, "wght" 300';
const OPSZ_TEXT    = '"opsz" 11, "wght" 300';
const SMOOTH: CSSProperties = { WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" };

const DARK = { surface: "#222120", divider: "#2C2A28", cream: "#EDE9E2", body: "#C4BEB4", dim: "rgba(237,233,226,0.55)", sage: "#7A8B74" };
const LIGHT = { ground: "#F4F2EE", surface: "#EBE7DF", rule: "#D6D2CB", muted: "#8E8A84", body: "#201E18", head: "#111010" };
const ON_IMAGE = { head: "rgba(237,233,226,0.96)", body: "rgba(196,190,180,0.82)" };
const CABIN_BG = "#131416";
const BP_SM = 640;
const BP_MD = 1024;

function useWindowWidth(): number {
  const [w, setW] = useState(390); // mobile first; settles on the real width after load
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on, { passive: true });
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}

/** Same-size stand-in for an image that does not exist yet. */
function NoImage({ abs, style }: { abs?: boolean; style?: CSSProperties }) {
  return (
    <div style={{
      ...(abs ? { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } : { width: "100%", height: "100%" }),
      background: "#1B1A18", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT_MONO, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#6E6A65", ...style,
    }}>
      image unavailable
    </div>
  );
}

const ImgCtx = createContext<CabinContent["images"]>({});

/** The image for one place on the page, or the honest placeholder. */
function Pic({ slot, abs, filter, style }: { slot: string; abs?: boolean; filter?: string; style?: CSSProperties }) {
  const img = useContext(ImgCtx)[slot];
  if (!img) return <NoImage abs={abs} style={style} />;
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes="100vw"
      alt={img.alt}
      loading="lazy"
      style={{
        ...(abs ? { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } : {}),
        width: "100%", height: "100%", objectFit: "cover", objectPosition: img.position, display: "block", filter,
      }}
    />
  );
}

const VIGNETTE = "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 100%)";
const shade = (bg: string): CSSProperties => ({ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: bg, pointerEvents: "none" });

const lines = (t: string) => t.split("\n").map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>);

// ── B1 · Arrival ───────────────────────────────────────────────────────────
function Arrival({ c }: { c: CabinContent }) {
  const w = useWindowWidth();
  const m = w < BP_SM, t = w >= BP_SM && w < BP_MD;
  return (
    <div style={{ position: "relative", width: "100%", height: "95vh", minHeight: 640, overflow: "hidden", background: CABIN_BG, ...SMOOTH }}>
      <Pic slot="hero" abs />
      <div style={shade("rgba(14,12,10,0.10)")} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: `linear-gradient(to bottom, transparent 55%, rgba(19,20,22,0.55) 78%, rgba(19,20,22,1) 100%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: m ? "2.4rem" : t ? "3rem" : "3.8rem", left: 0, width: "100%", padding: m ? "0 28px" : t ? "0 40px" : "0 60px", boxSizing: "border-box", pointerEvents: "none", zIndex: 4 }}>
        <div style={{ fontFamily: FONT_SS4, fontWeight: 300, fontStyle: "italic", fontVariationSettings: OPSZ_DISPLAY, lineHeight: 1.06, letterSpacing: "-0.01em", fontSize: m ? "1.95rem" : t ? "2.4rem" : "2.85rem", color: "rgba(237,233,226,0.60)" }}>
          {c.heroLabel}
        </div>
      </div>
    </div>
  );
}

// ── B2 · A place in a land ─────────────────────────────────────────────────
function PlaceAndLand({ c }: { c: CabinContent }) {
  const w = useWindowWidth();
  const m = w <= BP_SM, t = w <= BP_MD;
  const sidePad = m ? "40px 28px 48px" : t ? "56px 40px 56px" : "72px 60px";
  const cap = { fontFamily: FONT_SS4, fontSize: "1rem", fontVariationSettings: OPSZ_TEXT, lineHeight: 1.65, color: "rgba(237,233,226,1)", margin: 0, fontStyle: "italic" as const, whiteSpace: "pre-line" as const };
  const capBox = { position: "absolute" as const, bottom: 0, left: 0, right: 0, padding: m ? "80px 28px 36px" : t ? "120px 36px 44px" : "160px 36px 52px", background: "linear-gradient(to top, rgba(19,20,22,1) 0%, rgba(19,20,22,0.6) 60%, rgba(19,20,22,0) 100%)" };
  const photo = (h?: string | number) => (
    <div style={{ position: "relative", overflow: "hidden", height: h }}>
      <Pic slot="river" abs />
      <div style={shade("rgba(19,20,22,0.28)")} />
      <div style={shade(t ? "linear-gradient(to bottom, transparent 50%, rgba(19,20,22,0.5) 100%)" : "linear-gradient(to right, rgba(19,20,22,0.35) 0%, transparent 40%)")} />
    </div>
  );
  return (
    <div style={{ position: "relative", ...SMOOTH }}>
      <div style={{ background: CABIN_BG, display: "grid", gridTemplateColumns: t ? "1fr" : "45% 55%", minHeight: t ? undefined : 560 }}>
        {t && photo(m ? "62vw" : "50vw")}
        <div style={{ padding: sidePad, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ fontFamily: FONT_SS4, fontSize: m ? "1.6rem" : "2rem", fontVariationSettings: OPSZ_DISPLAY, fontWeight: 300, color: DARK.cream, lineHeight: 1.25, margin: "0 0 28px", letterSpacing: "-0.01em", fontStyle: "italic" }}>
            {lines(c.placeHeading)}
          </h2>
          {c.placeParagraphs.map((p, i, a) => (
            <p key={i} style={{ fontFamily: FONT_SS4, fontSize: "1rem", fontVariationSettings: OPSZ_TEXT, color: DARK.body, lineHeight: 1.8, margin: i < a.length - 1 ? "0 0 20px" : 0, maxWidth: 420 }}>{p}</p>
          ))}
        </div>
        {!t && photo()}
      </div>
      <div style={{ background: CABIN_BG, color: DARK.cream }}>
        <section style={{ position: "relative", width: "100%", minHeight: m ? 220 : t ? 280 : 380, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
          <Pic slot="aerial" abs />
          <div style={shade("rgba(19,20,22,0.30)")} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(rgba(19,20,22,0) 40%, rgba(19,20,22,0.6) 60%, rgba(19,20,22,0.98) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1, padding: m ? "0 24px 36px" : t ? "0 40px 44px" : "0 60px 52px", maxWidth: 600 }}>
            <p style={{ fontFamily: FONT_SS4, fontSize: m ? "1.35rem" : "2rem", fontVariationSettings: OPSZ_DISPLAY, lineHeight: 1.25, color: ON_IMAGE.head, margin: "0 0 16px", fontWeight: 300, letterSpacing: "-0.01em", fontStyle: "italic" }}>{c.riversHeading}</p>
            <p style={{ fontFamily: FONT_SS4, fontSize: "1rem", fontVariationSettings: OPSZ_TEXT, lineHeight: 1.8, color: ON_IMAGE.body, margin: 0 }}>{c.riversLine}</p>
          </div>
        </section>
        <section style={{ display: "grid", gridTemplateColumns: t ? "1fr" : "1fr 1fr", gap: 0 }}>
          <div style={{ position: "relative", overflow: "hidden", height: t ? undefined : "100%", minHeight: t ? 220 : 360 }}>
            <Pic slot="gorge" abs filter="brightness(0.9) saturate(0.9)" />
            <div style={capBox}><p style={cap}>{c.gorgeCaption}</p></div>
          </div>
          <div style={{ position: "relative", overflow: "hidden", height: t ? undefined : "100%", minHeight: t ? 220 : 360 }}>
            <Pic slot="cascade" abs filter="brightness(0.9) saturate(0.9)" />
            <div style={capBox}><p style={cap}>{c.cascadeCaption}</p></div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── B3 · Felt moments (fire hero, then the three pairs) ───────────────────
function Ritual({ c }: { c: CabinContent }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [idx, setIdx] = useState(0);
  const m = useWindowWidth() <= BP_SM;
  const n = Math.max(c.ritual.length, 1);

  useEffect(() => {
    if (revealed) return;
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) timer.current = setTimeout(() => setRevealed(true), 2500);
      else if (timer.current) clearTimeout(timer.current);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); if (timer.current) clearTimeout(timer.current); };
  }, [revealed]);

  const chev = (back: boolean) => <polyline points={back ? "8,1 1,22 8,43" : "1,1 8,22 1,43"} stroke="rgba(237,233,226,0.65)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <div style={{ background: CABIN_BG, color: DARK.cream, position: "relative", ...SMOOTH }}>
      <div ref={heroRef} style={{ position: "relative", width: "100%", height: m ? "70vh" : "62vw", maxHeight: m ? undefined : 700, minHeight: m ? 400 : 360, overflow: "hidden" }}>
        <Pic slot="fire" />
      </div>
      <div style={{ overflow: "hidden", maxHeight: revealed ? 2000 : 0, transition: revealed ? "max-height 1.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none" }}>
        <div style={{ position: "relative", overflow: "hidden", background: CABIN_BG }}>
          <div style={{ display: "flex", width: `${n * 100}%`, transform: `translateX(-${idx * (100 / n)}%)`, transition: "transform 1000ms ease-in-out" }}>
            {c.ritual.map((text, i) => (
              <div key={i} style={{ width: `${100 / n}%`, flexShrink: 0, display: "grid", gridTemplateColumns: m ? "1fr" : "2fr 1.5fr" }}>
                <div style={{ padding: m ? "32px 28px 8px" : "48px 32px 48px" }}>
                  <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
                    <Pic slot={`ritual-${i + 1}`} abs />
                    <div style={shade(VIGNETTE)} />
                  </div>
                </div>
                <div style={{ padding: m ? "8px 28px 40px" : "48px 40px 48px 8px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ fontFamily: FONT_SS4, fontSize: m ? "1rem" : "1.08rem", fontStyle: "italic", fontWeight: 300, lineHeight: 1.7, color: DARK.body, margin: 0, whiteSpace: "pre-line" }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
          {n > 1 && (
            <button aria-label="Next" onClick={() => setIdx((v) => (v + 1) % n)} style={{ position: "absolute", top: "20%", bottom: "20%", right: 20, width: m ? 18 : 22, background: "rgba(19,20,22,0.48)", border: "none", borderLeft: "1px solid rgba(237,233,226,0.06)", display: "flex", alignItems: "stretch", justifyContent: "center", padding: 0, zIndex: 10, cursor: "pointer" }}>
              <svg viewBox="0 0 9 44" fill="none" preserveAspectRatio="xMidYMid meet" style={{ display: "block", height: "100%", width: "auto" }}>{chev(idx >= n - 1)}</svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── B4 · Lived rhythm ──────────────────────────────────────────────────────
function LivedRhythm({ c }: { c: CabinContent }) {
  const w = useWindowWidth();
  const m = w <= BP_SM, t = w <= BP_MD;
  const side = m ? 28 : t ? 40 : 60;
  return (
    <div style={{ background: CABIN_BG, position: "relative", ...SMOOTH }}>
      <div style={{ width: "100%", height: m ? "54vw" : "48vw", overflow: "hidden" }}><Pic slot="lived" filter="brightness(0.88) saturate(0.79) sepia(0.18)" /></div>
      <div style={{ padding: `${m ? 56 : 80}px ${side}px` }}>
        <p style={{ fontFamily: FONT_SS4, fontSize: m ? "1.08rem" : t ? "1.18rem" : "1.32rem", fontStyle: "italic", fontWeight: 300, fontVariationSettings: OPSZ_TEXT, lineHeight: 1.58, color: DARK.body, margin: 0, maxWidth: 560 }}>{c.longingLine}</p>
        <p style={{ fontFamily: FONT_SS4, fontSize: m ? "1.08rem" : t ? "1.2rem" : "1.38rem", fontStyle: "italic", fontWeight: 300, fontVariationSettings: OPSZ_TEXT, lineHeight: 1.52, color: DARK.body, margin: `${m ? "2.5rem" : "3.75rem"} 0 0`, maxWidth: 520 }}>{lines(c.longingClosing)}</p>
      </div>
    </div>
  );
}

// ── B5 · Masonry and the interior gallery ─────────────────────────────────
const GAP = "0.4rem";
function Tile({ slot, entered, delay = 0, area, aspect, children }: { slot: string; entered: boolean; delay?: number; area?: string; aspect?: string; children?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#141210", gridArea: area, aspectRatio: aspect, opacity: entered ? 1 : 0, transform: entered ? "scale(1)" : "scale(1.04)", transition: `opacity 1.1s ease ${delay}s, transform 1.3s ease ${delay}s` }}>
      <Pic slot={slot} abs />
      <div style={shade(VIGNETTE)} />
      {children}
    </div>
  );
}

function Masonry({ c }: { c: CabinContent }) {
  const desktop = useWindowWidth() > BP_MD;
  const bandRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [inn, setInn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setEntered(true); io.disconnect(); } }, { threshold: 0.08 });
    if (bandRef.current) io.observe(bandRef.current);
    return () => io.disconnect();
  }, []);
  const openGallery = () => { if (open) return; setOpen(true); setTimeout(() => setInn(true), 100); };
  const row = (cols: string, pb = false) => ({ padding: GAP, paddingBottom: pb ? GAP : 0, display: "grid" as const, gap: GAP, gridTemplateColumns: cols });
  const fade = (on: boolean) => on ? null : <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(12,11,10,0.85) 100%)", pointerEvents: "none" }} />;

  return (
    <div ref={bandRef} style={{ background: "#0C0B0A", ...SMOOTH, cursor: open ? "default" : "pointer" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={openGallery}>
      {desktop ? (
        <div style={{ display: "grid", padding: GAP, gap: GAP, gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "38vh 38vh", gridTemplateAreas: `"a a b c c" "d d e e e"`, paddingBottom: open ? 0 : GAP }}>
          <Tile slot="masonry-a" entered={entered} area="a" />
          <Tile slot="masonry-b" entered={entered} delay={0.1} area="b" />
          <Tile slot="masonry-c" entered={entered} delay={0.2} area="c" />
          <Tile slot="masonry-d" entered={entered} delay={0.3} area="d" />
          <Tile slot="masonry-e" entered={entered} delay={0.4} area="e">{fade(open)}</Tile>
        </div>
      ) : (
        <>
          <div style={row("1fr")}><Tile slot="masonry-a" entered={entered} aspect="21/8" /></div>
          <div style={row("3fr 2fr")}><Tile slot="masonry-b" entered={entered} delay={0.1} aspect="4/3" /><Tile slot="masonry-c" entered={entered} delay={0.2} aspect="4/3" /></div>
          <div style={{ ...row("2fr 3fr"), paddingBottom: open ? 0 : GAP }}><Tile slot="masonry-d" entered={entered} delay={0.3} aspect="3/4" /><Tile slot="masonry-e" entered={entered} delay={0.4} aspect="3/4">{fade(open)}</Tile></div>
        </>
      )}
      {!open && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", padding: `0.5rem ${GAP} ${GAP}`, opacity: hovered ? 0.7 : 0.28, transition: "opacity 0.5s ease" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(200,185,154,0.25))" }} />
          <span style={{ fontFamily: FONT_SS4, fontVariationSettings: OPSZ_TEXT, fontStyle: "italic", fontWeight: 300, fontSize: "0.88rem", color: DARK.dim, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{c.insideLabel}</span>
        </div>
      )}
      <div style={{ overflow: "hidden", maxHeight: open ? "4000px" : 0, transition: open ? "max-height 2s cubic-bezier(0.4, 0, 0.2, 1)" : "max-height 0.6s ease" }}>
        <div style={{ opacity: inn ? 1 : 0, transform: inn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s" }}>
          <div style={row("1fr")}><Tile slot="interior-1" entered={inn} aspect="16/7" /></div>
          <div style={row("1fr 1fr")}><Tile slot="interior-2" entered={inn} delay={0.1} aspect="4/3" /><Tile slot="interior-3" entered={inn} delay={0.18} aspect="4/3" /></div>
          <div style={row("3fr 2fr", true)}><Tile slot="interior-4" entered={inn} delay={0.24} aspect="4/3" /><Tile slot="interior-5" entered={inn} delay={0.3} aspect="4/3" /></div>
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "1.8rem" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: "0.54rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(200,185,154,0.15)" }}>{c.stayLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── B6 · "You can stay here" and the stay panel (no planner) ──────────────
const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={LIGHT.body} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const MARKS: Array<{ label: string; sub: string; svg: React.ReactNode }> = [
  { label: "Waterfalls", sub: "3 left, 1 right", svg: <Svg><line x1="7" y1="3" x2="7" y2="14" /><line x1="12" y1="3" x2="12" y2="16" /><line x1="17" y1="3" x2="17" y2="14" /><path d="M4 17 Q7 20 12 20 Q17 20 20 17" /><path d="M7 14 Q9 17 12 17 Q15 17 17 14" strokeWidth="0.7" /></Svg> },
  { label: "Rivers", sub: "Pass the terrace", svg: <Svg><path d="M2 8 Q6 5 10 8 Q14 11 18 8 Q20 6.5 22 8" /><path d="M2 14 Q5 12 9 14 Q13 16 17 14 Q20 12.5 22 14" /><path d="M2 19 Q6 17 10 19 Q14 21 18 19" strokeWidth="0.7" /></Svg> },
  { label: "Hot Tub", sub: "Steam and Stars", svg: <Svg><path d="M9 6 Q10 4 11 6 Q12 8 13 6" /><path d="M14 6 Q15 4 16 6 Q17 8 18 6" /><rect x="3" y="9" width="18" height="9" rx="1.5" /><line x1="3" y1="13.5" x2="21" y2="13.5" /><line x1="6.5" y1="18" x2="6.5" y2="21" /><line x1="17.5" y1="18" x2="17.5" y2="21" /></Svg> },
  { label: "Sleeps 2, 4, 6", sub: "Double beds, Single beds", svg: <Svg><rect x="3" y="10" width="18" height="9" rx="1" /><rect x="3" y="7" width="3" height="3" rx="0.5" /><line x1="3" y1="10" x2="3" y2="7" /><rect x="7" y="11.5" width="5" height="3.5" rx="1" /><rect x="14" y="11.5" width="5" height="3.5" rx="1" /><line x1="3" y1="19" x2="3" y2="22" /><line x1="21" y1="19" x2="21" y2="22" /></Svg> },
  { label: "Couples", sub: "Perfect stay together", svg: <Svg><circle cx="9" cy="12" r="5.5" /><circle cx="15" cy="12" r="5.5" /></Svg> },
  { label: "All Comforts", sub: "Cabin designed with comforts", svg: <Svg><rect x="5" y="9" width="14" height="9" rx="1.5" /><path d="M5 13 C3 13 2 11 2 9.5 C2 8 3 7 4.5 7 L5 9" /><path d="M19 13 C21 13 22 11 22 9.5 C22 8 21 7 19.5 7 L19 9" /><line x1="7" y1="18" x2="7" y2="21" /><line x1="17" y1="18" x2="17" y2="21" /><rect x="5" y="7" width="14" height="2.5" rx="1" /></Svg> },
];

function Stay({ c }: { c: CabinContent }) {
  const w = useWindowWidth();
  const t = w <= BP_MD;
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({ 0: true });
  const [statementIn, setStatementIn] = useState(false);
  const bandRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    let tm: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); tm = setTimeout(() => setStatementIn(true), 1000); } }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(tm); };
  }, []);
  const pad = t ? "28px" : "72px";
  return (
    <div style={{ background: CABIN_BG, ...SMOOTH }}>
      <div ref={bandRef} style={{ padding: t ? "64px 28px 72px" : "108px 72px 100px", borderBottom: `1px solid ${DARK.divider}` }}>
        <p style={{ fontFamily: FONT_SS4, fontSize: "clamp(28px, 3.2vw, 50px)", fontVariationSettings: OPSZ_DISPLAY, lineHeight: 1.3, color: DARK.cream, margin: 0, fontStyle: "italic", fontWeight: 300, maxWidth: 820, opacity: statementIn ? 1 : 0, transform: statementIn ? "translateY(0)" : "translateY(14px)", transition: "opacity 1.3s ease, transform 1.3s ease" }}>
          {c.closeHeading}
        </p>
      </div>

      <div style={{ position: "relative", height: w <= BP_SM ? "62vh" : "70vh", borderBottom: `1px solid ${DARK.divider}`, overflow: "hidden", background: DARK.surface }}>
        <Pic slot="stay" abs />
        <div style={shade("linear-gradient(to bottom, rgba(14,12,10,0.35) 0%, rgba(14,12,10,0.72) 55%, rgba(14,12,10,0.97) 100%)")} />
      </div>

      <div style={{ background: LIGHT.surface }}>
        <div style={{ padding: t ? "52px 28px 44px" : "60px 72px 52px", borderBottom: `1px solid ${LIGHT.rule}` }}>
          <p style={{ fontFamily: FONT_SS4, fontSize: "clamp(20px, 2.2vw, 32px)", fontVariationSettings: OPSZ_DISPLAY, fontStyle: "italic", fontWeight: 300, lineHeight: 1.6, color: LIGHT.head, margin: 0, maxWidth: 680, opacity: 0.9 }}>{c.guestNote}</p>
          <p style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: LIGHT.muted, margin: "20px 0 0" }}>{c.guestNoteAttribution}</p>
        </div>
        <div style={{ borderBottom: `1px solid ${LIGHT.rule}`, padding: `40px ${pad}` }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px 64px" }}>
            {MARKS.map(({ label, sub, svg }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, minWidth: 80 }}>
                <div style={{ opacity: 0.8 }}>{svg}</div>
                <p style={{ fontFamily: FONT_MONO, fontSize: "0.88rem", letterSpacing: "0.10em", textTransform: "uppercase", color: LIGHT.body, margin: 0, lineHeight: 1.4 }}>{label}</p>
                <p style={{ fontFamily: FONT_MONO, fontSize: "0.76rem", color: LIGHT.muted, margin: 0, letterSpacing: "0.06em" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: `48px ${pad} 56px` }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: LIGHT.muted, margin: "0 0 12px" }}>{c.amenitiesHeading}</p>
          <div style={{ maxWidth: 640 }}>
            {c.amenities.map((cat, i) => {
              const isOpen = !!openMap[i];
              return (
                <div key={cat.title}>
                  <div style={{ borderTop: `1px solid ${LIGHT.rule}` }} />
                  <button onClick={() => setOpenMap((p) => ({ ...p, [i]: !p[i] }))} aria-expanded={isOpen} style={{ width: "100%", display: "block", padding: "17px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontFamily: FONT_SS4, fontVariationSettings: OPSZ_TEXT, fontSize: "1.02rem", fontStyle: "italic", fontWeight: 300, color: LIGHT.head, lineHeight: 1.3, textDecoration: "underline", textUnderlineOffset: 5, textDecorationColor: LIGHT.rule, textDecorationThickness: "1.5px" }}>{cat.title}</span>
                  </button>
                  <div style={{ maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height 380ms cubic-bezier(0.25, 0, 0.1, 1)" }}>
                    <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none" }}>
                      {cat.items.map((item) => (
                        <li key={item} style={{ fontFamily: FONT_SS3, fontSize: "0.9rem", color: LIGHT.body, lineHeight: 1.75, padding: "3px 0", display: "flex", gap: 10, alignItems: "baseline", opacity: 0.85 }}>
                          <span style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: "#7A9C90", flexShrink: 0 }}>·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
            <div style={{ borderTop: `1px solid ${LIGHT.rule}` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── B7 · Footer ────────────────────────────────────────────────────────────
function Footer() {
  const m = useWindowWidth() <= BP_SM;
  const col = (xs: string[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {xs.map((l) => <span key={l} style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#3A3836", letterSpacing: "0.1em", lineHeight: 1.5 }}>{l}</span>)}
    </div>
  );
  return (
    <div style={{ background: CABIN_BG, padding: m ? "48px 28px 56px" : "72px 72px 80px", display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: m ? 24 : 40, ...SMOOTH }}>
      {!m && <div />}{!m && <div />}
      {col(["Voss Waterfalls", "vosswaterfalls.no", "The Cabin", "Direct booking"])}
      {col(["© 2026", "Privacy", "Terms", "Contact"])}
    </div>
  );
}

export function Cabin({ content }: { content: CabinContent } & ShellPageProps) {
  return (
    <ImgCtx.Provider value={content.images}>
    <div style={{ background: CABIN_BG, minHeight: "100vh", overflowX: "hidden", ...SMOOTH }}>
      <Arrival c={content} />
      <PlaceAndLand c={content} />
      <Ritual c={content} />
      <LivedRhythm c={content} />
      <Masonry c={content} />
      <Stay c={content} />
      <Footer />
    </div>
    </ImgCtx.Provider>
  );
}
