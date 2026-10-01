import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { experience } from "@/content/experience";

import { Timeline } from "./timeline";

/** Hidden until src/content/experience.ts has an entry. */
export function Experience() {
  if (experience.length === 0) return null;

  return (
    <Section id="experience">
      <SectionHeader id="experience" title="Experience" />
      <Timeline />
    </Section>
  );
}
