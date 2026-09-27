/**
 * Host layer for the Tvindefossen page (Day 3, Astro).
 *
 * Owns the global state that HOW_TO_APPLY.md / GLOBAL_NAV_CAPSULE.md assign to
 * the host: theme (dark by default), audio intent (ON, unlocked on the first
 * eligible user interaction), the registered page audio toggle, breakpoint and
 * scroll state for the shell. Mounts exactly one SiteNav. Neither exported
 * component is modified for host concerns.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteNav, type NavScrollState } from "./shell/component";
import { TvindefossenFinal, type WaterfallContent } from "./tvindefossen/TvindefossenFinal";

export default function TvindefossenApp({ content }: { content: WaterfallContent }) {
  const [isDark, setIsDark] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioToggleRef = useRef<(() => void) | null>(null);
  const audioPlayingRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  const [scrollState, setScrollState] = useState<NavScrollState>("ghost");
  const [navHidden, setNavHidden] = useState(false);

  const registerAudioToggle = useCallback((toggle: () => void) => {
    audioToggleRef.current = toggle;
  }, []);
  const onAudioStateChange = useCallback((playing: boolean) => {
    audioPlayingRef.current = playing;
    setAudioPlaying(playing);
  }, []);

  // Breakpoint (contract: isMobile < 768px)
  useEffect(() => {
    const measure = () => setIsMobile(window.innerWidth < 768);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Scroll appearance + direction hide
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

  // Audio intent starts ON: first eligible interaction unlocks playback,
  // and the page's own engine fades in from silence.
  useEffect(() => {
    // Only events that grant browser user-activation (touchstart does not).
    const events = ["click", "keydown", "touchend"] as const;
    const unlock = () => {
      events.forEach((e) => window.removeEventListener(e, unlock, true));
      if (!audioPlayingRef.current) audioToggleRef.current?.();
    };
    events.forEach((e) => window.addEventListener(e, unlock, { capture: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, unlock, true));
  }, []);

  useEffect(() => {
    document.documentElement.style.background = isDark ? "#1A1714" : "#F4F2EE";
  }, [isDark]);

  return (
    <>
      <SiteNav
        isDark={isDark}
        onIsDarkChange={setIsDark}
        audioPlaying={audioPlaying}
        onAudioToggle={() => audioToggleRef.current?.()}
        scrollState={scrollState}
        isMobile={isMobile}
        hidden={navHidden}
      />
      <TvindefossenFinal
        content={content}
        isDark={isDark}
        registerAudioToggle={registerAudioToggle}
        onAudioStateChange={onAudioStateChange}
      />
    </>
  );
}
