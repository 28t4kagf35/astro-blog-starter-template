/**
 * Host layer for the Waterfalls Master Guide (/explore/waterfalls).
 * Same shell contract as TvindefossenApp: theme (dark default), breakpoint and
 * scroll state, exactly one SiteNav. The guide has no page audio.
 */
import { useEffect, useState } from "react";
import { SiteNav, type NavScrollState } from "./shell/component";
import { WaterfallsMasterGuideAligned, type MasterGuideContent } from "./masterguide/MasterGuideFinal";

export default function MasterGuideApp({ content }: { content: MasterGuideContent }) {
  const [isDark, setIsDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollState, setScrollState] = useState<NavScrollState>("ghost");
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    const measure = () => setIsMobile(window.innerWidth < 768);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrollState(y < 40 ? "ghost" : "glass");
      setNavHidden(y > last && y > 200);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.background = isDark ? "#1A1714" : "#F4F2EE";
  }, [isDark]);

  return (
    <>
      <SiteNav
        isDark={isDark}
        onIsDarkChange={setIsDark}
        audioPlaying={false}
        onAudioToggle={() => {}}
        scrollState={scrollState}
        isMobile={isMobile}
        hidden={navHidden}
      />
      <WaterfallsMasterGuideAligned content={content} isDark={isDark} />
    </>
  );
}
