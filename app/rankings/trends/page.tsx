import Link from "next/link"
import { headers } from "next/headers"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

type RepoHistoryItem = {
  snapshot_date: string
  ranking_key: string
  rank: string
  repo_id: number
  repo_name: string
  repo_full_name: string
  repo_url: string | null
  owner_login?: string | null
  owner_avatar_url?: string | null
  scope?: string | null
  summary?: string | null
  why_included?: string | null
  stars: number | null
  forks: number | null
  open_issues: number | null
  language: string | null
  score: number | null
  previous_rank?: string | null
  rank_change?: number | null
  stars_change?: number | null
  forks_change?: number | null
  score_change?: number | null
}

type BuilderHistoryItem = {
  snapshot_date: string
  rank: string
  login: string
  avatar_url: string | null
  profile_url: string | null
  repo_count: number | null
  total_contributions: number | null
  repositories: string[] | null
  builder_score: number | null
  previous_rank?: string | null
  rank_change?: number | null
  contributions_change?: number | null
  builder_score_change?: number | null
}

type RepoHistoryResponse = {
  ok: boolean
  type: "repo"
  rankingKey: string
  days: number
  total: number
  latestDate: string | null
  previousDate: string | null
  latest: RepoHistoryItem[]
  history: RepoHistoryItem[]
  error?: string
}

type BuilderHistoryResponse = {
  ok: boolean
  type: "builder"
  days: number
  total: number
  latestDate: string | null
  previousDate: string | null
  latest: BuilderHistoryItem[]
  history: BuilderHistoryItem[]
  error?: string
}

type TrendPoint = {
  date: string
  value: number
}

type TrendRow = {
  rank: string
  name: string
  fullName: string
  scope: string
  metric: number
  metricLabel: string
  delta: number | null
  deltaLabel: string
  rankDelta: number | null
  avatarUrl: string | null
  history: TrendPoint[]
}

type TrendGroup = {
  title: string
  plainTitle: string
  description: string
  rankingKey?: string
  metricLabel: string
  deltaLabel: string
  valueKey?: "stars" | "score"
  deltaKey?: "stars_change" | "score_change"
  href: string
}

const rankingGroups: TrendGroup[] = [
  {
    title: "GitHub Stars",
    plainTitle: "Most watched projects",
    description: "This shows which projects have the largest public audience on GitHub.",
    rankingKey: "github-stars",
    metricLabel: "Stars",
    deltaLabel: "New stars",
    valueKey: "stars",
    deltaKey: "stars_change",
    href: "/rankings/github-stars"
  },
  {
    title: "GitHub Momentum",
    plainTitle: "Projects moving fastest",
    description: "This shows which projects have the strongest recent public signal.",
    rankingKey: "github-trending",
    metricLabel: "Momentum",
    deltaLabel: "Daily change",
    valueKey: "score",
    deltaKey: "score_change",
    href: "/rankings/github-trending"
  },
  {
    title: "Agent Frameworks",
    plainTitle: "Frameworks with the strongest signal",
    description: "This compares reviewed agent frameworks by AIAA framework signal score.",
    rankingKey: "agent-frameworks",
    metricLabel: "Score",
    deltaLabel: "Score change",
    valueKey: "score",
    deltaKey: "score_change",
    href: "/rankings/agent-frameworks"
  }
]

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US").format(value)
}

function formatDelta(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0"
  }

  if (value > 0) {
    return `+${formatNumber(value)}`
  }

  return formatNumber(value)
}

function rankDeltaLabel(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value) || value === 0) {
    return "No change"
  }

  if (value > 0) {
    return `Up ${value}`
  }

  return `Down ${Math.abs(value)}`
}

function deltaTone(value: number | null | undefined) {
  if (!value) {
    return "border-white/10 bg-white/[0.035] text-white/58"
  }

  if (value > 0) {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
  }

  return "border-rose-400/25 bg-rose-400/10 text-rose-200"
}

async function getBaseUrl() {
  const requestHeaders = await headers()
  const host = requestHeaders.get("host")
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https")

  if (host) {
    return `${protocol}://${host}`
  }

  return process.env.SITE_URL ?? "http://localhost:3000"
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    })

    if (!response.ok) {
      return null
    }

    return await response.json() as T
  } catch {
    return null
  }
}

async function fetchRepoHistory(baseUrl: string, rankingKey: string) {
  return await fetchJson<RepoHistoryResponse>(`${baseUrl}/api/snapshots/github/history?rankingKey=${rankingKey}&days=90`)
}

async function fetchBuilderHistory(baseUrl: string) {
  return await fetchJson<BuilderHistoryResponse>(`${baseUrl}/api/snapshots/github/history?type=builder&days=90`)
}

function uniqueDates(responses: Array<RepoHistoryResponse | BuilderHistoryResponse | null>) {
  const dates = new Set<string>()

  for (const response of responses) {
    for (const row of response?.history ?? []) {
      dates.add(row.snapshot_date)
    }
  }

  return Array.from(dates).sort()
}

function repoRows(
  response: RepoHistoryResponse | null,
  valueKey: "stars" | "score",
  deltaKey: "stars_change" | "score_change",
  metricLabel: string,
  deltaLabel: string
): TrendRow[] {
  if (!response?.ok) {
    return []
  }

  return response.latest.slice(0, 5).map((row) => {
    const history = response.history
      .filter((item) => item.repo_full_name === row.repo_full_name)
      .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date))
      .map((item) => ({
        date: item.snapshot_date,
        value: item[valueKey] ?? 0
      }))

    return {
      rank: row.rank,
      name: row.repo_name,
      fullName: row.repo_full_name,
      scope: row.scope ?? row.language ?? "Repository",
      metric: row[valueKey] ?? 0,
      metricLabel,
      delta: row[deltaKey] ?? 0,
      deltaLabel,
      rankDelta: row.rank_change ?? 0,
      avatarUrl: row.owner_avatar_url ?? null,
      history
    }
  })
}

function builderRows(response: BuilderHistoryResponse | null): TrendRow[] {
  if (!response?.ok) {
    return []
  }

  return response.latest.slice(0, 5).map((row) => {
    const history = response.history
      .filter((item) => item.login === row.login)
      .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date))
      .map((item) => ({
        date: item.snapshot_date,
        value: item.builder_score ?? 0
      }))

    return {
      rank: row.rank,
      name: row.login,
      fullName: row.repositories?.join(", ") ?? "Tracked builder",
      scope: `${formatNumber(row.total_contributions)} contributions`,
      metric: row.builder_score ?? 0,
      metricLabel: "Builder score",
      delta: row.builder_score_change ?? 0,
      deltaLabel: "Score change",
      rankDelta: row.rank_change ?? 0,
      avatarUrl: row.avatar_url ?? null,
      history
    }
  })
}

function sparklinePoints(history: TrendPoint[]) {
  const width = 180
  const height = 44
  const padding = 6

  if (!history.length) {
    return ""
  }

  if (history.length === 1) {
    return `${padding},${height / 2} ${width - padding},${height / 2}`
  }

  const values = history.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = (width - padding * 2) / (history.length - 1)

  return history.map((point, index) => {
    const x = padding + index * step
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(" ")
}

function Sparkline({ history }: { history: TrendPoint[] }) {
  const points = sparklinePoints(history)
  const plotted = points.split(" ").filter(Boolean)

  return (
    <svg viewBox="0 0 180 44" className="h-11 w-[180px] overflow-visible" role="img" aria-label="Mini trend line">
      <line x1="6" y1="38" x2="174" y2="38" className="stroke-white/10" strokeWidth="1" />
      {points ? (
        <>
          <polyline points={points} fill="none" className="stroke-white/72" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {plotted.map((point, index) => {
            const [x, y] = point.split(",")
            return <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r="2.6" className="fill-white" />
          })}
        </>
      ) : null}
    </svg>
  )
}

function Avatar({ src, name }: { src: string | null; name: string }) {
  const initials = name.slice(0, 2).toUpperCase()

  return src ? (
    <img src={src} alt="" className="h-12 w-12 rounded-2xl border border-white/12 bg-white object-cover" />
  ) : (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.08] text-sm font-semibold text-white/70">
      {initials}
    </div>
  )
}

function DeltaPill({ value, rank }: { value: number | null | undefined; rank?: boolean }) {
  return (
    <span className={`inline-flex min-w-[6.2rem] items-center justify-center rounded-full border px-3 py-1.5 text-sm font-semibold ${deltaTone(value)}`}>
      {rank ? rankDeltaLabel(value) : formatDelta(value)}
    </span>
  )
}

function TodaySummary({ rows, latestDate, previousDate }: { rows: TrendRow[]; latestDate: string; previousDate: string }) {
  const leader = rows[0]
  const second = rows[1]
  const totalChange = rows.reduce((sum, row) => sum + (row.delta ?? 0), 0)

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-[1.5rem] border border-white/12 bg-white/[0.035] p-5">
        <div className="text-[0.66rem] uppercase tracking-[0.25em] text-white/42">Current leader</div>
        {leader ? (
          <div className="mt-4 flex items-center gap-3">
            <Avatar src={leader.avatarUrl} name={leader.name} />
            <div>
              <div className="text-xl font-semibold text-white">{leader.name}</div>
              <div className="mt-1 text-sm text-white/45">Rank {leader.rank} today</div>
            </div>
          </div>
        ) : <div className="mt-4 text-white/50">No data</div>}
      </div>

      <div className="rounded-[1.5rem] border border-white/12 bg-white/[0.035] p-5">
        <div className="text-[0.66rem] uppercase tracking-[0.25em] text-white/42">Closest challenger</div>
        {second ? (
          <div className="mt-4 flex items-center gap-3">
            <Avatar src={second.avatarUrl} name={second.name} />
            <div>
              <div className="text-xl font-semibold text-white">{second.name}</div>
              <div className="mt-1 text-sm text-white/45">Rank {second.rank} today</div>
            </div>
          </div>
        ) : <div className="mt-4 text-white/50">No data</div>}
      </div>

      <div className="rounded-[1.5rem] border border-white/12 bg-white/[0.035] p-5">
        <div className="text-[0.66rem] uppercase tracking-[0.25em] text-white/42">Snapshot window</div>
        <div className="mt-4 text-xl font-semibold text-white">{previousDate} to {latestDate}</div>
        <div className="mt-2 text-sm text-white/45">Top 5 daily change: {formatDelta(totalChange)}</div>
      </div>
    </div>
  )
}

function ProgressBoard({ rows }: { rows: TrendRow[] }) {
  const maxValue = Math.max(1, ...rows.map((row) => row.metric))

  return (
    <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/12">
      <div className="grid grid-cols-[0.55fr_2.5fr_1fr_1fr_1.5fr] gap-4 border-b border-white/14 bg-white/[0.03] px-5 py-4 text-[0.66rem] uppercase tracking-[0.24em] text-white/42">
        <div>Rank</div>
        <div>Project</div>
        <div>Today</div>
        <div>Change</div>
        <div>Share of leader</div>
      </div>

      {rows.length ? rows.map((row) => {
        const width = Math.max(4, Math.round((row.metric / maxValue) * 100))

        return (
          <div key={`${row.rank}-${row.name}`} className="grid grid-cols-[0.55fr_2.5fr_1fr_1fr_1.5fr] items-center gap-4 border-b border-white/10 px-5 py-5 last:border-b-0">
            <div className="text-2xl font-semibold text-white">{row.rank}</div>
            <div className="flex items-center gap-3">
              <Avatar src={row.avatarUrl} name={row.name} />
              <div>
                <div className="text-lg font-semibold text-white">{row.name}</div>
                <div className="mt-1 text-sm text-white/45">{row.fullName}</div>
              </div>
            </div>
            <div className="text-lg font-semibold text-white">{formatNumber(row.metric)}</div>
            <div><DeltaPill value={row.delta} /></div>
            <div>
              <div className="h-3 rounded-full bg-white/[0.07]">
                <div className="h-3 rounded-full bg-white/75" style={{ width: `${width}%` }} />
              </div>
              <div className="mt-2 text-xs text-white/35">{width}% of current leader</div>
            </div>
          </div>
        )
      }) : (
        <div className="px-5 py-8 text-white/50">No saved daily data yet.</div>
      )}
    </div>
  )
}

function MovementTable({ rows }: { rows: TrendRow[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/12">
      <div className="grid grid-cols-[0.55fr_2.2fr_1fr_1fr_1.35fr] gap-4 border-b border-white/14 bg-white/[0.03] px-5 py-4 text-[0.66rem] uppercase tracking-[0.24em] text-white/42">
        <div>Rank</div>
        <div>Name</div>
        <div>Rank change</div>
        <div>Daily change</div>
        <div>Mini trend</div>
      </div>

      {rows.length ? rows.map((row) => (
        <div key={`movement-${row.rank}-${row.name}`} className="grid grid-cols-[0.55fr_2.2fr_1fr_1fr_1.35fr] items-center gap-4 border-b border-white/10 px-5 py-4 last:border-b-0">
          <div className="text-xl font-semibold text-white">{row.rank}</div>
          <div className="flex items-center gap-3">
            <Avatar src={row.avatarUrl} name={row.name} />
            <div>
              <div className="font-semibold text-white">{row.name}</div>
              <div className="mt-1 text-sm text-white/45">{row.scope}</div>
            </div>
          </div>
          <div><DeltaPill value={row.rankDelta} rank /></div>
          <div><DeltaPill value={row.delta} /></div>
          <div><Sparkline history={row.history} /></div>
        </div>
      )) : (
        <div className="px-5 py-8 text-white/50">No saved daily data yet.</div>
      )}
    </div>
  )
}

function TrendSection({ id, title, description, rows, latestDate, previousDate, href }: { id?: string; title: string; description: string; rows: TrendRow[]; latestDate: string; previousDate: string; href: string }) {
  return (
    <section id={id} className="scroll-mt-36 rounded-[2rem] border border-white/14 bg-white/[0.025] p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[0.72rem] uppercase tracking-[0.32em] text-white/45">Trend board</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/58">{description}</p>
        </div>
        <Link href={href} className="inline-flex w-fit items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/85">
          View full ranking
        </Link>
      </div>

      <div className="mt-6">
        <TodaySummary rows={rows} latestDate={latestDate} previousDate={previousDate} />
      </div>

      <ProgressBoard rows={rows} />
      <MovementTable rows={rows} />
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/12 bg-white/[0.035] p-5">
      <div className="text-[0.68rem] uppercase tracking-[0.26em] text-white/45">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

export default async function RankingTrendsPage() {
  const baseUrl = await getBaseUrl()

  const [stars, trending, frameworks, builders] = await Promise.all([
    fetchRepoHistory(baseUrl, "github-stars"),
    fetchRepoHistory(baseUrl, "github-trending"),
    fetchRepoHistory(baseUrl, "agent-frameworks"),
    fetchBuilderHistory(baseUrl)
  ])

  const dates = uniqueDates([stars, trending, frameworks, builders])
  const latestDate = dates.at(-1) ?? "No snapshot"
  const previousDate = dates.at(-2) ?? "Pending"
  const totalRows = [stars, trending, frameworks, builders].reduce((sum, response) => sum + (response?.total ?? 0), 0)

  const groupRows = rankingGroups.map((group) => ({
    ...group,
    rows: repoRows(
      group.rankingKey === "github-stars" ? stars : group.rankingKey === "github-trending" ? trending : frameworks,
      group.valueKey ?? "score",
      group.deltaKey ?? "score_change",
      group.metricLabel,
      group.deltaLabel
    )
  }))

  const builderTrendRows = builderRows(builders)

  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-[1500px] px-6 pb-20 pt-28 md:px-10">
        <div className="rounded-[2.5rem] border border-white/14 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.13),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))] p-8 md:p-12">
          <div className="text-[0.75rem] uppercase tracking-[0.38em] text-white/45">Ranking trends</div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white md:text-7xl">
            What changed since the last snapshot.
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-white/68">
            This page turns daily AIAA snapshots into plain ranking changes. It shows who leads today, who is closest, and which scores moved.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <StatCard label="Latest snapshot" value={latestDate} />
            <StatCard label="Previous snapshot" value={previousDate} />
            <StatCard label="Days tracked" value={formatNumber(dates.length)} />
            <StatCard label="Saved records" value={formatNumber(totalRows)} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/rankings" className="rounded-full border border-white/12 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/10">
            Back to rankings
          </Link>
          <Link href="/rankings/github-stars" className="rounded-full border border-white/12 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/10">
            Stars ranking
          </Link>
          <Link href="/rankings/github-trending" className="rounded-full border border-white/12 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/10">
            Momentum ranking
          </Link>
          <Link href="/rankings/github-builders" className="rounded-full border border-white/12 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/10">
            Builder ranking
          </Link>
        </div>

        <div className="mt-10 grid gap-8">
          {groupRows.map((group) => (
            <TrendSection
              key={group.title}
              id={group.rankingKey}
              title={group.plainTitle}
              description={group.description}
              rows={group.rows}
              latestDate={latestDate}
              previousDate={previousDate}
              href={group.href}
            />
          ))}

          <TrendSection
            id="github-builders"
            title="Builders with the strongest contribution signal"
            description="This shows which public GitHub contributors have the highest contribution signal across tracked agent repositories."
            rows={builderTrendRows}
            latestDate={latestDate}
            previousDate={previousDate}
            href="/rankings/github-builders"
          />
        </div>
      </section>
    </main>
  )
}
