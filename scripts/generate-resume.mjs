/**
 * Builds public/resume.pdf (one A4 page) from the same content files as the site,
 * so the résumé never drifts from the portfolio.
 *
 *   npm run resume
 *
 * Node ≥ 23.6 runs the .ts content files directly (type stripping), which is why
 * those files avoid "@/" imports. The PDF uses the built-in Helvetica fonts with
 * WinAnsi encoding, so it needs no font files or dependencies. Contact details
 * are clickable link annotations.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (file) => import(pathToFileURL(join(root, "src/content", file)).href);

const [{ site }, { projects }, { skills, skillGroups }, { education, certifications }] = await Promise.all([
  load("site.ts"),
  load("projects.ts"),
  load("skills.ts"),
  load("education.ts"),
]);

// ── Fonts ─────────────────────────────────────────────────────
// Helvetica / Helvetica-Bold advance widths (1/1000 em) for ASCII 32–126, from the AFM files.
const REGULAR = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556,
  556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];
const BOLD = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611,
  611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584,
];

/** Non-ASCII characters we use, mapped to their WinAnsi code and widths [regular, bold]. */
const EXTRA = {
  "·": [0xb7, 278, 278],
  "–": [0x96, 556, 556],
  "—": [0x97, 1000, 1000],
  "…": [0x85, 1000, 1000],
  "’": [0x92, 222, 278],
  "‘": [0x91, 222, 278],
  "“": [0x93, 333, 500],
  "”": [0x94, 333, 500],
  "é": [0xe9, 556, 556],
  "×": [0xd7, 584, 584],
  "±": [0xb1, 584, 584],
};

function charWidth(ch, bold) {
  const code = ch.charCodeAt(0);
  if (code >= 32 && code <= 126) return (bold ? BOLD : REGULAR)[code - 32];
  const extra = EXTRA[ch];
  return extra ? extra[bold ? 2 : 1] : 556;
}

const textWidth = (text, size, bold = false) => ([...text].reduce((w, ch) => w + charWidth(ch, bold), 0) * size) / 1000;

/** PDF literal string, WinAnsi-encoded, non-ASCII as octal escapes. */
function pdfString(text) {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (ch === "(" || ch === ")" || ch === "\\") out += `\\${ch}`;
    else if (code >= 32 && code <= 126) out += ch;
    else if (EXTRA[ch]) out += `\\${EXTRA[ch][0].toString(8).padStart(3, "0")}`;
    else out += "?";
  }
  return `(${out})`;
}

function wrap(text, size, maxWidth, bold = false) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, size, bold) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ── Layout ────────────────────────────────────────────────────
const PAGE = { w: 595.28, h: 841.89 };
const M = { x: 46, top: 44, bottom: 34 };
const WIDTH = PAGE.w - M.x * 2;
const INK = "0.09 0.10 0.12";
const DIM = "0.36 0.38 0.42";

const ops = [];
const links = [];
let y = PAGE.h - M.top;

function text(str, x, size, { bold = false, color = INK } = {}) {
  ops.push(`BT ${color} rg /${bold ? "F2" : "F1"} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td ${pdfString(str)} Tj ET`);
}

function rule(weight = 0.6, gray = "0.75") {
  ops.push(`${gray} ${gray} ${gray} RG ${weight} w ${M.x} ${y.toFixed(2)} m ${(PAGE.w - M.x).toFixed(2)} ${y.toFixed(2)} l S`);
}

function heading(label) {
  y -= 16;
  text(label.toUpperCase(), M.x, 9, { bold: true, color: DIM });
  y -= 5;
  rule();
  y -= 13;
}

function paragraph(str, size = 9.5, { indent = 0, bullet = false, leading = 11.5, color = INK } = {}) {
  const x = M.x + indent;
  wrap(str, size, WIDTH - indent).forEach((line, i) => {
    if (bullet && i === 0) {
      ops.push(`${DIM} rg ${(x - 8).toFixed(2)} ${(y + size * 0.3).toFixed(2)} 2.2 2.2 re f`);
    }
    text(line, x, size, { color });
    y -= leading;
  });
}

/** Left text + right-aligned text on one line. */
function split(left, right, size, { bold = false } = {}) {
  text(left, M.x, size, { bold });
  text(right, PAGE.w - M.x - textWidth(right, size), size, { color: DIM });
}

// Header
text(site.name.toUpperCase(), M.x, 24, { bold: true });
y -= 17;
text(`${site.role} · ${site.credential}`, M.x, 10.5, { color: DIM });
y -= 15;

const contact = [
  { label: site.email, href: `mailto:${site.email}` },
  ...site.socials
    .filter((s) => s.platform !== "email")
    .map((s) => ({ label: s.href.replace(/^https?:\/\/(www\.)?/, ""), href: s.href })),
  { label: `${site.location.city}, ${site.location.region}, ${site.location.country}` },
];
let cx = M.x;
contact.forEach((item, i) => {
  if (i > 0) {
    text("  ·  ", cx, 9.5, { color: DIM });
    cx += textWidth("  ·  ", 9.5);
  }
  const w = textWidth(item.label, 9.5);
  ops.push(`BT ${INK} rg /F1 9.5 Tf ${cx.toFixed(2)} ${y.toFixed(2)} Td ${pdfString(item.label)} Tj ET`);
  if (item.href) links.push({ rect: [cx, y - 2.5, cx + w, y + 9], href: item.href });
  cx += w;
});
y -= 10;
rule(0.9, "0.55");
y -= 14;
paragraph(site.summary, 9.5);

// Education
heading("Education");
for (const degree of education) {
  split(degree.degree, `${degree.start} – ${degree.end}`, 10, { bold: true });
  y -= 12.5;
  text(`${degree.school}, ${degree.location}`, M.x, 9.5, { color: DIM });
  y -= 12.4;
}

// Projects
heading("Projects");
projects.forEach((project, i) => {
  if (i > 0) y -= 4;
  split(project.title, project.period, 10, { bold: true });
  const titleW = textWidth(project.title, 10, true);
  const stack = `  ·  ${project.tags.slice(0, 5).join(", ")}`;
  text(stack, M.x + titleW, 9, { color: DIM });
  y -= 13;
  paragraph(project.summary, 9.5, { indent: 10, bullet: true });
  paragraph(project.caseStudy.approach[0], 9.5, { indent: 10, bullet: true });
  const where = [project.links.live, project.links.source].filter(Boolean);
  if (where.length) {
    let lx = M.x + 10;
    where.forEach((href, j) => {
      const label = href.replace(/^https?:\/\/(www\.)?/, "");
      if (j > 0) {
        text("  ·  ", lx, 8.5, { color: DIM });
        lx += textWidth("  ·  ", 8.5);
      }
      text(label, lx, 8.5, { color: DIM });
      links.push({ rect: [lx, y - 2.5, lx + textWidth(label, 8.5), y + 8], href });
      lx += textWidth(label, 8.5);
    });
    y -= 12;
  }
});

// Skills
heading("Skills");
for (const group of skillGroups) {
  const names = skills.filter((s) => s.group === group.id).map((s) => s.name);
  if (names.length === 0) continue;
  const label = `${group.label}: `;
  text(label, M.x, 9.5, { bold: true });
  const indent = textWidth(label, 9.5, true);
  const lines = wrap(names.join(", "), 9.5, WIDTH - indent);
  lines.forEach((line, i) => {
    text(line, M.x + (i === 0 ? indent : 0), 9.5);
    y -= 11.8;
  });
}

// Certifications
if (certifications.length > 0) {
  heading("Certifications");
  for (const cert of certifications) {
    split(`${cert.name}, ${cert.issuer}`, cert.date, 9.5);
    y -= 11.8;
  }
}

if (y < M.bottom) {
  console.error(`✗ Résumé overflows the page by ${(M.bottom - y).toFixed(0)}pt. Shorten some content.`);
  process.exit(1);
}

// ── Assemble the PDF ──────────────────────────────────────────
const content = ops.join("\n");
const annots = links.map(
  ({ rect, href }) =>
    `<< /Type /Annot /Subtype /Link /Rect [${rect.map((n) => n.toFixed(2)).join(" ")}] /Border [0 0 0] /A << /S /URI /URI ${pdfString(href)} >> >>`,
);
const firstAnnot = 7;
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.w} ${PAGE.h}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R /Annots [${annots.map((_, i) => `${firstAnnot + i} 0 R`).join(" ")}] >>`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`,
  ...annots,
];
const info = `<< /Title ${pdfString(`${site.name} - Résumé`)} /Author ${pdfString(site.name)} >>`;
objects.push(info);

let pdf = "%PDF-1.4\n";
const offsets = [];
objects.forEach((obj, i) => {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
});
const xref = Buffer.byteLength(pdf, "latin1");
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

const out = join(root, "public/resume.pdf");
await writeFile(out, pdf, "latin1");
console.log(`✓ ${out} (${(Buffer.byteLength(pdf, "latin1") / 1024).toFixed(1)} KB, ${(y - M.bottom).toFixed(0)}pt to spare)`);
