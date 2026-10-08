/**
 * SiteFooterNext: first footer (draft). Dark only for now.
 * Shown only on the -v2 sandbox pages. A darker closing room than the page:
 * the wordmark (a link home), the places to wander next, a last row, and a faint
 * map of Vestland with Voss picked out lighter. No red. Links use the same
 * behaviour as the waterfall detail pages (dim underline that fades on hover).
 */
import { useState } from "react";
import { MAP_W, MAP_H, MAP_REST, MAP_VOSS } from "./map";

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const FONT_LBL = "'Raleway', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const DARK = {
  bg: "#131210", rule: "#24211F", body: "#C4BEB4", head: "#EDE9E2", bq: "#7A8B74",
  underline: "#4D4A47",           // same as the waterfall detail links
  mapLand: "#221F1C", mapEdge: "#131210", mapVoss: "#3A352F",
} as const;

type Wander = { label: string; href?: string };

// In the same order as the main menu: Explore (Culture & History, Nature: Observe, Learn, Experience, Waterfalls), The Cabin, Activities.
// Learn and Experience have no index page yet: plain text until they do.
const WANDER: Wander[] = [
  { label: "Culture & History", href: "/explore/culture-history" },
  { label: "Observe", href: "/explore/nature/observe" },
  { label: "Learn" },
  { label: "Experience" },
  { label: "Waterfalls", href: "/explore/waterfalls" },
  { label: "The Cabin", href: "/cabin" },
  { label: "Activities", href: "/activities" },
];

// A mood line that matches the cluster the visitor is in; one is picked at random per visit.
// Placeholder wording, to be rewritten by the owner.
type Cluster = "nature" | "waterfalls" | "culture" | "cabin" | "activities" | "home";
const MOODS: Record<Cluster, string[]> = {
  nature: [
    "Lungwort grows where the air has stayed clean for a very long time.",
    "Most of what lives here is small, slow, and easy to walk past.",
    "The valley is quietest in the hour after rain.",
  ],
  waterfalls: [
    "Every fall here is the same water, arriving at a different angle.",
    "You hear a waterfall long before you see it.",
    "In spring the whole valley sounds like running water.",
  ],
  culture: [
    "People have lived beside this water for a thousand years.",
    "Every farm here has a name older than the road.",
    "The old paths were made by people who needed to get somewhere.",
  ],
  cabin: [
    "A quiet room, a warm stove, a long view.",
    "The best hour at the cabin is the one with nothing planned.",
    "Come for the falls, stay for the evenings.",
  ],
  activities: [
    "Start slowly. The valley will wait.",
    "Take the longer path if the weather allows.",
    "Some days the best plan is to follow the river.",
  ],
  home: [
    "Norway is better when you take your time.",
    "Most of the valley is found by walking a little further.",
    "Slow water, long light, a path that keeps going.",
  ],
};

function clusterOf(path: string): Cluster {
  const p = path.replace(/\/+$/, "") || "/";
  if (/^\/(learn|experience|observe)-v2$/.test(p) || p.startsWith("/explore/nature")) return "nature";
  if (p === "/tvindefossen-v2" || p.startsWith("/explore/waterfalls")) return "waterfalls";
  if (p === "/culture-v2" || p.startsWith("/explore/culture")) return "culture";
  if (p.startsWith("/cabin")) return "cabin";
  if (p.startsWith("/activit")) return "activities";
  return "home";
}

// Responsive layout in CSS so it is right on the first paint.
const CSS = `
.fn-wrap{position:relative;overflow:hidden;background:${DARK.bg};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.fn-map{position:absolute;right:-6%;bottom:-8%;height:112%;width:auto;aspect-ratio:${MAP_W}/${MAP_H};pointer-events:none;opacity:.9}
.fn-in{position:relative;box-sizing:border-box;margin:0 auto;max-width:calc(1200px + 2rem);padding:3.4rem 1.25rem 2.2rem}
.fn-word{display:inline-block;font-family:${FONT_LBL};font-size:.84rem;font-weight:300;text-transform:uppercase;letter-spacing:.30em;line-height:1;color:${DARK.head};text-decoration:none;transition:color 200ms ease}
.fn-word:hover,.fn-word:focus-visible{color:${DARK.body}}
.fn-mood{margin:2rem 0 0;max-width:460px;border-left:2px solid ${DARK.bq};padding-left:1.2rem}
.fn-mood p{margin:0;font-family:${FONT_SS4};font-variation-settings:"opsz" 16;font-style:italic;font-weight:400;font-size:1.2rem;line-height:1.45;color:${DARK.head}}
.fn-links{display:grid;grid-template-columns:1fr 1fr;gap:.1rem 1.5rem;margin:1.8rem 0 0;padding:0;list-style:none;max-width:420px}
.fn-links li{margin:0}
.fn-a{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:${DARK.body};text-decoration:underline;text-underline-offset:3px;text-decoration-color:${DARK.underline};transition:text-decoration-color .2s ease}
.fn-a:hover,.fn-a:focus-visible{text-decoration-color:transparent}
.fn-t{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:${DARK.body}}
.fn-bottom{display:flex;flex-direction:column;gap:.5rem;margin-top:2.4rem;padding-top:1.4rem;border-top:1px solid ${DARK.rule}}
.fn-mono{font-family:${FONT_MONO};font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;line-height:1.5;color:${DARK.body}}
@media (min-width:600px){
  .fn-in{padding:3.8rem 1.4rem 2.4rem}
  .fn-links{grid-template-columns:repeat(3,auto);justify-content:start;gap:.1rem 2.4rem;max-width:none}
  .fn-map{right:-2%;height:120%}
}
@media (min-width:1024px){
  .fn-in{padding:4.4rem 1rem 2.6rem}
  .fn-links{grid-template-columns:repeat(2,auto);gap:.1rem 3rem;max-width:none}
  .fn-bottom{flex-direction:row;justify-content:space-between;align-items:baseline;margin-top:3.4rem}
  .fn-map{right:calc(50% - 600px - 1rem);height:125%;bottom:-12%}
}
`;

export function SiteFooterNext({ path }: { path: string }) {
  const lines = MOODS[clusterOf(path)];
  // The footer only mounts in the browser (after the shell knows the address), so a random pick is safe.
  const [pick] = useState(() => Math.floor(Math.random() * 1000));
  const mood = lines[pick % lines.length];
  return (
    <footer className="fn-wrap" data-site-footer>
      <style>{CSS}</style>
      <svg className="fn-map" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true" focusable="false">
        <path d={MAP_REST} fill={DARK.mapLand} stroke={DARK.mapEdge} strokeWidth="0.8" strokeLinejoin="round" />
        <path d={MAP_VOSS} fill={DARK.mapVoss} stroke={DARK.mapEdge} strokeWidth="0.8" strokeLinejoin="round" />
      </svg>
      <div className="fn-in">
        <a className="fn-word" href="/">Voss Waterfalls</a>
        <div className="fn-mood">
          <p>{mood}</p>
        </div>
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
          <a className="fn-a" href="/cabin">Book the cabin</a>
        </div>
      </div>
    </footer>
  );
}
