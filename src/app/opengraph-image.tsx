import { ImageResponse } from "next/og";

import { site } from "@/content/site";

import { OG_SIZE, OgCard } from "./og-template";

export const alt = `${site.name}, ${site.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${site.role} · ${site.credential}`}
        title={site.name}
        subtitle={site.headline}
        footer={`${site.availability.label} · ${site.location.city}, ${site.location.country}`}
      />
    ),
    size,
  );
}
