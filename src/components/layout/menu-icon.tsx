import { cn } from "@/lib/utils";

/** Two-line hamburger that morphs into an X. */
export function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-3 w-[1.125rem]">
      <span
        className={cn(
          "absolute left-0 top-0 h-[1.5px] w-full rounded bg-current transition-transform duration-300 ease-out-expo",
          open && "translate-y-[5.25px] rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-current transition-transform duration-300 ease-out-expo",
          open && "-translate-y-[5.25px] -rotate-45",
        )}
      />
    </span>
  );
}
