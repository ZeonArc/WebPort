import { ArrowUpRight } from "lucide-react";
import { Suspense, type ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { education } from "@/content/education";
import { site } from "@/content/site";

import { GitHubActivity } from "./github-activity";
import { LocalTime } from "./local-time";

export function About() {
  const degree = education[0];
  const github = site.socials.find((s) => s.platform === "github");

  const facts: { label: string; value: ReactNode }[] = [
    {
      label: "Based in",
      value: (
        <>
          {site.location.city}, {site.location.region}
          <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
            <LocalTime timeZone={site.location.timeZone} /> (IST)
          </span>
        </>
      ),
    },
    ...(degree
      ? [
          {
            label: "Studying",
            value: (
              <>
                {degree.degree}
                <span className="mt-0.5 block text-muted-foreground">
                  {degree.schoolShort}, {degree.start}–{degree.end}
                </span>
              </>
            ),
          },
        ]
      : []),
    { label: "Looking for", value: site.availability.lookingFor },
    {
      label: "Code",
      value: github ? (
        <a
          href={github.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 underline-offset-4 hover:text-lamp-ink hover:underline"
        >
          github.com/{github.handle}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : null,
    },
  ];

  return (
    <Section id="about">
      <SectionHeader id="about" title="About" />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <div className="space-y-5 text-lg leading-relaxed text-foreground/85">
            {site.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-5">
          <dl className="divide-y divide-border border-y border-border">
            {facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4">
                <dt className="label-mono pt-0.5 text-muted-foreground">{fact.label}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal className="mt-12">
        <Suspense>
          <GitHubActivity />
        </Suspense>
      </Reveal>
    </Section>
  );
}
