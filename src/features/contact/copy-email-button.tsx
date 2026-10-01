"use client";

import { Copy } from "lucide-react";

import { copyEmail } from "@/lib/copy-email";

export function CopyEmailButton() {
  return (
    <button
      type="button"
      onClick={() => void copyEmail()}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-seam-strong px-3 font-mono text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
    >
      <Copy className="size-3.5" aria-hidden="true" /> Copy
    </button>
  );
}
