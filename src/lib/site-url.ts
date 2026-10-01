/**
 * Absolute site URL for metadata, sitemap and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (falls back to Vercel's production URL).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
