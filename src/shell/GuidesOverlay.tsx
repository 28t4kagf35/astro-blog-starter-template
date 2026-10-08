/**
 * GuidesOverlay: a working tool for the -v2 sandbox pages (never shown to
 * visitors on other pages). Draws thin vertical lines over the page at the
 * standard column edges: 860 px reading column, 1200 px wide column, the canon
 * side gutters, the page centre, and the 600 px prose measure. On only while
 * ?guides is in the address (?guides=0 or off switches it off); no memory.
 * A small "guides" button in the corner switches it off. G toggles it on a keyboard.
 * It does not affect the layout.
 */
import { useEffect, useState } from "react";

function fromUrl(): boolean {
  try {
    // Forgiving: also matches a malformed address such as ?guides/?body=sleek.
    const m = /[?&]guides(?:=([^&]*))?/.exec(window.location.search);
    if (!m) return false;
    const v = (m[1] ?? "").toLowerCase();
    return v !== "0" && v !== "off" && v !== "false";
  } catch {
    return false;
  }
}

const COLORS = { read: "rgba(64,200,220,0.85)", wide: "rgba(230,90,200,0.85)", gutter: "rgba(240,200,60,0.9)", centre: "rgba(120,230,120,0.85)", prose: "rgba(255,150,60,0.9)" };

export function GuidesOverlay({ eligible }: { eligible: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(fromUrl()); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      setOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!eligible || !on) return null;

  const line = (left: string, color: string, label: string, i: number) => (
    <div key={label + i} style={{ position: "absolute", top: 0, bottom: 0, left, width: 0, borderLeft: `1px solid ${color}` }}>
      <span style={{ position: "absolute", top: 4 + (i % 2) * 14, left: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", color, background: "rgba(0,0,0,0.55)", padding: "1px 3px", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );

  return (
    <>
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "none", overflow: "hidden" }}>
        <style>{`.vw-g{--g:1.25rem}@media (min-width:600px){.vw-g{--g:1.4rem}}@media (min-width:1024px){.vw-g{--g:1rem}}`}</style>
        <div className="vw-g" style={{ position: "absolute", inset: 0 }}>
          {line("var(--g)", COLORS.gutter, "gutter", 0)}
          {line("calc(100% - var(--g))", COLORS.gutter, "gutter", 1)}
          {line("calc(50% - 430px)", COLORS.read, "860", 0)}
          {line("calc(50% + 430px)", COLORS.read, "860", 1)}
          {line("calc(50% - 600px)", COLORS.wide, "1200", 0)}
          {line("calc(50% + 600px)", COLORS.wide, "1200", 1)}
          {line("50%", COLORS.centre, "centre", 0)}
          {/* TEMPORARY: the 600 prose measure under review. Remove when settled. */}
          {line("calc(50% - 300px)", COLORS.prose, "600", 0)}
          {line("calc(50% + 300px)", COLORS.prose, "600", 1)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOn(false)}
        style={{ position: "fixed", right: 12, bottom: 12, zIndex: 10001, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#EDE9E2", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(237,233,226,0.35)", padding: "6px 10px", cursor: "pointer" }}
      >
        guides ✕
      </button>
    </>
  );
}
