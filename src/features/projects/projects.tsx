import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { SchematicLegend } from "@/components/shared/schematic";
import { projects } from "@/content/projects";

import { ProjectGrid } from "./project-grid";

export function Projects() {
  const allSolo = projects.every((p) => p.role === "Solo");

  return (
    <Section id="work">
      <SectionHeader
        id="work"
        title="Projects"
        meta={`${projects.length} projects${allSolo ? " · all solo builds" : ""}`}
        intro={
          <>
            <p>
              Each diagram is how that project actually fits together. Open one for the problem, how it works, and where it
              stands now.
            </p>
            <SchematicLegend className="mt-5" />
          </>
        }
      />
      <Reveal>
        <ProjectGrid />
      </Reveal>
    </Section>
  );
}
