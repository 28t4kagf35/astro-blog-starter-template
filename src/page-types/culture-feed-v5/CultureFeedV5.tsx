/**
 * Page type (v5 working copy): Culture & History, v4 plus a desktop experiment: on desktop the stories are
 * stacked in one scrolling 600px column (no swipe, no cover, no progress strip, one story open at a time).
 * Tablet uses the stack too (settled 2026-10-28) with a shorter hero (50vh). The phone behaves exactly as in v3.
 *
 * Page type (v4 working copy): Culture & History, v3 pager plus a tablet/desktop frame.
 *
 * v5 = v3 unchanged on a phone (the cover is the first card). On tablet and desktop the cover is
 * dropped: the title is the shared hero above the pager, on the pager card's left edge, and the pager
 * starts at story 1.
 *
 * v3 notes follow.
 *
 * The idea (ideated Oct 10 2026, to be judged on a phone):
 *  - One story is one card, and one card is one screen. Swipe sideways for the next story;
 *    read downward inside a card ("Read on" opens the rest in place).
 *  - The edge of the next card shows at the right: that is the swipe cue.
 *  - A quiet strip above the pager says where you are (story n of N) with one thin segment per story.
 *  - A cover card comes first (it replaces the hero), and the pager ends on the Continue block.
 *  - Each opened story ends with "Next: <title>", which is what carries a visitor through several.
 *  - Stock photos get one calm treatment (same crop, slightly muted, warm), so different photos read as a family.
 *  - Order alternates the moods (lore, history, food, mindset) instead of grouping them.
 *  - Cards address themselves: the page address gains #slug as you move, and a #slug opens the pager there.
 *  - Content is the same fifteen stories (Sanity, build time); all text is in the page.
 *  - Desktop: the same pager in a narrower centred column, with arrow buttons and arrow keys.
 */
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as RPointerEvent } from "react";
import { mediaSrcSet } from "../../site/media";
import { Hero } from "../../site/Hero";

const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_SS3  = "'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_LBL  = "'Raleway', system-ui, sans-serif";

const SS4_OPSZ_DISPLAY = '"opsz" 36, "wght" 300';

export const DARK = {
  bg: "#1A1714", surface: "#222120", rule: "#2C2A28", muted: "#6E6A65",
  body: "#C4BEB4", head: "#EDE9E2", bq: "#7A8B74", accent: "#D43535",
} as const;
export const LIGHT = {
  bg: "#F4F2EE", surface: "#EBE7DF", rule: "#D6D2CB", muted: "#8E8A84",
  body: "#201E18", head: "#111010", bq: "#A4AE9C", accent: "#D43535",
} as const;
export type Tk = typeof DARK | typeof LIGHT;

export const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300" +
  "&family=Source+Sans+3:wght@300;400" +
  "&family=IBM+Plex+Mono:wght@400" +
  "&family=Raleway:wght@300;400" +
  "&display=block";

export type CultureCardV5 = {
  slug: string;
  title: string;
  teaser: string[];
  expanded: string[];
  image: string;
  imagePosition: string;
  /** The index carries only the opening paragraph; this says the story has more (on its own page). */
  more?: boolean;
};
export interface CultureFeedV5Content {
  heroImage: { src: string; position: string };
  cards: CultureCardV5[];
  /** Where the story pages live (preview: "/culture-v5"). Without it, stories expand in place as before. */
  basePath?: string;
}

// The kind of story each is, from the copy's own cluster lines ("EXPLORE → CULTURE & HISTORY → …").
export const KIND: Record<string, string> = {
  "huldra": "Living Lore",
  "jul-nisse": "Living Lore",
  "trollveggen": "Living Lore",
  "a-viking-legacy-that-lives": "Ancient & Modern",
  "norway-tiny-history": "Ancient & Modern",
  "sami-hunters-herders-from-pre-history": "Ancient & Modern",
  "friluftsliv": "Mindset & Language",
  "no-such-thing": "Mindset & Language",
  "norwegian-clothing-local-costume-to-tech-gear": "Customs & Identity",
  "orange-in-the-snow": "Food the Land Gave",
  "sheep-in-the-west-reindeer-in-the-north": "Food the Land Gave",
  "energy-and-wealth-from-survival-to-surplus": "Norway in Scandinavia",
  "when-the-cold-are-the-caring": "Norway in Scandinavia",
  "bergen": "Cities & Trade",
  "voss": "Regions & Identity",
};

// Moods alternate, so each swipe feels different; the pager ends on Voss. Stories not listed follow.
export const ORDER = [
  "friluftsliv",
  "huldra",
  "norway-tiny-history",
  "orange-in-the-snow",
  "bergen",
  "jul-nisse",
  "no-such-thing",
  "sami-hunters-herders-from-pre-history",
  "norwegian-clothing-local-costume-to-tech-gear",
  "sheep-in-the-west-reindeer-in-the-north",
  "trollveggen",
  "when-the-cold-are-the-caring",
  "a-viking-legacy-that-lives",
  "energy-and-wealth-from-survival-to-surplus",
  "voss",
];

export function useBreakpoint() {
  const get = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 390;
    return w >= 1024 ? "desktop" : w >= 600 ? "tablet" : "mobile";
  };
  const [bp, setBp] = useState<"desktop" | "tablet" | "mobile">("mobile"); // phone first; the real value is set on mount
  useEffect(() => {
    const h = () => setBp(get());
    h();
    globalThis.addEventListener("resize", h);
    return () => globalThis.removeEventListener("resize", h);
  }, []);
  return bp;
}

export const label = (tk: Tk, extra?: CSSProperties): CSSProperties => ({
  fontFamily: FONT_LBL, fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.14em",
  textTransform: "uppercase", lineHeight: 1.4, color: tk.muted, ...extra,
});
export const mono = (tk: Tk, extra?: CSSProperties): CSSProperties => ({
  fontFamily: FONT_MONO, fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.4, color: tk.muted, ...extra,
});

// The closed paragraph fades out by a mask, not an overlay in the card colour: a mask has no colour, so it
// cannot drift out of step with the card when the dark/light switch eases the background.
const FADE_MASK = "linear-gradient(to bottom, #000 calc(100% - 2.6rem), transparent 100%)";

// One calm treatment for every photo.
const PHOTO: CSSProperties = { filter: "saturate(0.86) sepia(0.1) brightness(0.94)" };

function Photo({ src, position, tk, eager, stack, vignette }: { src: string; position: string; tk: Tk; eager?: boolean; stack?: boolean; vignette?: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", maxHeight: stack ? undefined : "30svh", overflow: "hidden", background: tk.surface }}>
      {src ? (
        <img
          src={src}
          srcSet={mediaSrcSet(src)}
          sizes="(min-width: 700px) 640px, 90vw"
          alt=""
          loading={eager ? "eager" : "lazy"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position, ...PHOTO }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={mono(tk)}>image unavailable</span>
        </div>
      )}
      {vignette ? (
        // Observe's edge vignette, even all round (no lower-half mask: there is no caption bowl on these cards).
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "multiply", background: "radial-gradient(ellipse farthest-corner at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 58%, rgba(10,8,6,0.46) 100%)" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,23,20,0.5) 0%, transparent 55%)" }} />
      )}
    </div>
  );
}

export function Story({
  entry, tk, isActive, isMobile, eager, nextTitle, onNext, index, total, stack, onOpen, startOpen, titleTag, readOnHref, fetchHref,
}: {
  entry: CultureCardV5; tk: Tk; isActive: boolean; isMobile: boolean; eager: boolean;
  nextTitle?: string; onNext?: () => void; index: number; total: number; stack?: boolean; onOpen?: () => void;
  /** Story pages: the card loads open (no "Read on"). */
  startOpen?: boolean;
  /** Story pages: the title is the page heading. */
  titleTag?: "h1" | "h2";
  /** Tablet and desktop index: "Read on" is a link to the story page. */
  readOnHref?: string;
  /** Phone index: "Read on" fetches the rest from the story page and opens it in place. */
  fetchHref?: string;
}) {
  const [open, setOpen] = useState(!!startOpen);
  const Title = titleTag ?? "h2";
  const hasMore = !!entry.more || entry.expanded.length > 0 || entry.teaser.length > 1;
  const [rest, setRest] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  // Phone: the index holds only the opening paragraph. "Read on" takes the rest from the story's own page
  // (its paragraphs are marked data-story-p), and opens it in place. If that fails, go to the page.
  const openIt = async () => {
    if (fetchHref && entry.more && !rest) {
      setLoading(true);
      try {
        const res = await fetch(fetchHref, { credentials: "same-origin" });
        if (!res.ok) throw new Error(String(res.status));
        const doc = new DOMParser().parseFromString(await res.text(), "text/html");
        const ps = Array.from(doc.querySelectorAll("p[data-story-p]")).map((el) => (el.textContent ?? "").trim()).filter(Boolean).slice(1);
        if (!ps.length) throw new Error("empty");
        setRest(ps);
      } catch { window.location.href = fetchHref; return; }
      setLoading(false);
    }
    setOpen(true); onOpen?.();
  };
  // A story you swiped away from folds itself shut, so the pager stays short.
  useEffect(() => { if (!isActive) setOpen(false); }, [isActive]);
  const pad = isMobile ? "1.25rem" : "1.6rem";
  const bodySz = isMobile ? "0.95rem" : "1rem";
  const p: CSSProperties = { margin: "0.9rem 0 0", fontFamily: FONT_SS3, fontSize: bodySz, fontWeight: 300, lineHeight: 1.78, letterSpacing: "0.01em", color: tk.body };
  return (
    <div style={{ background: tk.surface, border: `1px solid ${tk.rule}`, borderRadius: "0.35rem", overflow: "hidden", transition: "background .35s ease, border-color .35s ease" }}>
      <Photo src={entry.image} position={entry.imagePosition} tk={tk} eager={eager} stack={stack} vignette={!isMobile} />
      <div style={{ padding: `1.3rem ${pad} 1.4rem` }}>
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "baseline", gap: "1rem", marginBottom: "0.8rem" }}>
          <span style={label(tk)}>{KIND[entry.slug] ?? "Culture & History"}</span>
        </div>
        <Title style={{ margin: 0, fontFamily: FONT_SS4, fontSize: isMobile ? "1.7rem" : "1.9rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_DISPLAY, color: tk.head, lineHeight: 1.16, letterSpacing: "-0.01em" }}>
          {entry.title}
        </Title>
        {/* Closed: one opening paragraph, clamped with a soft fade, so the card ends inside the screen and "Read on" is always in sight. */}
        <div style={{ position: "relative" }}>
          <p data-story-p="" style={{
            ...p, marginTop: "1rem",
            ...(open ? {} : { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 5, overflow: "hidden", WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }),
          } as CSSProperties}>{entry.teaser[0]}</p>
        </div>
        {open && entry.teaser.slice(1).map((t, i) => <p key={i} data-story-p="" style={p}>{t}</p>)}
        {open && rest?.map((t, i) => <p key={"r" + i} style={p}>{t}</p>)}

        {!open && hasMore && (readOnHref ? (
          <a href={readOnHref}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0 0", padding: "0.7rem 0", textDecoration: "none", ...label(tk, { color: tk.body }) }}>
            Read on <span aria-hidden="true">→</span>
          </a>
        ) : (
          <button onClick={openIt} disabled={loading} aria-expanded={false}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0 0", padding: "0.7rem 0", background: "none", border: "none", cursor: loading ? "default" : "pointer", ...label(tk, { color: tk.body }) }}>
            {loading ? "Opening…" : <>Read on <span aria-hidden="true">↓</span></>}
          </button>
        ))}

        <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.26s cubic-bezier(0.65, 0, 0.35, 1)" }}>
          <div style={{ overflow: "hidden", minHeight: 0 }}>
            {entry.expanded.map((t, i) => <p key={i} data-story-p="" style={p}>{t}</p>)}
          </div>
        </div>

        {(open || !hasMore) && onNext && nextTitle && (
          <button onClick={onNext}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.35rem", width: "100%", margin: "1.6rem 0 0", padding: "1.1rem 0 0", background: "none", border: "none", borderTop: `1px solid ${tk.rule}`, cursor: "pointer", textAlign: "left" }}>
            <span style={label(tk)}>Next · {index + 1} / {total}</span>
            <span style={{ fontFamily: FONT_SS4, fontSize: "1.15rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_DISPLAY, color: tk.head }}>{nextTitle} →</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Cover({ tk, count, image, position, isMobile, onStart }: { tk: Tk; count: number; image: string; position: string; isMobile: boolean; onStart: () => void }) {
  const pad = isMobile ? "1.25rem" : "1.6rem";
  return (
    <div style={{ background: tk.surface, border: `1px solid ${tk.rule}`, borderRadius: "0.35rem", overflow: "hidden", transition: "background .35s ease, border-color .35s ease" }}>
      <Photo src={image} position={position} tk={tk} eager />
      <div style={{ padding: `1.3rem ${pad} 1.4rem` }}>
        <div style={{ ...label(tk), marginBottom: "0.8rem" }}>Explore · Culture &amp; History</div>
        <h1 style={{ margin: 0, fontFamily: FONT_SS4, fontSize: isMobile ? "2.1rem" : "2.4rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_DISPLAY, color: tk.head, lineHeight: 1.12, letterSpacing: "-0.01em" }}>
          Culture &amp; History
        </h1>
        <p style={{ margin: "1rem 0 0", fontFamily: FONT_SS3, fontSize: isMobile ? "0.95rem" : "1rem", fontWeight: 300, lineHeight: 1.78, letterSpacing: "0.01em", color: tk.body }}>
          {count} fun short stories about Norway
        </p>
        <button onClick={onStart}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0 0", padding: "0.7rem 0", background: "none", border: "none", cursor: "pointer", ...label(tk, { color: tk.body }) }}>
          <span aria-hidden="true">«</span> Swipe this card left to start
        </button>
      </div>
    </div>
  );
}

export function CultureFeedV5({ content, isDark = true }: { content: CultureFeedV5Content; isDark?: boolean }) {
  useEffect(() => {
    const doc = globalThis["document"];
    if (doc.querySelector("link[data-brand-fonts]")) return;
    const link = doc.createElement("link");
    link.rel = "stylesheet"; link.href = FONTS_HREF; link.setAttribute("data-brand-fonts", "1");
    doc.head.appendChild(link);
  }, []);

  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const isStack = bp !== "mobile"; // tablet and desktop: one scrolling column (the phone keeps the swipe pager)
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const tk = isDark ? DARK : LIGHT;

  const stories = [...content.cards].sort((a, b) => {
    const r = (s: string) => { const i = ORDER.indexOf(s); return i < 0 ? ORDER.length : i; };
    return r(a.slug) - r(b.slug);
  });
  const n = stories.length;
  const slots = n + 1; // slot 0 is the cover (phone only)
  const minI = isMobile ? 0 : 1; // tablet and desktop have no cover: the pager starts at story 1

  const padH = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem";
  const SEC = isMobile ? "3.5rem" : isTablet ? "4.5rem" : "5.5rem";
  const GAP = 12;

  // The row of cards slides under our own hand-held swipe, not the browser's scroll, so it can be made to
  // stop at exactly one card per swipe (the browser's own momentum scroll ran several cards over on a phone).
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [switching, setSwitching] = useState(false);
  const [step, setStep] = useState(0); // px from one card to the next, measured
  const drag = useRef({ on: false, locked: false, x0: 0, y0: 0, t0: 0, dx: 0, pts: [] as { x: number; t: number }[] });
  const suppressClick = useRef(false);
  const instant = useRef(false);

  // The first paint is phone-first; once the real size is known, tablet and desktop start at story 1.
  useEffect(() => { if (bp !== "mobile") { instant.current = true; setActive((a) => Math.max(1, a)); } }, [bp]);
  const EASE = "transform 0.42s cubic-bezier(0.22, 0.8, 0.28, 1)"; // eases out and settles
  // Moving to another card brings the page back to the top, so the new card is read from its start.
  const toTop = () => { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { window.scrollTo(0, 0); } };
  const goTo = (i: number) => { setActive(Math.max(minI, Math.min(slots - 1, i))); toTop(); };

  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const measure = () => { const el = slotRefs.current[0]; if (el) setStep(el.offsetWidth + GAP); };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [bp]);

  // Put the row where the active card is: eased when it moves, at once on the first paint.
  useEffect(() => {
    const row = rowRef.current; if (!row || !step) return;
    row.style.transition = instant.current ? "none" : EASE;
    row.style.transform = `translate3d(${-active * step}px, 0, 0)`;
    instant.current = false;
  }, [active, step]);

  // The swipe reads the latest values through a ref, so it can never act on a stale card or width.
  const live = useRef({ active: 0, step: 0, slots: 0, minI: 0 });
  live.current = { active, step, slots, minI };

  // One slow nudge to the left, a second after the page opens, on the cover and on the card behind it: it
  // shows which way the cards go. Skipped if the visitor has already moved, or asked for less motion.
  useEffect(() => {
    try { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch { /* animate anyway */ }
    const t = window.setTimeout(() => {
      if (live.current.active !== 0) return;
      [slotRefs.current[0], slotRefs.current[1]].forEach((el) => {
        if (!el || typeof el.animate !== "function") return;
        el.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(-15px)", offset: 0.4375 }, { transform: "translateX(0)" }],
          { duration: 2253, easing: "cubic-bezier(0.16, 0.84, 0.3, 1)" },
        );
      });
    }, 1000);
    return () => window.clearTimeout(t);
  }, []);

  const begin = (x: number, y: number) => {
    const wrap = wrapRef.current; if (wrap) wrap.style.userSelect = "";
    drag.current = { on: true, locked: false, x0: x, y0: y, t0: performance.now(), dx: 0, pts: [{ x, t: performance.now() }] };
  };
  // Returns true once the movement is a sideways swipe (and so the page must not scroll with it).
  const move = (x: number, y: number): boolean => {
    const d = drag.current; const row = rowRef.current; const wrap = wrapRef.current;
    if (!d.on || !row || !wrap) return false;
    const { active: a, step: st, slots: sl, minI: mi } = live.current;
    const dx = x - d.x0; const dy = y - d.y0;
    if (!d.locked) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 0.8) { d.locked = true; wrap.style.userSelect = "none"; }
      else if (Math.abs(dy) > 8) { d.on = false; return false; } // a vertical scroll: leave it to the page
      else return false;
    }
    d.dx = dx;
    d.pts.push({ x, t: performance.now() }); if (d.pts.length > 6) d.pts.shift();
    // Pulling past the first or last card is held back, like a rubber band.
    const held = (a === mi && dx > 0) || (a === sl - 1 && dx < 0) ? dx / 3 : dx;
    row.style.transition = "none";
    row.style.transform = `translate3d(${-a * st + held}px, 0, 0)`;
    return true;
  };
  const finish = () => {
    const d = drag.current; const row = rowRef.current; const wrap = wrapRef.current;
    const wasOn = d.on; d.on = false;
    if (wrap) wrap.style.userSelect = "";
    if (!wasOn || !d.locked || !row) return;
    d.locked = false;
    const { active: a, step: st, slots: sl, minI: mi } = live.current;
    // Speed of the last moments of the swipe, so a pause before the flick does not count against it.
    const a0 = d.pts[0]; const a1 = d.pts[d.pts.length - 1];
    const v = a0 && a1 && a1.t > a0.t ? (a1.x - a0.x) / (a1.t - a0.t) : 0; // px per ms
    const far = Math.min(st * 0.15, 48);
    let next = a;
    if (d.dx < -far || (v < -0.25 && d.dx < -10)) next = a + 1;
    else if (d.dx > far || (v > 0.25 && d.dx > 10)) next = a - 1;
    next = Math.max(mi, Math.min(sl - 1, next));
    suppressClick.current = true;
    window.setTimeout(() => { suppressClick.current = false; }, 350);
    row.style.transition = EASE;
    row.style.transform = `translate3d(${-next * st}px, 0, 0)`;
    setActive(next); // one card per swipe, however hard the flick
    if (next !== a) toTop();
  };

  // Fingers: plain touch events, which iOS never half-cancels the way it can pointer events. Once a swipe is
  // sideways the page is told not to scroll, so the gesture cannot be taken over or left hanging.
  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const ts = (e: TouchEvent) => { if (e.touches.length === 1) begin(e.touches[0].clientX, e.touches[0].clientY); else finish(); };
    const tm = (e: TouchEvent) => { if (e.touches.length === 1 && move(e.touches[0].clientX, e.touches[0].clientY) && e.cancelable) e.preventDefault(); };
    const te = () => finish();
    wrap.addEventListener("touchstart", ts, { passive: true });
    wrap.addEventListener("touchmove", tm, { passive: false });
    wrap.addEventListener("touchend", te, { passive: true });
    wrap.addEventListener("touchcancel", te, { passive: true });
    return () => {
      wrap.removeEventListener("touchstart", ts); wrap.removeEventListener("touchmove", tm);
      wrap.removeEventListener("touchend", te); wrap.removeEventListener("touchcancel", te);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mouse (desktop): the same swipe by dragging.
  const onMouseDown = (e: RPointerEvent) => { if (e.pointerType === "mouse" && e.button === 0) begin(e.clientX, e.clientY); };
  const onMouseMove = (e: RPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (move(e.clientX, e.clientY)) { try { wrapRef.current?.setPointerCapture(e.pointerId); } catch { /* not all browsers */ } }
  };
  const onMouseUp = (e: RPointerEvent) => { if (e.pointerType === "mouse") finish(); };

  useEffect(() => {
    setSwitching(true);
    const t = window.setTimeout(() => setSwitching(false), 450);
    return () => window.clearTimeout(t);
  }, [active]);

  // The row is as tall as the card in front, so a short story has no empty space under it.
  useEffect(() => {
    const el = slotRefs.current[active]; if (!el) return;
    // The frame takes the card's height straight away, frame by frame, so when a card opens the card and
    // its text grow together. (Only moving between cards eases the height, see `switching`.)
    const measure = () => { const h = el.offsetHeight; if (wrapRef.current) wrapRef.current.style.height = `${h}px`; setHeight(h); };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, bp, stories.length]);

  // A reload always starts at the cover. Story names are not kept in the address, so the browser has no
  // card to jump to and cannot slide the row sideways on its own.
  useEffect(() => {
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }, []);

  // Left and right arrow keys move between stories.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isStack) return;
      if (e.key === "ArrowRight") goTo(Math.min(slots - 1, active + 1));
      else if (e.key === "ArrowLeft") goTo(Math.max(minI, active - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, slots, minI, isStack]);

  if (isStack) {
    const COL = `calc(600px + 2 * ${padH})`; // 600px of card, plus the gutters
    const goNext = (slug: string) => {
      setOpenSlug(null);
      window.setTimeout(() => { document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 300);
    };
    return (
      <div style={{ background: tk.bg, minHeight: "100vh", overflowX: "hidden", transition: "background 0.35s ease", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
        <Hero compact minHeight={isTablet ? "50vh" : undefined} textMax={COL} textMaxTablet={COL} image={content.heroImage.src} srcSet={mediaSrcSet(content.heroImage.src)} position={content.heroImage.position} alt="Culture & History" title="Culture & History" placement="Explore · Culture & History" tagline={`${n} fun short stories about Norway`} isMobile={false} isTablet={isTablet} isDesktop={!isTablet} />
        <div data-bb-field="entries" style={{ maxWidth: COL, margin: "0 auto", padding: `2.4rem ${padH} 0`, boxSizing: "border-box" }}>
          {stories.map((s, i) => (
            <div key={s.slug} id={s.slug} style={{ scrollMarginTop: "5.5rem", marginBottom: i < n - 1 ? "3.5rem" : 0 }}>
              <Story
                entry={s} tk={tk} isActive={openSlug === s.slug} isMobile={false} eager={i < 2} stack
                index={i + 1} total={n}
                nextTitle={stories[i + 1]?.title}
                onNext={stories[i + 1] ? () => goNext(stories[i + 1].slug) : undefined}
                onOpen={() => setOpenSlug(s.slug)}
                readOnHref={content.basePath ? `${content.basePath}/${s.slug}` : undefined}
              />
            </div>
          ))}
        </div>
        <div style={{ height: SEC }} aria-hidden="true" />
      </div>
    );
  }

  const colMax = isMobile ? "none" : "680px";
  // The card is as wide as the row less a thin sliver: about 28px of the next card shows at the right
  // (the previous card shows about the same at the left), so the card keeps its width for the text.
  const PEEK = 28;
  const slotW = `calc(100% - ${PEEK + GAP}px)`; // 100% is the row less its left padding

  return (
    <div style={{ background: tk.bg, minHeight: "100vh", overflowX: "hidden", transition: "background 0.35s ease", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
      {!isMobile && (
        <Hero compact minHeight={isTablet ? "50vh" : undefined} textMax="680px" textMaxTablet="680px" image={content.heroImage.src} srcSet={mediaSrcSet(content.heroImage.src)} position={content.heroImage.position} alt="Culture & History" title="Culture & History" placement="Explore · Culture & History" tagline={`${n} fun short stories about Norway`} isMobile={isMobile} isTablet={isTablet} isDesktop={!isTablet} />
      )}
      <div style={{ maxWidth: colMax, margin: "0 auto", paddingTop: isMobile ? "5.6rem" : "1.8rem" }}>

        {/* Orientation: where you are, with one thin segment per story. */}
        <div style={{ padding: `0 ${padH}`, marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.8rem" }}>
            {isMobile ? (
              <button onClick={() => goTo(0)} aria-label="Culture and History, back to the start"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", ...label(tk, { color: tk.body }) }}>Culture &amp; History</button>
            ) : (
              <span aria-hidden="true" />
            )}
            <span style={active === 0 ? mono(tk, { color: tk === DARK ? "#9A958D" : "#5E5A54" }) : mono(tk)}>{`${active === 0 ? "0" : String(active).padStart(2, "0")} / ${n}`}</span>
          </div>
          <div style={{ display: "flex", gap: 3 }} aria-hidden="true">
            {stories.map((s, i) => (
              <button key={s.slug} tabIndex={-1} onClick={() => goTo(i + 1)}
                style={{ flex: 1, height: 14, padding: 0, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <span style={{ display: "block", width: "100%", height: 2, background: i + 1 === active || (active === 0 && i === 0) ? tk.head : i + 1 < active ? tk.muted : tk.rule, opacity: i + 1 === active || (active === 0 && i === 0) ? 0.85 : 1, transition: "background .3s ease" }} />
              </button>
            ))}
          </div>
        </div>

        {/* The pager: swipe sideways, one card per swipe; the edge of the next card shows at the right. */}
        <div
          ref={wrapRef}
          data-bb-field="entries"
          onPointerDown={onMouseDown}
          onPointerMove={onMouseMove}
          onPointerUp={onMouseUp}
          onPointerCancel={onMouseUp}
          onClickCapture={(e) => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; } }}
          onDragStart={(e) => e.preventDefault()}
          onScroll={(e) => { e.currentTarget.scrollLeft = 0; e.currentTarget.scrollTop = 0; }}
          style={{ position: "relative", overflow: "hidden", touchAction: "pan-y", height, transition: switching ? "height 0.35s cubic-bezier(0.65, 0, 0.35, 1)" : "none" }}
        >
          {active > minI && (
            <button aria-label="Previous story" onClick={() => goTo(active - 1)}
              style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: padH, zIndex: 2, background: "none", border: "none", padding: 0, cursor: "pointer" }} />
          )}
          <div ref={rowRef} style={{ display: "flex", alignItems: "flex-start", gap: GAP, paddingLeft: padH, willChange: "transform" }}>
            <div ref={(el) => { slotRefs.current[0] = el; }} style={{ flex: `0 0 ${slotW}` }}>
              {isMobile ? <Cover tk={tk} count={n} image={content.heroImage.src} position={content.heroImage.position} isMobile={isMobile} onStart={() => goTo(1)} /> : null}
            </div>
            {stories.map((s, i) => (
              <div key={s.slug} ref={(el) => { slotRefs.current[i + 1] = el; }} style={{ flex: `0 0 ${slotW}` }}>
                <Story
                  entry={s} tk={tk} isActive={active === i + 1} isMobile={isMobile} eager={i < 2}
                  index={i + 1} total={n}
                  nextTitle={stories[i + 1]?.title}
                  onNext={stories[i + 1] ? () => goTo(i + 2) : undefined}
                  fetchHref={content.basePath ? `${content.basePath}/${s.slug}` : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Arrows for larger screens; on a phone the swipe is the control. */}
        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: `1rem ${padH} 0` }}>
            <button onClick={() => goTo(Math.max(minI, active - 1))} disabled={active <= minI}
              style={{ background: "none", border: "none", cursor: active <= minI ? "default" : "pointer", opacity: active <= minI ? 0.3 : 1, ...label(tk, { color: tk.body }) }}>← Previous</button>
            <button onClick={() => goTo(Math.min(slots - 1, active + 1))} disabled={active === slots - 1}
              style={{ background: "none", border: "none", cursor: active === slots - 1 ? "default" : "pointer", opacity: active === slots - 1 ? 0.3 : 1, ...label(tk, { color: tk.body }) }}>Next →</button>
          </div>
        )}

        {/* Room below the cards so the footer sits comfortably under them. */}
        <div style={{ height: SEC }} aria-hidden="true" />
      </div>
    </div>
  );
}
