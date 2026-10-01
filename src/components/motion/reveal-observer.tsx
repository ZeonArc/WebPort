"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-revealed]), [data-split]:not([data-intro]):not([data-revealed]), .skill-bar:not([data-revealed])";

/**
 * One IntersectionObserver for every scroll-triggered entrance on the page.
 * It sets `data-revealed` directly on the element (no React state, no re-render);
 * CSS in globals.css does the animating. A MutationObserver picks up content
 * that mounts later (tab switches, filtered grids, client navigations).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const scan = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    scan();

    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
