/**
 * Page type: Explore home (cluster home for /explore). A placeholder grid for now: plain tiles, labels and links
 * from the cluster file, no images. The real design comes in the cluster's
 * design pass.
 */
import type { ShellPageProps } from "../../shell/SiteShell";

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const FONT_SS3 = "'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

export type Tile = { label: string; note: string; href?: string; children?: Tile[] };

export interface ExploreHomeContent {
  heading: string;
  intro: string;
  tiles: Tile[];
  footnote?: string;
}

function TileBox({ t, nested }: { t: Tile; nested?: boolean }) {
  const inner = (
    <>
      <p style={{ margin: "0 0 0.6rem", fontFamily: FONT_MONO, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#6E6A65" }}>{t.href ? "Open" : "Coming"}</p>
      <p style={{ margin: "0 0 0.5rem", fontFamily: "'Raleway', system-ui, sans-serif", fontSize: "0.92rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#EDE9E2" }}>{t.label}</p>
      <p style={{ margin: 0, fontFamily: FONT_SS3, fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.6 }}>{t.note}</p>
    </>
  );
  const box = { display: "block", minHeight: nested ? "9rem" : "11rem", padding: "1.4rem", background: nested ? "#2A2827" : "#222120", textDecoration: "none", color: "inherit", boxSizing: "border-box" as const };
  return t.href ? <a href={t.href} style={box}>{inner}</a> : <div style={box}>{inner}</div>;
}

export function ExploreHome({ content }: { content: ExploreHomeContent } & ShellPageProps) {
  const c = content;
  return (
    <main style={{ minHeight: "100vh", background: "#1A1714", color: "#C4BEB4", padding: "7rem 1.5rem 5rem", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "62rem", margin: "0 auto" }}>
        <p style={{ margin: "0 0 1rem", fontFamily: FONT_MONO, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#6E6A65" }}>Explore</p>
        <h1 style={{ margin: "0 0 1rem", fontFamily: FONT_SS4, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 2.8rem)", lineHeight: 1.2, color: "#EDE9E2" }}>{c.heading}</h1>
        <p style={{ margin: "0 0 2.4rem", maxWidth: "36rem", fontFamily: FONT_SS3, fontWeight: 300, fontSize: "1rem", lineHeight: 1.7 }}>{c.intro}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "3px" }}>
          {c.tiles.map((t) =>
            t.children ? (
              <div key={t.label} style={{ gridColumn: "1 / -1", padding: "1.4rem", background: "#222120", boxSizing: "border-box" }}>
                <p style={{ margin: "0 0 0.5rem", fontFamily: "'Raleway', system-ui, sans-serif", fontSize: "0.92rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#EDE9E2" }}>{t.label}</p>
                <p style={{ margin: "0 0 1.2rem", fontFamily: FONT_SS3, fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.6 }}>{t.note}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "3px" }}>
                  {t.children.map((ch) => <TileBox key={ch.label} t={ch} nested />)}
                </div>
              </div>
            ) : (
              <TileBox key={t.label} t={t} />
            ),
          )}
        </div>
        {c.footnote && <p style={{ margin: "2rem 0 0", fontFamily: FONT_SS3, fontWeight: 300, fontSize: "0.88rem", color: "#6E6A65" }}>{c.footnote}</p>}
      </div>
    </main>
  );
}
