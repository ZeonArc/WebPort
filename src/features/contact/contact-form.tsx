"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";

import { site } from "@/content/site";
import { copyEmail } from "@/lib/copy-email";
import { notify } from "@/lib/toast";
import { contactSchema, type ContactInput, type ContactValues } from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

import { CharCount, Field, inputClass, PLACEHOLDERS, PRIVACY_NOTE, submitClass } from "./contact-form-shell";

/** Interactive contact form (react-hook-form + zod). Loaded lazily by <LazyContactForm />. */
export default function ContactForm() {
  const uid = useId();
  const ids = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message` };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  async function onSubmit(values: ContactValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "The server didn't accept the message.");

      notify("success", "Message sent", {
        description: `Thanks, ${values.name.split(" ")[0]}. It's in my inbox, and I'll reply to ${values.email}.`,
      });
      reset();
    } catch (error) {
      notify("error", "Message not sent", {
        description: `${error instanceof Error ? error.message : "Network error."} You can email ${site.email} directly.`,
        action: { label: "Copy email", onClick: () => void copyEmail() },
      });
    }
  }

  const describedBy = (key: keyof typeof ids, extra?: string) =>
    [errors[key] ? `${ids[key]}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={ids.name} label="Name" error={errors.name?.message} valid={Boolean(dirtyFields.name)}>
          <input
            id={ids.name}
            type="text"
            autoComplete="name"
            placeholder={PLACEHOLDERS.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            className={inputClass}
            {...register("name")}
          />
        </Field>
        <Field id={ids.email} label="Email" error={errors.email?.message} valid={Boolean(dirtyFields.email)}>
          <input
            id={ids.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={PLACEHOLDERS.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={inputClass}
            {...register("email")}
          />
        </Field>
      </div>

      <Field
        id={ids.message}
        label="Message"
        error={errors.message?.message}
        valid={Boolean(dirtyFields.message)}
        hint={<CharCount id={`${ids.message}-count`} length={messageLength} />}
      >
        <textarea
          id={ids.message}
          rows={6}
          placeholder={PLACEHOLDERS.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", `${ids.message}-count`)}
          className={cn(inputClass, "min-h-40 resize-y")}
          {...register("message")}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col-reverse items-start justify-between gap-4 pt-1 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">{PRIVACY_NOTE}</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className={submitClass}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message
              <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
