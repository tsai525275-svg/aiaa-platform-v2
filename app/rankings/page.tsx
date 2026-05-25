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

type RankingBlueprint = {
  label: string
  title: string
  description: string
  href: string
  trendHref?: string
  status: string
  updateFrequency: string
  rankedSubject: string
  dataSource: string
  scoringModel: string[]
  relevanceModel: string[]
  bestFor: string
  tags: string[]
}


function decodeHtmlEntities(value: string) {
  return value
    .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number.parseInt(num, 10)))
}

function cleanVisibleSummary(value: string | null | undefined) {
  if (!value) return null

  const cleaned = decodeHtmlEntities(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/<!--[\s\S]*?(-->|$)/g, " ")
    .replace(/<(script|style|picture|svg)\b[\s\S]*?(<\/\1>|$)/gi, " ")
    .replace(/<img\b[^>]*(>|$)/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<a\b[^>]*>([\s\S]*?)(<\/a>|$)/gi, "$1")
    .replace(/<[^>]*(>|$)/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/[#*_`>|~{}\[\]();=]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180)
    .replace(/\s+\S*$/, "")
    .trim()

  if (!cleaned) return null
  if (/[<>]|&(?:nbsp|ensp|emsp|lt|gt|amp);/i.test(cleaned)) return null
  return cleaned
}

const productPreviewRows: ProductPreviewRow[] = [
  { rank: "01", name: "Product Candidate 01", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "02", name: "Product Candidate 02", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "03", name: "Product Candidate 03", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "04", name: "Product Candidate 04", scope: "Agent product", status: "Pending", review: "Review pending" },
  { rank: "05", name: "Product Candidate 05", scope: "Agent product", status: "Pending", review: "Review pending" }
]

const rankingBlueprints = {
  products: {
    label: "Ranking 01",
    title: "AI Agent Product Ranking",
    description: "AIAA product ranking is the reviewed layer for commercial AI Agent products, enterprise agent systems, and production automation platforms.",
    href: "/rankings/ai-agent-products",
    status: "Preview framework",
    updateFrequency: "Manual review first, daily data later",
    rankedSubject: "AI Agent products, enterprise systems, public launches, submitted products, and verified commercial platforms.",
    dataSource: "AIAA registry submissions, product evidence, public websites, launch records, customer proof, and certification review.",
    scoringModel: ["Product maturity", "Real usage", "Automation depth", "Safety control", "Enterprise readiness", "Verification status"],
    relevanceModel: ["Must be an AI Agent product", "Must execute or coordinate tasks", "Must show product evidence", "Marketing pages alone do not count"],
    bestFor: "Companies, buyers, operators, and founders looking for trusted AI Agent products.",
    tags: ["Product maturity", "Real usage", "Automation depth", "Safety control"]
  },
  stars: {
    label: "Ranking 02",
    title: "GitHub Stars Ranking",
    description: "A public open source attention ranking based on GitHub star counts across tracked AI Agent repositories.",
    href: "/rankings/github-stars",
    trendHref: "/rankings/trends#github-stars",
    status: "Snapshot-backed",
    updateFrequency: "Daily snapshot on Vercel Cron after production deployment",
    rankedSubject: "AI Agent repositories, open source agent apps, frameworks, tools, and infrastructure projects.",
    dataSource: "GitHub public repository metadata and AIAA Supabase daily snapshots.",
    scoringModel: ["Stars", "Forks", "Open issues", "Language", "Last update", "Repository freshness"],
    relevanceModel: ["Must connect to AI Agent use cases", "General AI tools require review", "UI libraries and unrelated repos should be excluded"],
    bestFor: "Readers who want to see the most watched open source AI Agent projects.",
    tags: ["Stars", "Rank change", "Daily snapshot", "Public GitHub"]
  },
  trending: {
    label: "Ranking 03",
    title: "GitHub Trending Ranking",
    description: "A growth and momentum ranking for AI Agent repositories gaining developer attention across daily snapshots.",
    href: "/rankings/github-trending",
    trendHref: "/rankings/trends#github-trending",
    status: "Snapshot-backed",
    updateFrequency: "Daily snapshot on Vercel Cron after production deployment",
    rankedSubject: "Tracked AI Agent repositories with recent public signal movement.",
    dataSource: "GitHub public metadata, star movement, repository activity, and AIAA daily snapshot history.",
    scoringModel: ["Score change", "Rank change", "Recent star growth", "Commit activity", "Release cadence", "Contributor movement"],
    relevanceModel: ["Must have recent agent ecosystem movement", "Growth signal must come from relevant repositories", "Temporary hype needs history check"],
    bestFor: "Readers who want to know which AI Agent projects are rising now.",
    tags: ["Momentum", "Score change", "Rank change", "Daily snapshot"]
  },
  builders: {
    label: "Ranking 04",
    title: "GitHub Builders Ranking",
    description: "A public builder signal ranking for maintainers, contributors, and engineers shaping the AI Agent ecosystem.",
    href: "/rankings/github-builders",
    trendHref: "/rankings/trends#github-builders",
    status: "Snapshot-backed",
    updateFrequency: "Daily snapshot on Vercel Cron after production deployment",
    rankedSubject: "GitHub users contributing to tracked AI Agent repositories.",
    dataSource: "Public GitHub contributor metadata and AIAA builder daily snapshots.",
    scoringModel: ["Contribution volume", "Repository count", "Tracked repo impact", "Recent activity", "Builder score"],
    relevanceModel: ["Must contribute to AI Agent repositories", "General GitHub popularity is not enough", "Representative projects should be visible"],
    bestFor: "Talent discovery, contributor discovery, and future AIAA expert invitation lists.",
    tags: ["Contributions", "Builder score", "Rank change", "Daily snapshot"]
  },
  frameworks: {
    label: "Ranking 05",
    title: "Agent Framework Ranking",
    description: "A reviewed framework ranking for agent orchestration, workflow design, memory, tool calling, and agent infrastructure.",
    href: "/rankings/agent-frameworks",
    trendHref: "/rankings/trends#agent-frameworks",
    status: "Snapshot-backed with review layer",
    updateFrequency: "Daily GitHub snapshot plus AIAA relevance review",
    rankedSubject: "Agent frameworks, multi-agent frameworks, workflow builders, browser agents, memory layers, and tool calling infrastructure.",
    dataSource: "GitHub public metadata, framework documentation, adoption signals, and AIAA technical review.",
    scoringModel: ["Framework score", "Documentation", "Tool calling", "Multi-agent support", "Deployment fit", "Developer adoption"],
    relevanceModel: ["Must support agent behavior", "Plain LLM libraries need review", "Workflow tools need agent relevance evidence"],
    bestFor: "Developers, founders, and enterprises choosing an AI Agent build stack.",
    tags: ["Framework score", "Agent architecture", "Rank change", "Daily snapshot"]
  }
} satisfies Record<string, RankingBlueprint>

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

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.45rem] border border-white/12 bg-white/[0.03] p-5">
      <div className="text-[10px] uppercase tracking-[0.28em] text-white/42">{label}</div>
      <div className="mt-3 text-sm leading-6 text-white/72">{children}</div>
    </div>
  )
}

function BlueprintGrid({ blueprint }: { blueprint: RankingBlueprint }) {
  return (
    <div className="mt-8 grid gap-3 lg:grid-cols-4">
      <FieldBlock label="Ranked subject">{blueprint.rankedSubject}</FieldBlock>
      <FieldBlock label="Data source">{blueprint.dataSource}</FieldBlock>
      <FieldBlock label="Update frequency">{blueprint.updateFrequency}</FieldBlock>
      <FieldBlock label="Best for">{blueprint.bestFor}</FieldBlock>
    </div>
  )
}

function MethodologyGrid({ blueprint }: { blueprint: RankingBlueprint }) {
  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-2">
      <div className="rounded-[1.45rem] border border-white/12 bg-white/[0.025] p-5">
        <div className="text-[10px] uppercase tracking-[0.28em] text-white/42">Scoring fields</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {blueprint.scoringModel.map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/74">{item}</span>
          ))}
        </div>
      </div>

      <div className="rounded-[1.45rem] border border-white/12 bg-white/[0.025] p-5">
        <div className="text-[10px] uppercase tracking-[0.28em] text-white/42">Relevance filter</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {blueprint.relevanceModel.map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/74">{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmptyTableState({ label }: { label: string }) {
  return (
    <div className="rounded-b-[2rem] border-t border-white/10 px-6 py-8 text-sm text-white/52">
      No {label} snapshot rows are available yet. Run the GitHub snapshot route after Supabase and production Cron are configured.
    </div>
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

      {rows.length ? rows.slice(0, 5).map((row) => (
        <div key={`${row.ranking_key}-${row.repo_full_name}`} className="grid grid-cols-[70px_1fr_130px_130px_140px] items-center border-b border-white/10 px-6 py-5 last:border-b-0 max-lg:grid-cols-[52px_1fr_110px]">
          <div className="text-2xl font-semibold text-white">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-4">
            <Avatar src={row.owner_avatar_url} label={row.repo_name} />
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-white">{row.repo_name}</div>
              <div className="truncate text-sm text-white/45">{row.repo_full_name}</div>
              {(() => {
                const summary = cleanVisibleSummary(row.summary)
                return summary ? <div className="mt-1 truncate text-xs text-white/42">{summary}</div> : null
              })()}
            </div>
          </div>
          <div className="text-lg font-semibold text-white">{formatNumber(metric === "stars" ? row.stars : row.score)}</div>
          <div className="max-lg:hidden"><DeltaBadge value={row.rank_change} kind="rank" /></div>
          <div className="max-lg:hidden"><DeltaBadge value={metric === "stars" ? row.stars_change : row.score_change} /></div>
        </div>
      )) : <EmptyTableState label="repository" />}
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

      {rows.length ? rows.slice(0, 5).map((row) => (
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
      )) : <EmptyTableState label="builder" />}
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

function HubCard({ blueprint }: { blueprint: RankingBlueprint }) {
  return (
    <Link href={blueprint.href} className="group flex min-h-[292px] flex-col rounded-[2rem] border border-white/14 bg-white/[0.025] p-6 transition hover:border-white/32 hover:bg-white/[0.045]">
      <div className="flex flex-col items-start gap-3">
        <div className="text-[11px] uppercase tracking-[0.34em] text-white/45">{blueprint.label}</div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/52">{blueprint.status}</div>
      </div>
      <div className="mt-7 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{blueprint.title}</div>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/60">{blueprint.rankedSubject}</p>
      <div className="mt-auto pt-7 text-sm font-semibold text-white/72 transition group-hover:text-white">Open ranking →</div>
    </Link>
  )
}

function RankingPanel({
  blueprint,
  meta,
  children
}: {
  blueprint: RankingBlueprint
  meta?: SnapshotMeta
  children: React.ReactNode
}) {
  return (
    <section id={blueprint.href.split("/").pop()} className="scroll-mt-52 rounded-[2.3rem] border border-white/25 bg-white/[0.025] px-8 pb-8 pt-14 shadow-[0_28px_100px_rgba(0,0,0,0.3)] lg:px-12 lg:pb-12 lg:pt-16">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[12px] uppercase tracking-[0.36em] text-white/70">{blueprint.label}</div>
            <div className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/52">{blueprint.status}</div>
          </div>
          <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-white md:text-6xl">{blueprint.title}</h2>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">{blueprint.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {blueprint.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-white/80">{tag}</span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href={blueprint.href} className="rounded-full bg-white px-7 py-4 text-base font-semibold text-black transition hover:bg-white/82">
            View Full Ranking
          </Link>
          {blueprint.trendHref ? (
            <Link href={blueprint.trendHref} className="rounded-full border border-white/30 bg-white/[0.04] px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10">
              View Trends
            </Link>
          ) : null}
        </div>
      </div>

      <BlueprintGrid blueprint={blueprint} />
      <MethodologyGrid blueprint={blueprint} />
      {meta ? <SnapshotStats meta={meta} /> : null}

      <div className="mt-12">{children}</div>
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
    <main data-rankings-page className="min-h-screen bg-[#030406] text-white">
      <style>{`
        main[data-rankings-page] > header {
          position: sticky !important;
          top: 1rem !important;
        }
        main[data-rankings-page] section[id] {
          scroll-margin-top: 180px;
        }
      `}</style>
      <SiteHeader />

      <section className="mx-auto max-w-[1840px] px-5 pb-28 pt-10 md:px-12 md:pt-12">
        <div className="rounded-[2.6rem] border border-white/20 bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] p-8 md:p-14">
          <div className="text-[12px] uppercase tracking-[0.38em] text-white/58">AIAA ranking hub</div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.08em] text-white md:text-8xl">
                The index layer for the AI Agent economy.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-8 text-white/72">
                AIAA tracks products, repositories, builders, frameworks, and public signal history so the AI Agent ecosystem has a visible ranking surface.
              </p>
            </div>
            <Link href="/rankings/trends" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-5 text-lg font-semibold text-black transition hover:bg-white/82">
              View Trend Charts
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Stat label="Rankings live" value="5" />
            <Stat label="Snapshot source" value="GitHub" />
            <Stat label="Trust layer" value="AIAA review" />
          </div>
        </div>

        <div className="mt-20 scroll-mt-56 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <HubCard blueprint={rankingBlueprints.products} />
          <HubCard blueprint={rankingBlueprints.stars} />
          <HubCard blueprint={rankingBlueprints.trending} />
          <HubCard blueprint={rankingBlueprints.builders} />
          <HubCard blueprint={rankingBlueprints.frameworks} />
        </div>

        <div className="mt-20 scroll-mt-56 rounded-[2.2rem] border border-white/14 bg-white/[0.02] p-7 md:p-9">
          <div className="text-[11px] uppercase tracking-[0.36em] text-white/42">Ranking doctrine</div>
          <div className="mt-5 grid gap-5 text-sm leading-7 text-white/65 lg:grid-cols-3">
            <p>Public popularity is only one signal. AIAA separates stars, growth, builders, frameworks, and product review so each ranking has a clear purpose.</p>
            <p>Every ranking needs a relevance layer. Agent tools, general AI libraries, workflow products, and commercial products should not be mixed into one list.</p>
            <p>The private AIAA certified ranking will become the strongest asset after registry, certification, benchmark, and review data accumulate.</p>
          </div>
        </div>

        <div className="mt-20 grid gap-20">
          <RankingPanel blueprint={rankingBlueprints.products}>
            <ProductMiniTable />
          </RankingPanel>

          <RankingPanel
            blueprint={rankingBlueprints.stars}
            meta={{ latestDate: starsHistory.latestDate, previousDate: starsHistory.previousDate, total: starsHistory.total }}
          >
            <RepoMiniTable rows={starsHistory.latest ?? []} metric="stars" />
          </RankingPanel>

          <RankingPanel
            blueprint={rankingBlueprints.trending}
            meta={{ latestDate: trendingHistory.latestDate, previousDate: trendingHistory.previousDate, total: trendingHistory.total }}
          >
            <RepoMiniTable rows={trendingHistory.latest ?? []} metric="score" />
          </RankingPanel>

          <RankingPanel
            blueprint={rankingBlueprints.builders}
            meta={{ latestDate: builderHistory.latestDate, previousDate: builderHistory.previousDate, total: builderHistory.total }}
          >
            <BuilderMiniTable rows={builderHistory.latest ?? []} />
          </RankingPanel>

          <RankingPanel
            blueprint={rankingBlueprints.frameworks}
            meta={{ latestDate: frameworkHistory.latestDate, previousDate: frameworkHistory.previousDate, total: frameworkHistory.total }}
          >
            <RepoMiniTable rows={frameworkHistory.latest ?? []} metric="score" />
          </RankingPanel>
        </div>
      </section>
    </main>
  )
}
