"use client";

import { ArrowUpRight, Copy, FileText } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useRef } from "react";

import { useScrollLock, useSectionNavigation } from "@/components/providers/smooth-scroll-provider";
import { SocialIcon } from "@/components/shared/social-icon";
import { sections } from "@/content/navigation";
import { site } from "@/content/site";
import { copyEmail } from "@/lib/copy-email";

import { MenuIcon } from "./menu-icon";
import { ThemeToggle } from "./theme-toggle";

const EASE = [0.16, 1, 0.3, 1] as const;

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Full-screen mobile navigation. Code-split: loaded by <MobileMenuTrigger /> on first use. */
export default function MobileMenu({ open, onOpenChange: setOpen }: MobileMenuProps) {
  const pending = useRef<string | null>(null);
  const goToSection = useSectionNavigation();

  useScrollLock(open);

  return (
    <MotionConfig reducedMotion="user">
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Content
                forceMount
                asChild
                onCloseAutoFocus={(event) => {
                  const id = pending.current;
                  if (!id) return;
                  event.preventDefault();
                  pending.current = null;
                  goToSection(id);
                }}
              >
                <motion.div
                  initial={{ clipPath: "inset(0 0 100% 0 round 0 0 0 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0 round 0 0 0px 0px)" }}
                  exit={{ clipPath: "inset(0 0 100% 0 round 0 0 0 0)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="fixed inset-0 z-[55] flex flex-col bg-background px-4 pb-8 pt-3 md:hidden"
                >
                  <div className="flex items-center justify-between py-3 pl-1">
                    <DialogPrimitive.Title className="label-mono text-muted-foreground">Menu</DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">Site navigation and contact links</DialogPrimitive.Description>
                    <div className="flex items-center gap-1">
                      <ThemeToggle />
                      <DialogPrimitive.Close
                        className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
                        aria-label="Close menu"
                      >
                        <MenuIcon open />
                      </DialogPrimitive.Close>
                    </div>
                  </div>

                  <nav aria-label="Mobile" className="mt-6 flex-1">
                    <ul className="space-y-1">
                      {sections.map((section, i) => (
                        <motion.li
                          key={section.id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.045 }}
                        >
                          <a
                            href={`/#${section.id}`}
                            onClick={(event) => {
                              event.preventDefault();
                              pending.current = section.id;
                              setOpen(false);
                            }}
                            className="group flex items-center justify-between border-b border-border py-3.5 display-caps text-5xl"
                          >
                            {section.label}
                            <ArrowUpRight className="size-6 text-muted-foreground transition group-hover:text-lamp-ink" aria-hidden="true" />
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={site.resumeUrl}
                        download
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lamp text-sm font-medium text-lamp-foreground"
                      >
                        <FileText className="size-4" aria-hidden="true" /> Résumé
                      </a>
                      <button
                        type="button"
                        onClick={() => void copyEmail()}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-seam-strong text-sm font-medium"
                      >
                        <Copy className="size-4" aria-hidden="true" /> Copy email
                      </button>
                    </div>
                    <ul className="flex items-center justify-center gap-2">
                      {site.socials.map((social) => (
                        <li key={social.platform}>
                          <a
                            href={social.href}
                            target={social.platform === "email" ? undefined : "_blank"}
                            rel="noreferrer"
                            aria-label={social.label}
                            className="inline-flex size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:text-foreground"
                          >
                            <SocialIcon platform={social.platform} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </MotionConfig>
  );
}
