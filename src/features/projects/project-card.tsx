import { ArrowRight, ArrowUpRight, Lock } from "lucide-react";

import { Schematic } from "@/components/shared/schematic";
import { SocialIcon } from "@/components/shared/social-icon";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

import { ProjectLink } from "./project-link";
import { SpecTable } from "./case-study";

interface ProjectCardProps {
  project: Project;
  /** Featured layout: diagram and text side by side on large screens. */
  wide?: boolean;
}

/** One project: its architecture on a plate, then what it is and where to see it. */
export function ProjectCard({ project, wide = false }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative grid h-full overflow-hidden rounded-md border border-border bg-background transition-colors hover:border-seam-strong",
        wide ? "lg:grid-cols-12" : "grid-rows-[auto_1fr]",
      )}
    >
      <ProjectLink
        slug={project.slug}
        className={cn(
          "flex items-center justify-center border-b border-border bg-plate p-4 sm:p-6",
          wide && "lg:col-span-8 lg:border-b-0 lg:border-r",
        )}
      >
        <span className="sr-only">Read the {project.title} write-up</span>
        {project.diagram ? (
          <Schematic diagram={project.diagram} title={project.title} className="w-full" />
        ) : (
          <SpecTable rows={project.caseStudy.spec} className="w-full" />
        )}
      </ProjectLink>

      <div className={cn("flex flex-col p-5 sm:p-6", wide && "lg:col-span-4")}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="display-caps text-[2rem] sm:text-[2.25rem]">{project.title}</h3>
          <span className="label-mono shrink-0 text-muted-foreground">{project.period}</span>
        </div>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/85">{project.summary}</p>

        <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
          <span className="sr-only">Built with: </span>
          {/* The non-breaking space keeps each dot on the line of the tag before it. */}
          {project.tags.slice(0, 6).join(" · ")}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-6">
          <ProjectLink
            slug={project.slug}
            className="group/cta inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Read the write-up
            <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
          </ProjectLink>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

/** Live / Source links, or the note that replaces Source (e.g. a private repo). */
export function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  const { live, source } = project.links;
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs", className)}>
      {live && (
        <li>
          <a
            href={live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:text-lamp-ink hover:underline"
          >
            Live <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">{project.title} (opens in a new tab)</span>
          </a>
        </li>
      )}
      {source ? (
        <li>
          <a
            href={source}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:text-lamp-ink hover:underline"
          >
            <SocialIcon platform="github" className="size-3.5" /> Source
            <span className="sr-only">for {project.title} on GitHub (opens in a new tab)</span>
          </a>
        </li>
      ) : (
        project.sourceNote && (
          <li className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Lock className="size-3" aria-hidden="true" /> {project.sourceNote}
          </li>
        )
      )}
    </ul>
  );
}
