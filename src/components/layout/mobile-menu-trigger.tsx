"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { MenuIcon } from "./menu-icon";

const loadMenu = () => import("./mobile-menu");
const MobileMenu = dynamic(loadMenu, { ssr: false });

/**
 * Hamburger button. The menu itself (Radix Dialog + motion) is a separate chunk,
 * prefetched on pointer-down/focus and mounted on first open.
 */
export function MobileMenuTrigger() {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  return (
    <>
      <button
        type="button"
        onPointerDown={() => void loadMenu()}
        onFocus={() => void loadMenu()}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent md:hidden"
      >
        <MenuIcon open={open} />
      </button>
      {requested && <MobileMenu open={open} onOpenChange={setOpen} />}
    </>
  );
}
