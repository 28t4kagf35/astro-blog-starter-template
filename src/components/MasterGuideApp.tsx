/**
 * Host layer for the Waterfalls Master Guide (/explore/waterfalls).
 * Same shell contract as TvindefossenApp: theme (dark default), exactly one
 * SiteNav; navbar look + hide/reveal from shell/navBehavior.ts. The guide has no page audio.
 */
import { useEffect, useState } from "react";
import { SiteNav } from "./shell/component";
import { useNavBehavior } from "./shell/navBehavior";
import { WaterfallsMasterGuideAligned, type MasterGuideContent } from "./masterguide/MasterGuideFinal";

export default function MasterGuideApp({ content }: { content: MasterGuideContent }) {
  const [isDark, setIsDark] = useState(true);
  // Navbar look + hide/reveal come from the one global rule.
  const { scrollState, hidden: navHidden, isMobile } = useNavBehavior();

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
