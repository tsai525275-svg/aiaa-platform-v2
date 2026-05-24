import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type RepoSnapshotRow = {
  snapshot_date: string
  ranking_key: string
  rank: string
  repo_id: number
  repo_name: string
  repo_full_name: string
  repo_url: string | null
  stars: number | null
  forks: number | null
  open_issues: number | null
  language: string | null
  score: number | null
  scope: string | null
  summary: string | null
}

type BuilderSnapshotRow = {
  snapshot_date: string
  rank: string
  login: string
  avatar_url: string | null
  profile_url: string | null
  repo_count: number | null
  total_contributions: number | null
  repositories: string[] | null
  builder_score: number | null
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  })
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "")
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is missing")
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing")
  }

  return { supabaseUrl, serviceRoleKey }
}

function clampDays(value: string | null) {
  const parsed = Number(value ?? "30")

  if (!Number.isFinite(parsed)) {
    return 30
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 365)
}

function getStartDate(days: number) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days + 1)
  return date.toISOString().slice(0, 10)
}

async function supabaseGet<T>(table: string, query: string) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig()

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: "application/json"
    },
    cache: "no-store"
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`${table} query failed with ${response.status}: ${message}`)
  }

  return await response.json() as T[]
}

function indexPreviousRepoRows(rows: RepoSnapshotRow[]) {
  const latestDate = rows[0]?.snapshot_date ?? null
  const previousDate = rows.find((row) => row.snapshot_date !== latestDate)?.snapshot_date ?? null

  const latestRows = rows.filter((row) => row.snapshot_date === latestDate)
  const previousRows = rows.filter((row) => row.snapshot_date === previousDate)

  const previousByRepo = new Map(previousRows.map((row) => [row.repo_full_name, row]))

  const latestWithDelta = latestRows.map((row) => {
    const previous = previousByRepo.get(row.repo_full_name)

    return {
      ...row,
      previous_rank: previous?.rank ?? null,
      rank_change: previous ? Number(previous.rank) - Number(row.rank) : null,
      stars_change: previous ? (row.stars ?? 0) - (previous.stars ?? 0) : null,
      forks_change: previous ? (row.forks ?? 0) - (previous.forks ?? 0) : null,
      score_change: previous ? (row.score ?? 0) - (previous.score ?? 0) : null
    }
  })

  return {
    latestDate,
    previousDate,
    latestRows,
    latestWithDelta
  }
}

function indexPreviousBuilderRows(rows: BuilderSnapshotRow[]) {
  const latestDate = rows[0]?.snapshot_date ?? null
  const previousDate = rows.find((row) => row.snapshot_date !== latestDate)?.snapshot_date ?? null

  const latestRows = rows.filter((row) => row.snapshot_date === latestDate)
  const previousRows = rows.filter((row) => row.snapshot_date === previousDate)

  const previousByLogin = new Map(previousRows.map((row) => [row.login, row]))

  const latestWithDelta = latestRows.map((row) => {
    const previous = previousByLogin.get(row.login)

    return {
      ...row,
      previous_rank: previous?.rank ?? null,
      rank_change: previous ? Number(previous.rank) - Number(row.rank) : null,
      contributions_change: previous ? (row.total_contributions ?? 0) - (previous.total_contributions ?? 0) : null,
      builder_score_change: previous ? (row.builder_score ?? 0) - (previous.builder_score ?? 0) : null
    }
  })

  return {
    latestDate,
    previousDate,
    latestRows,
    latestWithDelta
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get("type") ?? "repo"
    const rankingKey = url.searchParams.get("rankingKey") ?? "github-stars"
    const days = clampDays(url.searchParams.get("days"))
    const startDate = getStartDate(days)

    if (type === "builder") {
      const rows = await supabaseGet<BuilderSnapshotRow>(
        "github_builder_daily_snapshots",
        [
          "select=snapshot_date,rank,login,avatar_url,profile_url,repo_count,total_contributions,repositories,builder_score",
          `snapshot_date=gte.${startDate}`,
          "order=snapshot_date.desc,rank.asc"
        ].join("&")
      )

      const summary = indexPreviousBuilderRows(rows)

      return json({
        ok: true,
        type: "builder",
        days,
        total: rows.length,
        latestDate: summary.latestDate,
        previousDate: summary.previousDate,
        latest: summary.latestWithDelta,
        history: rows
      })
    }

    const allowedRankingKeys = new Set([
      "github-stars",
      "github-trending",
      "agent-frameworks"
    ])

    if (!allowedRankingKeys.has(rankingKey)) {
      return json({
        ok: false,
        error: "Invalid rankingKey"
      }, 400)
    }

    const rows = await supabaseGet<RepoSnapshotRow>(
      "github_repo_daily_snapshots",
      [
        "select=snapshot_date,ranking_key,rank,repo_id,repo_name,repo_full_name,repo_url,owner_login,owner_avatar_url,scope,summary,why_included,stars,forks,open_issues,language,score",
        `ranking_key=eq.${rankingKey}`,
        `snapshot_date=gte.${startDate}`,
        "order=snapshot_date.desc,rank.asc"
      ].join("&")
    )

    const summary = indexPreviousRepoRows(rows)

    return json({
      ok: true,
      type: "repo",
      rankingKey,
      days,
      total: rows.length,
      latestDate: summary.latestDate,
      previousDate: summary.previousDate,
      latest: summary.latestWithDelta,
      history: rows
    })
  } catch (error) {
    return json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, 500)
  }
}

