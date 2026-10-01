"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";

import { useScrollLock } from "@/components/providers/smooth-scroll-provider";
import { Schematic, SchematicLegend } from "@/components/shared/schematic";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Project } from "@/content/projects";

import { CaseStudyBody, ProjectMeta, ProjectTags, SpecTable } from "./case-study";
import { ProjectLinks } from "./project-card";

interface ProjectModalProps {
  project: Project | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  useScrollLock(open);

  return (
    <Dialog open={open && project !== undefined} onOpenChange={onOpenChange}>
      {project && (
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[min(54rem,calc(100dvh-2rem))] w-[calc(100%-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-md border border-seam-strong bg-popover p-0 ring-0 sm:max-w-3xl"
        >
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <header className="space-y-4 px-6 pb-8 pt-7 pr-16 sm:px-10">
              <DialogTitle className="display-caps text-5xl sm:text-6xl">{project.title}</DialogTitle>
              <DialogDescription className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                {project.summary}
              </DialogDescription>
              <ProjectMeta project={project} className="pt-2" />
            </header>

            {project.diagram && (
              <div className="border-y border-border bg-plate px-4 py-6 sm:px-10">
                <Schematic diagram={project.diagram} title={project.title} />
                <SchematicLegend className="mt-5 justify-center" />
              </div>
            )}

            <div className="space-y-10 px-6 py-8 sm:px-10">
              <CaseStudyBody project={project} />
              <section>
                <h3 className="label-mono text-lamp-ink">Spec</h3>
                <SpecTable rows={project.caseStudy.spec} className="mt-3" />
              </section>
              <ProjectTags tags={project.tags} />
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-popover px-6 py-4 sm:px-10">
            <ProjectLinks project={project} className="text-sm" />
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Open as a page
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </footer>

          <DialogClose className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-md border border-border bg-popover text-foreground transition hover:bg-accent">
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Close write-up</span>
          </DialogClose>
        </DialogContent>
      )}
    </Dialog>
  );
}
