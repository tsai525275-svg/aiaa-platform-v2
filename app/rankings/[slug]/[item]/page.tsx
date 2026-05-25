import type { ReactNode } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 300

const rankingConfigs = {
  "ai-agent-products": {
    title: "AI Agent Product Ranking",
    itemLabel: "Product profile",
    apiPath: null,
    mode: "preview"
  },
  "github-stars": {
    title: "GitHub Stars Ranking",
    itemLabel: "Repository profile",
    apiPath: "/api/github/repos",
    mode: "repo"
  },
  "github-trending": {
    title: "GitHub Trending Ranking",
    itemLabel: "Momentum profile",
    apiPath: "/api/github/trending",
    mode: "repo"
  },
  "github-builders": {
    title: "GitHub Builders Ranking",
    itemLabel: "Builder profile",
    apiPath: "/api/github/builders",
    mode: "builder"
  },
  "agent-frameworks": {
    title: "Agent Framework Ranking",
    itemLabel: "Framework profile",
    apiPath: "/api/github/frameworks",
    mode: "repo"
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

type PreviewRow = {
  rank: string
  name: string
  level: string
  category: string
  signal: string
  score: string
  slug: string
  summary: string
  capabilities: string[]
  bestFor: string
  evidence: string
}

type ApiListResponse<T> = {
  results: T[]
  total?: number
}


type ItemProfileRow = {
  ranking_key: string
  item_slug: string
  item_type: string
  name: string
  full_name: string | null
  external_url: string | null
  avatar_url: string | null
  rank: string | null
  summary: string | null
  what_it_does: string | null
  why_ranked: string | null
  capabilities: string[] | null
  best_for: string | null
  source_url: string | null
  stars: number | null
  forks: number | null
  open_issues: number | null
  language: string | null
  pushed_at: string | null
  updated_at: string | null
  last_refreshed_at: string | null
}

const previewRows: PreviewRow[] = [
  {
    rank: "01",
    name: "Certification Candidate 01",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending",
    slug: "certification-candidate-01",
    summary: "A pending AIAA certification profile for an AI Agent product. This page will store application evidence, assessment notes, verification status, certificate level, and certification history.",
    capabilities: ["Application review", "Capability assessment", "Certificate status", "Public registry linkage"],
    bestFor: "Buyers and operators checking whether a commercial AI Agent product has passed AIAA certification.",
    evidence: "AIAA certification application, ownership verification, product evidence, benchmark evidence, exam or assessment result, and certificate record."
  },
  {
    rank: "02",
    name: "Certification Candidate 02",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending",
    slug: "certification-candidate-02",
    summary: "A pending AIAA certification profile for a production AI Agent platform.",
    capabilities: ["Workflow deployment review", "Agent orchestration review", "Operational evidence", "Production monitoring review"],
    bestFor: "Companies checking certified production-ready AI Agent platforms.",
    evidence: "Product documentation, platform demo, customer proof, production usage, exam or assessment result, and review checklist."
  },
  {
    rank: "03",
    name: "Certification Candidate 03",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending",
    slug: "certification-candidate-03",
    summary: "A pending AIAA certification profile for an autonomous workflow system that coordinates tasks, tools, memory, and execution logic.",
    capabilities: ["Task routing review", "Tool calling review", "Workflow execution review", "Failure handling review"],
    bestFor: "Operators checking certified agent systems for repeatable business workflows.",
    evidence: "Workflow evidence, logs, benchmark output, human handoff design, reliability review, and certificate record."
  },
  {
    rank: "04",
    name: "Certification Candidate 04",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending",
    slug: "certification-candidate-04",
    summary: "A pending AIAA certification profile for an enterprise AI Agent stack covering governance, integrations, access control, and deployment.",
    capabilities: ["Enterprise integration review", "Access control review", "Audit trail review", "Safety policy review"],
    bestFor: "Enterprise teams checking certified AI Agent infrastructure vendors.",
    evidence: "Company review, security documents, deployment proof, user controls, compliance notes, and certificate record."
  },
  {
    rank: "05",
    name: "Certification Candidate 05",
    level: "Pending",
    category: "AIAA Certification",
    signal: "Awaiting certificate",
    score: "Pending",
    slug: "certification-candidate-05",
    summary: "A pending AIAA certification profile for infrastructure products that support AI Agent execution, memory, evaluation, observability, or tool access.",
    capabilities: ["Agent infrastructure review", "Monitoring review", "Evaluation review", "Tool integration review"],
    bestFor: "Teams checking certified infrastructure components for agent systems.",
    evidence: "Certification application, technical documentation, integration proof, assessment result, and AIAA certificate record."
  }
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0)
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Pending"
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(value))
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
      "User-Agent": "AIAA Ranking Detail Page"
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

async function fetchItemProfile(rankingKey: string, itemSlug: string) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "")
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return null

  try {
    const query = [
      "select=*",
      `ranking_key=eq.${encodeURIComponent(rankingKey)}`,
      `item_slug=eq.${encodeURIComponent(itemSlug)}`,
      "limit=1"
    ].join("&")

    const response = await fetch(`${supabaseUrl}/rest/v1/ranking_item_profiles?${query}`, {
      cache: "no-store",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept: "application/json"
      }
    })

    if (!response.ok) return null

    const rows = await response.json() as ItemProfileRow[]
    return rows[0] ?? null
  } catch {
    return null
  }
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-white/10 py-4 md:grid-cols-[13rem_1fr] md:items-start">
      <div className="text-[0.68rem] uppercase tracking-[0.22em] text-white/40">{label}</div>
      <div className="text-lg font-semibold leading-7 text-white">{value}</div>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-white/10 py-8">
      <h2 className="text-[0.76rem] uppercase tracking-[0.26em] text-white/42">{title}</h2>
      <div className="mt-4 max-w-5xl text-lg leading-9 text-white/76">{children}</div>
    </section>
  )
}

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-0">
      {items.map((item) => (
        <li key={item} className="border-b border-white/10 py-3 text-white/76 last:border-b-0">
          {item}
        </li>
      ))}
    </ul>
  )
}

function inferRepoCapabilities(item: RepoRow, slug: RankingSlug) {
  if (slug === "agent-frameworks") {
    return [item.scope ?? "Agent framework", "Tool calling", "Workflow orchestration", "Developer ecosystem"]
  }

  if (slug === "github-trending") {
    return ["Recent public signal", "Repository activity", "Community attention", "Open source momentum"]
  }

  return ["Open source repository", "Public GitHub signal", "Developer adoption", item.language ?? "Technical project"]
}

function RepoProfile({ item, slug, profile }: { item: RepoRow; slug: RankingSlug; profile: ItemProfileRow | null }) {
  const summary = profile?.summary ?? item.summary ?? item.description ?? "Tracked AI Agent repository."
  const whatItDoes = profile?.what_it_does ?? item.description ?? summary
  const whyIncluded = profile?.why_ranked ?? item.whyIncluded ?? "Included because AIAA tracks this repository as part of the public AI Agent software ecosystem."
  const primaryScore = slug === "github-trending" ? item.momentumScore : slug === "agent-frameworks" ? item.frameworkScore : item.stars
  const capabilities = profile?.capabilities?.length ? profile.capabilities : inferRepoCapabilities(item, slug)

  return (
    <>
      <section className="border-t border-white/12">
        <DetailMetric label="Rank" value={item.rank} />
        <DetailMetric label="Stars" value={formatNumber(item.stars)} />
        <DetailMetric label="Forks" value={formatNumber(item.forks)} />
        <DetailMetric label="Primary Score" value={formatNumber(primaryScore)} />
      </section>

      <DetailSection title="Summary">
        <p>{summary}</p>
      </DetailSection>

      <DetailSection title="What it does">
        <p>{whatItDoes}</p>
      </DetailSection>

      <DetailSection title="Why it is ranked">
        <p>{whyIncluded}</p>
      </DetailSection>

      <DetailSection title="Repository facts">
        <div className="grid gap-0">
          <DetailMetric label="Full name" value={item.fullName} />
          <DetailMetric label="Owner" value={item.ownerLogin} />
          <DetailMetric label="Language" value={item.language ?? "Public"} />
          <DetailMetric label="Open issues" value={formatNumber(item.openIssues)} />
          <DetailMetric label="Last pushed" value={formatDate(item.pushedAt)} />
          <DetailMetric label="Last updated" value={formatDate(item.updatedAt)} />
        </div>
      </DetailSection>

      {profile?.best_for ? (
        <DetailSection title="Best for">
          <p>{profile.best_for}</p>
        </DetailSection>
      ) : null}

      <DetailSection title="Capabilities">
        <DetailList items={capabilities} />
      </DetailSection>

      {profile?.last_refreshed_at ? (
        <DetailSection title="Data freshness">
          <p>Last refreshed on {formatDate(profile.last_refreshed_at)}.</p>
        </DetailSection>
      ) : null}
    </>
  )
}

function BuilderProfile({ item, profile }: { item: BuilderRow; profile: ItemProfileRow | null }) {
  const summary = profile?.summary ?? `${item.login} is ranked by public GitHub contribution signals across tracked AI Agent repositories.`
  const whyRanked = profile?.why_ranked ?? "The builder appears in contributor data for repositories tracked by AIAA. This is a public contribution signal, not an AIAA identity certification."
  const capabilities = profile?.capabilities?.length ? profile.capabilities : ["AI Agent repository contribution", "Open source activity", "Public builder signal", "GitHub ecosystem presence"]

  return (
    <>
      <section className="border-t border-white/12">
        <DetailMetric label="Rank" value={item.rank} />
        <DetailMetric label="Builder Score" value={formatNumber(item.builderScore)} />
        <DetailMetric label="Repositories" value={formatNumber(item.repoCount)} />
        <DetailMetric label="Contributions" value={formatNumber(item.totalContributions)} />
      </section>

      <DetailSection title="Summary">
        <p>{summary}</p>
      </DetailSection>

      <DetailSection title="Why this builder is ranked">
        <p>{whyRanked}</p>
      </DetailSection>

      <DetailSection title="Tracked repositories">
        <DetailList items={item.repositories} />
      </DetailSection>

      <DetailSection title="Capability signal">
        <DetailList items={capabilities} />
      </DetailSection>

      {profile?.last_refreshed_at ? (
        <DetailSection title="Data freshness">
          <p>Last refreshed on {formatDate(profile.last_refreshed_at)}.</p>
        </DetailSection>
      ) : null}
    </>
  )
}

function ProductProfile({ item }: { item: PreviewRow }) {
  return (
    <>
      <section className="border-t border-white/12">
        <DetailMetric label="Rank" value={item.rank} />
        <DetailMetric label="Level" value={item.level} />
        <DetailMetric label="Category" value={item.category} />
        <DetailMetric label="Score" value={item.score} />
      </section>

      <DetailSection title="Product summary">
        <p>{item.summary}</p>
      </DetailSection>

      <DetailSection title="Best for">
        <p>{item.bestFor}</p>
      </DetailSection>

      <DetailSection title="Capabilities">
        <DetailList items={item.capabilities} />
      </DetailSection>

      <DetailSection title="Evidence required">
        <p>{item.evidence}</p>
      </DetailSection>
    </>
  )
}

export default async function RankingItemPage({ params }: { params: Promise<{ slug: string; item: string }> }) {
  const { slug, item } = await params
  const config = rankingConfigs[slug as RankingSlug]

  if (!config) notFound()

  let title = ""
  let subtitle = ""
  let avatarUrl = ""
  let externalUrl = ""
  let content: ReactNode = null

  if (config.mode === "preview") {
    const product = previewRows.find((row) => row.slug === item)
    if (!product) notFound()
    title = product.name
    subtitle = product.summary
    content = <ProductProfile item={product} />
  }

  if (config.mode === "repo" && config.apiPath) {
    const data = await safeFetchJson<ApiListResponse<RepoRow>>(config.apiPath, { results: [] })
    const repo = data.results.find((row) => slugify(row.name) === item || slugify(row.fullName) === item)
    if (!repo) notFound()
    const profile = await fetchItemProfile(slug, item)
    title = profile?.name ?? repo.name
    subtitle = profile?.summary ?? repo.summary ?? repo.description ?? "Tracked AI Agent repository."
    avatarUrl = profile?.avatar_url ?? repo.ownerAvatarUrl
    externalUrl = profile?.external_url ?? repo.url
    content = <RepoProfile item={repo} slug={slug as RankingSlug} profile={profile} />
  }

  if (config.mode === "builder" && config.apiPath) {
    const data = await safeFetchJson<ApiListResponse<BuilderRow>>(config.apiPath, { results: [] })
    const builder = data.results.find((row) => slugify(row.login) === item)
    if (!builder) notFound()
    const profile = await fetchItemProfile(slug, item)
    title = profile?.name ?? builder.login
    subtitle = profile?.summary ?? "Public builder profile based on contribution signals across tracked AI Agent repositories."
    avatarUrl = profile?.avatar_url ?? builder.avatarUrl
    externalUrl = profile?.external_url ?? builder.profileUrl
    content = <BuilderProfile item={builder} profile={profile} />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <SiteHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.18),rgba(6,7,10,0.94)_52%,rgba(6,7,10,1))]" />
        <div className="absolute left-[-10%] top-[12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(100,122,168,0.18),transparent_64%)] blur-[140px]" />
        <div className="absolute right-[-10%] top-[4%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(112,85,132,0.18),transparent_64%)] blur-[150px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36">
        <Link href={`/rankings/${slug}`} className="inline-flex rounded-full border border-white/16 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white hover:bg-white/10">
          Back to ranking
        </Link>

        <div className="mt-10 border-b border-white/12 pb-10">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/44">{config.itemLabel}</div>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            {avatarUrl ? <img src={avatarUrl} alt="" className="h-16 w-16 rounded-2xl border border-white/12 bg-white/[0.04] object-cover" /> : null}
            <h1 className="text-[clamp(2.55rem,5.6vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
              {title}
            </h1>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-white/66 md:text-lg md:leading-9">{subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/rankings/${slug}`} className="rounded-full border border-white/16 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Ranking
            </Link>
            {externalUrl ? (
              <a href={externalUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/86">
                {config.mode === "builder" ? "Open GitHub Profile" : "Open GitHub"}
              </a>
            ) : null}
          </div>
        </div>

        <article className="mt-8 max-w-6xl">{content}</article>
      </section>
    </main>
  )
}
