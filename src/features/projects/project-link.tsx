"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { preloadProjectModal, useProjectModal } from "./project-modal-provider";

interface ProjectLinkProps {
  slug: string;
  className?: string;
  children: ReactNode;
}

/**
 * Links to /projects/[slug]. On the home page a plain click opens the write-up
 * in the modal instead (modified clicks still open the page in a new tab).
 */
export function ProjectLink({ slug, className, children }: ProjectLinkProps) {
  const { openProject } = useProjectModal();
  const pathname = usePathname();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    openProject(slug);
  }

  return (
    <Link
      href={`/projects/${slug}`}
      prefetch={false}
      onClick={onClick}
      onPointerEnter={preloadProjectModal}
      onFocus={preloadProjectModal}
      className={className}
    >
      {children}
    </Link>
  );
}
