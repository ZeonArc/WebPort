import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { experience, type ExperienceKind } from "@/content/experience";

const KIND_LABEL: Record<ExperienceKind, string> = {
  job: "Full-time",
  internship: "Internship",
  milestone: "Milestone",
};

/** Experience as rows: dates on the left rail, the work on the right. */
export function Timeline() {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {experience.map((entry) => (
        <li key={`${entry.org}-${entry.start}`} className="grid gap-4 py-8 md:grid-cols-[12rem_1fr] md:gap-10">
          <div>
            <p className="label-mono text-foreground">
              <time>{entry.start}</time>
              {entry.end !== entry.start && (
                <>
                  {" – "}
                  <time>{entry.end}</time>
                </>
              )}
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className={entry.end === "Present" ? "lamp" : "lamp-off"} aria-hidden="true" />
              {KIND_LABEL[entry.kind]}
            </p>
          </div>

          <Reveal>
            <h3 className="text-xl font-semibold tracking-tight">{entry.role}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.orgUrl ? (
                <a
                  href={entry.orgUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {entry.org}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <span className="font-medium text-foreground">{entry.org}</span>
              )}
              <span aria-hidden="true"> · </span>
              {entry.location}
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-foreground/85">{entry.summary}</p>
            {entry.highlights.length > 0 && (
              <ul className="mt-3 space-y-2">
                {entry.highlights.map((item) => (
                  <li key={item} className="grid grid-cols-[1rem_1fr] text-[0.9375rem] leading-relaxed text-foreground/85">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-2.5 bg-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              <span className="sr-only">Technologies: </span>
              {entry.tech.join(" · ")}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
