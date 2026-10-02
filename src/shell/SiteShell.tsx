/**
 * SiteShell: the ONE place where global elements are mounted and where the
 * state they share with the page lives (theme, ambient-audio bridge).
 *
 * Page types never import a global. A page type is made mountable with
 * withShell(Page); the shell renders the globals around it and hands the page
 * the shared state as props (ShellPageProps).
 *
 * Only files in src/shell may import from src/globals (enforced by the build
 * check in scripts/check-architecture.mjs).
 */
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { SiteNav, useNavBehavior } from "../globals/navbar";

/** What every page type receives from the shell. */
export interface ShellPageProps {
  isDark: boolean;
  /** A page with ambient audio registers its toggle; the nav's audio button calls it. */
  registerAudioToggle: (toggle: () => void) => void;
  /** The page reports real playback state; drives the nav's audio icon. */
  onAudioStateChange: (playing: boolean) => void;
}

export function withShell<C>(Page: ComponentType<{ content: C } & ShellPageProps>) {
  return function ShellPage({ content }: { content: C }) {
    const [isDark, setIsDark] = useState(true);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const audioToggleRef = useRef<(() => void) | null>(null);
    const audioPlayingRef = useRef(false);

    // Navbar look + hide/reveal: the navbar global's own rule.
    const { scrollState, hidden: navHidden, isMobile } = useNavBehavior();

    const registerAudioToggle = useCallback((toggle: () => void) => {
      audioToggleRef.current = toggle;
    }, []);
    const onAudioStateChange = useCallback((playing: boolean) => {
      audioPlayingRef.current = playing;
      setAudioPlaying(playing);
    }, []);

    // Audio intent starts ON: the first eligible interaction unlocks playback
    // on pages that registered an audio toggle; a no-op on pages without one.
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
        <Page
          content={content}
          isDark={isDark}
          registerAudioToggle={registerAudioToggle}
          onAudioStateChange={onAudioStateChange}
        />
      </>
    );
  };
}
