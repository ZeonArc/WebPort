"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { TOASTER_MOUNT_EVENT } from "@/lib/toast";

const ToasterMounted = dynamic(() => import("./toaster-mounted"), { ssr: false });

/** Mounts the (code-split) toast viewport the first time something calls notify(). */
export function ToasterHost() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const activate = () => setActive(true);
    window.addEventListener(TOASTER_MOUNT_EVENT, activate, { once: true });
    return () => window.removeEventListener(TOASTER_MOUNT_EVENT, activate);
  }, []);

  return active ? <ToasterMounted /> : null;
}
