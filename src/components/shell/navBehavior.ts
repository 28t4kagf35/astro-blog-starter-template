/**
 * Global navbar behaviour: the ONE place that decides how SiteNav looks and
 * when it hides. Hosts call useNavBehavior() and pass the result straight to
 * <SiteNav>; no page may set its own scroll rule.
 *
 * Rule (user-confirmed intent, Oct 1 2026; values = webglobals SiteNav defaults):
 *  - Look: one constant frosted bar, never transparent: "soft"
 *    (rgba(19,20,22,0.28) + blur(5px), defined inside SiteNav). Measured on
 *    the canon Replit mockup (nav/SiteNavDesktop), Oct 1 2026: soft at every
 *    scroll position.
 *  - Hide: after scrolling DOWN past 1 x viewport height.
 *  - Reveal: after scrolling UP an accumulated 20% of viewport height.
 *  - isMobile: viewport < 768px (shell contract).
 */
import { useEffect, useState } from "react";
import type { NavScrollState } from "./component";

export const NAV_LOOK: NavScrollState = "soft";
export const NAV_HIDE_AFTER_VH = 1.0;
export const NAV_REVEAL_UP_VH = 0.2;
export const NAV_MOBILE_MAX_PX = 767;

export function useNavBehavior() {
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${NAV_MOBILE_MAX_PX}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let upAccum = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const delta = y - lastY;
        if (delta > 0) {
          upAccum = 0;
          if (y > vh * NAV_HIDE_AFTER_VH) setHidden(true);
        } else if (delta < 0) {
          upAccum += -delta;
          if (upAccum >= vh * NAV_REVEAL_UP_VH || y <= 0) { setHidden(false); upAccum = 0; }
        }
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrollState: NAV_LOOK, hidden, isMobile };
}
