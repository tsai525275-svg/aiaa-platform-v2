import { headers } from "next/headers";

export const rankingConfigs = {
  "ai-agent-products": {
    eyebrow: "AIAA Ranking",
    title: "AI Agent Product Ranking",
    subtitle: "Certification based ranking for AI Agent products that pass AIAA review.",
    description: "Products enter this ranking after application, assessment, identity verification, product evidence review, and certificate issuance. This is review based, not an automated GitHub popularity ranking.",
    mode: "preview",
    signal: "AIAA Certification",
    source: "AIAA Certification Review",
    metricLabel: "Trust Score"
  },
  "github-stars": {
    eyebrow: "Public GitHub Signal",
    title: "GitHub Stars Ranking",
    subtitle: "Live repository ranking with daily historical snapshots.",
    description: "This ranking uses public GitHub star counts across tracked AI Agent repositories. Snapshot data adds previous rank, star change, fork change, and score change.",
    mode: "repo-stars",
    signal: "Public GitHub",
    source: "GitHub public data and AIAA daily snapshots",
    metricLabel: "Stars"
  },
  "github-trending": {
    eyebrow: "Public GitHub Signal",
    title: "GitHub Trending Ranking",
    subtitle: "Momentum signal with daily historical snapshots.",
    description: "This ranking uses public GitHub repository metadata and daily snapshots. Growth metrics improve as more days accumulate.",
    mode: "repo-trending",
    signal: "Public GitHub",
    source: "GitHub public data and AIAA daily snapshots",
    metricLabel: "Momentum"
  },
  "github-builders": {
    eyebrow: "Public Builder Signal",
    title: "GitHub Builders Ranking",
    subtitle: "Builder contribution ranking with daily historical snapshots.",
    description: "This ranking uses public GitHub contributor metadata across tracked AI Agent repositories. It is not an AIAA identity certification.",
    mode: "builders",
    signal: "Public GitHub",
    source: "GitHub public data and AIAA daily snapshots",
    metricLabel: "Score"
  },
  "agent-frameworks": {
    eyebrow: "Framework Signal",
    title: "Agent Framework Ranking",
    subtitle: "Agent framework ranking with daily historical snapshots.",
    description: "This ranking tracks reviewed AI Agent frameworks, agent infrastructure, and workflow builders. Product and skill rankings are tracked separately.",
    mode: "frameworks",
    signal: "Public GitHub",
    source: "GitHub public data and AIAA daily snapshots",
    metricLabel: "Framework Score"
  }
} as const;

export type RankingSlug = keyof typeof rankingConfigs;

export type RepoRow = {
  rank: string;
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  pushedAt: string;
  updatedAt: string;
  ownerLogin: string;
  ownerAvatarUrl: string;
  scope?: string;
  summary?: string;
  whyIncluded?: string;
  momentumScore?: number;
  frameworkScore?: number;
};

export type BuilderRow = {
  rank: string;
  login: string;
  avatarUrl: string;
  profileUrl: string;
  repoCount: number;
  totalContributions: number;
  repositories: string[];
  builderScore: number;
};

export type RepoHistoryRow = {
  snapshot_date: string;
  ranking_key: string;
  rank: string;
  repo_id: number;
  repo_name: string;
  repo_full_name: string;
  repo_url: string | null;
  owner_login: string | null;
  owner_avatar_url: string | null;
  scope: string | null;
  summary: string | null;
  why_included: string | null;
  stars: number | null;
  forks: number | null;
  open_issues: number | null;
  language: string | null;
  score: number | null;
  previous_rank: string | null;
  rank_change: number | null;
  stars_change: number | null;
  forks_change: number | null;
  score_change: number | null;
};

export type BuilderHistoryRow = {
  snapshot_date: string;
  rank: string;
  login: string;
  avatar_url: string | null;
  profile_url: string | null;
  repo_count: number | null;
  total_contributions: number | null;
  repositories: string[] | null;
  builder_score: number | null;
  previous_rank: string | null;
  rank_change: number | null;
  contributions_change: number | null;
  builder_score_change: number | null;
};

export type ApiListResponse<T> = {
  results: T[];
  total?: number;
};

export type HistoryResponse<T> = {
  ok: boolean;
  latestDate: string | null;
  previousDate: string | null;
  latest: T[];
  history: T[];
  total: number;
};

export const previewRows = Array.from({ length: 8 }, (_, index) => {
  const rank = String(index + 1).padStart(2, "0");
  return {
    rank,
    name: `Certification Candidate ${rank}`,
    slug: `certification-candidate-${rank}`,
    level: index < 2 ? "Level 2" : "Level 1",
    category: "Agent Product",
    signal: "AIAA certification",
    score: "Pending"
  };
});

export async function getBaseUrl() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");

  if (!host) return process.env.SITE_URL ?? "http://localhost:3000";
  return `${protocol}://${host}`;
}

export async function fetchJson<T>(path: string) {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "AIAA Ranking Page"
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${path} failed with ${response.status}: ${message}`);
  }

  return (await response.json()) as T;
}

export async function safeFetchJson<T>(path: string, fallback: T) {
  try {
    return await fetchJson<T>(path);
  } catch {
    return fallback;
  }
}

export function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRepoMetric(row: RepoRow, mode: string) {
  if (mode === "repo-trending") return row.momentumScore ?? 0;
  if (mode === "frameworks") return row.frameworkScore ?? 0;
  return row.stars;
}

export function historyByRepo(rows: RepoHistoryRow[]) {
  return new Map(rows.map((row) => [row.repo_full_name, row]));
}

export function historyByBuilder(rows: BuilderHistoryRow[]) {
  return new Map(rows.map((row) => [row.login, row]));
}

export function repoHistoryPath(slug: RankingSlug) {
  if (slug === "github-stars") return "/api/snapshots/github/history?rankingKey=github-stars";
  if (slug === "github-trending") return "/api/snapshots/github/history?rankingKey=github-trending";
  if (slug === "agent-frameworks") return "/api/snapshots/github/history?rankingKey=agent-frameworks";
  return "/api/snapshots/github/history?rankingKey=github-stars";
}

export function repoApiPath(slug: RankingSlug) {
  if (slug === "github-stars") return "/api/github/repos";
  if (slug === "github-trending") return "/api/github/trending";
  if (slug === "agent-frameworks") return "/api/github/frameworks";
  return "/api/github/repos";
}
