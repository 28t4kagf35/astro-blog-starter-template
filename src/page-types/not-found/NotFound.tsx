/**
 * Page type: Not found (the 404 page). No design export exists for it: a calm,
 * plain page in the site's dark look with a way back to the main places.
 */
import type { ShellPageProps } from "../../shell/SiteShell";

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const FONT_SS3 = "'Source Sans 3', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const WAYS = [
  { label: "Home", href: "/" },
  { label: "The Waterfalls", href: "/explore/waterfalls" },
  { label: "The Cabin", href: "/cabin" },
  { label: "Observe", href: "/explore/nature/observe" },
];

export type NotFoundContent = Record<string, never>;

export function NotFound(_: { content: NotFoundContent } & ShellPageProps) {
  return (
    <main style={{ minHeight: "100vh", background: "#1A1714", color: "#C4BEB4", display: "flex", flexDirection: "column", justifyContent: "center", padding: "6rem 1.5rem 4rem", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "34rem", margin: "0 auto", width: "100%" }}>
        <p style={{ margin: "0 0 1rem", fontFamily: FONT_MONO, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#6E6A65" }}>404</p>
        <h1 style={{ margin: "0 0 1rem", fontFamily: FONT_SS4, fontStyle: "italic", fontWeight: 300, fontSize: "2rem", lineHeight: 1.25, color: "#EDE9E2" }}>
          This page isn&rsquo;t here.
        </h1>
        <p style={{ margin: "0 0 2rem", fontFamily: FONT_SS3, fontWeight: 300, fontSize: "1rem", lineHeight: 1.7 }}>
          The address may have changed, or it was never a page. These are good places to start again.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem 1.6rem" }}>
          {WAYS.map((w) => (
            <a key={w.href} href={w.href} style={{ fontFamily: FONT_MONO, fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#EDE9E2", textDecoration: "underline", textUnderlineOffset: "4px", textDecorationColor: "#4D4A47" }}>
              {w.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
