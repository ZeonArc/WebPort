import { Suspense } from "react";

import { About } from "@/features/about/about";
import { Contact } from "@/features/contact/contact";
import { Education } from "@/features/education/education";
import { Experience } from "@/features/experience/experience";
import { Hero } from "@/features/hero/hero";
import { Projects } from "@/features/projects/projects";
import { Stack } from "@/features/stack/stack";

// Re-render at most twice a day so the GitHub activity graph stays fresh.
export const revalidate = 43200;

/**
 * Each below-the-fold section sits in its own Suspense boundary. The page is fully
 * prerendered (no fallbacks are ever shown); the boundaries let React hydrate and
 * commit sections one at a time instead of in a single long main-thread task.
 * Section order here must match src/content/navigation.ts.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <Stack />
      </Suspense>
      <Suspense>
        <About />
      </Suspense>
      <Suspense>
        <Experience />
        <Education />
      </Suspense>
      <Suspense>
        <Contact />
      </Suspense>
    </>
  );
}
