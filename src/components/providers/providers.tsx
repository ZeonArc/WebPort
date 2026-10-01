"use client";

import type { ReactNode } from "react";

import { ProjectModalProvider } from "@/features/projects/project-modal-provider";

import { SmoothScrollProvider } from "./smooth-scroll-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <ProjectModalProvider>{children}</ProjectModalProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
