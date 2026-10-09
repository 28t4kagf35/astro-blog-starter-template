/**
 * SiteFooterNext: first footer (draft). Dark only for now.
 * Shown only on the -v2 sandbox pages. A darker closing room than the page:
 * the wordmark (a link home), the places to wander next, a last row, and a faint
 * map of Vestland with Voss picked out lighter. No red. Links use the same
 * behaviour as the waterfall detail pages (dim underline that fades on hover).
 */
import { MAP_W, MAP_H, MAP_REST, MAP_VOSS } from "./map";

const FONT_LBL = "'Raleway', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const DARK = {
  bg: "#131210", rule: "#24211F", body: "#726E68", head: "#7D7972", bq: "#7A8B74",
  underline: "#2E2C28",           // same as the waterfall detail links
  mapLand: "#221F1C", mapEdge: "#131210", mapVoss: "#2D2A26",
} as const;

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
.fn-wrap{position:relative;overflow:hidden;background:${DARK.bg};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.fn-map{position:absolute;right:-6%;bottom:-8%;height:112%;width:auto;aspect-ratio:${MAP_W}/${MAP_H};pointer-events:none;opacity:.85}
.fn-in{position:relative;box-sizing:border-box;margin:0 auto;max-width:calc(1200px + 2rem);padding:5rem 1.25rem 2.2rem}
.fn-word{display:inline-block;font-family:${FONT_LBL};font-size:.84rem;font-weight:300;text-transform:uppercase;letter-spacing:.30em;line-height:1;color:${DARK.head};text-decoration:none;transition:color 200ms ease}
.fn-word:hover,.fn-word:focus-visible{color:${DARK.body}}
.fn-vf{display:block;flex:none;height:56px;width:auto;max-width:none;opacity:.45}
.fn-links{display:grid;grid-template-columns:1fr 1fr;gap:.1rem 1.5rem;margin:1.8rem 0 0;padding:0;list-style:none;max-width:420px}
.fn-links li{margin:0}
.fn-a{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:${DARK.body};text-decoration:underline;text-underline-offset:3px;text-decoration-color:${DARK.underline};transition:text-decoration-color .2s ease}
.fn-a:hover,.fn-a:focus-visible{text-decoration-color:transparent}
.fn-t{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:${DARK.body}}
.fn-bottom{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:2.4rem;padding-top:1.4rem;border-top:1px solid ${DARK.rule}}
.fn-mono{font-family:${FONT_MONO};font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;line-height:1.5;color:${DARK.body}}
@media (min-width:600px){
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

export function SiteFooterNext() {
  return (
    <footer className="fn-wrap" data-site-footer>
      <style>{CSS}</style>
      <svg className="fn-map" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true" focusable="false">
        <path d={MAP_REST} fill={DARK.mapLand} stroke={DARK.mapEdge} strokeWidth="0.8" strokeLinejoin="round" />
        <path d={MAP_VOSS} fill={DARK.mapVoss} stroke={DARK.mapEdge} strokeWidth="0.8" strokeLinejoin="round" />
      </svg>
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
          <img className="fn-vf" src="/brand/vf-mark-light.png" alt="" width="46" height="56" />
        </div>
      </div>
    </footer>
  );
}
