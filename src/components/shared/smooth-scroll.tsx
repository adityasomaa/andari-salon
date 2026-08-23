"use client";

/**
 * Lenis, deliberately narrow in scope.
 *
 * It runs only on pointer-driven desktop viewports. Tablets and phones keep
 * native scrolling, because hijacked momentum on a touch surface fights the
 * platform and breaks address-bar behaviour. It also stops entirely whenever
 * anything holds a scroll lock, which covers the calendar, the listboxes, the
 * mobile menu and the page-transition curtain.
 */

import Lenis from "lenis";
import { useEffect, useRef } from "react";

import { useUIState } from "./ui-state";

const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function SmoothScroll() {
  const { locked } = useUIState();
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);

    const destroy = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const sync = () => {
      const shouldRun = desktop.matches && !reduced.matches;
      if (shouldRun && !lenisRef.current) {
        const lenis = new Lenis({
          duration: 1.05,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 0,
          wheelMultiplier: 1,
        });
        lenisRef.current = lenis;
        const loop = (time: number) => {
          lenis.raf(time);
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      } else if (!shouldRun && lenisRef.current) {
        destroy();
      }
    };

    sync();
    desktop.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      destroy();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [locked]);

  return null;
}

/** Jump to the top without Lenis easing it, used by the page transition. */
export function scrollToTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
}
