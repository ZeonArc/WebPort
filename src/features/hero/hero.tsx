import Image from "next/image";

import { SocialIcon } from "@/components/shared/social-icon";
import { LocalTime } from "@/features/about/local-time";
import profile from "@/content/images/profile.webp";
import { site } from "@/content/site";

import { HeroCtas } from "./hero-ctas";

/**
 * Server-rendered hero: who, what, where, and a way in. The portrait is the
 * LCP element, so it's eagerly loaded; nothing here waits for hydration except
 * the CTA click handler and the live clock.
 */
export function Hero() {
  const links = site.socials;

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col lg:col-span-7 lg:pt-6">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className={site.availability.open ? "lamp" : "lamp-off"} aria-hidden="true" />
              <span className="font-medium text-foreground">{site.availability.label}</span>
              <span className="text-muted-foreground">{site.availability.detail}</span>
            </p>

            <h1 id="hero-title" className="display-caps mt-8 text-[clamp(5rem,15vw,10.5rem)]">
              {site.name}
            </h1>

            <p className="label-mono mt-6 text-foreground">
              {site.role} <span className="text-muted-foreground">· {site.credential}</span>
            </p>

            <p className="mt-6 max-w-xl text-xl leading-relaxed text-foreground/85 sm:text-[1.375rem] sm:leading-[1.55]">
              {site.headline}
            </p>

            <div className="mt-10">
              <HeroCtas />
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3" aria-label="Elsewhere">
              {links.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.href}
                    target={link.platform === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 font-mono text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <SocialIcon platform={link.platform} className="size-4" />
                    <span className="underline-offset-4 group-hover:underline">{link.platform === "email" ? link.handle : link.label}</span>
                    {link.platform !== "email" && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <figure className="mx-auto w-full max-w-sm sm:max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-plate">
              <Image
                src={profile}
                alt={`Portrait of ${site.name}`}
                placeholder="blur"
                priority
                fill
                sizes="(min-width: 1024px) 28rem, (min-width: 640px) 28rem, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="label-mono mt-3 flex items-center justify-between gap-4 text-muted-foreground">
              <span>
                {site.name} · {site.location.city}, {site.location.countryCode}
              </span>
              <span className="tabular-nums">
                <LocalTime timeZone={site.location.timeZone} variant="inline" /> IST
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
