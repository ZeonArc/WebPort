"use client";

import {
  ArrowUp,
  Copy,
  CornerDownLeft,
  FileText,
  FolderOpen,
  Hash,
  Moon,
  Sun,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

import { useScrollLock, useSectionNavigation } from "@/components/providers/smooth-scroll-provider";
import { SocialIcon } from "@/components/shared/social-icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { sections } from "@/content/navigation";
import { getCategoryLabel, projects } from "@/content/projects";
import { site } from "@/content/site";
import { useProjectModal } from "@/features/projects/project-modal-provider";
import { copyEmail } from "@/lib/copy-email";

import { useThemeSwitch } from "./theme-toggle";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** The ⌘K palette UI. Loaded on demand by <CommandMenu />. */
export default function CommandPalette({ open, onOpenChange: setOpen }: CommandPaletteProps) {
  const pendingAction = useRef<(() => void) | null>(null);
  const goToSection = useSectionNavigation();
  const { openProject } = useProjectModal();
  const { isDark, toggle: toggleTheme } = useThemeSwitch();
  const pathname = usePathname();
  const router = useRouter();

  useScrollLock(open);

  /** Close first, then run the action once focus has been released by the dialog. */
  function run(action: () => void) {
    pendingAction.current = action;
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[18vh] w-[calc(100%-1.5rem)] max-w-xl translate-y-0 overflow-hidden rounded-md border border-seam-strong p-0 ring-0 sm:max-w-xl"
        onCloseAutoFocus={(event) => {
          const action = pendingAction.current;
          if (!action) return;
          event.preventDefault();
          pendingAction.current = null;
          action();
        }}
      >
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <DialogDescription className="sr-only">Jump to a section, open a project, or run an action.</DialogDescription>
        <Command className="rounded-md! bg-popover p-1.5" loop>
          <CommandInput placeholder="Search sections, projects, actions…" />
          <CommandList data-lenis-prevent className="max-h-[min(24rem,60vh)]">
            <CommandEmpty>No matches. Try a project or section name.</CommandEmpty>

            <CommandGroup heading="Go to">
              <CommandItem value="top home hero" onSelect={() => run(() => goToSection("top"))}>
                <ArrowUp /> Top
              </CommandItem>
              {sections.map((section) => (
                <CommandItem key={section.id} value={`section ${section.label}`} onSelect={() => run(() => goToSection(section.id))}>
                  <Hash /> {section.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.slug}
                  value={`project ${project.title} ${project.tags.join(" ")}`}
                  onSelect={() =>
                    run(() => (pathname === "/" ? openProject(project.slug) : router.push(`/projects/${project.slug}`)))
                  }
                >
                  <FolderOpen />
                  <span>{project.title}</span>
                  <CommandShortcut className="font-mono text-[0.625rem] tracking-normal">
                    {getCategoryLabel(project.category)}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Actions">
              <CommandItem value="theme toggle dark light mode" onSelect={() => run(() => toggleTheme())}>
                {isDark ? <Sun /> : <Moon />} Switch to {isDark ? "light" : "dark"} theme
              </CommandItem>
              <CommandItem value="copy email address" onSelect={() => run(() => void copyEmail())}>
                <Copy /> Copy email address
              </CommandItem>
              <CommandItem value="download resume cv" onSelect={() => run(() => window.open(site.resumeUrl, "_blank", "noopener"))}>
                <FileText /> Download résumé
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Elsewhere">
              {site.socials
                .filter((social) => social.platform !== "email")
                .map((social) => (
                  <CommandItem
                    key={social.platform}
                    value={`social ${social.label}`}
                    onSelect={() => run(() => window.open(social.href, "_blank", "noopener"))}
                  >
                    <SocialIcon platform={social.platform} className="size-4" /> {social.label}
                    <CommandShortcut className="font-mono text-[0.625rem] tracking-normal">{social.handle}</CommandShortcut>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
          <div className="flex items-center justify-between border-t border-border px-3 pb-1 pt-2.5 text-[0.6875rem] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded border border-border px-1 font-mono">↑↓</kbd> navigate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="inline-flex items-center rounded border border-border px-1 font-mono">
                <CornerDownLeft className="size-3" aria-hidden="true" />
              </kbd>
              select
              <kbd className="ml-2 rounded border border-border px-1 font-mono">esc</kbd> close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
