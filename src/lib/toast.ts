"use client";

import type { ExternalToast } from "sonner";

type Kind = "success" | "error" | "info";

let resolveReady: () => void = () => {};
const ready = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

/** Called by <ToasterMounted /> once sonner's <Toaster> is subscribed. */
export function markToasterReady() {
  resolveReady();
}

export const TOASTER_MOUNT_EVENT = "toaster:mount";

/**
 * Show a toast. sonner and its <Toaster> are code-split: the first call asks
 * <ToasterHost /> to mount it, then the toast is shown once it's listening.
 */
export function notify(kind: Kind, message: string, data?: ExternalToast) {
  window.dispatchEvent(new Event(TOASTER_MOUNT_EVENT));
  void Promise.all([import("sonner"), ready]).then(([{ toast }]) => toast[kind](message, data));
}
