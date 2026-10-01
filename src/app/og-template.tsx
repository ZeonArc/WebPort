/** Shared JSX for generated Open Graph images (Satori: flexbox only, inline styles). */

export const OG_SIZE = { width: 1200, height: 630 };

const PANEL = "#12161b";
const PLATE = "#191e25";
const SEAM = "#2b323c";
const INK = "#e8e6e0";
const DIM = "#949ba6";
const LAMP = "#f2c14e";

export function Mark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect x="4" y="5" width="11" height="9" rx="1.5" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M15 9.5h7.5V18" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="17" y="18" width="11" height="9" rx="1.5" fill={LAMP} />
    </svg>
  );
}

interface OgCardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}

export function OgCard({ eyebrow, title, subtitle, footer }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: PANEL,
        color: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Mark />
        <span style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>{eyebrow}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, borderTop: `2px solid ${SEAM}`, paddingTop: 32 }}>
        <span
          style={{
            fontSize: title.length > 16 ? 96 : 132,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 0.9,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 30, color: DIM, maxWidth: 960, lineHeight: 1.35 }}>{subtitle}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: DIM }}>
          <span style={{ width: 12, height: 12, borderRadius: 12, background: LAMP }} />
          {footer}
        </span>
        <span style={{ display: "flex", padding: "8px 16px", borderRadius: 6, background: PLATE, border: `1px solid ${SEAM}`, fontSize: 20, color: INK }}>
          github.com/ZeonArc
        </span>
      </div>
    </div>
  );
}
