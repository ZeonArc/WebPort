import { Check, CircleAlert, Send } from "lucide-react";
import type { ReactNode } from "react";

import { MESSAGE_MAX } from "@/lib/validations/limits";
import { cn } from "@/lib/utils";

/**
 * Presentational pieces shared by the interactive <ContactForm /> and the inert
 * placeholder rendered until its code loads (so the swap causes no layout shift).
 */

export const inputClass =
  "w-full rounded-md border border-seam-strong bg-background px-3.5 py-2.5 pr-10 text-[0.9375rem] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-lamp focus-visible:outline-none aria-invalid:border-destructive";

export const submitClass =
  "group inline-flex h-11 items-center gap-2 rounded-md bg-lamp px-5 text-[0.9375rem] font-medium text-lamp-foreground transition-[filter] hover:brightness-110 disabled:cursor-wait disabled:opacity-80";

export const PRIVACY_NOTE = "Your details are only used to reply to you.";

export const PLACEHOLDERS = {
  name: "Your name",
  email: "you@company.com",
  message: "The role or project, and how to reach you.",
};

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  valid?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}

export function Field({ id, label, error, valid = false, hint, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {hint}
      </div>
      <div className="relative">
        {children}
        {valid && !error && (
          <Check aria-hidden="true" className="pointer-events-none absolute right-3.5 top-3.5 size-4 text-success" />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function CharCount({ id, length }: { id: string; length: number }) {
  return (
    <span
      id={id}
      className={cn("font-mono text-[0.6875rem] tabular-nums", length > MESSAGE_MAX ? "text-destructive" : "text-muted-foreground")}
    >
      {length}/{MESSAGE_MAX}
    </span>
  );
}

/** Same layout as the real form, but inert: shown until the form's code has loaded. */
export function ContactFormPlaceholder() {
  return (
    <div inert aria-hidden="true" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cf-ph-name" label="Name">
          <input id="cf-ph-name" readOnly placeholder={PLACEHOLDERS.name} className={inputClass} />
        </Field>
        <Field id="cf-ph-email" label="Email">
          <input id="cf-ph-email" readOnly placeholder={PLACEHOLDERS.email} className={inputClass} />
        </Field>
      </div>
      <Field id="cf-ph-message" label="Message" hint={<CharCount id="cf-ph-count" length={0} />}>
        <textarea id="cf-ph-message" readOnly rows={6} placeholder={PLACEHOLDERS.message} className={cn(inputClass, "min-h-40 resize-y")} />
      </Field>
      <div className="flex flex-col-reverse items-start justify-between gap-4 pt-1 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">{PRIVACY_NOTE}</p>
        <span className={submitClass}>
          Send message <Send className="size-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
