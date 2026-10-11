/**
 * Page type: Observe feed v3 (working copy, Sanity type `observePage`).
 * A calm, Instagram-like feed of close-ups: one picture at a time, the caption arriving after a pause,
 * a thin heart to like and a thin arrow to share. Dark only (Observe is dark-only).
 *
 *  - Pictures keep their own shape (the frame takes the picture's width/height ratio, within limits), so nothing
 *    shifts while it loads. On a phone they run edge to edge.
 *  - Hearts: kept on the visitor's phone (so the heart stays filled) and counted for everyone through
 *    `/api/hearts` once that exists; until then the page works without it and shows no totals.
 *  - Share: the phone's own share sheet, or the link is copied. The link opens the feed at that picture.
 *  - Only captioned blocks come from the content (the uncaptioned design pictures are left out for now).
 */
import { mediaSrcSet } from "../../site/media";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const FONT_SS4  = "'Source Serif 4', Georgia, serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_LBL  = "'Raleway', system-ui, sans-serif";
const SS4_OPSZ = '"opsz" 30, "wght" 230'; // slimmer than the usual 300
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..300;1,8..60,200..300" +
  "&family=Source+Sans+3:wght@300;400&family=IBM+Plex+Mono:wght@400&family=Raleway:wght@300;400&display=block";

// Observe cards are deeper than the page, so the picture falls away into shadow; page, shadow and card colour flow into each other.
const CARD = "#171411";
const DARK = { bg: "#1A1714", surface: "#222120", rule: "#2C2A28", muted: "#6E6A65", body: "#C4BEB4", head: "#EDE9E2", accent: "#D43535" };
// Heart and share are switched off while the picture and caption are fine-tuned; set to true to bring them back.
const SHOW_ACTIONS = false;
// No photo filter on Observe: the pictures show as they were taken.
const PHOTO: CSSProperties = {};

export type ObserveFeedV3Block = {
  id: string;
  image: string;
  mediaFilename?: string;
  caption: string;
  section?: string;
  ratio?: number; // picture width / height
};
export interface ObserveFeedV3Content { blocks: ObserveFeedV3Block[]; }

const label = (extra?: CSSProperties): CSSProperties => ({
  fontFamily: FONT_LBL, fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.4, color: DARK.muted, ...extra,
});
const mono = (extra?: CSSProperties): CSSProperties => ({
  fontFamily: FONT_MONO, fontSize: "0.7rem", letterSpacing: "0.12em", lineHeight: 1.4, color: DARK.muted, ...extra,
});

const slugOf = (b: ObserveFeedV3Block) => (b.mediaFilename ?? b.id).replace(/\.[a-z]+$/i, "").toLowerCase();

function useBreakpoint() {
  const get = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 390;
    return w >= 1024 ? "desktop" : w >= 600 ? "tablet" : "mobile";
  };
  const [bp, setBp] = useState<"desktop" | "tablet" | "mobile">("mobile"); // phone first; the real value is set on mount
  useEffect(() => {
    const h = () => setBp(get());
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

const HeartIcon = ({ on }: { on: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={on ? DARK.accent : "none"} stroke={on ? DARK.accent : "currentColor"} strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.4s-7.6-4.6-7.6-10.3c0-2.6 2-4.5 4.4-4.5 1.5 0 2.7.8 3.2 1.9.5-1.1 1.7-1.9 3.2-1.9 2.4 0 4.4 1.9 4.4 4.5 0 5.7-7.6 10.3-7.6 10.3z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 15V3.8" /><path d="M7.8 7.6 12 3.4l4.2 4.2" /><path d="M5 12.5v6.2c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-6.2" />
  </svg>
);

function Post({
  b, first, eager, isMobile, padH, liked, count, onLike, onSetLike,
}: {
  b: ObserveFeedV3Block; first: boolean; eager: boolean; isMobile: boolean; padH: string;
  liked: boolean; count: number; onLike: () => void; onSetLike: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [burst, setBurst] = useState(0);
  const [note, setNote] = useState("");
  const lastTap = useRef(0);
  const id = slugOf(b);

  // The caption arrives a moment after the picture is in view.
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const photoTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 320) { onSetLike(); setBurst((n) => n + 1); lastTap.current = 0; }
    else lastTap.current = now;
  };
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      if (navigator.share) { await navigator.share({ title: "Voss Waterfalls · Observe", text: b.caption, url }); return; }
      await navigator.clipboard.writeText(url);
      setNote("Link copied"); window.setTimeout(() => setNote(""), 2200);
    } catch { /* closed the share sheet */ }
  };

  // The buttons rest on the picture, inside its lower fade.
  const iconBtn: CSSProperties = { background: "none", border: "none", padding: "0.6rem", margin: "-0.6rem", cursor: "pointer", color: DARK.head, display: "inline-flex", alignItems: "center", WebkitTapHighlightColor: "transparent", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.45))" };
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

  return (
    <article id={id} style={{ position: "relative", marginBottom: "1.2rem", scrollMarginTop: "4.5rem", background: "transparent", border: "1px solid #1F1E1C", borderRadius: "0.35rem", overflow: "hidden", boxShadow: "0 8px 26px rgba(0,0,0,0.32)" }}>
      <div>
        <div ref={ref} onClick={photoTap}
          style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: CARD, cursor: "pointer", userSelect: "none", WebkitTapHighlightColor: "transparent" }}>
          {b.image ? (
            <img src={b.image} srcSet={mediaSrcSet(b.image)} sizes="(min-width: 700px) 620px, calc(100vw - 40px)" alt="" draggable={false}
              loading={eager ? "eager" : "lazy"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...PHOTO }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={mono()}>image unavailable</span></div>
          )}

          {/* Rebuild, step 1: one gentle vignette over the whole picture. A multiply layer in a deep, slightly warm dark
              (so colours get richer, not greyer); the centre is untouched and only the outer edge is touched, up to about 18% at the corners. */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "multiply",
            background: "radial-gradient(ellipse 80% 80% at 50% 46%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 55%, rgba(40,34,30,0.22) 100%)" }} />

          {/* Rebuild, step 2 (second try): the half vignette as a bowl. One oval in the card colour, centred above the middle
              of the picture, clear in the middle and rising dark along the sides, strongest at the bottom. At the caption it is about
              74% in the centre and solid at the sides; the bottom edge is solid, so it lands exactly on the card. The top is masked clear. */}
          <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: -1, pointerEvents: "none",
            background: "radial-gradient(ellipse 99% 65% at 50% 30%, rgba(23,20,17,0) 0%, rgba(23,20,17,0) 20%, rgba(23,20,17,0.04) 32%, rgba(23,20,17,0.1) 44%, rgba(23,20,17,0.22) 56%, rgba(23,20,17,0.4) 68%, rgba(23,20,17,0.62) 79%, rgba(23,20,17,0.8) 88%, rgba(23,20,17,1) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 30%)", maskImage: "linear-gradient(to bottom, transparent 0%, #000 30%)" }} />

          {burst > 0 && (
            <svg key={burst} className="ov3-burst" width="92" height="92" viewBox="0 0 24 24" fill={DARK.accent} aria-hidden="true"
              style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -46, marginTop: -46, pointerEvents: "none" }}>
              <path d="M12 20.4s-7.6-4.6-7.6-10.3c0-2.6 2-4.5 4.4-4.5 1.5 0 2.7.8 3.2 1.9.5-1.1 1.7-1.9 3.2-1.9 2.4 0 4.4 1.9 4.4 4.5 0 5.7-7.6 10.3-7.6 10.3z" />
            </svg>
          )}

          {SHOW_ACTIONS && (
          <div onClick={stop} style={{ position: "absolute", left: padH, right: padH, bottom: "3.2rem", display: "flex", alignItems: "center", gap: "1.5rem",
            opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(6px)", pointerEvents: seen ? "auto" : "none",
            transition: "opacity 1.1s ease 0.3s, transform 1.1s ease 0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <button aria-label={liked ? "Remove heart" : "Heart this"} aria-pressed={liked} onClick={onLike} className={liked ? "ov3-pop" : undefined} style={iconBtn}>
                <HeartIcon on={liked} />
              </button>
              {count > 0 && <span style={mono({ color: DARK.head })}>{count.toLocaleString("en")}</span>}
            </div>
            <button aria-label="Share" onClick={share} style={iconBtn}><ShareIcon /></button>
            {note && <span style={mono({ fontSize: "0.64rem", color: DARK.head })}>{note}</span>}
          </div>
          )}
        </div>

        {/* A strip of card colour under the picture, to catch the last caption line. The bowl is solid at the picture's bottom edge, so there is no seam. */}
        <div aria-hidden="true" style={{ height: "0.75rem", background: CARD }} />

        <p style={{
          position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 1, margin: 0, padding: `0 ${padH} 0.75rem`, maxWidth: "34rem",
          fontFamily: FONT_SS4, fontStyle: "italic", fontWeight: 230, fontVariationSettings: SS4_OPSZ,
          fontSize: isMobile ? "1.02rem" : "1.18rem", lineHeight: 1.72, letterSpacing: "0.06em", color: "#D3CDC3",
          opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(6px)",
          transition: "opacity 1.1s ease 0.3s, transform 1.1s ease 0.3s",
        }}>
          {b.caption}
        </p>
      </div>
    </article>
  );
}

export function ObserveFeedV3({ content }: { content: ObserveFeedV3Content; isDark?: boolean }) {
  useEffect(() => {
    if (document.querySelector("link[data-observe-fonts]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONTS_HREF; link.setAttribute("data-observe-fonts", "1");
    document.head.appendChild(link);
  }, []);

  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  // Text and buttons keep a generous margin; the pictures run edge to edge.
  const padH = isMobile ? "1.25rem" : "1.6rem";
  const blocks = content.blocks.filter((b) => b.caption.trim() !== "");

  // Hearts: this visitor's own (kept on the phone) and everyone's totals (from the server, when it exists).
  const [mine, setMine] = useState<Record<string, true>>({});
  const [totals, setTotals] = useState<Record<string, number>>({});
  useEffect(() => {
    try { const raw = window.localStorage.getItem("vw-observe-hearts"); if (raw) setMine(JSON.parse(raw)); } catch { /* storage blocked */ }
    fetch("/api/hearts").then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && typeof j === "object") setTotals(j as Record<string, number>); }).catch(() => {});
  }, []);
  const setLike = (id: string, on: boolean) => {
    if (!!mine[id] === on) return;
    const next = { ...mine }; if (on) next[id] = true; else delete next[id];
    setMine(next);
    try { window.localStorage.setItem("vw-observe-hearts", JSON.stringify(next)); } catch { /* storage blocked */ }
    setTotals((t) => ({ ...t, [id]: Math.max(0, (t[id] ?? 0) + (on ? 1 : -1)) }));
    fetch("/api/hearts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, delta: on ? 1 : -1 }) }).catch(() => {});
  };

  return (
    <div style={{ background: DARK.bg, minHeight: "100vh", overflowX: "hidden", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
      <style>{`
        @keyframes ov3-burst { 0% { opacity: 0; transform: scale(.4); } 18% { opacity: .92; transform: scale(1.08); } 40% { transform: scale(.96); } 100% { opacity: 0; transform: scale(1.12); } }
        .ov3-burst { animation: ov3-burst 0.9s cubic-bezier(0.22, 0.8, 0.28, 1) forwards; }
        @keyframes ov3-pop { 0% { transform: scale(1); } 40% { transform: scale(1.22); } 100% { transform: scale(1); } }
        .ov3-pop svg { animation: ov3-pop 0.34s cubic-bezier(0.22, 0.8, 0.28, 1); }
        @media (prefers-reduced-motion: reduce) { .ov3-burst, .ov3-pop svg { animation: none; } }
      `}</style>
      <div style={{ maxWidth: isMobile ? "none" : "680px", margin: "0 auto", paddingTop: 0 }}>
      <div style={{ maxWidth: isMobile ? "none" : "620px", margin: "0 auto", padding: isMobile ? "0 1.25rem" : 0 }}>
        {blocks.map((b, i) => (
          <Post key={b.id} b={b} first={i === 0} eager={i < 2} isMobile={isMobile} padH={padH}
            liked={!!mine[slugOf(b)]} count={totals[slugOf(b)] ?? 0}
            onLike={() => setLike(slugOf(b), !mine[slugOf(b)])} onSetLike={() => setLike(slugOf(b), true)} />
        ))}

        <p style={{ margin: "0 0 0", padding: `0 ${padH}`, textAlign: "center", fontFamily: FONT_SS4, fontStyle: "italic", fontWeight: 300, fontSize: "1.05rem", color: DARK.muted }}>
          That is all, for now.
        </p>
        <div style={{ height: isMobile ? "3.5rem" : "5.5rem" }} aria-hidden="true" />
      </div>
      </div>
    </div>
  );
}
