/**
 * ─────────────────────────────────────────────────────────────
 *  Projects + write-ups. Order matters: featured projects get a
 *  full-width row; the rest share a two-column grid.
 *
 *  Adding a project is one object. `diagram` is optional: it draws
 *  the project's architecture as a schematic (nodes on a small grid,
 *  edges between them). Without it, the card shows the spec table.
 *
 *  Keep this file free of "@/" imports: scripts/generate-resume.mjs
 *  imports it directly with Node.
 * ─────────────────────────────────────────────────────────────
 */

export const projectCategories = [
  { id: "full-stack", label: "Full-stack" },
  { id: "automation", label: "AI & automation" },
  { id: "desktop", label: "Desktop" },
] as const;

export type ProjectCategory = (typeof projectCategories)[number]["id"];

/** Which part of a system a diagram node is. Drives its colour (and dashes, for external services). */
export type Layer = "client" | "service" | "data" | "external";

export interface DiagramNode {
  id: string;
  label: string;
  /** Second line, shown on wider layouts. Keep it under ~20 characters. */
  detail?: string;
  layer: Layer;
  /** Grid position: col runs with the flow (left → right), row across it. */
  col: number;
  row: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  /** Short label (a word or two), shown on the large diagram only. */
  label?: string;
  /** Arrowheads at both ends. */
  both?: boolean;
}

export interface Diagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  /** 1–2 sentences shown on the card. */
  summary: string;
  category: ProjectCategory;
  /** Most important first: cards show the first six. Also used as evidence in the Stack section. */
  tags: string[];
  year: string;
  /** When it was built, e.g. "Jun – Aug 2026". */
  period: string;
  role: string;
  featured?: boolean;
  links: {
    live?: string;
    source?: string;
  };
  /** Shown in place of a Source link, e.g. when the repository is private. */
  sourceNote?: string;
  diagram?: Diagram;
  caseStudy: {
    problem: string;
    approach: string[];
    result: string;
    spec: SpecRow[];
  };
}

export const projects: Project[] = [
  {
    slug: "code-clash",
    title: "Code Clash",
    summary:
      "Real-time 1v1 coding duels. Two players are matched by Elo rating, race to pass the same hidden tests, and the winner takes rating from the loser.",
    category: "full-stack",
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "React", "Tailwind CSS", "Web Workers", "Vercel"],
    year: "2026",
    period: "Jun – Aug 2026",
    role: "Solo",
    featured: true,
    links: {},
    sourceNote: "Private repo",
    diagram: {
      nodes: [
        { id: "arena", label: "Duel arena", detail: "Next.js · Monaco", layer: "client", col: 0, row: 1 },
        { id: "sandbox", label: "Web Worker", detail: "runs JS / TS", layer: "client", col: 0, row: 2 },
        { id: "realtime", label: "Realtime", detail: "presence · progress", layer: "service", col: 1, row: 0 },
        { id: "rpc", label: "Postgres RPCs", detail: "matchmaking · Elo", layer: "service", col: 1, row: 1 },
        { id: "compiler", label: "Wandbox", detail: "Python, C++, Go…", layer: "external", col: 1, row: 2 },
        { id: "db", label: "Postgres", detail: "RLS on every table", layer: "data", col: 2, row: 1 },
      ],
      edges: [
        { from: "arena", to: "realtime", both: true },
        { from: "arena", to: "rpc" },
        { from: "arena", to: "compiler" },
        { from: "arena", to: "sandbox" },
        { from: "rpc", to: "db" },
      ],
    },
    caseStudy: {
      problem:
        "Coding practice is usually solo. Code Clash turns one problem into a timed race between two players, with a rating that moves when you win or lose, so there's a reason to finish fast and correctly.",
      approach: [
        "Matchmaking is one atomic Postgres function using FOR UPDATE SKIP LOCKED, with no separate queue service. The search opens at ±200 rating and widens by 100 every 10 seconds up to ±600, so a quiet queue still finds a match.",
        "The arena pairs a Monaco editor with a test panel: run the visible examples, try custom input, or submit against the hidden suite. Opponent presence and progress stream over Supabase Realtime.",
        "JavaScript and TypeScript run in a sandboxed Web Worker in the browser. Python, C, C++, C#, Java, Go and Rust compile remotely on Wandbox. Every language gets a typed starter stub generated from the problem's signature.",
        "Row Level Security is on for every table and all writes go through SECURITY DEFINER functions. Duels settle with standard Elo (K = 32).",
      ],
      result:
        "Runs end to end on free tiers: ranked matchmaking, live duels, solo practice, and a leaderboard and Elo history built from real duel records. The schema file is idempotent and seeds 15 problems.",
      spec: [
        { label: "Frontend", value: "Next.js 16, React 19, TypeScript" },
        { label: "Backend", value: "Supabase: Postgres, Auth, Realtime" },
        { label: "Matchmaking", value: "Postgres RPC, SKIP LOCKED, widening rating window" },
        { label: "Code execution", value: "Web Worker (JS/TS) + Wandbox, 9 languages" },
        { label: "Rating", value: "Elo, K = 32" },
      ],
    },
  },
  {
    slug: "jobscheduler",
    title: "JobScheduler",
    summary:
      "A job queue that runs on Postgres alone: distributed workers, job dependencies, rate limits, retries and a dead-letter queue, with a live dashboard.",
    category: "full-stack",
    tags: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Socket.IO",
      "Next.js",
      "TypeScript",
      "Prisma",
      "React",
      "Tailwind CSS",
      "Jest",
      "Zod",
      "Vercel",
      "Render",
    ],
    year: "2026",
    period: "Jul 2026",
    role: "Solo",
    featured: true,
    links: { live: "https://jobshedulerproject.vercel.app" },
    sourceNote: "Private repo",
    diagram: {
      nodes: [
        { id: "dash", label: "Dashboard", detail: "Next.js · React Flow", layer: "client", col: 0, row: 0 },
        { id: "api", label: "API", detail: "Express · Socket.IO", layer: "service", col: 1, row: 0 },
        { id: "db", label: "Postgres", detail: "jobs · queues · DAG", layer: "data", col: 2, row: 0 },
        { id: "workers", label: "Workers ×N", detail: "poll the queue", layer: "service", col: 2, row: 1 },
        { id: "hooks", label: "Webhooks", detail: "the actual work", layer: "external", col: 3, row: 1 },
      ],
      edges: [
        { from: "dash", to: "api", both: true, label: "REST/WS" },
        { from: "api", to: "db" },
        { from: "workers", to: "db", label: "SKIP LOCKED", both: true },
        { from: "workers", to: "hooks", label: "HTTP" },
      ],
    },
    caseStudy: {
      problem:
        "Background job systems usually put Redis next to the database. JobScheduler keeps all job state in Postgres and uses the database's own row locking to hand work to many workers safely.",
      approach: [
        "Workers claim jobs with SELECT … FOR UPDATE SKIP LOCKED, so any number of them can poll at the same moment without two taking the same job.",
        "Jobs can wait on parent jobs. The dependency graph (a DAG) is drawn live in the dashboard with React Flow.",
        "Each queue has a concurrency limit and a rate limit, for example 60 jobs a minute. Workers drop rate-limited queues from their polling cycle instead of spinning on them.",
        "Failed jobs retry with exponential or linear backoff. When the retries run out they move to a dead-letter queue, where they can be inspected and requeued.",
        "Socket.IO pushes job status, worker heartbeats and queue metrics to the dashboard as they change. Queues and jobs are isolated per project, behind JWT auth.",
      ],
      result:
        "Deployed: the dashboard on Vercel, the API and worker loop on Render, Postgres on Neon. The backend has a Jest test suite.",
      spec: [
        { label: "Job claiming", value: "SELECT … FOR UPDATE SKIP LOCKED" },
        { label: "API", value: "Express, REST + Socket.IO, Zod validation" },
        { label: "Data", value: "PostgreSQL (Neon) via Prisma" },
        { label: "Dashboard", value: "Next.js, React Flow" },
        { label: "Hosting", value: "Vercel, Render, Neon" },
      ],
    },
  },
  {
    slug: "devleap-ai",
    title: "DevLeap AI",
    summary:
      "Reads a developer's GitHub repositories and builds a profile where every skill points to the file it came from, then drafts job pitches you approve before anything is sent.",
    category: "full-stack",
    tags: [
      "Next.js",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "LLM APIs",
      "Stripe",
      "TypeScript",
      "React",
      "Prisma",
      "Clerk",
      "Docker",
      "pytest",
      "Tailwind CSS",
      "Vercel",
      "Render",
    ],
    year: "2026",
    period: "May – Aug 2026",
    role: "Solo",
    featured: true,
    links: { live: "https://dev-leap-ai.vercel.app", source: "https://github.com/ZeonArc/DevLeap-AI" },
    diagram: {
      nodes: [
        { id: "web", label: "Web app", detail: "Next.js · Clerk", layer: "client", col: 0, row: 1 },
        { id: "api", label: "API", detail: "FastAPI · asyncpg", layer: "service", col: 1, row: 1 },
        { id: "db", label: "Postgres", detail: "profiles · pitches", layer: "data", col: 1, row: 2 },
        { id: "github", label: "GitHub", detail: "clone repos", layer: "external", col: 2, row: 0 },
        { id: "llm", label: "LLM", detail: "OpenAI-compatible", layer: "external", col: 2, row: 1 },
        { id: "search", label: "Job search", detail: "Tavily · Brave", layer: "external", col: 2, row: 2 },
      ],
      edges: [
        { from: "web", to: "api", label: "JWT" },
        { from: "api", to: "db" },
        { from: "api", to: "github" },
        { from: "api", to: "llm" },
        { from: "api", to: "search" },
      ],
    },
    caseStudy: {
      problem:
        "A résumé can say \"React, Postgres\" but it can't show where. DevLeap reads the source instead, so each claim on the profile links to code a reviewer can open.",
      approach: [
        "The profiler clones a public repo, or a whole GitHub profile, and sends the source to an LLM to extract skills, Mermaid architecture diagrams and a plain-language summary, each tied to the file it came from.",
        "The broker reads a live job posting and drafts a pitch grounded in that profile. \"Find jobs for me\" uses web search (Tavily, SearXNG or Brave). With search turned off it says so, instead of letting the model invent postings.",
        "FastAPI runs raw SQL through asyncpg. Prisma is only used for the schema and migrations.",
        "Clerk handles sign-in (JWTs verified against JWKS), Stripe Checkout and webhooks handle the Pro tier, and sliding-window rate limits per user and IP stop one account from draining the LLM budget.",
      ],
      result:
        "Live, with the frontend on Vercel and a Dockerised FastAPI service on Render. A /health endpoint reports whether the database, the LLM and the search provider are reachable. Nothing is sent without your approval.",
      spec: [
        { label: "Frontend", value: "Next.js 16, React 19, Tailwind 4, Mermaid" },
        { label: "Backend", value: "FastAPI, raw SQL via asyncpg, PostgreSQL" },
        { label: "LLM", value: "Any OpenAI-compatible endpoint" },
        { label: "Auth & billing", value: "Clerk (JWKS), Stripe Checkout + webhooks" },
        { label: "Tests", value: "pytest" },
        { label: "Hosting", value: "Vercel, Render (Docker)" },
      ],
    },
  },
  {
    slug: "devguardian",
    title: "DevGuardian",
    summary:
      "Watches a GitLab project. Each push, merge request and pipeline run goes through an n8n workflow that uses Gemini to flag leaked secrets, risky dependencies and failed CI, then opens a merge request with the report.",
    category: "automation",
    tags: ["n8n", "LLM APIs", "Node.js", "Express", "Supabase", "React", "JavaScript"],
    year: "2026",
    period: "Mar 2026",
    role: "Solo",
    links: { source: "https://github.com/ZeonArc/DevGuard" },
    diagram: {
      nodes: [
        { id: "gitlab", label: "GitLab", detail: "push · MR · pipeline", layer: "external", col: 0, row: 1 },
        { id: "n8n", label: "n8n workflow", detail: "routes each event", layer: "service", col: 1, row: 1 },
        { id: "gemini", label: "Gemini", detail: "reviews the change", layer: "external", col: 2, row: 0 },
        { id: "db", label: "Supabase", detail: "risks · actions", layer: "data", col: 2, row: 1 },
        { id: "mr", label: "Merge request", detail: "report on a branch", layer: "external", col: 2, row: 2 },
      ],
      edges: [
        { from: "gitlab", to: "n8n", label: "webhook" },
        { from: "n8n", to: "gemini" },
        { from: "n8n", to: "db" },
        { from: "n8n", to: "mr" },
      ],
    },
    caseStudy: {
      problem:
        "Security review tends to happen late, if at all. DevGuardian runs on every GitLab event, so a committed secret or a broken pipeline gets a written explanation while the change is still fresh.",
      approach: [
        "A GitLab webhook triggers an n8n workflow that normalises the event and routes it: pushes, merge requests and pipeline runs each take their own branch.",
        "Pushes are checked for secrets and dependency changes, failed pipelines get a CI diagnosis, and merge requests get an architecture review, each through a Gemini call with its own prompt.",
        "Findings are standardised and checked against existing risks in Supabase, so a repeat finding updates the old record instead of adding a duplicate. Every action is logged.",
        "The workflow then creates a branch, commits the report and opens a merge request. A React dashboard (Express API, GitLab OAuth) shows risks, agent activity and a security score.",
      ],
      result: "Works end to end against GitLab. The repository includes the exported n8n workflow and the dashboard.",
      spec: [
        { label: "Trigger", value: "GitLab webhooks: push, merge request, pipeline" },
        { label: "Orchestration", value: "n8n" },
        { label: "Analysis", value: "Gemini, one prompt per event type" },
        { label: "Data", value: "Supabase" },
        { label: "Dashboard", value: "React, Chart.js, Express, GitLab OAuth" },
      ],
    },
  },
  {
    slug: "docugithub",
    title: "DocuGithub",
    summary:
      "Point it at a GitHub repository and it writes the documentation. n8n workflows analyse the code with Gemini, you refine the draft in a chat, and it pushes the result back to the repo.",
    category: "automation",
    tags: ["n8n", "LLM APIs", "React", "TypeScript", "Supabase", "Auth0", "Tailwind CSS", "Netlify"],
    year: "2026",
    period: "Jan 2026",
    role: "Solo",
    links: { live: "https://docugithub.netlify.app" },
    sourceNote: "Private repo",
    diagram: {
      nodes: [
        { id: "web", label: "Web app", detail: "React · Auth0", layer: "client", col: 0, row: 1 },
        { id: "n8n", label: "n8n pipeline", detail: "5 workflows", layer: "service", col: 1, row: 1 },
        { id: "github", label: "GitHub", detail: "read · push", layer: "external", col: 2, row: 0 },
        { id: "gemini", label: "Gemini", detail: "analyse · write", layer: "external", col: 2, row: 1 },
        { id: "db", label: "Supabase", detail: "session state", layer: "data", col: 2, row: 2 },
      ],
      edges: [
        { from: "web", to: "n8n", label: "HMAC" },
        { from: "n8n", to: "github", both: true },
        { from: "n8n", to: "gemini" },
        { from: "n8n", to: "db" },
      ],
    },
    caseStudy: {
      problem:
        "Documentation is the part of a project that gets skipped. DocuGithub drafts it from the code itself, then leaves the final say with the author.",
      approach: [
        "The pipeline is five n8n workflows: initialise, analyse, generate, chat and push. The React app calls them through HMAC-signed webhooks.",
        "Gemini reads the repository and produces an analysis, then writes Markdown documentation from it. The chat step revises the draft on request.",
        "Each run is a session in Supabase that moves through explicit states (analysing, generated, publishing, published or error), so the UI always shows where a run is and failures are recorded.",
        "Auth0 handles sign-in, and the last step commits the documentation to the user's repository.",
      ],
      result: "Live on Netlify. I've used it to write the README for one of my own repositories.",
      spec: [
        { label: "Frontend", value: "React, TypeScript, Vite, Zustand" },
        { label: "Pipeline", value: "n8n, 5 workflows, HMAC-signed webhooks" },
        { label: "Model", value: "Gemini 2.0 Flash" },
        { label: "Data & auth", value: "Supabase, Auth0" },
        { label: "Hosting", value: "Netlify" },
      ],
    },
  },
  {
    slug: "nebula",
    title: "Nebula",
    summary:
      "A desktop chat app with its own server inside. The chat gateway starts on localhost when the app opens, people on the same network can join, and voice runs peer-to-peer over WebRTC.",
    category: "desktop",
    tags: ["Electron", "React", "TypeScript", "Node.js", "Express", "Socket.IO", "WebRTC"],
    year: "2026",
    period: "Sep 2026",
    role: "Solo",
    links: {},
    sourceNote: "Private repo",
    diagram: {
      nodes: [
        { id: "ui", label: "Desktop UI", detail: "Electron · React", layer: "client", col: 0, row: 1 },
        { id: "gateway", label: "Gateway", detail: "Express · Socket.IO", layer: "service", col: 1, row: 1 },
        { id: "store", label: "Local store", detail: "on-disk data", layer: "data", col: 2, row: 1 },
        { id: "lan", label: "LAN clients", detail: "same servers", layer: "external", col: 1, row: 0 },
        { id: "peers", label: "Peers", detail: "WebRTC voice", layer: "external", col: 1, row: 2 },
      ],
      edges: [
        { from: "ui", to: "gateway", both: true, label: "WS" },
        { from: "gateway", to: "store" },
        { from: "lan", to: "gateway", both: true },
        { from: "ui", to: "peers", both: true },
      ],
    },
    caseStudy: {
      problem:
        "Chat apps normally need a cloud account and a hosted backend. Nebula ships the backend inside the app, so a group on one network can run their own servers with nothing else to set up.",
      approach: [
        "An Express and Socket.IO gateway runs inside the Electron process on 127.0.0.1 and keeps its data in a local folder. Other clients on the LAN can point at the host machine and join the same servers.",
        "Voice and screen share use WebRTC in a full mesh with perfect negotiation, without a media server. Voice activity detection, push-to-talk while the window is unfocused, per-user volume.",
        "A role system with a 26-flag permission bitfield, per-channel overwrites and a role hierarchy drives moderation: kicks, bans, timeouts and server mute.",
        "It adds things Discord never shipped: full edit history, scheduled messages that survive a restart, saved messages with snapshots, reminders and quiet hours.",
      ],
      result: "Builds to an installable Windows app, and to macOS and Linux from the same source.",
      spec: [
        { label: "Shell", value: "Electron 33" },
        { label: "UI", value: "React 18, TypeScript" },
        { label: "Gateway", value: "Express + Socket.IO on 127.0.0.1" },
        { label: "Voice", value: "WebRTC full mesh, no media server" },
        { label: "Storage", value: "Local data folder" },
      ],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getCategoryLabel(id: ProjectCategory) {
  return projectCategories.find((c) => c.id === id)?.label ?? id;
}
