/**
 * ─────────────────────────────────────────────────────────────
 *  Site-wide personal info. Every section reads from /src/content,
 *  so you shouldn't need to touch component code to edit the site.
 *  Keep this file free of "@/" imports: scripts/generate-resume.mjs
 *  imports it directly with Node.
 * ─────────────────────────────────────────────────────────────
 */

export type SocialPlatform = "github" | "linkedin" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
  handle: string;
}

export const site = {
  name: "Harish V",
  firstName: "Harish",
  initials: "HV",
  handle: "ZeonArc",
  role: "Full-stack developer",
  /** Shown next to the role: what and where. */
  credential: "B.Tech CSE '27, SRMIST Trichy",
  /** The sentence under the name in the hero. */
  headline:
    "I build the parts of an app you don't see: job queues, real-time sync, LLM pipelines. Then I build the interface on top.",
  /** Top line of the generated résumé. */
  summary:
    "Full-stack developer building job queues, real-time apps and LLM pipelines with TypeScript, Node.js, Python and PostgreSQL. Looking for SDE and full-stack internships and 2027 new-grad roles.",
  /** SEO description (≈150 characters). */
  description:
    "Harish V is a full-stack developer and CS student at SRMIST Trichy who builds job queues, real-time apps and LLM pipelines with TypeScript, Node and Postgres.",
  keywords: [
    "Harish V",
    "ZeonArc",
    "Software Development Engineer",
    "Full-stack developer",
    "Backend developer",
    "SRMIST Trichy",
    "TypeScript",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "FastAPI",
  ],

  location: {
    city: "Trichy",
    region: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    /** IANA timezone, drives the local-time readouts. */
    timeZone: "Asia/Kolkata",
  },

  availability: {
    open: true,
    label: "Open to internships",
    detail: "Full-stack or backend · graduating 2027",
    /** Longer form, used in About. */
    lookingFor: "SDE and full-stack internships, and new-grad roles from 2027. Remote, or on-site anywhere in India.",
  },

  email: "harishvofficialwork@gmail.com",
  /** Generated from these content files by `npm run resume`. Drop your own PDF in /public to replace it. */
  resumeUrl: "/resume.pdf",

  /** GitHub account for the contribution graph (GITHUB_USERNAME in .env overrides it). */
  githubUsername: "ZeonArc",

  socials: [
    { platform: "github", label: "GitHub", href: "https://github.com/ZeonArc", handle: "ZeonArc" },
    // TODO: confirm this is your LinkedIn URL (LinkedIn blocks automated checks).
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/harishvdev", handle: "in/harishvdev" },
    { platform: "email", label: "Email", href: "mailto:harishvofficialwork@gmail.com", handle: "harishvofficialwork@gmail.com" },
  ] satisfies SocialLink[],

  /** About section paragraphs. */
  bio: [
    "I'm a computer science student at SRMIST Trichy, graduating in 2027. Most of what I know I learned by building whole things: a job queue that runs on Postgres alone, a coding-duel platform with rated matchmaking, a desktop chat app that hosts its own server.",
    "The backend half is the part I enjoy most. Concurrency, state that has to stay consistent, pipelines that call an LLM and have to fail safely. I still build the interface myself, because that's where you find out whether the system underneath actually works.",
  ],
} as const;

export type Site = typeof site;
