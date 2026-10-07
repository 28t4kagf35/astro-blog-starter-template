// The shared hero for the v2 working copies: same anatomy as Tvindefossen.
// Photo, dark fade from the bottom, veil that clears on load, then the title
// with one Raleway capitals line (tagline) below it, bottom-left inside the
// 860px reading column. Page types choose the photo, crop, title and tagline.
import { useEffect, useState, type ReactNode } from "react";

const FONT_SS4 = "'Source Serif 4', Georgia, serif";
const FONT_LBL = "'Raleway', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

export interface HeroProps {
  image?: string;
  srcSet?: string;
  position?: string;
  alt?: string;
  title: ReactNode;
  /** Where this page sits in the site (small, mono, above the title). */
  placement?: string;
  /** A line that reads for substance (Raleway capitals, below the title). */
  tagline?: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** Plain Source Serif italic title ("Culture & History" keeps its line break). */
  fieldPrefix?: string;
  /** Calmer pages (articles): a shorter hero so the first lines of text peek in. */
  compact?: boolean;
}

export function Hero({ image, srcSet, position = "center", alt = "", title, placement, tagline, isMobile, isTablet, isDesktop, compact }: HeroProps) {
  const [cleared, setCleared] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setCleared(true))); }, []);
  useEffect(() => { const t = setTimeout(() => setTextVisible(true), 400); return () => clearTimeout(t); }, []);

  const pad = isMobile ? "0 1.25rem" : isTablet ? "0 1.4rem" : "0 1rem";
  const h1 = isMobile ? "2.6rem" : isTablet ? "3.2rem" : "3.8rem";

  return (
    <div style={{ position: "relative", width: "100%", minHeight: compact ? (isMobile ? "68vh" : isTablet ? "66vh" : "70vh") : (isMobile ? "80vh" : isTablet ? "88vh" : "100dvh"), overflow: "hidden" }}>
      {image ? (
        <img
          data-bb-field="heroImage"
          src={image}
          srcSet={srcSet}
          sizes="100vw"
          fetchPriority="high"
          alt={alt}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position }}
        />
      ) : (
        <div data-bb-field="heroImage" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "#222120", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E6A65" }}>image unavailable</span>
        </div>
      )}
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: compact ? "linear-gradient(to top,rgba(26,23,20,1) 0%,rgba(26,23,20,0.88) 7%,rgba(0,0,0,.5) 17%,rgba(0,0,0,.1) 28%,transparent 36%)" : "linear-gradient(to top,rgba(26,23,20,1) 0%,rgba(26,23,20,0.88) 10%,rgba(0,0,0,.5) 24%,rgba(0,0,0,.1) 40%,transparent 52%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: cleared ? "rgba(14,12,10,0)" : "rgba(14,12,10,0.42)", opacity: cleared ? 0 : 1, transition: compact ? "background-color 1.8s cubic-bezier(.18,0,.38,1), opacity 1.8s cubic-bezier(.18,0,.38,1)" : "background-color 2.6s cubic-bezier(.18,0,.38,1), opacity 2.6s cubic-bezier(.18,0,.38,1)", pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: isMobile ? "2.4rem" : isTablet ? "3rem" : "3.8rem", left: isDesktop ? "50%" : 0, transform: isDesktop ? "translateX(-50%)" : "none", width: "100%", maxWidth: isDesktop ? "860px" : "none", zIndex: 3, padding: pad, boxSizing: "border-box", opacity: textVisible ? 1 : 0, transition: "opacity 1.3s ease-in-out" }}>
        {placement ? (
          <p style={{ margin: "0 0 1rem", fontFamily: FONT_MONO, fontSize: isMobile ? "0.68rem" : "0.74rem", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", lineHeight: 1.4, color: "#EDE9E2", opacity: 0.7 }}>{placement}</p>
        ) : null}
        <h1 style={{ margin: 0, fontFamily: FONT_SS4, fontSize: h1, fontWeight: 300, fontStyle: "italic", fontVariationSettings: '"opsz" 36, "wght" 300', lineHeight: 1.06, letterSpacing: "-0.01em", color: "#EDE9E2" }}>{title}</h1>
        {tagline ? (
          <p style={{ margin: "0.8rem 0 0", fontFamily: FONT_LBL, fontSize: "1.06rem", fontWeight: 400, letterSpacing: "0.13em", textTransform: "uppercase", lineHeight: 1.4, color: "#EDE9E2", opacity: 0.78 }}>{tagline}</p>
        ) : null}
      </div>
    </div>
  );
}
