"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { getProject } from "@/content/projects";

const loadModal = () => import("./project-modal").then((mod) => mod.ProjectModal);
const ProjectModal = dynamic(loadModal, { ssr: false });

/** Warm the case-study dialog chunk (e.g. when a card is hovered). */
export function preloadProjectModal() {
  void loadModal();
}

interface ProjectModalApi {
  openProject: (slug: string) => void;
}

const ProjectModalContext = createContext<ProjectModalApi | null>(null);

/** Hosts a single case-study dialog that any component (cards, ⌘K palette) can open. */
export function ProjectModalProvider({ children }: { children: ReactNode }) {
  // The slug is kept after closing so the dialog can animate out with its content.
  const [slug, setSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = useCallback((next: string) => {
    setSlug(next);
    setOpen(true);
  }, []);

  const api = useMemo(() => ({ openProject }), [openProject]);

  return (
    <ProjectModalContext.Provider value={api}>
      {children}
      {/* Mounted on first use; the dialog code is a separate chunk. */}
      {slug && <ProjectModal project={getProject(slug)} open={open} onOpenChange={setOpen} />}
    </ProjectModalContext.Provider>
  );
}

export function useProjectModal(): ProjectModalApi {
  const ctx = useContext(ProjectModalContext);
  if (!ctx) throw new Error("useProjectModal must be used inside <ProjectModalProvider>");
  return ctx;
}
