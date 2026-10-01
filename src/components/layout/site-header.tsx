"use client";

import { Command as CommandIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

import { useSectionNavigation } from "@/components/providers/smooth-scroll-provider";
import { SiteMark } from "@/components/shared/site-mark";
import { navSections } from "@/content/navigation";
import { site } from "@/content/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

import { openCommandMenu, preloadCommandMenu } from "./command-menu";
import { MobileMenuTrigger } from "./mobile-menu-trigger";
import { ThemeToggle } from "./theme-toggle";

const NAV_IDS = navSections.map((s) => s.id);

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(NAV_IDS);
  const goToSection = useSectionNavigation();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const isMac = hydrated && /Mac|iPhone|iPad/.test(navigator.userAgent);
  const currentId = pathname === "/" ? activeId : null;

  // Reading scrollY doesn't force layout; React bails out when the boolean doesn't change.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNav(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (pathname !== "/") return; // let the link route to /#id
    event.preventDefault();
    goToSection(id);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-border bg-background" : "border-transparent bg-background/0",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          prefetch={false}
          onClick={(event) => {
            if (pathname !== "/") return;
            event.preventDefault();
            goToSection("top");
          }}
          className="flex items-center gap-3 rounded-md"
          aria-label={`${site.name}, back to top`}
        >
          <SiteMark className="size-7 text-foreground" />
          <span className="display-caps pt-0.5 text-2xl leading-none">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navSections.map((section) => {
              const active = currentId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`/#${section.id}`}
                    onClick={(event) => handleNav(event, section.id)}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn("lamp transition-opacity duration-300", active ? "opacity-100" : "opacity-0")}
                    />
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openCommandMenu}
            onPointerEnter={preloadCommandMenu}
            onFocus={preloadCommandMenu}
            className="hidden h-9 items-center gap-2 rounded-md border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:border-seam-strong hover:text-foreground sm:inline-flex"
            aria-label="Open command menu"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <CommandIcon className="size-3.5" aria-hidden="true" />
            <kbd className={cn("font-mono text-[0.6875rem] transition-opacity", hydrated ? "opacity-100" : "opacity-0")}>
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <ThemeToggle />
          <MobileMenuTrigger />
        </div>
      </div>
    </header>
  );
}
