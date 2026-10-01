import { ArrowUpRight, FileText } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { SocialIcon } from "@/components/shared/social-icon";
import { site } from "@/content/site";

import { CopyEmailButton } from "./copy-email-button";
import { LazyContactForm } from "./lazy-contact-form";

export function Contact() {
  const links = [
    ...site.socials
      .filter((social) => social.platform !== "email")
      .map((social) => ({
        key: social.platform,
        label: social.label,
        detail: social.handle,
        href: social.href,
        icon: <SocialIcon platform={social.platform} className="size-4" />,
      })),
    {
      key: "resume",
      label: "Résumé",
      detail: "PDF, one page",
      href: site.resumeUrl,
      icon: <FileText className="size-4" aria-hidden="true" />,
    },
  ];

  return (
    <Section id="contact" className="pb-28 md:pb-36">
      <SectionHeader
        id="contact"
        title="Contact"
        intro="Email is the quickest way to reach me. The form goes to the same inbox."
      />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <p className="label-mono text-muted-foreground">Email</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
            <a
              href={`mailto:${site.email}`}
              className="break-all text-2xl font-medium tracking-tight underline decoration-seam-strong decoration-1 underline-offset-[6px] transition-colors hover:decoration-lamp sm:text-[1.75rem]"
            >
              {site.email}
            </a>
            <CopyEmailButton />
          </div>

          <ul className="mt-10 divide-y divide-border border-y border-border">
            {links.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-lamp-ink"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-muted-foreground group-hover:text-current">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">{link.detail}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-current"
                    aria-hidden="true"
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-6">
          <div className="rounded-md border border-border bg-plate p-5 sm:p-7">
            <LazyContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
