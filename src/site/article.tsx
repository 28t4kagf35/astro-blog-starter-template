// Shared pieces for long-form article pages (Learn v2 now; Experience v2 can fold in later).
// Body face variants, a closing card, and a figure slot for images that break out of the text column.
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

export const FONT_SS4 = "'Source Serif 4', Georgia, serif";
export const FONT_SPEC = "'Spectral', Georgia, serif";
export const FONT_MONO = "'IBM Plex Mono', monospace";
export const FONT_LBL = "'Raleway', system-ui, sans-serif";

export type ArticleTokens = {
  readonly bg: string; readonly surface: string; readonly rule: string; readonly muted: string;
  readonly body: string; readonly head: string; readonly bq: string; readonly accent: string;
};

/** One Google Fonts request for everything an article page needs. */
export const ARTICLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..500;1,8..60,300..500" +
  "&family=Spectral:ital,wght@0,300;1,300" +
  "&family=Source+Sans+3:wght@300;400" +
  "&family=IBM+Plex+Mono:wght@400" +
  "&family=Raleway:wght@300;400" +
  "&display=block";

export function useArticleFonts(id: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id; link.rel = "stylesheet"; link.href = ARTICLE_FONTS_HREF;
    document.head.appendChild(link);
  }, [id]);
}

/** ?body=sleek | mid | sturdy | sans | spectral for comparison; the default is the sleekest Source Serif cut. */
export function useBodyVariant(): string {
  const [v, setV] = useState("default");
  useEffect(() => { setV(new URLSearchParams(window.location.search).get("body") ?? "default"); }, []);
  return v;
}

const SS_BODY: Record<string, { opsz: number; wght: number }> = {
  default: { opsz: 48, wght: 300 }, sleek: { opsz: 32, wght: 320 }, mid: { opsz: 22, wght: 360 }, sturdy: { opsz: 14, wght: 400 },
};

export function bodyFontStyle(variant: string, fontSize: string): CSSProperties {
  if (variant === "spectral") return { fontFamily: FONT_SPEC, fontWeight: 300, fontSize, lineHeight: 2.05, letterSpacing: "0.01em" };
  if (variant === "sans") return { fontFamily: "'Source Sans 3', system-ui, sans-serif", fontWeight: 300, fontSize, lineHeight: 1.75, letterSpacing: "0.012em" };
  const ss = SS_BODY[variant] ?? SS_BODY.default;
  return { fontFamily: FONT_SS4, fontWeight: ss.wght, fontVariationSettings: `"opsz" ${ss.opsz}`, fontSize, lineHeight: 1.8, letterSpacing: "0.003em" };
}

const FONT_SS3 = "'Source Sans 3', system-ui, sans-serif";
export type ContinueCard = { label: string; body: string; href?: string };

/**
 * The "Continue" block, styled as on the Tvindefossen page: a rule, a small label,
 * and bordered cards on the surface tone (label + short text). Two cards.
 * On desktop it breaks out of the 600 text column to the 860 column.
 * A card is a link only when it has an href (Stretch-style cover link, no hover effect, as on Tvindefossen).
 */
export function ContinueBlock({ cards, tk, isMobile, isTablet, isDesktop, sec, ruled = true }: {
  cards: ContinueCard[]; tk: ArticleTokens; isMobile: boolean; isTablet: boolean; isDesktop: boolean; sec: string; ruled?: boolean;
}) {
  const wrap: CSSProperties = isDesktop
    ? { width: "min(860px, 100vw - 2rem)", position: "relative", left: "50%", transform: "translateX(-50%)" }
    : {};
  const pad = isMobile || isTablet ? "1.3rem" : "1.6rem";
  return (
    <div style={wrap}>
      <div style={{ borderTop: ruled ? `1px solid ${tk.rule}` : "none", paddingTop: ruled ? sec : 0 }}>
        <p style={{ margin: "0 0 1.6rem", fontFamily: FONT_LBL, fontSize: "0.76rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.6, color: tk.body }}>Continue</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isDesktop ? "1.4rem" : "1.1rem" }}>
          {cards.map((c) => (
            <div key={c.label} style={{ position: "relative", border: `1px solid ${tk.rule}`, borderRadius: "0.35rem", padding: pad, display: "flex", flexDirection: "column", background: tk.surface }}>
              {c.href ? <a href={c.href} aria-label={c.label} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 4 }} /> : null}
              <span style={{ display: "block", marginBottom: "0.7rem", fontFamily: FONT_LBL, fontSize: "0.76rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.6, color: tk.head }}>{c.label}</span>
              <p style={{ margin: 0, fontFamily: FONT_SS3, fontSize: isMobile ? "0.95rem" : "1rem", fontWeight: 300, lineHeight: 1.82, letterSpacing: "0.02em", color: tk.body }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Figure slot: an image that breaks out of the 600px text column to 860 or 1200 with a mono caption.
 * Not used until the CMS has a figure block; the layout is ready for it.
 */
export function Figure({ src, srcSet, alt, caption, wide, tk }: { src: string; srcSet?: string; alt?: string; caption?: string; wide?: boolean; tk: ArticleTokens }): ReactNode {
  const w = wide ? 1200 : 860;
  return (
    <figure style={{ margin: "3rem 0", width: `min(${w}px, 100vw - 2rem)`, position: "relative", left: "50%", transform: "translateX(-50%)" }}>
      <img src={src} srcSet={srcSet} sizes={`${w}px`} alt={alt ?? ""} style={{ display: "block", width: "100%", height: "auto" }} />
      {caption ? <figcaption style={{ marginTop: "0.8rem", fontFamily: FONT_MONO, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.5, color: tk.muted }}>{caption}</figcaption> : null}
    </figure>
  );
}
