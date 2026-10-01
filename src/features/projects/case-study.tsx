import { Tag } from "@/components/shared/tag";
import { getCategoryLabel, type Project, type SpecRow } from "@/content/projects";
import { cn } from "@/lib/utils";

/** Building blocks shared by the write-up modal and the /projects/[slug] page. */

export function ProjectMeta({ project, className }: { project: Project; className?: string }) {
  const items = [
    { label: "Built", value: project.period },
    { label: "Role", value: project.role },
    { label: "Type", value: getCategoryLabel(project.category) },
  ];
  return (
    <dl className={cn("flex flex-wrap gap-x-10 gap-y-4", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="label-mono text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Two-column spec sheet: the facts a reviewer would otherwise dig through the README for. */
export function SpecTable({ rows, className }: { rows: SpecRow[]; className?: string }) {
  return (
    <dl className={cn("divide-y divide-border border-y border-border", className)}>
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 py-2.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
          <dt className="label-mono pt-0.5 text-muted-foreground">{row.label}</dt>
          <dd className="text-sm text-foreground">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseStudyBody({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const { problem, approach, result } = project.caseStudy;

  return (
    <div className="space-y-10">
      <section>
        <Heading className="label-mono text-lamp-ink">The problem</Heading>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">{problem}</p>
      </section>
      <section>
        <Heading className="label-mono text-lamp-ink">How it works</Heading>
        <ul className="mt-4 space-y-4">
          {approach.map((step) => (
            <li key={step} className="grid grid-cols-[1.5rem_1fr] text-base leading-relaxed text-foreground/90">
              <span aria-hidden="true" className="mt-[0.8em] h-px w-3 bg-muted-foreground" />
              {step}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Heading className="label-mono text-lamp-ink">Where it stands</Heading>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">{result}</p>
      </section>
    </div>
  );
}

export function ProjectTags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
