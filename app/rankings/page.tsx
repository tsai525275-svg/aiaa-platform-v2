import { SiteHeader } from "@/components/site-header"
import { headers } from "next/headers"
import type { ReactNode } from "react"

export const dynamic = "force-dynamic"
export const revalidate = 300

const trackedRepos = [
  "Significant-Gravitas/AutoGPT",
  "langchain-ai/langgraph",
  "crewAIInc/crewAI",
  "All-Hands-AI/OpenHands",
  "browser-use/browser-use",
  "microsoft/autogen",
  "run-llama/llama_index",
  "FlowiseAI/Flowise",
  "microsoft/semantic-kernel",
  "langgenius/dify"
]

type FrameworkConfig = {
  repo: string
  scope: string
  summary: string
  whyIncluded: string
}

const frameworkConfigs: FrameworkConfig[] = [
  {
    repo: "langchain-ai/langgraph",
    scope: "Agent Orchestration",
    summary: "Graph based framework for stateful agent workflows, routing, tool calling, and multi step AI systems.",
    whyIncluded: "Included because it helps developers build structured AI Agent workflows and orchestration systems."
  },
  {
    repo: "crewAIInc/crewAI",
    scope: "Multi Agent Framework",
    summary: "Framework for coordinating multiple AI agents through roles, tasks, crews, and workflow execution.",
    whyIncluded: "Included because it focuses on multi agent collaboration and task delegation."
  },
  {
    repo: "microsoft/autogen",
    scope: "Multi Agent Framework",
    summary: "Framework for building agent systems, multi agent conversations, tool use, and automated collaboration.",
    whyIncluded: "Included because it supports multi agent architecture and developer controlled agent systems."
  },
  {
    repo: "microsoft/semantic-kernel",
    scope: "Enterprise Agent Framework",
    summary: "Application framework for connecting models, tools, plugins, planners, and enterprise AI workflows.",
    whyIncluded: "Included because it supports production agent architecture, tool calling, and enterprise integration."
  },
  {
    repo: "run-llama/llama_index",
    scope: "Data Agent Framework",
    summary: "Data framework for connecting AI systems to documents, retrieval, indexes, tools, and agent workflows.",
    whyIncluded: "Included because retrieval, data access, and tool backed context are core parts of agent systems."
  },
  {
    repo: "FlowiseAI/Flowise",
    scope: "Agent Workflow Builder",
    summary: "Visual builder for LLM workflows, agent flows, tool usage, and low code AI applications.",
    whyIncluded: "Included because it helps teams build agent workflows through a visual development interface."
  },
  {
    repo: "langgenius/dify",
    scope: "Agent App Platform",
    summary: "Platform for building AI applications, agent workflows, RAG systems, and production LLM apps.",
    whyIncluded: "Included because it provides agent application infrastructure and production workflow tooling."
  },
  {
    repo: "browser-use/browser-use",
    scope: "Browser Agent Toolkit",
    summary: "Toolkit that lets AI agents operate browsers, interact with websites, and complete web based tasks.",
    whyIncluded: "Included because browser operation is an important agent infrastructure capability."
  },
  {
    repo: "langchain-ai/langchain",
    scope: "Agent Tooling Framework",
    summary: "Developer framework for LLM applications, chains, tool calling, integrations, and agent workflows.",
    whyIncluded: "Included because it provides foundational tooling used across many agent based systems."
  },
  {
    repo: "Significant-Gravitas/AutoGPT",
    scope: "Autonomous Agent Framework",
    summary: "Open source autonomous agent project focused on goal driven task execution and agent experiments.",
    whyIncluded: "Included as an early autonomous agent framework reference with major public ecosystem signal."
  }
]

type GitHubRepo = {
  id: number
  full_name: string
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  pushed_at: string
  updated_at: string
  language: string | null
  owner: {
    login: string
    avatar_url: string
    html_url?: string
  }
}

type GitHubContributor = {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

type RepoRow = {
  rank: string
  name: string
  fullName: string
  url: string
  stars: number
  forks: number
  openIssues: number
  language: string | null
  pushedAt: string
  updatedAt: string
  ownerAvatarUrl: string
  scope: string
  momentumScore?: number
}

type BuilderRow = {
  rank: string
  login: string
  avatarUrl: string
  profileUrl: string
  repoCount: number
  totalContributions: number
  builderScore: number
}

type FrameworkRow = {
  rank: string
  name: string
  fullName: string
  url: string
  ownerAvatarUrl: string
  scope: string
  summary: string
  whyIncluded: string
  stars: number
  forks: number
  language: string | null
  contributorSample: number
  frameworkScore: number
}

const repoScopes: Record<string, string> = {
  "Significant-Gravitas/AutoGPT": "Autonomous Agent",
  "langchain-ai/langgraph": "Agent Orchestration",
  "crewAIInc/crewAI": "Multi Agent Framework",
  "All-Hands-AI/OpenHands": "Coding Agent",
  "browser-use/browser-use": "Browser Agent",
  "microsoft/autogen": "Multi Agent Framework",
  "run-llama/llama_index": "Data Agent Framework",
  "FlowiseAI/Flowise": "Agent Builder",
  "microsoft/semantic-kernel": "Enterprise Framework",
  "langgenius/dify": "Agent App Platform"
}

async function getBaseUrl() {
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  const protocol = headerStore.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https")

  if (!host) return "http://localhost:3000"

  return `${protocol}://${host}`
}

async function fetchApi<T>(path: string) {
  try {
    const baseUrl = await getBaseUrl()
    const response = await fetch(`${baseUrl}${path}`, {
      cache: "no-store"
    })

    if (!response.ok) return null

    return (await response.json()) as T
  } catch {
    return null
  }
}

function githubHeaders(userAgent: string) {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": userAgent,
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {})
  }
}

async function fetchGitHubRepo(repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: githubHeaders("AIAA Rankings Overview"),
      next: {
        revalidate: 3600
      }
    })

    if (!response.ok) return null

    return (await response.json()) as GitHubRepo
  } catch {
    return null
  }
}

async function fetchGitHubContributors(repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=30`, {
      headers: githubHeaders("AIAA Rankings Overview"),
      next: {
        revalidate: 3600
      }
    })

    if (!response.ok) return []

    return (await response.json()) as GitHubContributor[]
  } catch {
    return []
  }
}

function avatarFromFullName(fullName: string) {
  const owner = fullName.split("/")[0]
  return `https://github.com/${owner}.png?size=64`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

function daysSince(dateText: string) {
  const now = Date.now()
  const then = new Date(dateText).getTime()
  return Math.max(0, Math.floor((now - then) / 86400000))
}

function calculateMomentum(repo: GitHubRepo) {
  const pushedDays = daysSince(repo.pushed_at)
  const updatedDays = daysSince(repo.updated_at)
  const recencyScore = Math.max(0, 100 - pushedDays * 3)
  const updateScore = Math.max(0, 60 - updatedDays * 2)
  const starScore = Math.min(100, repo.stargazers_count / 1500)
  const forkScore = Math.min(60, repo.forks_count / 700)
  const issueScore = Math.min(40, repo.open_issues_count / 20)

  return Math.round(recencyScore + updateScore + starScore + forkScore + issueScore)
}

function calculateFrameworkScore(repo: GitHubRepo, contributorSample: number) {
  const activityDays = daysSince(repo.pushed_at)
  const activityScore = Math.max(0, 120 - activityDays * 2)
  const starScore = Math.min(160, repo.stargazers_count / 800)
  const forkScore = Math.min(90, repo.forks_count / 350)
  const contributorScore = Math.min(80, contributorSample * 4)
  const issueScore = Math.min(50, repo.open_issues_count / 15)

  return Math.round(activityScore + starScore + forkScore + contributorScore + issueScore)
}

function repoApiItemToRow(
  item: {
    rank?: string
    name: string
    fullName: string
    url: string
    stars: number
    forks: number
    openIssues: number
    language: string | null
    pushedAt: string
    updatedAt: string
    ownerAvatarUrl?: string
    momentumScore?: number
  },
  index: number
): RepoRow {
  return {
    rank: String(index + 1).padStart(2, "0"),
    name: item.name,
    fullName: item.fullName,
    url: item.url,
    stars: item.stars,
    forks: item.forks,
    openIssues: item.openIssues,
    language: item.language,
    pushedAt: item.pushedAt,
    updatedAt: item.updatedAt,
    ownerAvatarUrl: item.ownerAvatarUrl ?? avatarFromFullName(item.fullName),
    scope: repoScopes[item.fullName] ?? "AI Agent Repository",
    momentumScore: item.momentumScore
  }
}

function githubRepoToRow(repo: GitHubRepo, index: number): RepoRow {
  return {
    rank: String(index + 1).padStart(2, "0"),
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    language: repo.language,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    ownerAvatarUrl: repo.owner.avatar_url,
    scope: repoScopes[repo.full_name] ?? "AI Agent Repository",
    momentumScore: calculateMomentum(repo)
  }
}

async function getRepoRows(mode: "stars" | "trending") {
  type RepoApiResponse = {
    results: Array<{
      rank: string
      name: string
      fullName: string
      url: string
      stars: number
      forks: number
      openIssues: number
      language: string | null
      pushedAt: string
      updatedAt: string
      ownerAvatarUrl?: string
      momentumScore?: number
    }>
  }

  const data = await fetchApi<RepoApiResponse>(mode === "stars" ? "/api/github/repos" : "/api/github/trending")
  const apiRows = (data?.results ?? []).slice(0, 5).map(repoApiItemToRow)

  if (apiRows.length > 0) return apiRows

  const repos = (await Promise.all(trackedRepos.map(fetchGitHubRepo))).filter((repo): repo is GitHubRepo => repo !== null)
  const sorted = repos.sort((a, b) => {
    if (mode === "stars") return b.stargazers_count - a.stargazers_count
    return calculateMomentum(b) - calculateMomentum(a)
  })

  return sorted.slice(0, 5).map(githubRepoToRow)
}

function scoreBuilder(repoCount: number, totalContributions: number) {
  return Math.round(repoCount * 120 + totalContributions)
}

async function getBuilderRows() {
  type BuilderApiResponse = {
    results: Array<{
      rank: string
      login: string
      avatarUrl: string
      profileUrl: string
      repoCount: number
      totalContributions: number
      builderScore: number
    }>
  }

  const data = await fetchApi<BuilderApiResponse>("/api/github/builders")
  const apiRows = (data?.results ?? [])
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: String(index + 1).padStart(2, "0")
    }))

  if (apiRows.length > 0) return apiRows

  const builderMap = new Map<string, BuilderRow>()
  await Promise.all(
    trackedRepos.map(async (repo) => {
      const contributors = await fetchGitHubContributors(repo)

      contributors
        .filter((item) => item.type === "User")
        .forEach((item) => {
          const current = builderMap.get(item.login)
          const repoCount = current ? current.repoCount + 1 : 1
          const totalContributions = (current?.totalContributions ?? 0) + item.contributions

          builderMap.set(item.login, {
            rank: "00",
            login: item.login,
            avatarUrl: item.avatar_url,
            profileUrl: item.html_url,
            repoCount,
            totalContributions,
            builderScore: scoreBuilder(repoCount, totalContributions)
          })
        })
    })
  )

  return Array.from(builderMap.values())
    .sort((a, b) => b.builderScore - a.builderScore)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: String(index + 1).padStart(2, "0")
    }))
}

async function getContributorSample(repo: string) {
  const contributors = await fetchGitHubContributors(repo)
  return contributors.filter((item) => item.type === "User").length
}

async function getFrameworkRows() {
  type FrameworkApiResponse = {
    results: Array<{
      rank: string
      name: string
      fullName: string
      url: string
      ownerAvatarUrl: string
      scope: string
      summary: string
      whyIncluded: string
      stars: number
      forks: number
      language: string | null
      contributorSample: number
      frameworkScore: number
    }>
  }

  const data = await fetchApi<FrameworkApiResponse>("/api/github/frameworks")
  const apiRows = (data?.results ?? [])
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: String(index + 1).padStart(2, "0")
    }))

  if (apiRows.length > 0) return apiRows

  const rows = await Promise.all(
    frameworkConfigs.map(async (framework) => {
      const repo = await fetchGitHubRepo(framework.repo)
      if (!repo) return null

      const contributorSample = await getContributorSample(framework.repo)

      return {
        rank: "00",
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        ownerAvatarUrl: repo.owner.avatar_url,
        scope: framework.scope,
        summary: framework.summary,
        whyIncluded: framework.whyIncluded,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        contributorSample,
        frameworkScore: calculateFrameworkScore(repo, contributorSample)
      }
    })
  )

  return rows
    .filter((item): item is Omit<FrameworkRow, "rank"> & { rank: string } => item !== null)
    .sort((a, b) => b.frameworkScore - a.frameworkScore)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: String(index + 1).padStart(2, "0")
    }))
}

const previewRows = Array.from({ length: 5 }, (_, index) => ({
  rank: String(index + 1).padStart(2, "0"),
  name: `Candidate ${String(index + 1).padStart(2, "0")}`,
  level: "Pending",
  category: "Preview",
  signal: "Review pending"
}))

function SignalBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex min-w-[7rem] justify-center rounded-full border border-emerald-300/30 bg-emerald-300/[0.10] px-3 py-1.5 text-xs font-medium text-emerald-100">
      {children}
    </span>
  )
}

function PreviewBadge() {
  return (
    <span className="inline-flex min-w-[6.4rem] justify-center rounded-full border border-white/18 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70">
      Pending
    </span>
  )
}

function RepoMiniTable({ rows, metric }: { rows: RepoRow[]; metric: "stars" | "momentum" }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/10">
      <div className="grid grid-cols-[0.42fr_1.55fr_0.85fr_0.75fr] gap-3 border-b border-white/14 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/40">
        <div>Rank</div>
        <div>Repository</div>
        <div>Scope</div>
        <div>{metric === "stars" ? "Stars" : "Momentum"}</div>
      </div>
      {rows.map((row) => (
        <div key={`${metric}-${row.fullName}`} className="grid grid-cols-[0.42fr_1.55fr_0.85fr_0.75fr] gap-3 border-b border-white/8 px-4 py-3 last:border-b-0">
          <div className="text-base font-semibold text-white/82">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-3">
            <img src={row.ownerAvatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{row.name}</div>
              <div className="truncate text-xs text-white/40">{row.fullName}</div>
            </div>
          </div>
          <div className="truncate text-xs text-white/68">{row.scope}</div>
          <div className="text-sm font-semibold text-white">{formatNumber(metric === "stars" ? row.stars : row.momentumScore ?? 0)}</div>
        </div>
      ))}
    </div>
  )
}

function BuilderMiniTable({ rows }: { rows: BuilderRow[] }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/10">
      <div className="grid grid-cols-[0.42fr_1.55fr_0.9fr_0.75fr] gap-3 border-b border-white/14 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/40">
        <div>Rank</div>
        <div>Builder</div>
        <div>Public Signal</div>
        <div>Score</div>
      </div>
      {rows.map((row) => (
        <div key={row.login} className="grid grid-cols-[0.42fr_1.55fr_0.9fr_0.75fr] gap-3 border-b border-white/8 px-4 py-3 last:border-b-0">
          <div className="text-base font-semibold text-white/82">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-3">
            <img src={row.avatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{row.login}</div>
              <div className="truncate text-xs text-white/40">{formatNumber(row.totalContributions)} contributions</div>
            </div>
          </div>
          <div><SignalBadge>Public GitHub</SignalBadge></div>
          <div className="text-sm font-semibold text-white">{formatNumber(row.builderScore)}</div>
        </div>
      ))}
    </div>
  )
}

function FrameworkMiniTable({ rows }: { rows: FrameworkRow[] }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/10">
      <div className="grid grid-cols-[0.42fr_1.55fr_0.85fr_0.65fr] gap-3 border-b border-white/14 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/40">
        <div>Rank</div>
        <div>Framework</div>
        <div>Scope</div>
        <div>Score</div>
      </div>
      {rows.map((row) => (
        <div key={row.fullName} className="grid grid-cols-[0.42fr_1.55fr_0.85fr_0.65fr] gap-3 border-b border-white/8 px-4 py-3 last:border-b-0">
          <div className="text-base font-semibold text-white/82">{row.rank}</div>
          <div className="flex min-w-0 items-center gap-3">
            <img src={row.ownerAvatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{row.name}</div>
              <div className="truncate text-xs text-white/40">{row.fullName}</div>
            </div>
          </div>
          <div className="truncate text-xs text-white/68">{row.scope}</div>
          <div className="text-sm font-semibold text-white">{formatNumber(row.frameworkScore)}</div>
        </div>
      ))}
    </div>
  )
}

function PreviewMiniTable({ label }: { label: string }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/10">
      <div className="grid grid-cols-[0.42fr_1.35fr_0.8fr_0.9fr] gap-3 border-b border-white/14 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/40">
        <div>Rank</div>
        <div>Name</div>
        <div>Status</div>
        <div>Signal</div>
      </div>
      {previewRows.map((row) => (
        <div key={`${label}-${row.rank}`} className="grid grid-cols-[0.42fr_1.35fr_0.8fr_0.9fr] gap-3 border-b border-white/8 px-4 py-3 last:border-b-0">
          <div className="text-base font-semibold text-white/82">{row.rank}</div>
          <div className="text-sm font-medium text-white">{label} {row.name}</div>
          <div><PreviewBadge /></div>
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
  children
}: {
  eyebrow: string
  title: string
  description: string
  tags: string[]
  href: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[2rem] border border-white/8 bg-white/[0.035] p-5 md:p-7">
      <div className="grid gap-7 lg:grid-cols-[0.66fr_1.34fr] lg:items-center">
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
  const [starsRows, trendingRows, builderRows, frameworkRows] = await Promise.all([
    getRepoRows("stars"),
    getRepoRows("trending"),
    getBuilderRows(),
    getFrameworkRows()
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
            AIAA tracks agent products, open source repositories, GitHub builders, and agent frameworks. Public GitHub cards show live data.
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
            <PreviewMiniTable label="Product" />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 02"
            title="GitHub Stars Ranking"
            description="A live repository ranking based on public GitHub star counts across tracked AI Agent repositories."
            tags={["Stars", "Forks", "Repository scope", "Public GitHub"]}
            href="/rankings/github-stars"
          >
            <RepoMiniTable rows={starsRows} metric="stars" />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 03"
            title="GitHub Trending Ranking"
            description="A live repository ranking based on current public GitHub momentum signals. Daily snapshots will add true growth later."
            tags={["Momentum", "Recent updates", "Forks", "Open issues"]}
            href="/rankings/github-trending"
          >
            <RepoMiniTable rows={trendingRows} metric="momentum" />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 04"
            title="GitHub Builders Ranking"
            description="A live builder ranking based on public GitHub contributor metadata across tracked AI Agent repositories."
            tags={["Contributions", "Tracked repos", "Builder signal", "Public GitHub"]}
            href="/rankings/github-builders"
          >
            <BuilderMiniTable rows={builderRows} />
          </RankingCard>

          <RankingCard
            eyebrow="Ranking 05"
            title="Agent Framework Ranking"
            description="A live framework ranking based on reviewed agent frameworks, orchestration systems, and developer infrastructure."
            tags={["Framework score", "Agent architecture", "Developer tooling", "Public GitHub"]}
            href="/rankings/agent-frameworks"
          >
            <FrameworkMiniTable rows={frameworkRows} />
          </RankingCard>
        </div>
      </section>
    </main>
  )
}
