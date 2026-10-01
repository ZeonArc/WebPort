/**
 * ─────────────────────────────────────────────────────────────
 *  Experience, newest first. The section (and its nav link) stays
 *  hidden while this list is empty: add your first internship here.
 *
 *  {
 *    kind: "internship",
 *    role: "Software Engineering Intern",
 *    org: "Company",
 *    orgUrl: "https://company.com",
 *    location: "Bengaluru · Hybrid",
 *    start: "May 2027",
 *    end: "Jul 2027",
 *    summary: "One line on the team and the product.",
 *    highlights: ["What you built, and what changed because of it."],
 *    tech: ["TypeScript", "PostgreSQL"],
 *  }
 * ─────────────────────────────────────────────────────────────
 */

export type ExperienceKind = "job" | "internship" | "milestone";

export interface ExperienceEntry {
  kind: ExperienceKind;
  role: string;
  org: string;
  orgUrl?: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  tech: string[];
}

export const experience: ExperienceEntry[] = [];
