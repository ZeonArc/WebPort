import { experience } from "./experience";

/**
 * Section anchors, in page order. `id` must match the `id` on each <section>.
 * `inNav` controls the top navbar; every entry appears in the ⌘K palette.
 */
export interface NavSection {
  id: string;
  label: string;
  inNav: boolean;
}

const allSections: (NavSection & { hidden?: boolean })[] = [
  { id: "work", label: "Projects", inNav: true },
  { id: "stack", label: "Stack", inNav: true },
  { id: "about", label: "About", inNav: true },
  // Shows up once src/content/experience.ts has an entry.
  { id: "experience", label: "Experience", inNav: true, hidden: experience.length === 0 },
  { id: "education", label: "Education", inNav: false },
  { id: "contact", label: "Contact", inNav: true },
];

export const sections: NavSection[] = allSections.filter(({ hidden }) => !hidden);

export const navSections = sections.filter((s) => s.inNav);
