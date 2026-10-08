/**
 * SiteFooterNext: first footer (draft). Dark only for now.
 * Shown only on the -v2 sandbox pages. One quiet closing room: a short red mark,
 * the wordmark, one line of curiosity, the places to wander next, and a small
 * last row. Link text uses the body and head colours (never the faint grey).
 */
import type { CSSProperties } from "react";

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const FONT_LBL = "'Raleway', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const DARK = {
  bg: "#1A1714", surface: "#222120", rule: "#2C2A28", muted: "#6E6A65",
  body: "#C4BEB4", head: "#EDE9E2", bq: "#7A8B74", accent: "#D43535",
} as const;

type Wander = { label: string; href?: string };

// Learn and Experience have no index page yet: shown as plain text until they do.
const WANDER: Wander[] = [
  { label: "Waterfalls", href: "/explore/waterfalls" },
  { label: "Observe", href: "/explore/nature/observe" },
  { label: "Learn" },
  { label: "Experience" },
  { label: "Culture & History", href: "/explore/culture-history" },
  { label: "The Cabin", href: "/cabin" },
  { label: "Activities", href: "/activities" },
];

// Placeholder line, to be rewritten by the owner.
const CURIOSITY = "Most of the valley is found by walking a little further.";

// Responsive layout in CSS so it is right on the first paint.
const CSS = `
.fn-wrap{background:${DARK.surface};border-top:1px solid ${DARK.rule};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.fn-in{box-sizing:border-box;margin:0 auto;max-width:calc(1200px + 2rem);padding:3.2rem 1.25rem 2.2rem}
.fn-top{display:grid;grid-template-columns:1fr;gap:1.8rem}
.fn-links{display:grid;grid-template-columns:1fr 1fr;gap:.2rem 1.5rem;margin:2.6rem 0 0;padding:0;list-style:none}
.fn-links li{margin:0}
.fn-a{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:${DARK.head};text-decoration:none;border-bottom:1px solid transparent;transition:border-color 200ms ease-out}
.fn-a:hover,.fn-a:focus-visible{border-bottom-color:${DARK.accent}}
.fn-t{display:inline-block;padding:.7rem 0;font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;line-height:1.2;color:${DARK.body}}
.fn-bottom{display:flex;flex-direction:column;gap:.9rem;margin-top:2.4rem;padding-top:1.4rem;border-top:1px solid ${DARK.rule}}
.fn-mono{font-family:${FONT_MONO};font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;line-height:1.5;color:${DARK.body}}
.fn-book{font-family:${FONT_LBL};font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:${DARK.head};text-decoration:none;border-bottom:1px solid ${DARK.body};padding-bottom:2px;align-self:flex-start}
.fn-book:hover,.fn-book:focus-visible{border-bottom-color:${DARK.accent}}
@media (min-width:600px){
  .fn-in{padding:3.8rem 1.4rem 2.4rem}
  .fn-links{grid-template-columns:repeat(3,auto);justify-content:start;gap:.2rem 2.4rem}
}
@media (min-width:1024px){
  .fn-in{padding:4.4rem 1rem 2.6rem}
  .fn-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;align-items:start}
  .fn-links{margin:0;grid-template-columns:repeat(2,auto);gap:.1rem 3rem;justify-content:end}
  .fn-bottom{flex-direction:row;justify-content:space-between;align-items:baseline;margin-top:3.4rem}
  .fn-book{align-self:auto}
}
`;

export function SiteFooterNext() {
  const wordmark: CSSProperties = {
    fontFamily: FONT_LBL, fontSize: "0.84rem", fontWeight: 300, textTransform: "uppercase",
    letterSpacing: "0.30em", color: DARK.head, lineHeight: 1, margin: "0 0 1.4rem",
  };
  return (
    <footer className="fn-wrap" data-site-footer>
      <style>{CSS}</style>
      <div className="fn-in">
        <div style={{ width: 28, height: 2, background: DARK.accent, marginBottom: "2rem" }} />
        <div className="fn-top">
          <div>
            <p style={wordmark}>Voss Waterfalls</p>
            <div style={{ borderLeft: `2px solid ${DARK.bq}`, paddingLeft: "1.2rem", maxWidth: 460 }}>
              <p style={{ margin: 0, fontFamily: FONT_SS4, fontVariationSettings: '"opsz" 16', fontStyle: "italic", fontWeight: 400, fontSize: "1.2rem", lineHeight: 1.45, color: DARK.head }}>{CURIOSITY}</p>
            </div>
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
        </div>
        <div className="fn-bottom">
          <span className="fn-mono">Voss, Norway · © {new Date().getFullYear()}</span>
          <a className="fn-book" href="/cabin">Book the cabin</a>
        </div>
      </div>
    </footer>
  );
}
