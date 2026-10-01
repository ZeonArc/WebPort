// zod/mini keeps the client bundle small; the API is functional (checks via `.check()`).
import * as z from "zod/mini";

import { MESSAGE_MAX } from "./limits";

/** Shared between the client form (react-hook-form) and the /api/contact route. */
export const contactSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, "Enter your name (at least 2 characters)."),
      z.maxLength(80, "Keep your name under 80 characters."),
    ),
  email: z.pipe(
    z.string().check(z.trim(), z.minLength(1, "Enter your email so I can reply.")),
    z.email("Enter a valid email address, like name@company.com."),
  ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(20, "Add a little more detail (at least 20 characters)."),
      z.maxLength(MESSAGE_MAX, "Keep your message under 2,000 characters."),
    ),
  /** Honeypot: hidden from people, bots tend to fill it. Must stay empty. */
  website: z.optional(z.string().check(z.maxLength(0))),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;

export { MESSAGE_MAX };
