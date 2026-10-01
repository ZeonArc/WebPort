import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Distance (px) to slide up from. */
  y?: number;
}

/**
 * Fade + slide-up once the element scrolls into view.
 * Pure markup + CSS (see globals.css); <RevealObserver /> flips `data-revealed`.
 * Works in server components and adds no hydration cost.
 */
export function Reveal({ children, className, delay = 0, y }: RevealProps) {
  const style: Record<string, string> = {};
  if (delay) style["--reveal-delay"] = `${delay}s`;
  if (y !== undefined) style["--reveal-y"] = `${y}px`;

  return (
    <div data-reveal="" className={className} style={Object.keys(style).length ? (style as CSSProperties) : undefined}>
      {children}
    </div>
  );
}
