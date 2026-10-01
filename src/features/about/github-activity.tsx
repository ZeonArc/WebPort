import { ArrowUpRight } from "lucide-react";

import { getGitHubActivity, type ContributionLevel } from "@/lib/github";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;

const LEVEL_FILL: Record<ContributionLevel, string> = {
  0: "var(--plate-2)",
  1: "color-mix(in oklab, var(--lamp) 30%, var(--plate-2))",
  2: "color-mix(in oklab, var(--lamp) 55%, var(--plate-2))",
  3: "color-mix(in oklab, var(--lamp) 78%, var(--plate-2))",
  4: "var(--lamp)",
};

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const NUMBER = new Intl.NumberFormat("en-IN");

/** Server-rendered contribution heatmap (revalidated every 12h). Renders nothing if the data can't be fetched. */
export async function GitHubActivity() {
  const activity = await getGitHubActivity();
  if (!activity) return null;

  const { weeks } = activity;
  const width = weeks.length * STEP - GAP;
  const height = 7 * STEP - GAP;

  // A label per month change, skipping any that would sit within 3 weeks of the previous one.
  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  let lastWeek = -Infinity;
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month === lastMonth) return;
    lastMonth = month;
    if (i - lastWeek < 3 || i > weeks.length - 3) return;
    monthLabels.push({ x: i * STEP, label: MONTH.format(new Date(`${first.date}T00:00:00Z`)) });
    lastWeek = i;
  });

  // One path per level keeps this to 5 nodes instead of ~370 rects.
  const levelPaths: string[] = ["", "", "", "", ""];
  weeks.forEach((week, x) =>
    week.forEach((day, y) => {
      if (!day) return;
      levelPaths[day.level] += `M${x * STEP} ${y * STEP}h${CELL}v${CELL}h-${CELL}z`;
    }),
  );

  return (
    <figure className="rounded-md border border-border bg-plate p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <figcaption className="label-mono text-foreground">
          GitHub · {NUMBER.format(activity.totalContributions)} contributions in the last 12 months
          {activity.publicRepos !== null && (
            <span className="text-muted-foreground"> · {activity.publicRepos} public repos</span>
          )}
        </figcaption>
        <a
          href={activity.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          github.com/{activity.username}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      {/* rtl on the scroller makes narrow screens start at the most recent weeks. */}
      <div className="no-scrollbar mt-5 overflow-x-auto [direction:rtl]">
        <svg
          role="img"
          aria-label={`${NUMBER.format(activity.totalContributions)} GitHub contributions in the last 12 months`}
          viewBox={`0 -16 ${width} ${height + 16}`}
          className="h-auto w-full min-w-[42rem] [direction:ltr]"
        >
          {monthLabels.map((m) => (
            <text key={`${m.label}-${m.x}`} x={m.x} y={-5} className="fill-muted-foreground font-mono" fontSize={8}>
              {m.label}
            </text>
          ))}
          {levelPaths.map((d, level) => (
            <path key={level} d={d} style={{ fill: LEVEL_FILL[level as ContributionLevel] }} />
          ))}
        </svg>
      </div>

      <p className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[0.6875rem] text-muted-foreground" aria-hidden="true">
        Less
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <span key={level} className="size-2.5 rounded-[1px]" style={{ background: LEVEL_FILL[level] }} />
        ))}
        More
      </p>
    </figure>
  );
}
