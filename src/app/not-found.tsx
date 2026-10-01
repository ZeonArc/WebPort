import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { OpenCommandMenuButton } from "@/components/layout/open-command-menu-button";
import { Schematic } from "@/components/shared/schematic";
import type { Diagram } from "@/content/projects";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** The request made it to the router, which had nowhere to send it. */
const NO_ROUTE: Diagram = {
  nodes: [
    { id: "you", label: "You", detail: "this browser", layer: "client", col: 0, row: 0 },
    { id: "router", label: "Router", detail: "no match", layer: "service", col: 1, row: 0 },
    { id: "page", label: "404", detail: "page not found", layer: "external", col: 2, row: 0 },
  ],
  edges: [
    { from: "you", to: "router", label: "GET" },
    { from: "router", to: "page", label: "?" },
  ],
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="flex min-h-[85svh] items-center pb-16 pt-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-border pt-6">
          <p className="label-mono text-muted-foreground">Error 404</p>
          <h1 id="not-found-title" className="display-caps mt-4 text-7xl sm:text-9xl">
            No route to this page
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            The page may have moved, or the link has a typo. Head back home, or search the site.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-lamp px-5 text-[0.9375rem] font-medium text-lamp-foreground transition-[filter] hover:brightness-110"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to home
            </Link>
            <OpenCommandMenuButton />
          </div>
        </div>

        <div className="mt-16 rounded-md border border-border bg-plate p-6">
          <Schematic diagram={NO_ROUTE} title="this missing page" />
        </div>
      </div>
    </section>
  );
}
