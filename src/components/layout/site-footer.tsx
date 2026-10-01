import Link from "next/link";

import { SiteMark } from "@/components/shared/site-mark";
import { sections } from "@/content/navigation";
import { site } from "@/content/site";

import { BackToTop } from "./back-to-top";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <Link href="/" prefetch={false} className="inline-flex items-center gap-3">
            <SiteMark className="size-7 text-foreground" />
            <span className="display-caps pt-0.5 text-2xl leading-none">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {site.role}, {site.credential}. {site.availability.open ? `${site.availability.label}.` : null}
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="label-mono text-muted-foreground">On this page</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <Link href={`/#${section.id}`} prefetch={false} className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="label-mono text-muted-foreground">Elsewhere</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {site.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
                >
                  {social.label}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 border-t border-border px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>
          © {year} {site.name}. Built with Next.js; set in Big Shoulders, IBM Plex Sans and IBM Plex Mono.
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
