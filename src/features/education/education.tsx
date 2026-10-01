import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { certifications, education } from "@/content/education";

export function Education() {
  return (
    <Section id="education">
      <SectionHeader id="education" title="Education" />

      <Reveal>
        <ul className="divide-y divide-border border-y border-border">
          {education.map((degree) => (
            <li key={degree.degree} className="grid gap-2 py-6 md:grid-cols-[12rem_1fr] md:gap-10">
              <p className="label-mono pt-1 text-foreground">
                {degree.start} – {degree.end}
              </p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{degree.degree}</h3>
                <p className="mt-1 text-muted-foreground">
                  {degree.school} · {degree.location}
                </p>
                {degree.detail && <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/85">{degree.detail}</p>}
                {degree.highlights && degree.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-[0.9375rem] text-foreground/85">
                    {degree.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}

          {certifications.map((cert) => (
            <li key={cert.name} className="grid gap-2 py-5 md:grid-cols-[12rem_1fr] md:gap-10">
              <p className="label-mono pt-0.5 text-muted-foreground">{cert.date}</p>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p>
                  <span className="font-medium">{cert.name}</span>
                  <span className="text-muted-foreground"> · {cert.issuer}</span>
                </p>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Verify
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">{cert.name} credential (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
