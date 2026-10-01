import { site } from "@/content/site";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface GitHubActivity {
  username: string;
  profileUrl: string;
  totalContributions: number;
  /** Columns of 7 days (Sun → Sat), oldest first. */
  weeks: (ContributionDay | null)[][];
  publicRepos: number | null;
}

const REVALIDATE = 60 * 60 * 12; // 12h

interface ContributionsApiResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

interface GitHubUserResponse {
  public_repos: number;
}

/**
 * Contribution graph + public repo count for the configured account
 * (GITHUB_USERNAME, falling back to site.githubUsername). GITHUB_TOKEN is
 * optional and only raises the API rate limit.
 * Contributions come from github-contributions-api.jogruber.de, which reads the
 * public profile graph. Returns null on failure: the page then simply omits the
 * graph rather than showing made-up data.
 */
export async function getGitHubActivity(): Promise<GitHubActivity | null> {
  const username = process.env.GITHUB_USERNAME?.trim() || site.githubUsername;
  if (!username) return null;

  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const [contribRes, userRes] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
        next: { revalidate: REVALIDATE },
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        next: { revalidate: REVALIDATE },
      }),
    ]);

    if (!contribRes.ok) throw new Error(`contributions ${contribRes.status}`);
    const contrib = (await contribRes.json()) as ContributionsApiResponse;
    const user = userRes.ok ? ((await userRes.json()) as GitHubUserResponse) : null;

    return {
      username,
      profileUrl: `https://github.com/${username}`,
      totalContributions: contrib.total.lastYear ?? contrib.contributions.reduce((n, d) => n + d.count, 0),
      weeks: toWeeks(contrib.contributions),
      publicRepos: user?.public_repos ?? null,
    };
  } catch (error) {
    console.warn("[github] couldn't load activity, hiding the graph:", error);
    return null;
  }
}

/** Group a flat list of days into Sunday-first week columns, padding the first week. */
function toWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: (ContributionDay | null)[][] = [];
  let week: (ContributionDay | null)[] = [];

  sorted.forEach((day, i) => {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (i === 0) week = Array.from({ length: weekday }, () => null);
    week.push(day);
    if (weekday === 6) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length) weeks.push(week);
  return weeks;
}
