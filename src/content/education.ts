/**
 * ─────────────────────────────────────────────────────────────
 *  Education & certifications.
 *  Keep this file free of "@/" imports (see scripts/generate-resume.mjs).
 * ─────────────────────────────────────────────────────────────
 */

export interface Degree {
  degree: string;
  school: string;
  /** Short name used where space is tight. */
  schoolShort: string;
  location: string;
  start: string;
  end: string;
  detail?: string;
  highlights?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export const education: Degree[] = [
  {
    degree: "B.Tech, Computer Science and Engineering",
    school: "SRM Institute of Science and Technology",
    schoolShort: "SRMIST",
    location: "Tiruchirappalli, Tamil Nadu",
    start: "2023",
    end: "2027",
  },
];

export const certifications: Certification[] = [
  {
    name: "Product Management Simulation",
    issuer: "Electronic Arts",
    date: "Jan 2026",
  },
];
