import { cn } from "@/lib/utils";

/**
 * The site's mark: two stations joined by a wire, the second one lit.
 * The same drawing is used for the favicon (app/icon.svg) and the apple icon.
 */
export function SiteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-7", className)}>
      <rect x="4" y="5" width="11" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9.5h7.5V18" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="17" y="18" width="11" height="9" rx="1.5" fill="var(--lamp)" />
    </svg>
  );
}
