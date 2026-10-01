"use client";

import { useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import { markToasterReady } from "@/lib/toast";

export default function ToasterMounted() {
  // Child effects run first, so sonner has subscribed by the time this fires.
  useEffect(markToasterReady, []);
  return <Toaster position="bottom-right" dir="ltr" />;
}
