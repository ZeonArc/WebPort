import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { CommandMenu } from "@/components/layout/command-menu";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToasterHost } from "@/components/layout/toaster-host";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { Providers } from "@/components/providers/providers";
import { education } from "@/content/education";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import { getSiteUrl } from "@/lib/site-url";

import "./globals.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-plex-sans", display: "swap" });
// next/font has no metrics for Big Shoulders, so it can't size-match a fallback; a narrow system face is closest.
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-shoulders",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

const siteUrl = getSiteUrl();
const title = `${site.name} · ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#12161b" },
    { media: "(prefers-color-scheme: light)", color: "#e9ebee" },
  ],
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: site.name,
      alternateName: site.handle,
      url: siteUrl,
      image: `${siteUrl}/opengraph-image`,
      jobTitle: site.role,
      description: site.description,
      email: `mailto:${site.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressRegion: site.location.region,
        addressCountry: site.location.countryCode,
      },
      sameAs: site.socials.filter((s) => s.platform !== "email").map((s) => s.href),
      knowsAbout: skills.map((s) => s.name),
      alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      publisher: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable} ${mono.variable} dark`}
    >
      <body className="min-h-svh overflow-x-clip">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        <a
          href="#main"
          className="sr-only z-[80] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <Providers>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <CommandMenu />
          <RevealObserver />
          <ToasterHost />
        </Providers>

        {/* Vercel injects these scripts only on its platform; elsewhere they'd 404. */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
