import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 300

const rankingConfigs = {
  "ai-agent-products": {
    eyebrow: "AIAA Ranking",
    title: "AI Agent Product Ranking",
    subtitle: "Certification-based ranking for AI Agent products that pass AIAA review.",
    description: "Products enter this ranking after application, exam or assessment, identity verification, product evidence review, and certificate issuance. This is intentionally review-based, not an automated GitHub or popularity ranking.",
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
    description: "This ranking uses public GitHub repository metadata and daily snapshots. True growth metrics will improve as more days accumulate.",
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
} as const

type RankingSlug = keyof typeof rankingConfigs

type RepoRow = {
  rank: string
  id: number
  name: string
  fullName: string
  description: string | null
  url: string
  stars: number
  forks: number
  openIssues: number
  language: string | null
  pushedAt: string
  updatedAt: string
  ownerLogin: string
  ownerAvatarUrl: string
  scope?: string
  summary?: string
  whyIncluded?: string
  momentumScore?: number
  frameworkScore?: number
}

type BuilderRow = {
  rank: string
  login: string
  avatarUrl: string
  profileUrl: string
  repoCount: number
  totalContributions: number
  repositories: string[]
  builderScore: number
}

type RepoHistoryRow = {
  snapshot_date: string
  ranking_key: string
  rank: string
  repo_id: number
  repo_name: string
  repo_full_name: string
  repo_url: string | null
  owner_login: string | null
  owner_avatar_url: string | null
  scope: string | null
  summary: string | null
  why_included: string | null
  stars: number
  forks: number
  open_issues: number
  language: string | null
  score: number | null
  previous_rank: string | null
  rank_change: number | null
  stars_change: number | null
  forks_change: number | null
  score_change: number | null
}

type BuilderHistoryRow = {
  snapshot_date: string
  rank: string
  login: string
  avatar_url: string | null
  profile_url: string | null
  repo_count: number | null
  total_contributions: number | null
  repositories: string[] | null
  builder_score: number | null
  previous_rank: string | null
  rank_change: number | null
  contributions_change: number | null
  builder_score_change: number | null
}

type ApiListResponse<T> = {
  results: T[]
  total?: number
}

type HistoryResponse<T> = {
  ok: boolean
  latestDate: string | null
  previousDate: string | null
  latest: T[]
  history: T[]
  total: number
}

const previewRows = [
  {
    rank: "01",
    name: "Certification Candidate 01",
    slug: "certification-candidate-01",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending"
  },
  {
    rank: "02",
    name: "Certification Candidate 02",
    slug: "certification-candidate-02",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending"
  },
  {
    rank: "03",
    name: "Certification Candidate 03",
    slug: "certification-candidate-03",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending"
  },
  {
    rank: "04",
    name: "Certification Candidate 04",
    slug: "certification-candidate-04",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending"
  },
  {
    rank: "05",
    name: "Certification Candidate 05",
    slug: "certification-candidate-05",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending"
  }
]

export function generateStaticParams() {
  return Object.keys(rankingConfigs).map((slug) => ({ slug }))
}

async function getBaseUrl() {
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  const protocol = headerStore.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https")

  if (!host) return process.env.SITE_URL ?? "http://localhost:3000"

  return `${protocol}://${host}`
}

async function fetchJson<T>(path: string) {
  const baseUrl = await getBaseUrl()
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "AIAA Ranking Page"
    }
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`${path} failed with ${response.status}: ${message}`)
  }

  return (await response.json()) as T
}

async function safeFetchJson<T>(path: string, fallback: T) {
  try {
    return await fetchJson<T>(path)
  } catch {
    return fallback
  }
}

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function historyByRepo(rows: RepoHistoryRow[]) {
  return new Map(rows.map((row) => [row.repo_full_name, row]))
}

function historyByBuilder(rows: BuilderHistoryRow[]) {
  return new Map(rows.map((row) => [row.login, row]))
}

function getRepoMetric(row: RepoRow, mode: string) {
  if (mode === "repo-trending") return row.momentumScore ?? 0
  if (mode === "frameworks") return row.frameworkScore ?? 0
  return row.stars
}

function getRepoHistoryMetricChange(row: RepoHistoryRow | undefined, mode: string) {
  if (!row) return null
  if (mode === "repo-stars") return row.stars_change
  return row.score_change
}

function DeltaBadge({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) {
    return <span className="text-white/36">No prior</span>
  }

  if (value > 0) {
    return <span className="text-emerald-200">▲ +{formatNumber(value)}</span>
  }

  if (value < 0) {
    return <span className="text-rose-200">▼ {formatNumber(value)}</span>
  }

  return <span className="text-white/52">0</span>
}

function RankDeltaBadge({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) {
    return <span className="text-white/36">No prior</span>
  }

  if (value > 0) {
    return <span className="text-emerald-200">▲ +{formatNumber(value)}</span>
  }

  if (value < 0) {
    return <span className="text-rose-200">▼ {formatNumber(value)}</span>
  }

  return <span className="text-white/52">0</span>
}

function SignalBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-full max-w-[9rem] justify-center rounded-full border border-emerald-300/30 bg-emerald-300/[0.10] px-3 py-1.5 text-xs font-medium leading-5 text-emerald-100">
      {label}
    </span>
  )
}

function ScopeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-full max-w-[10rem] justify-center rounded-full border border-white/18 bg-white/[0.04] px-3 py-1.5 text-center text-xs font-medium leading-5 text-white/80">
      {label}
    </span>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/[0.035] px-4 py-3">
      <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/38">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  )
}

function EmptyHistoryNote() {
  return (
    <div className="mt-4 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/56">
      Snapshot history will become more useful after more daily runs. Current deltas compare the latest snapshot against the previous snapshot.
    </div>
  )
}

function PreviewTable() {
  return (
    <section className="mt-6 rounded-[1.6rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
      <div className="grid grid-cols-[0.38fr_1.05fr_0.78fr_1.0fr_0.88fr_0.66fr_0.78fr] items-center gap-3 border-b border-white/12 px-3 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
        <div>Rank</div>
        <div>Name</div>
        <div className="text-center">Level</div>
        <div>Category</div>
        <div>Signal</div>
        <div>Score</div>
        <div>Details</div>
      </div>
      {previewRows.map((entry) => (
        <div key={`${entry.rank}-${entry.name}`} className="grid grid-cols-[0.38fr_1.05fr_0.78fr_1.0fr_0.88fr_0.66fr_0.78fr] items-center gap-3 border-b border-white/8 px-3 py-3.5 last:border-b-0">
          <div className="text-[1.55rem] font-semibold leading-none tracking-[-0.08em] text-white">{entry.rank}</div>
          <div className="text-base font-medium text-white">{entry.name}</div>
          <div className="flex h-full w-full items-center justify-center"><ScopeBadge label={entry.level} /></div>
          <div className="text-base text-white/76">{entry.category}</div>
          <div className="text-base text-white/76">{entry.signal}</div>
          <div className="text-base font-semibold text-white">{entry.score}</div>
          <div>
            <Link href={`/rankings/ai-agent-products/${entry.slug}`} className="inline-flex whitespace-nowrap rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/10">
              View Details
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}

function RepoHistoryTable({
  items,
  historyRows,
  mode,
  metricLabel,
  signal
}: {
  items: RepoRow[]
  historyRows: RepoHistoryRow[]
  mode: string
  metricLabel: string
  signal: string
}) {
  const historyMap = historyByRepo(historyRows)
  const deltaLabel = mode === "repo-stars" ? "Star Δ" : "Score Δ"

  return (
    <section className="mt-6 rounded-[1.6rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
      <div className="grid grid-cols-[0.3fr_1.44fr_0.74fr_0.68fr_0.5fr_0.48fr_0.5fr_0.48fr_0.62fr] items-center gap-3 border-b border-white/12 px-3 py-3 text-[0.64rem] uppercase tracking-[0.18em] text-white/42">
        <div>Rank</div>
        <div>Repository</div>
        <div>Scope</div>
        <div>Signal</div>
        <div>{metricLabel}</div>
        <div>Rank Δ</div>
        <div>{deltaLabel}</div>
        <div>Lang.</div>
        <div>Details</div>
      </div>

      {items.map((item) => {
        const history = historyMap.get(item.fullName)
        const scope = item.scope ?? history?.scope ?? "AI Agent Repository"
        const summary = item.summary ?? history?.summary ?? item.description ?? "Tracked AI Agent repository."

        return (
          <div key={`${mode}-${item.fullName}`} className="grid min-h-[8.75rem] grid-cols-[0.3fr_1.44fr_0.74fr_0.68fr_0.5fr_0.48fr_0.5fr_0.48fr_0.62fr] items-center gap-3 border-b border-white/8 px-3 py-3.5 last:border-b-0">
            <div className="text-[1.45rem] font-semibold leading-none tracking-[-0.08em] text-white">{item.rank}</div>
            <div className="flex min-w-0 gap-3">
              <img src={item.ownerAvatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
              <div className="min-w-0">
                <a href={item.url} target="_blank" rel="noreferrer" className="break-words text-base font-medium text-white hover:text-white/70">
                  {item.name}
                </a>
                <div className="mt-0.5 break-words text-xs text-white/44">{item.fullName}</div>
                <p className="mt-1.5 h-10 overflow-hidden text-xs leading-5 text-white/62">{summary}</p>
              </div>
            </div>
            <div><ScopeBadge label={scope} /></div>
            <div><SignalBadge label={signal} /></div>
            <div className="text-base font-semibold text-white">{formatNumber(getRepoMetric(item, mode))}</div>
            <div className="text-base font-semibold"><RankDeltaBadge value={history?.rank_change} /></div>
            <div className="text-base font-semibold"><DeltaBadge value={getRepoHistoryMetricChange(history, mode)} /></div>
            <div className="break-words text-base font-semibold text-white">{item.language ?? "Public"}</div>
            <div>
              <Link href={`/rankings/${mode === "repo-stars" ? "github-stars" : mode === "repo-trending" ? "github-trending" : "agent-frameworks"}/${slugify(item.name)}`} className="inline-flex whitespace-nowrap rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/10">
                View Details
              </Link>
            </div>
          </div>
        )
      })}
    </section>
  )
}

function BuilderHistoryTable({ items, historyRows }: { items: BuilderRow[]; historyRows: BuilderHistoryRow[] }) {
  const historyMap = historyByBuilder(historyRows)

  return (
    <section className="mt-6 rounded-[1.6rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
      <div className="grid grid-cols-[0.3fr_1.42fr_0.72fr_0.62fr_0.5fr_0.48fr_0.48fr_0.62fr] items-center gap-3 border-b border-white/12 px-3 py-3 text-[0.64rem] uppercase tracking-[0.18em] text-white/42">
        <div>Rank</div>
        <div>Builder</div>
        <div>Signal</div>
        <div>Contrib.</div>
        <div>Score</div>
        <div>Rank Δ</div>
        <div>Score Δ</div>
        <div>Details</div>
      </div>

      {items.map((item) => {
        const history = historyMap.get(item.login)

        return (
          <div key={item.login} className="grid min-h-[8.75rem] grid-cols-[0.3fr_1.42fr_0.72fr_0.62fr_0.5fr_0.48fr_0.48fr_0.62fr] items-center gap-3 border-b border-white/8 px-3 py-3.5 last:border-b-0">
            <div className="text-[1.45rem] font-semibold leading-none tracking-[-0.08em] text-white">{item.rank}</div>
            <div className="flex min-w-0 gap-3">
              <img src={item.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
              <div className="min-w-0">
                <a href={item.profileUrl} target="_blank" rel="noreferrer" className="break-words text-base font-medium text-white hover:text-white/70">
                  {item.login}
                </a>
                <p className="mt-1.5 h-10 overflow-hidden text-xs leading-5 text-white/62">Public contributor across tracked AI Agent repositories.</p>
                <div className="mt-0.5 break-words text-[0.72rem] leading-5 text-white/42">Repos: {item.repositories.slice(0, 2).join(", ")}{item.repositories.length > 2 ? "..." : ""}</div>
              </div>
            </div>
            <div><SignalBadge label="Public GitHub" /></div>
            <div className="text-base font-semibold text-white">{formatNumber(item.totalContributions)}</div>
            <div className="text-base font-semibold text-white">{formatNumber(item.builderScore)}</div>
            <div className="text-base font-semibold"><RankDeltaBadge value={history?.rank_change} /></div>
            <div className="text-base font-semibold"><DeltaBadge value={history?.builder_score_change} /></div>
            <div>
              <Link href={`/rankings/github-builders/${slugify(item.login)}`} className="inline-flex whitespace-nowrap rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white hover:bg-white/10">
                View Details
              </Link>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default async function RankingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const config = rankingConfigs[slug as RankingSlug]

  if (!config) notFound()

  let repoItems: RepoRow[] = []
  let builderItems: BuilderRow[] = []
  let repoHistory: HistoryResponse<RepoHistoryRow> | null = null
  let builderHistory: HistoryResponse<BuilderHistoryRow> | null = null

  if (config.mode === "repo-stars") {
    const data = await safeFetchJson<ApiListResponse<RepoRow>>("/api/github/repos", { results: [] })
    repoItems = data.results ?? []
    repoHistory = await safeFetchJson<HistoryResponse<RepoHistoryRow>>("/api/snapshots/github/history?rankingKey=github-stars", {
      ok: false,
      latestDate: null,
      previousDate: null,
      latest: [],
      history: [],
      total: 0
    })
  }

  if (config.mode === "repo-trending") {
    const data = await safeFetchJson<ApiListResponse<RepoRow>>("/api/github/trending", { results: [] })
    repoItems = data.results ?? []
    repoHistory = await safeFetchJson<HistoryResponse<RepoHistoryRow>>("/api/snapshots/github/history?rankingKey=github-trending", {
      ok: false,
      latestDate: null,
      previousDate: null,
      latest: [],
      history: [],
      total: 0
    })
  }

  if (config.mode === "frameworks") {
    const data = await safeFetchJson<ApiListResponse<RepoRow>>("/api/github/frameworks", { results: [] })
    repoItems = data.results ?? []
    repoHistory = await safeFetchJson<HistoryResponse<RepoHistoryRow>>("/api/snapshots/github/history?rankingKey=agent-frameworks", {
      ok: false,
      latestDate: null,
      previousDate: null,
      latest: [],
      history: [],
      total: 0
    })
  }

  if (config.mode === "builders") {
    const data = await safeFetchJson<ApiListResponse<BuilderRow>>("/api/github/builders", { results: [] })
    builderItems = data.results ?? []
    builderHistory = await safeFetchJson<HistoryResponse<BuilderHistoryRow>>("/api/snapshots/github/history?type=builder", {
      ok: false,
      latestDate: null,
      previousDate: null,
      latest: [],
      history: [],
      total: 0
    })
  }

  const latestDate = repoHistory?.latestDate ?? builderHistory?.latestDate ?? "Pending"
  const previousDate = repoHistory?.previousDate ?? builderHistory?.previousDate ?? "Pending"
  const historyTotal = repoHistory?.total ?? builderHistory?.total ?? 0
  const statusTitle = config.mode === "preview" ? "Certification Status" : "Snapshot Status"
  const latestLabel = config.mode === "preview" ? "Latest Certificate" : "Latest Snapshot"
  const previousLabel = config.mode === "preview" ? "Previous Certificate" : "Previous Snapshot"
  const totalLabel = config.mode === "preview" ? "Certified Products" : "History Rows"

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <SiteHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.18),rgba(6,7,10,0.94)_52%,rgba(6,7,10,1))]" />
        <div className="absolute left-[-10%] top-[12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(100,122,168,0.18),transparent_64%)] blur-[140px]" />
        <div className="absolute right-[-10%] top-[4%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(112,85,132,0.18),transparent_64%)] blur-[150px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/44">{config.eyebrow}</div>
            <h1 className="mt-5 text-[clamp(2.35rem,4.8vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
              {config.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/66 md:text-lg md:leading-9">{config.description}</p>
          </div>

          <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.035] p-5 md:p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-white/40">{statusTitle}</div>
            <p className="mt-3 text-lg leading-8 text-white/72">{config.subtitle}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricCard label={latestLabel} value={latestDate} />
              <MetricCard label={previousLabel} value={previousDate} />
              <MetricCard label={totalLabel} value={formatNumber(historyTotal)} />
              <MetricCard label="Source" value={config.source} />
            </div>
          </div>
        </div>

        {config.mode === "preview" ? (
          <PreviewTable />
        ) : config.mode === "builders" ? (
          <>
            <EmptyHistoryNote />
            <BuilderHistoryTable items={builderItems} historyRows={builderHistory?.latest ?? []} />
          </>
        ) : (
          <>
            <EmptyHistoryNote />
            <RepoHistoryTable
              items={repoItems}
              historyRows={repoHistory?.latest ?? []}
              mode={config.mode}
              metricLabel={config.metricLabel}
              signal={config.signal}
            />
          </>
        )}
      </section>
    </main>
  )
}


