import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Small mono chip for tech tags. */
export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] leading-4 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
