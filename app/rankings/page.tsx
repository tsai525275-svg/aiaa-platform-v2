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

type HistoryResponse<T> = {
  ok: boolean
  type: string
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

type ProductPreviewRow = {
  rank: string
  name: string
  scope: string
  status: string
  review: string
}

const productPreviewRows: ProductPreviewRow[] = [
  { rank: "01", name: "Product Candidate 01", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "02", name: "Product Candidate 02", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "03", name: "Product Candidate 03", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "04", name: "Product Candidate 04", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "05", name: "Product Candidate 05", scope: "Agent product", status: "Pending", review: "Review pending" }
]

async function getBaseUrl() {
  const requestHeaders = await headers()
  const host = requestHeaders.get("host")
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https")

  if (host) {
    return `${protocol}://${host}`
  }

  return process.env.SITE_URL ?? "http://localhost:3000"
}

async function fetchHistory<T>(baseUrl: string, path: string): Promise<HistoryResponse<T>> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    })

    if (!response.ok) {
      return {
        ok: false,
        type: "unknown",
        days: 0,
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
      type: "unknown",
      days: 0,
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
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US").format(value)
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Pending"
  }

  return value
}

function deltaLabel(value: number | null | undefined, kind: "rank" | "metric" = "metric") {
  if (value === null || value === undefined || Number.isNaN(value) || value === 0) {
    return kind === "rank" ? "0" : "0"
  }

  if (value > 0) {
    return kind === "rank" ? `▲ ${value}` : `+${formatNumber(value)}`
  }

  return kind === "rank" ? `▼ ${Math.abs(value)}` : formatNumber(value)
}

function deltaTone(value: number | null | undefined) {
  if (!value) {
    return "border-white/10 bg-white/[0.035] text-white/60"
  }

  if (value > 0) {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
  }

  return "border-rose-400/25 bg-rose-400/10 text-rose-200"
}

function Avatar({ src, label }: { src?: string | null; label: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/[0.045] text-sm font-semibold text-white">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        label.slice(0, 2).toUpperCase()
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/[0.035] p-5">
      <div className="text-[11px] uppercase tracking-[0.34em] text-white/55">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

function SnapshotStats({ meta }: { meta: SnapshotMeta }) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      <Stat label="Latest Snapshot" value={formatDate(meta.latestDate)} />
      <Stat label="Previous Snapshot" value={formatDate(meta.previousDate)} />
      <Stat label="History Rows" value={formatNumber(meta.total)} />
    </div>
  )
}

function DeltaBadge({ value, kind = "metric" }: { value?: number | null; kind?: "rank" | "metric" }) {
  return (
    <span className={`inline-flex min-w-20 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold ${deltaTone(value)}`}>
      {deltaLabel(value, kind)}
    </span>
  )
}

function RepoMiniTable({ rows, metric }: { rows: RepoHistoryItem[]; metric: "stars" | "score" }) {
  return (
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/20">
      <div className="grid grid-cols-[70px_1fr_130px_130px_140px] border-b border-white/20 px-6 py-4 text-[11px] uppercase tracking-[0.32em] text-white/55 max-lg:grid-cols-[52px_1fr_110px]">
        <div>Rank</div>
        <div>Repository</div>
        <div>Today</div>
        <div className="max-lg:hidden">Rank Δ</div>
        <div className="max-lg:hidden">{metric === "stars" ? "Stars Δ" : "Score Δ"}</div>
      </div>

      {rows.slice(0, 5).map((row) => (
        <div key={`${row.ranking_key}-${row.repo_full_name}`} className="grid grid-cols-[70px_1fr_130px_130px_140px] items-center border-b border-white/10 px-6 py-5 last:border-b-0 max-lg:grid-cols-[52px_1fr_110px]">
          <div className="text-2xl font-semibold text-white">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-4">
            <Avatar src={row.owner_avatar_url} label={row.repo_name} />
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-white">{row.repo_name}</div>
              <div className="truncate text-sm text-white/45">{row.repo_full_name}</div>
            </div>
          </div>
          <div className="text-lg font-semibold text-white">{formatNumber(metric === "stars" ? row.stars : row.score)}</div>
          <div className="max-lg:hidden"><DeltaBadge value={row.rank_change} kind="rank" /></div>
          <div className="max-lg:hidden"><DeltaBadge value={metric === "stars" ? row.stars_change : row.score_change} /></div>
        </div>
      ))}
    </div>
  )
}

function BuilderMiniTable({ rows }: { rows: BuilderHistoryItem[] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/20">
      <div className="grid grid-cols-[70px_1fr_130px_130px_140px] border-b border-white/20 px-6 py-4 text-[11px] uppercase tracking-[0.32em] text-white/55 max-lg:grid-cols-[52px_1fr_110px]">
        <div>Rank</div>
        <div>Builder</div>
        <div>Today</div>
        <div className="max-lg:hidden">Rank Δ</div>
        <div className="max-lg:hidden">Score Δ</div>
      </div>

      {rows.slice(0, 5).map((row) => (
        <div key={row.login} className="grid grid-cols-[70px_1fr_130px_130px_140px] items-center border-b border-white/10 px-6 py-5 last:border-b-0 max-lg:grid-cols-[52px_1fr_110px]">
          <div className="text-2xl font-semibold text-white">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-4">
            <Avatar src={row.avatar_url} label={row.login} />
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-white">{row.login}</div>
              <div className="truncate text-sm text-white/45">{formatNumber(row.total_contributions)} contributions</div>
            </div>
          </div>
          <div className="text-lg font-semibold text-white">{formatNumber(row.builder_score)}</div>
          <div className="max-lg:hidden"><DeltaBadge value={row.rank_change} kind="rank" /></div>
          <div className="max-lg:hidden"><DeltaBadge value={row.builder_score_change} /></div>
        </div>
      ))}
    </div>
  )
}

function ProductMiniTable() {
  return (
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/20">
      <div className="grid grid-cols-[70px_1fr_180px_180px] border-b border-white/20 px-6 py-4 text-[11px] uppercase tracking-[0.32em] text-white/55 max-lg:grid-cols-[52px_1fr_120px]">
        <div>Rank</div>
        <div>Product</div>
        <div>Signal</div>
        <div className="max-lg:hidden">Review</div>
      </div>

      {productPreviewRows.map((row) => (
        <div key={row.rank} className="grid grid-cols-[70px_1fr_180px_180px] items-center border-b border-white/10 px-6 py-5 last:border-b-0 max-lg:grid-cols-[52px_1fr_120px]">
          <div className="text-2xl font-semibold text-white">{row.rank}</div>
          <div>
            <div className="text-lg font-semibold text-white">{row.name}</div>
            <div className="text-sm text-white/45">{row.scope}</div>
          </div>
          <div><span className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70">{row.status}</span></div>
          <div className="text-sm text-white/45 max-lg:hidden">{row.review}</div>
        </div>
      ))}
    </div>
  )
}

function RankingPanel({
  label,
  title,
  description,
  tags,
  href,
  trendHref,
  meta,
  children
}: {
  label: string
  title: string
  description: string
  tags: string[]
  href: string
  trendHref?: string
  meta?: SnapshotMeta
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-36 rounded-[2.3rem] border border-white/25 bg-white/[0.025] p-8 shadow-[0_28px_100px_rgba(0,0,0,0.3)] lg:p-12">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <div className="text-[12px] uppercase tracking-[0.36em] text-white/70">{label}</div>
          <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-white md:text-6xl">{title}</h2>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">{description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-white/80">{tag}</span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href={href} className="rounded-full bg-white px-7 py-4 text-base font-semibold text-black transition hover:bg-white/82">
            View Full Ranking
          </Link>
          {trendHref ? (
            <Link href={trendHref} className="rounded-full border border-white/30 bg-white/[0.04] px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10">
              View Trends
            </Link>
          ) : null}
        </div>
      </div>

      {meta ? <SnapshotStats meta={meta} /> : null}

      <div className="mt-10">{children}</div>
    </section>
  )
}


export default async function RankingsPage() {
  const baseUrl = await getBaseUrl()

  const [starsHistory, trendingHistory, builderHistory, frameworkHistory] = await Promise.all([
    fetchHistory<RepoHistoryItem>(baseUrl, "/api/snapshots/github/history?rankingKey=github-stars"),
    fetchHistory<RepoHistoryItem>(baseUrl, "/api/snapshots/github/history?rankingKey=github-trending"),
    fetchHistory<BuilderHistoryItem>(baseUrl, "/api/snapshots/github/history?type=builder"),
    fetchHistory<RepoHistoryItem>(baseUrl, "/api/snapshots/github/history?rankingKey=agent-frameworks")
  ])

  return (
    <main className="min-h-screen bg-[#030406] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-[1840px] px-5 pb-24 pt-36 md:px-12">
        <div className="rounded-[2.6rem] border border-white/20 bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] p-8 md:p-14">
          <div className="text-[12px] uppercase tracking-[0.38em] text-white/58">AIAA ranking system</div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.08em] text-white md:text-8xl">
                Live rankings for the AI Agent economy.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-8 text-white/72">
                AIAA tracks agent products, open source repositories, GitHub builders, and agent frameworks with daily snapshot history.
              </p>
            </div>
            <Link href="/rankings/trends" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-5 text-lg font-semibold text-black transition hover:bg-white/82">
              View Trend Charts
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8">
          <RankingPanel
            label="Ranking 01"
            title="AI Agent Product Ranking"
            description="A public preview framework for AI Agent products. Full product scoring will open after reviewed submissions begin."
            tags={["Product maturity", "Real usage", "Automation depth", "Safety control"]}
            href="/rankings/ai-agent-products"
          >
            <ProductMiniTable />
          </RankingPanel>

          <RankingPanel
            label="Ranking 02"
            title="GitHub Stars Ranking"
            description="A repository ranking based on public GitHub star counts and AIAA daily snapshots."
            tags={["Stars", "Rank change", "Daily snapshot", "Public GitHub"]}
            href="/rankings/github-stars"
            trendHref="/rankings/trends#github-stars"
            meta={{ latestDate: starsHistory.latestDate, previousDate: starsHistory.previousDate, total: starsHistory.total }}
          >
            <RepoMiniTable rows={starsHistory.latest ?? []} metric="stars" />
          </RankingPanel>

          <RankingPanel
            label="Ranking 03"
            title="GitHub Trending Ranking"
            description="A momentum ranking based on daily snapshot score changes across tracked AI Agent repositories."
            tags={["Momentum", "Score change", "Rank change", "Daily snapshot"]}
            href="/rankings/github-trending"
            trendHref="/rankings/trends#github-trending"
            meta={{ latestDate: trendingHistory.latestDate, previousDate: trendingHistory.previousDate, total: trendingHistory.total }}
          >
            <RepoMiniTable rows={trendingHistory.latest ?? []} metric="score" />
          </RankingPanel>

          <RankingPanel
            label="Ranking 04"
            title="GitHub Builders Ranking"
            description="A builder ranking based on public GitHub contributor metadata and daily contribution snapshots."
            tags={["Contributions", "Builder score", "Rank change", "Daily snapshot"]}
            href="/rankings/github-builders"
            trendHref="/rankings/trends#github-builders"
            meta={{ latestDate: builderHistory.latestDate, previousDate: builderHistory.previousDate, total: builderHistory.total }}
          >
            <BuilderMiniTable rows={builderHistory.latest ?? []} />
          </RankingPanel>

          <RankingPanel
            label="Ranking 05"
            title="Agent Framework Ranking"
            description="A reviewed framework ranking based on agent architecture, developer tooling, public GitHub signal, and daily snapshots."
            tags={["Framework score", "Agent architecture", "Rank change", "Daily snapshot"]}
            href="/rankings/agent-frameworks"
            trendHref="/rankings/trends#agent-frameworks"
            meta={{ latestDate: frameworkHistory.latestDate, previousDate: frameworkHistory.previousDate, total: frameworkHistory.total }}
          >
            <RepoMiniTable rows={frameworkHistory.latest ?? []} metric="score" />
          </RankingPanel>
        </div>
      </section>
    </main>
  )
}
