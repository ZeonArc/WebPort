import { ImageResponse } from "next/og";

import { getCategoryLabel, getProject, projects } from "@/content/projects";
import { site } from "@/content/site";

import { OG_SIZE, OgCard } from "../../og-template";

export const alt = "Project write-up";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={project ? `${getCategoryLabel(project.category)} · ${project.period}` : "Project"}
        title={project?.title ?? site.name}
        subtitle={project?.summary ?? site.description}
        footer={`${site.name} · ${site.role}`}
      />
    ),
    size,
  );
}
