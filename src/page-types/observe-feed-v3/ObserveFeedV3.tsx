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
const SS4_OPSZ = '"opsz" 24, "wght" 300';
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;1,8..60,300" +
  "&family=Source+Sans+3:wght@300;400&family=IBM+Plex+Mono:wght@400&family=Raleway:wght@300;400&display=block";

const DARK = { bg: "#1A1714", surface: "#222120", rule: "#2C2A28", muted: "#6E6A65", body: "#C4BEB4", head: "#EDE9E2", accent: "#D43535" };
const PHOTO: CSSProperties = { filter: "saturate(0.86) sepia(0.1) brightness(0.94)" };

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
  b, first, eager, isMobile, padH, showSection, liked, count, onLike, onSetLike,
}: {
  b: ObserveFeedV3Block; first: boolean; eager: boolean; isMobile: boolean; padH: string; showSection: boolean;
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

  const ratio = Math.min(1.6, Math.max(0.56, b.ratio ?? 0.75));
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

  const iconBtn: CSSProperties = { background: "none", border: "none", padding: "0.55rem", margin: "-0.55rem", cursor: "pointer", color: DARK.body, display: "inline-flex", alignItems: "center", WebkitTapHighlightColor: "transparent" };

  return (
    <article id={id} style={{ marginBottom: isMobile ? "3.4rem" : "4.6rem", scrollMarginTop: "4.5rem" }}>
      {showSection && b.section && (
        <div style={{ padding: `0 ${padH}`, margin: `${first ? "0.4rem" : "0.6rem"} 0 1.1rem`, display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ display: "block", width: "1.6rem", height: 1, background: DARK.rule }} />
          <span style={label()}>{b.section}</span>
        </div>
      )}

      <div ref={ref} onClick={photoTap}
        style={{ position: "relative", width: "100%", aspectRatio: String(ratio), maxHeight: "82svh", overflow: "hidden", background: DARK.surface, borderRadius: isMobile ? 0 : "0.35rem", cursor: "pointer", userSelect: "none", WebkitTapHighlightColor: "transparent" }}>
        {b.image ? (
          <img src={b.image} srcSet={mediaSrcSet(b.image)} sizes="(min-width: 700px) 560px, 100vw" alt="" draggable={false}
            loading={eager ? "eager" : "lazy"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...PHOTO }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={mono()}>image unavailable</span></div>
        )}
        {burst > 0 && (
          <svg key={burst} className="ov3-burst" width="92" height="92" viewBox="0 0 24 24" fill={DARK.accent} aria-hidden="true"
            style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -46, marginTop: -46, pointerEvents: "none" }}>
            <path d="M12 20.4s-7.6-4.6-7.6-10.3c0-2.6 2-4.5 4.4-4.5 1.5 0 2.7.8 3.2 1.9.5-1.1 1.7-1.9 3.2-1.9 2.4 0 4.4 1.9 4.4 4.5 0 5.7-7.6 10.3-7.6 10.3z" />
          </svg>
        )}
      </div>

      <div style={{ padding: `0.95rem ${padH} 0`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <button aria-label={liked ? "Remove heart" : "Heart this"} aria-pressed={liked} onClick={onLike} className={liked ? "ov3-pop" : undefined} style={iconBtn}>
            <HeartIcon on={liked} />
          </button>
          {count > 0 && <span style={mono()}>{count.toLocaleString("en")}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {note && <span style={mono({ fontSize: "0.64rem" })}>{note}</span>}
          <button aria-label="Share" onClick={share} style={iconBtn}><ShareIcon /></button>
        </div>
      </div>

      <p style={{
        margin: "0.7rem 0 0", padding: `0 ${padH}`, maxWidth: "36rem",
        fontFamily: FONT_SS4, fontStyle: "italic", fontWeight: 300, fontVariationSettings: SS4_OPSZ,
        fontSize: isMobile ? "1.18rem" : "1.28rem", lineHeight: 1.5, letterSpacing: "-0.005em", color: DARK.head,
        opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(7px)",
        transition: "opacity 1.1s ease 0.3s, transform 1.1s ease 0.3s",
      }}>
        {b.caption}
      </p>
    </article>
  );
}

export function ObserveFeedV3({ content }: { content: ObserveFeedV3Content; isDark?: boolean }) {
  useEffect(() => {
    if (document.querySelector("link[data-brand-fonts]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONTS_HREF; link.setAttribute("data-brand-fonts", "1");
    document.head.appendChild(link);
  }, []);

  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const padH = isMobile ? "1.25rem" : bp === "tablet" ? "1.4rem" : "0.2rem";
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
      <div style={{ maxWidth: isMobile ? "none" : "560px", margin: "0 auto", paddingTop: isMobile ? "5.6rem" : "5rem" }}>
        <div style={{ padding: `0 ${padH}`, marginBottom: "1.8rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={label({ color: DARK.body })}>Observe</span>
          <span style={mono({ fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase" })}>{blocks.length} close-ups</span>
        </div>

        {blocks.map((b, i) => (
          <Post key={b.id} b={b} first={i === 0} eager={i < 2} isMobile={isMobile} padH={padH}
            showSection={i === 0 || blocks[i - 1].section !== b.section}
            liked={!!mine[slugOf(b)]} count={totals[slugOf(b)] ?? 0}
            onLike={() => setLike(slugOf(b), !mine[slugOf(b)])} onSetLike={() => setLike(slugOf(b), true)} />
        ))}

        <p style={{ margin: "0 0 0", padding: `0 ${padH}`, textAlign: "center", fontFamily: FONT_SS4, fontStyle: "italic", fontWeight: 300, fontSize: "1.05rem", color: DARK.muted }}>
          That is all, for now.
        </p>
        <div style={{ height: isMobile ? "3.5rem" : "5.5rem" }} aria-hidden="true" />
      </div>
    </div>
  );
}
