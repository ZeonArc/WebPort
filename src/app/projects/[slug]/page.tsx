import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Schematic, SchematicLegend } from "@/components/shared/schematic";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { CaseStudyBody, ProjectMeta, ProjectTags, SpecTable } from "@/features/projects/case-study";
import { ProjectLinks } from "@/features/projects/project-card";
import { getSiteUrl } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: `${project.title} · ${site.name}`,
      description: project.summary,
    },
    twitter: { card: "summary_large_image", title: `${project.title} · ${site.name}`, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    codeRepository: project.links.source,
    dateCreated: project.year,
    keywords: project.tags.join(", "),
    author: { "@type": "Person", name: site.name, url: siteUrl },
  };

  return (
    <article className="pb-24 pt-28 md:pt-32" aria-labelledby="project-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/#work" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          All projects
        </Link>

        <header className="mt-10 space-y-6 border-t border-border pt-6">
          <h1 id="project-title" className="display-caps text-6xl sm:text-8xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-foreground/85">{project.summary}</p>
          <ProjectMeta project={project} />
          <ProjectLinks project={project} className="text-sm" />
        </header>
      </div>

      {project.diagram && (
        <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md border border-border bg-plate px-4 py-8 sm:px-8">
            <Schematic diagram={project.diagram} title={project.title} />
            <SchematicLegend className="mt-6 justify-center" />
          </div>
        </div>
      )}

      <div className="mx-auto mt-14 max-w-4xl space-y-14 px-4 sm:px-6 lg:px-8">
        <CaseStudyBody project={project} headingLevel="h2" />
        <section>
          <h2 className="label-mono text-lamp-ink">Spec</h2>
          <SpecTable rows={project.caseStudy.spec} className="mt-3" />
        </section>
        <ProjectTags tags={project.tags} />

        <nav aria-label="Next project" className="border-t border-border pt-8">
          <Link href={`/projects/${next.slug}`} className="group flex items-end justify-between gap-6">
            <span>
              <span className="label-mono block text-muted-foreground">Next project</span>
              <span className="display-caps mt-2 block text-5xl transition-colors group-hover:text-lamp-ink">{next.title}</span>
            </span>
            <ArrowRight className="mb-1 size-6 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </article>
  );
}
