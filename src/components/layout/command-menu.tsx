"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OPEN_EVENT = "command-menu:open";

const loadPalette = () => import("./command-palette");
const CommandPalette = dynamic(loadPalette, { ssr: false });

/** Open the palette from anywhere (navbar button, 404 page…). */
export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Warm the palette chunk before it's needed (e.g. on hover of the ⌘K button). */
export function preloadCommandMenu() {
  void loadPalette();
}

/**
 * Listens for ⌘K / Ctrl+K and the open event. The palette itself (cmdk + its UI)
 * is code-split and only fetched the first time it's requested.
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setRequested(true);
        setOpen((value) => !value);
      }
    }
    function onOpen() {
      setRequested(true);
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  if (!requested) return null;
  return <CommandPalette open={open} onOpenChange={setOpen} />;
}
