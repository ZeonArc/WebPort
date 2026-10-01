"use client";

import type Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type ScrollTarget = string | number | HTMLElement;

interface ScrollOptions {
  immediate?: boolean;
}

interface SmoothScrollApi {
  scrollTo: (target: ScrollTarget, options?: ScrollOptions) => void;
  /** Pause smooth scrolling (e.g. while a dialog is open). Calls are ref-counted. */
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lenis smooth scrolling for mouse/trackpad users. It's code-split and loaded after
 * hydration; touch devices and reduced-motion users keep native scrolling
 * (with CSS smooth anchor scrolling, see globals.css).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const locks = useRef(0);

  useEffect(() => {
    const wanted = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!wanted.matches) return;

    let instance: Lenis | null = null;
    let cancelled = false;
    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      instance = new LenisCtor({
        autoRaf: true,
        allowNestedScroll: true,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
      if (locks.current > 0) instance.stop();
      lenisRef.current = instance;
    });

    return () => {
      cancelled = true;
      instance?.destroy();
      lenisRef.current = null;
    };
  }, []);

  /**
   * Section offsets come from CSS `scroll-padding-top` (globals.css), which Lenis,
   * scrollIntoView and native anchor jumps all honour, so the navbar never covers a heading.
   */
  const scrollTo = useCallback((target: ScrollTarget, { immediate = false }: ScrollOptions = {}) => {
    const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (element === null) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(element, { immediate, duration: 1.1, force: true });
      return;
    }

    const behavior: ScrollBehavior = immediate || prefersReducedMotion() ? "instant" : "smooth";
    if (typeof element === "number") window.scrollTo({ top: element, behavior });
    else element.scrollIntoView({ behavior, block: "start" });
  }, []);

  const stop = useCallback(() => {
    locks.current += 1;
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current === 0) lenisRef.current?.start();
  }, []);

  const api = useMemo(() => ({ scrollTo, stop, start }), [scrollTo, stop, start]);

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollApi {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScrollProvider>");
  return ctx;
}

/** Pause Lenis while `locked` is true (dialogs, menus). */
export function useScrollLock(locked: boolean) {
  const { stop, start } = useSmoothScroll();
  useEffect(() => {
    if (!locked) return;
    stop();
    return start;
  }, [locked, stop, start]);
}

/**
 * Navigate to a home-page section: smooth-scroll when we're on "/", otherwise route to "/#id".
 * Moves focus to the section so keyboard and screen-reader users land in the right place.
 */
export function useSectionNavigation() {
  const { scrollTo } = useSmoothScroll();
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (id: string) => {
      const element = id === "top" ? document.body : document.getElementById(id);
      if (pathname !== "/" || element === null) {
        router.push(id === "top" ? "/" : `/#${id}`);
        return;
      }

      if (id === "top") {
        scrollTo(0);
        history.replaceState(null, "", "/");
        return;
      }

      scrollTo(element);
      history.replaceState(null, "", `#${id}`);
      element.focus({ preventScroll: true });
    },
    [pathname, router, scrollTo],
  );
}
