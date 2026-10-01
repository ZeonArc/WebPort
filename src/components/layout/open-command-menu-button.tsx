"use client";

import { Search } from "lucide-react";

import { openCommandMenu } from "./command-menu";

export function OpenCommandMenuButton() {
  return (
    <button
      type="button"
      onClick={openCommandMenu}
      className="inline-flex h-12 items-center gap-2 rounded-md border border-seam-strong px-5 text-[0.9375rem] font-medium transition-colors hover:bg-accent"
    >
      <Search className="size-4" aria-hidden="true" />
      Search the site
    </button>
  );
}
