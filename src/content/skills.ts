/**
 * ─────────────────────────────────────────────────────────────
 *  Stack, grouped by where each tool sits in a system.
 *  No self-ratings: each tool lists the projects that use it, matched
 *  against project `tags` (plus any extra names in `match`). Tools no
 *  project uses yet can point somewhere else with `note` + `href`.
 *  Keep this file free of "@/" imports (see scripts/generate-resume.mjs).
 * ─────────────────────────────────────────────────────────────
 */

/** `layer` ties a group to a diagram colour; null groups use the neutral rule colour. */
export const skillGroups = [
  { id: "languages", label: "Languages", layer: null },
  { id: "interface", label: "Interface", layer: "client" },
  { id: "services", label: "Services", layer: "service" },
  { id: "data", label: "Data", layer: "data" },
  { id: "ai", label: "AI & automation", layer: "external" },
  { id: "tooling", label: "Infra & tooling", layer: null },
] as const;

export type SkillGroup = (typeof skillGroups)[number]["id"];

export interface Skill {
  name: string;
  group: SkillGroup;
  /** Project tags that count as using this tool. Defaults to [name]. */
  match?: string[];
  /** Shown instead of (or after) the project list. */
  note?: string;
  href?: string;
}

export const skills: Skill[] = [
  { name: "TypeScript", group: "languages" },
  { name: "JavaScript", group: "languages" },
  { name: "Python", group: "languages" },
  { name: "SQL", group: "languages", match: ["PostgreSQL"] },
  { name: "Java", group: "languages", note: "Older repos on GitHub", href: "https://github.com/ZeonArc?tab=repositories&language=java" },
  { name: "C++", group: "languages", note: "Older repos on GitHub", href: "https://github.com/ZeonArc?tab=repositories&language=c%2B%2B" },

  { name: "React", group: "interface" },
  { name: "Next.js", group: "interface" },
  { name: "Tailwind CSS", group: "interface" },
  { name: "Electron", group: "interface" },

  { name: "Node.js", group: "services" },
  { name: "Express", group: "services" },
  { name: "FastAPI", group: "services" },
  { name: "Socket.IO", group: "services" },
  { name: "WebRTC", group: "services" },

  { name: "PostgreSQL", group: "data" },
  { name: "Supabase", group: "data" },
  { name: "Prisma", group: "data" },

  { name: "LLM APIs", group: "ai", note: "Gemini, OpenAI-compatible" },
  { name: "n8n", group: "ai" },

  { name: "Git & GitHub", group: "tooling", note: "Every project", href: "https://github.com/ZeonArc" },
  { name: "Docker", group: "tooling" },
  { name: "Vercel", group: "tooling" },
  { name: "Render", group: "tooling" },
  { name: "Jest", group: "tooling" },
  { name: "pytest", group: "tooling" },
  { name: "Stripe", group: "tooling" },
  { name: "Clerk / Auth0", group: "tooling", match: ["Clerk", "Auth0"] },
];
