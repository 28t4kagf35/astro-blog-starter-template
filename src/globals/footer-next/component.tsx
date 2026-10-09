/**
 * SiteFooterNext: first footer (draft). Dark and light.
 * Shown only on the -v2 sandbox pages. A darker closing room than the page:
 * the wordmark (a link home), the places to wander next, a last row, and a faint
 * map of Vestland with Voss picked out lighter. No red. Links use the same
 * behaviour as the waterfall detail pages (dim underline that fades on hover).
 */
import type * as React from "react";
import { MAP_W, MAP_H, MAP_REST, MAP_VOSS } from "./map";

const FONT_LBL = "'Raleway', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

// Colours come as CSS variables so the footer can fade between dark and light.
// Dark: a step darker than the page. Light: a warm stone a step darker than the light page.
const PALETTES = {
  dark: {
    bg: "#131210", rule: "#24211F", body: "#726E68", head: "#7D7972",
    underline: "#2E2C28",           // same as the waterfall detail links
    mapLand: "#191715", mapEdge: "#131210", mapVoss: "#1E1C1A",
    vig: "rgba(0,0,0,0.36)",
  },
  light: {
    bg: "#B9B6B0", rule: "#A3A09A", body: "#4A4742", head: "#3E3B36",
    underline: "#8F8C86",
    mapLand: "#AEABA5", mapEdge: "#B9B6B0", mapVoss: "#A5A29C",
    vig: "rgba(45,40,34,0.20)",
  },
} as const;

// The Vf files are named for the page they sit on: "light" is the off-white mark for dark pages,
// "dark" is the black mark for light pages.
const VF = { dark: "/brand/vf-mark-light.png", light: "/brand/vf-mark-dark.png" } as const;

type Wander = { label: string; href?: string };

// Footer links. Contact and Compliance have no pages yet: plain text until they do.
const WANDER: Wander[] = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "The Cabin", href: "/cabin" },
  { label: "Contact" },
  { label: "Compliance" },
];

// Responsive layout in CSS so it is right on the first paint.
const CSS = `
.fn-wrap{position:relative;overflow:hidden;background:var(--fn-bg);transition:background .35s ease;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.fn-map{position:absolute;right:-6%;bottom:-8%;height:112%;width:auto;aspect-ratio:${MAP_W}/${MAP_H};pointer-events:none;opacity:.85}
.fn-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse closest-side at 50% 50%,transparent 60%,var(--fn-vig) 100%)}
.fn-in{position:relative;box-sizing:border-box;margin:0 auto;max-width:calc(1200px + 2rem);padding:5rem 1.25rem 2.2rem}
.fn-word{display:inline-block;font-family:${FONT_LBL};font-size:.84rem;font-weight:300;text-transform:uppercase;letter-spacing:.30em;line-height:1;color:var(--fn-head);text-decoration:none;transition:color 200ms ease}
.fn-word:hover,.fn-word:focus-visible{color:var(--fn-body)}
.fn-vf{display:block;flex:none;height:45px;width:auto;max-width:none;opacity:.4}
.fn-links{display:grid;grid-template-columns:1fr 1fr;gap:.1rem 1.5rem;margin:1.8rem 0 0;padding:0;list-style:none;max-width:420px}
.fn-links li{margin:0}
.fn-a{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:var(--fn-body);text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--fn-underline);transition:text-decoration-color .2s ease}
.fn-a:hover,.fn-a:focus-visible{text-decoration-color:transparent}
.fn-t{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:var(--fn-body)}
.fn-bottom{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:2.4rem;padding-top:1.4rem}
.fn-mono{font-family:${FONT_MONO};font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;line-height:1.5;color:var(--fn-body)}
@media (min-width:600px){
  .fn-vf{height:56px}
  .fn-in{padding:6rem 1.4rem 2.4rem}
  .fn-links{grid-template-columns:repeat(3,auto);justify-content:start;gap:.1rem 2.4rem;max-width:none}
  .fn-map{right:-2%;height:120%}
}
@media (min-width:1024px){
  .fn-in{padding:7rem 1rem 2.6rem}
  .fn-links{grid-template-columns:repeat(2,auto);gap:.1rem 3rem;max-width:none}
  .fn-bottom{margin-top:3.4rem}
  .fn-map{right:calc(50% - 600px - 1rem);height:125%;bottom:-12%}
}
`;

export function SiteFooterNext({ isDark = true }: { isDark?: boolean }) {
  const pal = isDark ? PALETTES.dark : PALETTES.light;
  const vars = Object.fromEntries(Object.entries(pal).map(([k, v]) => ["--fn-" + k, v])) as React.CSSProperties;
  return (
    <footer className="fn-wrap" data-site-footer style={vars}>
      <style>{CSS}</style>
      <svg className="fn-map" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true" focusable="false">
        <path d={MAP_REST} style={{ fill: "var(--fn-mapLand)", stroke: "var(--fn-mapEdge)", transition: "fill .35s ease, stroke .35s ease" }} strokeWidth="0.8" strokeLinejoin="round" />
        <path d={MAP_VOSS} style={{ fill: "var(--fn-mapVoss)", stroke: "var(--fn-mapEdge)", transition: "fill .35s ease, stroke .35s ease" }} strokeWidth="0.8" strokeLinejoin="round" />
      </svg>
      <div className="fn-vig" aria-hidden="true" />
      <div className="fn-in">
        <a className="fn-word" href="/">Voss Waterfalls</a>
        <nav aria-label="Footer">
          <ul className="fn-links">
            {WANDER.map((w) => (
              <li key={w.label}>
                {w.href ? <a className="fn-a" href={w.href}>{w.label}</a> : <span className="fn-t">{w.label}</span>}
              </li>
            ))}
          </ul>
        </nav>
        <div className="fn-bottom">
          <span className="fn-mono">Voss, Norway · © {new Date().getFullYear()}</span>
          <img className="fn-vf" src={isDark ? VF.dark : VF.light} alt="" width="46" height="56" style={{ opacity: isDark ? 0.4 : 0.45 }} />
        </div>
      </div>
    </footer>
  );
}
