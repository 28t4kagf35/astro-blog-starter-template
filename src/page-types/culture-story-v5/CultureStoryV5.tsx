/**
 * Page type (v5 working copy): one Culture & History story on its own address.
 *
 * The story loads open (no "Read on"): the card is the page, in the same look as the v5 index card.
 * Navigation is at the top (back to all stories, Previous, counter, Next) and again at the bottom
 * (Previous and Next with the story titles, and a link back), so a "next" is never hard to find.
 * No hero: the card is the page. Phone: full width. Tablet and desktop: the 600px column.
 */
import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { DARK, LIGHT, FONTS_HREF, Story, label, mono, useBreakpoint, type CultureCardV5 } from "../culture-feed-v5/CultureFeedV5";

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const SS4_OPSZ_DISPLAY = '"opsz" 36, "wght" 300';

type Ref = { slug: string; title: string };

export interface CultureStoryV5Content {
  story: CultureCardV5;
  index: number; // 1-based place in the pager's order
  total: number;
  prev?: Ref;
  next?: Ref;
  /** Where the index and the story addresses live (preview: "/culture-v5"). */
  basePath: string;
}

export function CultureStoryV5({ content, isDark = true }: { content: CultureStoryV5Content; isDark?: boolean }) {
  useEffect(() => {
    const doc = globalThis["document"];
    if (doc.querySelector("link[data-brand-fonts]")) return;
    const link = doc.createElement("link");
    link.rel = "stylesheet"; link.href = FONTS_HREF; link.setAttribute("data-brand-fonts", "1");
    doc.head.appendChild(link);
  }, []);

  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const tk = isDark ? DARK : LIGHT;
  const { story, index, total, prev, next, basePath } = content;
  const padH = isMobile ? "1.25rem" : isTablet ? "1.4rem" : "1rem";
  const SEC = isMobile ? "3.5rem" : isTablet ? "4.5rem" : "5.5rem";
  const COL = isMobile ? "none" : `calc(600px + 2 * ${padH})`;
  const href = (r: Ref) => `${basePath}/${r.slug}`;

  const link = (extra?: CSSProperties): CSSProperties => ({ ...label(tk, { color: tk.body }), textDecoration: "none", ...extra });
  const off = { opacity: 0.3, cursor: "default" } as const;
  const Step = ({ to, children, dir }: { to?: Ref; children: ReactNode; dir: "prev" | "next" }) =>
    to ? <a href={href(to)} rel={dir} style={link()}>{children}</a> : <span style={link(off)} aria-disabled="true">{children}</span>;

  const bottomBlock = (to: Ref, dir: "prev" | "next") => (
    <a href={href(to)} rel={dir}
      style={{ display: "flex", flexDirection: "column", alignItems: dir === "prev" ? "flex-start" : "flex-end", gap: "0.35rem", padding: "1.1rem 0 0", borderTop: `1px solid ${tk.rule}`, textDecoration: "none", textAlign: dir === "prev" ? "left" : "right", flex: 1 }}>
      <span style={label(tk)}>{dir === "prev" ? "← Previous" : "Next →"}</span>
      <span style={{ fontFamily: FONT_SS4, fontSize: "1.15rem", fontWeight: 300, fontStyle: "italic", fontVariationSettings: SS4_OPSZ_DISPLAY, color: tk.head }}>{to.title}</span>
    </a>
  );

  return (
    <div style={{ background: tk.bg, minHeight: "100vh", overflowX: "hidden", transition: "background 0.35s ease", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
      <div style={{ maxWidth: COL, margin: "0 auto", padding: `${isMobile ? "5.6rem" : "6.2rem"} ${padH} 0`, boxSizing: "border-box" }}>

        {/* Top navigation: always in reach, before the story. */}
        <nav aria-label="Stories" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.6rem 1rem", marginBottom: "1.1rem" }}>
          <a href={basePath} style={link()}>← All stories</a>
          <span style={{ display: "flex", alignItems: "baseline", gap: "0.9rem" }}>
            <Step to={prev} dir="prev">‹ Prev</Step>
            <span style={mono(tk)}>{`${String(index).padStart(2, "0")} / ${total}`}</span>
            <Step to={next} dir="next">Next ›</Step>
          </span>
        </nav>

        <Story entry={story} tk={tk} isActive isMobile={isMobile} eager stack={!isMobile} index={index} total={total} startOpen titleTag="h1" />

        {/* Bottom navigation: the neighbours by name. */}
        <nav aria-label="Next and previous story" style={{ display: "flex", gap: "1.5rem", marginTop: "2.2rem" }}>
          {prev ? bottomBlock(prev, "prev") : <span style={{ flex: 1 }} />}
          {next ? bottomBlock(next, "next") : <span style={{ flex: 1 }} />}
        </nav>
        <div style={{ textAlign: "center", marginTop: "1.6rem" }}>
          <a href={basePath} style={link()}>All stories</a>
        </div>

        <div style={{ height: SEC }} aria-hidden="true" />
      </div>
    </div>
  );
}
