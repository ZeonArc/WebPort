"use client";

import { ArrowDown, FileText } from "lucide-react";
import type { MouseEvent } from "react";

import { useSectionNavigation } from "@/components/providers/smooth-scroll-provider";
import { site } from "@/content/site";

export function HeroCtas() {
  const goToSection = useSectionNavigation();

  function viewProjects(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    goToSection("work");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="#work"
        onClick={viewProjects}
        className="group inline-flex h-12 items-center gap-2 rounded-md bg-lamp px-6 text-[0.9375rem] font-medium text-lamp-foreground transition-[filter] hover:brightness-110"
      >
        See projects
        <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
      </a>
      <a
        href={site.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-12 items-center gap-2 rounded-md border border-seam-strong px-6 text-[0.9375rem] font-medium text-foreground transition-colors hover:bg-accent"
      >
        <FileText className="size-4" aria-hidden="true" />
        Résumé (PDF)
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
