import { SiteHeader } from "@/components/site-header"
import { headers } from "next/headers"
import type { ReactNode } from "react"

export const dynamic = "force-dynamic"
export const revalidate = 300

type RepoHistoryItem = {
  snapshot_date: string
  ranking_key: string
  rank: string
  repo_id: number | null
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

type HistoryResponse<T> = {
  ok: boolean
  type: string
  rankingKey?: string
  days: number
  total: number
  latestDate: string | null
  previousDate: string | null
  latest: T[]
  history: T[]
  error?: string
}

type SnapshotMeta = {
  latestDate: string | null
  previousDate: string | null
  total: number
}

const productPreviewRows = Array.from({ length: 5 }, (_, index) => ({
  rank: String(index + 1).padStart(2, "0"),
  name: `Candidate ${String(index + 1).padStart(2, "0")}`,
  status: "Pending",
  signal: "Certification review"
}))

async function getBaseUrl() {
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  const protocol = headerStore.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https")

  if (!host) return "http://localhost:3000"

  return `${protocol}://${host}`
}

async function fetchHistory<T>(path: string): Promise<HistoryResponse<T>> {
  try {
    const baseUrl = process.env.SITE_URL ?? await getBaseUrl()
    const response = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "AIAA Rankings Overview"
      }
    })

    if (!response.ok) {
      return {
        ok: false,
        type: "error",
        days: 30,
        total: 0,
        latestDate: null,
        previousDate: null,
        latest: [],
        history: [],
        error: `${path} failed with ${response.status}`
      }
    }

    return await response.json() as HistoryResponse<T>
  } catch (error) {
    return {
      ok: false,
      type: "error",
      days: 30,
      total: 0,
      latestDate: null,
      previousDate: null,
      latest: [],
      history: [],
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0)
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Pending"
  return value
}

function deltaText(value: number | null | undefined, kind: "rank" | "number") {
  if (value === null || value === undefined) return "Pending"
  if (value === 0) return "0"

  const prefix = value > 0 ? "+" : ""

  if (kind === "rank") {
    return value > 0 ? `▲ ${prefix}${value}` : `▼ ${value}`
  }

  return `${prefix}${formatNumber(value)}`
}

function DeltaBadge({ value, kind = "number" }: { value: number | null | undefined; kind?: "rank" | "number" }) {
  const positive = (value ?? 0) > 0
  const negative = (value ?? 0) < 0

  return (
    <span className={`inline-flex min-w-[4.6rem] justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
      positive
        ? "border-emerald-300/24 bg-emerald-300/[0.10] text-emerald-100"
        : negative
          ? "border-rose-300/24 bg-rose-300/[0.10] text-rose-100"
          : "border-white/10 bg-white/[0.04] text-white/55"
    }`}>
      {deltaText(value, kind)}
    </span>
  )
}

function SnapshotStats({ meta }: { meta: SnapshotMeta }) {
  return (
    <div className="mt-6 grid gap-2 sm:grid-cols-3">
      <Stat label="Latest Snapshot" value={formatDate(meta.latestDate)} />
      <Stat label="Previous Snapshot" value={formatDate(meta.previousDate)} />
      <Stat label="History Rows" value={formatNumber(meta.total)} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/16 px-4 py-3">
      <div className="text-[0.62rem] uppercase tracking-[0.22em] text-white/38">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/86">{value}</div>
    </div>
  )
}

function RepoMiniTable({ rows, metric }: { rows: RepoHistoryItem[]; metric: "stars" | "score" }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/10">
      <div className="grid grid-cols-[0.42fr_1.55fr_0.7fr_0.65fr] gap-3 border-b border-white/14 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/40 md:grid-cols-[0.42fr_1.55fr_0.7fr_0.65fr_0.72fr]">
        <div>Rank</div>
        <div>Repository</div>
        <div>{metric === "stars" ? "Stars" : "Score"}</div>
        <div>Rank Δ</div>
        <div className="hidden md:block">{metric === "stars" ? "Stars Δ" : "Score Δ"}</div>
      </div>
      {rows.slice(0, 5).map((row) => (
        <div key={`${row.ranking_key}-${row.repo_full_name}`} className="grid grid-cols-[0.42fr_1.55fr_0.7fr_0.65fr] gap-3 border-b border-white/8 px-4 py-3 last:border-b-0 md:grid-cols-[0.42fr_1.55fr_0.7fr_0.65fr_0.72fr]">
          <div className="text-base font-semibold text-white/82">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-3">
            <img src={row.owner_avatar_url ?? ""} alt="" className="h-8 w-8 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{row.repo_name}</div>
              <div className="truncate text-xs text-white/40">{row.repo_full_name}</div>
            </div>
          </div>
          <div className="text-sm font-semibold text-white">{formatNumber(metric === "stars" ? row.stars : row.score)}</div>
          <div><DeltaBadge value={row.rank_change} kind="rank" /></div>
          <div className="hidden md:block"><DeltaBadge value={metric === "stars" ? row.stars_change : row.score_change} /></div>
        </div>
      ))}
    </div>
  )
}

function BuilderMiniTable({ rows }: { rows: BuilderHistoryItem[] }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/10">
      <div className="grid grid-cols-[0.42fr_1.45fr_0.78fr_0.65fr] gap-3 border-b border-white/14 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/40 md:grid-cols-[0.42fr_1.45fr_0.78fr_0.65fr_0.72fr]">
        <div>Rank</div>
        <div>Builder</div>
        <div>Score</div>
        <div>Rank Δ</div>
        <div className="hidden md:block">Score Δ</div>
      </div>
      {rows.slice(0, 5).map((row) => (
        <div key={row.login} className="grid grid-cols-[0.42fr_1.45fr_0.78fr_0.65fr] gap-3 border-b border-white/8 px-4 py-3 last:border-b-0 md:grid-cols-[0.42fr_1.45fr_0.78fr_0.65fr_0.72fr]">
          <div className="text-base font-semibold text-white/82">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-3">
            <img src={row.avatar_url ?? ""} alt="" className="h-8 w-8 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{row.login}</div>
              <div className="truncate text-xs text-white/40">{formatNumber(row.total_contributions)} contributions</div>
            </div>
          </div>
          <div className="text-sm font-semibold text-white">{formatNumber(row.builder_score)}</div>
          <div><DeltaBadge value={row.rank_change} kind="rank" /></div>
          <div className="hidden md:block"><DeltaBadge value={row.builder_score_change} /></div>
        </div>
      ))}
    </div>
  )
}

function ProductMiniTable() {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/10">
      <div className="grid grid-cols-[0.42fr_1.35fr_0.8fr_0.9fr] gap-3 border-b border-white/14 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/40">
        <div>Rank</div>
        <div>Name</div>
        <div>Status</div>
        <div>Signal</div>
      </div>
      {productPreviewRows.map((row) => (
        <div key={row.rank} className="grid grid-cols-[0.42fr_1.35fr_0.8fr_0.9fr] gap-3 border-b border-white/8 px-4 py-3 last:border-b-0">
          <div className="text-base font-semibold text-white/82">{row.rank}</div>
          <div className="text-sm font-medium text-white">Product {row.name}</div>
          <div><span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/60">{row.status}</span></div>
          <div className="text-sm text-white/60">{row.signal}</div>
        </div>
      ))}
    </div>
  )
}

function RankingCard({
  eyebrow,
  title,
  description,
  tags,
  href,
  meta,
  children
}: {
  eyebrow: string
  title: string
  description: string
  tags: string[]
  href: string
  meta?: SnapshotMeta
  children: ReactNode
}) {
  return (
    <section className="rounded-[2rem] border border-white/8 bg-white/[0.035] p-5 md:p-7">
      <div className="grid gap-7 lg:grid-cols-[0.62fr_1.38fr] lg:items-center">
        <div>
          <div className="text-[0.7rem] uppercase tracking-[0.3em] text-white/42">{eyebrow}</div>
          <h2 className="mt-4 max-w-xl text-[clamp(2.25rem,4vw,4.15rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
            {title}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/68 md:text-lg">{description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5 text-sm text-white/66">
                {tag}
              </span>
            ))}
          </div>
          {meta ? <SnapshotStats meta={meta} /> : null}
          <a href={href} className="mt-7 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.02]">
            View Full Ranking →
          </a>
        </div>
        {children}
      </div>
    </section>
  )
}

export default async function RankingsPage() {
  const [starsHistory, trendingHistory, builderHistory, frameworkHistory] = await Promise.all([
    fetchHistory<RepoHistoryItem>("/api/snapshots/github/history?rankingKey=github-stars"),
    fetchHistory<RepoHistoryItem>("/api/snapshots/github/history?rankingKey=github-trending"),
    fetchHistory<BuilderHistoryItem>("/api/snapshots/github/history?type=builder"),
    fetchHistory<RepoHistoryItem>("/api/snapshots/github/history?rankingKey=agent-frameworks")
  ])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <SiteHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.18),rgba(6,7,10,0.94)_52%,rgba(6,7,10,1))]" />
        <div className="absolute left-[-10%] top-[12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(100,122,168,0.18),transparent_64%)] blur-[140px]" />
        <div className="absolute right-[-10%] top-[4%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(112,85,132,0.18),transparent_64%)] blur-[150px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-8 md:pb-32 md:pt-44">
        <div className="mx-auto max-w-5xl text-center">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/44">AIAA Rankings</div>
          <h1 className="mt-5 text-[clamp(3rem,6.4vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
            Ranking framework for the AI Agent economy.
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/66 md:text-xl md:leading-9">
            AIAA tracks agent products, open source repositories, GitHub builders, and agent frameworks with daily snapshot history.
          </p>
        </div>

        <div className="mt-14 space-y-7">
          <RankingCard
            eyebrow="Ranking 01"
            title="AI Agent Product Ranking"
            description="A public preview framework for AI Agent products. Formal product ranking will come from the certification review system."
            tags={["Product maturity", "Real usage", "Automation depth", "Safety control"]}
            href="/rankings/ai-agent-products"
          >
            <ProductMiniTable />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 02"
            title="GitHub Stars Ranking"
            description="A repository ranking based on public GitHub star counts and AIAA daily snapshots."
            tags={["Stars", "Rank change", "Daily snapshot", "Public GitHub"]}
            href="/rankings/github-stars"
            meta={{ latestDate: starsHistory.latestDate, previousDate: starsHistory.previousDate, total: starsHistory.total }}
          >
            <RepoMiniTable rows={starsHistory.latest ?? []} metric="stars" />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 03"
            title="GitHub Trending Ranking"
            description="A momentum ranking based on daily snapshot score changes across tracked AI Agent repositories."
            tags={["Momentum", "Score change", "Rank change", "Daily snapshot"]}
            href="/rankings/github-trending"
            meta={{ latestDate: trendingHistory.latestDate, previousDate: trendingHistory.previousDate, total: trendingHistory.total }}
          >
            <RepoMiniTable rows={trendingHistory.latest ?? []} metric="score" />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 04"
            title="GitHub Builders Ranking"
            description="A builder ranking based on public GitHub contributor metadata and daily contribution snapshots."
            tags={["Contributions", "Builder score", "Rank change", "Daily snapshot"]}
            href="/rankings/github-builders"
            meta={{ latestDate: builderHistory.latestDate, previousDate: builderHistory.previousDate, total: builderHistory.total }}
          >
            <BuilderMiniTable rows={builderHistory.latest ?? []} />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 05"
            title="Agent Framework Ranking"
            description="A reviewed framework ranking based on agent architecture, developer tooling, public GitHub signal, and daily snapshots."
            tags={["Framework score", "Agent architecture", "Rank change", "Daily snapshot"]}
            href="/rankings/agent-frameworks"
            meta={{ latestDate: frameworkHistory.latestDate, previousDate: frameworkHistory.previousDate, total: frameworkHistory.total }}
          >
            <RepoMiniTable rows={frameworkHistory.latest ?? []} metric="score" />
          </RankingCard>
        </div>
      </section>
    </main>
  )
}
