import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Section id, used for the heading id the section is labelled by. */
  id: string;
  title: string;
  /** Short, true facts about the section (e.g. a count), set in mono on the right. */
  meta?: ReactNode;
  intro?: ReactNode;
  className?: string;
}

/** A hairline rule across the container, then the title in engraved caps. */
export function SectionHeader({ id, title, meta, intro, className }: SectionHeaderProps) {
  return (
    <header className={cn("mb-10 md:mb-14", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-border pt-6">
        <h2 id={`${id}-title`} className="display-caps text-[3.25rem] sm:text-6xl md:text-7xl">
          {title}
        </h2>
        {meta && <p className="label-mono pb-1 text-muted-foreground">{meta}</p>}
      </div>
      {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</div>}
    </header>
  );
}
