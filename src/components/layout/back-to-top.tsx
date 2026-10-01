"use client";

import { ArrowUp } from "lucide-react";

import { useSectionNavigation } from "@/components/providers/smooth-scroll-provider";

export function BackToTop() {
  const goToSection = useSectionNavigation();
  return (
    <button
      type="button"
      onClick={() => goToSection("top")}
      className="group inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs text-muted-foreground transition hover:border-seam-strong hover:text-foreground"
    >
      Back to top
      <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
    </button>
  );
}
