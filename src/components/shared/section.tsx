import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * Page section with a focusable anchor target (`tabIndex=-1`) so in-page
 * navigation can move keyboard focus here. Labelled by `${id}-title`.
 */
export function Section({ id, children, className, containerClassName }: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={cn("relative py-16 outline-none md:py-24", className)}
    >
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", containerClassName)}>{children}</div>
    </section>
  );
}
