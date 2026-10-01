"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";

import { SocialIcon } from "@/components/shared/social-icon";
import { projectCategories, projects, type ProjectCategory } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

import { ProjectCard } from "./project-card";

type Filter = ProjectCategory | "all";

const FILTERS: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...projectCategories];

/** Each card's view-transition name; only applied while a filter transition runs (see globals.css). */
const vtName = (id: string) => ({ "--vt-name": `project-${id}` }) as CSSProperties;

export function ProjectGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const github = site.socials.find((s) => s.platform === "github");

  /**
   * Cards that stay glide to their new positions, others fade in or out, via the
   * View Transitions API. Unsupported browsers and reduced motion switch instantly.
   */
  function changeFilter(next: Filter) {
    if (next === filter) return;
    const grid = gridRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion || !grid) {
      setFilter(next);
      return;
    }
    grid.dataset.vt = "";
    const transition = document.startViewTransition(() => flushSync(() => setFilter(next)));
    transition.finished.finally(() => delete grid.dataset.vt);
  }

  return (
    <div ref={gridRef} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter projects by type" className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => {
            const count = item.id === "all" ? projects.length : projects.filter((p) => p.category === item.id).length;
            if (count === 0) return null;
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(item.id)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
                  active
                    ? "border-seam-strong bg-plate text-foreground"
                    : "border-border text-muted-foreground hover:border-seam-strong hover:text-foreground",
                )}
              >
                <span className={active ? "lamp" : "lamp-off"} aria-hidden="true" />
                {item.label}
                <span className="font-mono text-[0.6875rem] text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {visible.map((project) => {
          const wide = filter === "all" && Boolean(project.featured);
          return (
            <li key={project.slug} className={cn("vt-card", wide && "md:col-span-2")} style={vtName(project.slug)}>
              <ProjectCard project={project} wide={wide} />
            </li>
          );
        })}

        {filter === "all" && github && (
          <li className="vt-card" style={vtName("more")}>
            <a
              href={github.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full min-h-48 flex-col justify-between rounded-md border border-dashed border-seam-strong p-6 transition-colors hover:border-foreground/40 hover:bg-plate"
            >
              <SocialIcon platform="github" className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" />
              <div>
                <p className="display-caps text-[2rem]">More on GitHub</p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  Older and smaller projects at github.com/{github.handle}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </p>
              </div>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
