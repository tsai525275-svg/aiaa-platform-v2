import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RepoRow = {
  rank: string;
  id: number;
  name: string;
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  pushedAt: string;
  updatedAt: string;
  ownerLogin?: string;
  ownerAvatarUrl?: string;
  scope?: string;
  summary?: string;
  whyIncluded?: string;
  momentumScore?: number;
  frameworkScore?: number;
};

type BuilderRow = {
  rank: string;
  login: string;
  avatarUrl: string;
  profileUrl: string;
  repoCount: number;
  totalContributions: number;
  repositories: string[];
  builderScore: number;
};

type ApiResponse<T> = {
  results: T[];
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

async function readApi<T>(origin: string, path: string) {
  const response = await fetch(`${origin}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "AIAA Snapshot Runner"
    }
  });

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }

  return (await response.json()) as ApiResponse<T>;
}

async function upsertRows(table: string, onConflict: string, rows: unknown[]) {
  if (rows.length === 0) {
    return {
      table,
      rows: 0
    };
  }

  const supabaseUrl = requireEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}?on_conflict=${onConflict}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(rows)
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${table} upsert failed: ${message}`);
  }

  return {
    table,
    rows: rows.length
  };
}

function mapRepoRows(
  snapshotDate: string,
  rankingKey: string,
  rows: RepoRow[],
  scoreKey: "stars" | "momentumScore" | "frameworkScore"
) {
  return rows.map((item) => ({
    snapshot_date: snapshotDate,
    ranking_key: rankingKey,
    rank: item.rank,
    repo_id: item.id,
    repo_name: item.name,
    repo_full_name: item.fullName,
    repo_url: item.url,
    owner_login: item.ownerLogin ?? item.fullName.split("/")[0] ?? null,
    owner_avatar_url: item.ownerAvatarUrl ?? null,
    scope: item.scope ?? null,
    summary: item.summary ?? null,
    why_included: item.whyIncluded ?? null,
    stars: item.stars ?? 0,
    forks: item.forks ?? 0,
    open_issues: item.openIssues ?? 0,
    language: item.language ?? null,
    pushed_at: item.pushedAt ?? null,
    updated_at: item.updatedAt ?? null,
    score: item[scoreKey] ?? 0,
    raw: item
  }));
}

function mapBuilderRows(snapshotDate: string, rows: BuilderRow[]) {
  return rows.map((item) => ({
    snapshot_date: snapshotDate,
    rank: item.rank,
    login: item.login,
    avatar_url: item.avatarUrl,
    profile_url: item.profileUrl,
    repo_count: item.repoCount,
    total_contributions: item.totalContributions,
    repositories: item.repositories,
    builder_score: item.builderScore,
    raw: item
  }));
}

export async function GET(request: NextRequest) {
  try {
    const cronSecret = requireEnv("CRON_SECRET");
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized"
        },
        {
          status: 401
        }
      );
    }

    const origin = request.nextUrl.origin;
    const snapshotDate = new Date().toISOString().slice(0, 10);

    const [repos, trending, builders, frameworks] = await Promise.all([
      readApi<RepoRow>(origin, "/api/github/repos"),
      readApi<RepoRow>(origin, "/api/github/trending"),
      readApi<BuilderRow>(origin, "/api/github/builders"),
      readApi<RepoRow>(origin, "/api/github/frameworks")
    ]);

    const repoRows = [
      ...mapRepoRows(snapshotDate, "github-stars", repos.results ?? [], "stars"),
      ...mapRepoRows(snapshotDate, "github-trending", trending.results ?? [], "momentumScore"),
      ...mapRepoRows(snapshotDate, "agent-frameworks", frameworks.results ?? [], "frameworkScore")
    ];

    const builderRows = mapBuilderRows(snapshotDate, builders.results ?? []);

    const writes = await Promise.all([
      upsertRows(
        "github_repo_daily_snapshots",
        "snapshot_date,ranking_key,repo_full_name",
        repoRows
      ),
      upsertRows(
        "github_builder_daily_snapshots",
        "snapshot_date,login",
        builderRows
      )
    ]);

    return NextResponse.json({
      ok: true,
      snapshotDate,
      source: "AIAA Daily GitHub Snapshot",
      repoSnapshots: repoRows.length,
      builderSnapshots: builderRows.length,
      writes
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      {
        status: 500
      }
    );
  }
}
