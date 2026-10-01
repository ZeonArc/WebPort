import { ArrowUpRight } from "lucide-react";
import { Fragment } from "react";

import { Reveal } from "@/components/motion/reveal";
import { LAYER_STROKE } from "@/components/shared/schematic";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { projects } from "@/content/projects";
import { skillGroups, skills, type Skill } from "@/content/skills";
import { ProjectLink } from "@/features/projects/project-link";

/** Projects whose tags include this tool (or one of its `match` names). */
function usedIn(skill: Skill) {
  const names = skill.match ?? [skill.name];
  return projects.filter((project) => project.tags.some((tag) => names.includes(tag)));
}

function Evidence({ skill }: { skill: Skill }) {
  const list = usedIn(skill);

  if (list.length === 0) {
    if (!skill.note) return null;
    return skill.href ? (
      <a
        href={skill.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-0.5 underline-offset-4 hover:text-foreground hover:underline"
      >
        {skill.note}
        <ArrowUpRight className="size-3" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    ) : (
      <span>{skill.note}</span>
    );
  }

  return (
    <>
      <span className="sr-only">Used in </span>
      {list.map((project, i) => (
        <Fragment key={project.slug}>
          {i > 0 && <span aria-hidden="true">, </span>}
          <ProjectLink slug={project.slug} className="underline-offset-4 hover:text-foreground hover:underline">
            {project.title}
          </ProjectLink>
        </Fragment>
      ))}
      {skill.note && <span> · {skill.note}</span>}
    </>
  );
}

export function Stack() {
  return (
    <Section id="stack">
      <SectionHeader
        id="stack"
        title="Stack"
        meta={`${skills.length} tools · ${skillGroups.length} groups`}
        intro="Grouped by where each tool sits in a system. Under each one are the projects that use it, so you can check the work instead of a rating."
      />

      <Reveal>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const items = skills.filter((skill) => skill.group === group.id);
            if (items.length === 0) return null;
            const stroke = group.layer ? LAYER_STROKE[group.layer] : "var(--input)";
            return (
              <section key={group.id} aria-labelledby={`stack-${group.id}`}>
                <h3
                  id={`stack-${group.id}`}
                  className="label-mono flex items-center gap-3 border-b pb-3 text-foreground"
                  style={{ borderColor: stroke }}
                >
                  {group.label}{" "}
                  <span className="text-muted-foreground">
                    {items.length}
                    <span className="sr-only"> tools</span>
                  </span>
                </h3>
                <ul className="divide-y divide-border">
                  {items.map((skill) => (
                    <li key={skill.name} className="py-3">
                      <p className="text-[0.9375rem] font-medium text-foreground">{skill.name}</p>
                      <p className="mt-0.5 font-mono text-xs leading-relaxed text-muted-foreground">
                        <Evidence skill={skill} />
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
