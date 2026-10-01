import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as z from "zod/mini";

import { site } from "@/content/site";
import { contactSchema } from "@/lib/validations/contact";

/**
 * POST /api/contact
 *
 * Env (see .env.example):
 *   RESEND_API_KEY      – required in production
 *   CONTACT_TO_EMAIL    – inbox that receives messages (defaults to site.email)
 *   CONTACT_FROM_EMAIL  – verified sender, e.g. "Portfolio <hello@yourdomain.dev>"
 *
 * Without RESEND_API_KEY in development, messages are logged to the server console.
 */

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
// Best-effort, per-instance limiter. Use Upstash/Vercel KV for a shared limit across instances.
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages from this connection. Try again in 10 minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body wasn't valid JSON." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some fields need attention.", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const { name, email, message, website } = parsed.data;

  // Honeypot filled: pretend success so bots don't retry.
  if (website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set; message logged instead of sent:", { name, email, message });
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: "The contact form isn't configured yet." }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio: new message from ${name}`,
    text: `${message}\n\n— ${name} <${email}>`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "The email service rejected the message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
