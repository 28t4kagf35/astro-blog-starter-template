/**
 * GuidesOverlay: a working tool for the -v2 sandbox pages (never shown to
 * visitors on other pages). Draws thin vertical lines over the page at the
 * standard column edges: 860 px reading column, 1200 px wide column, the canon
 * side gutters and the page centre. Switch on with ?guides in the address or
 * the G key; it stays on for the browser tab until switched off (G key, or
 * ?guides=0). It does not affect the layout.
 */
import { useEffect, useState } from "react";

const KEY = "vw-guides";

function read(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get("guides");
    if (q !== null) {
      const on = q !== "0" && q !== "off";
      try { sessionStorage.setItem(KEY, on ? "1" : "0"); } catch { /* storage may be blocked */ }
      return on;
    }
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

const COLORS = { read: "rgba(64,200,220,0.85)", wide: "rgba(230,90,200,0.85)", gutter: "rgba(240,200,60,0.9)", centre: "rgba(120,230,120,0.85)" };

export function GuidesOverlay({ eligible }: { eligible: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(read()); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      setOn((v) => {
        const next = !v;
        try { sessionStorage.setItem(KEY, next ? "1" : "0"); } catch { /* ignore */ }
        return next;
      });
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
      </div>
    </div>
  );
}
