"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";

import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

/**
 * Switches theme with a circular reveal from the click point (View Transitions API).
 * Falls back to an instant switch where unsupported or with reduced motion.
 */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated ? resolvedTheme !== "light" : true;

  function toggle(origin?: { x: number; y: number }) {
    const next = isDark ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 40;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 560, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  return { isDark, toggle };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useThemeSwitch();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative inline-flex size-10 items-center justify-center overflow-hidden rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {/* Both icons are rendered; html.dark (set before first paint) picks one, so there's no flash. */}
      <Sun
        aria-hidden="true"
        className="size-[1.125rem] transition-[transform,opacity] duration-300 ease-out-expo dark:-rotate-90 dark:scale-50 dark:opacity-0"
      />
      <Moon
        aria-hidden="true"
        className="absolute size-[1.125rem] rotate-90 scale-50 opacity-0 transition-[transform,opacity] duration-300 ease-out-expo dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}
