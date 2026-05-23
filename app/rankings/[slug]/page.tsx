import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { rankingCategories } from "../ranking-data";

export const revalidate = 3600;

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
];

type GitHubRepo = {
  id: number;
  full_name: string;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  updated_at: string;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};

type RepoRow = {
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
  momentumScore?: number;
};

type GitHubContributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
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

type FrameworkConfig = {
  repo: string;
  scope: string;
  summary: string;
  whyIncluded: string;
};

type FrameworkRow = {
  rank: string;
  id: number;
  name: string;
  fullName: string;
  scope: string;
  summary: string;
  whyIncluded: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  ownerLogin: string;
  ownerAvatarUrl: string;
  pushedAt: string;
  updatedAt: string;
  contributorSample: number;
  frameworkScore: number;
};

const frameworkConfigs: FrameworkConfig[] = [
  {
    repo: "langchain-ai/langgraph",
    scope: "Agent Orchestration",
    summary: "Graph based framework for stateful agent workflows, tool calling, routing, and multi step AI systems.",
    whyIncluded: "Included because it helps developers build structured AI Agent workflows and orchestration systems."
  },
  {
    repo: "crewAIInc/crewAI",
    scope: "Multi Agent Framework",
    summary: "Framework for coordinating multiple AI agents through roles, tasks, crews, and workflow execution.",
    whyIncluded: "Included because it focuses on multi agent collaboration, task delegation, and agent workflow execution."
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
];

type RepoProfile = {
  scope: string;
  summary: string;
  relevance: string;
};

const repoProfiles: Record<string, RepoProfile> = {
  "Significant-Gravitas/AutoGPT": {
    scope: "Autonomous Agent",
    summary: "Open source autonomous agent project for goal driven task execution and agent workflows.",
    relevance: "Included because it is a widely tracked autonomous agent repository."
  },
  "langchain-ai/langgraph": {
    scope: "Agent Orchestration",
    summary: "Graph based framework for stateful agent workflows, tool calling, and multi step AI systems.",
    relevance: "Included because it is infrastructure for building agentic applications."
  },
  "crewAIInc/crewAI": {
    scope: "Multi Agent Framework",
    summary: "Framework for coordinating multiple AI agents that work together across roles and tasks.",
    relevance: "Included because it focuses on multi agent collaboration and workflow execution."
  },
  "All-Hands-AI/OpenHands": {
    scope: "Coding Agent",
    summary: "AI driven software development agent for coding tasks, repository work, and developer automation.",
    relevance: "Included because it represents the coding agent category."
  },
  "browser-use/browser-use": {
    scope: "Browser Agent",
    summary: "Browser automation agent toolkit for website interaction and online task execution.",
    relevance: "Included because browser control is a core AI Agent capability."
  },
  "microsoft/autogen": {
    scope: "Multi Agent Framework",
    summary: "Programming framework for building agent systems and multi agent workflows.",
    relevance: "Included because it supports agent orchestration and collaboration."
  },
  "run-llama/llama_index": {
    scope: "Data Agent Framework",
    summary: "Data framework for connecting AI systems to documents, retrieval, tools, and agent workflows.",
    relevance: "Included because data access and retrieval are core agent infrastructure."
  },
  "FlowiseAI/Flowise": {
    scope: "Agent Builder",
    summary: "Visual builder for LLM flows, agent workflows, and low code AI applications.",
    relevance: "Included because it helps teams build agent workflows through a visual interface."
  },
  "microsoft/semantic-kernel": {
    scope: "Enterprise Agent Framework",
    summary: "Application framework for integrating LLMs, plugins, tools, and enterprise AI workflows.",
    relevance: "Included because it supports enterprise agent and tool calling architecture."
  },
  "langgenius/dify": {
    scope: "Agent App Platform",
    summary: "Platform for building AI applications and agentic workflows with production oriented features.",
    relevance: "Included because it is an agent application platform with public repository signals."
  }
};

const liveCopy = {
  "github-stars": {
    eyebrow: "GitHub Ranking 01",
    title: "GitHub Stars Ranking",
    description: "A repository ranking based on public GitHub star counts across tracked AI Agent repositories.",
    modelLabel: "Ranking Model",
    modelValue: "Stars",
    statusValue: "Public GitHub data",
    notice: "This table ranks repositories by public GitHub attention. It does not represent AIAA certification.",
    criteria: ["Stars", "Forks", "Repository activity", "Public metadata"],
    dataSources: ["Public GitHub repository metadata", "Repository star counts", "Repository fork counts"],
    methodology: ["Rank repositories by public star count", "Show repository scope and summary", "Keep AIAA certification status separate"]
  },
  "github-trending": {
    eyebrow: "GitHub Ranking 02",
    title: "GitHub Trending Ranking",
    description: "A repository ranking based on public GitHub momentum signals across tracked AI Agent repositories.",
    modelLabel: "Signal Model",
    modelValue: "Momentum Signal V1",
    statusValue: "Public GitHub data",
    notice: "This table uses public metadata to estimate current momentum. Daily snapshot tracking will add true 7 day and 30 day growth later.",
    criteria: ["Recent updates", "Stars", "Forks", "Open issues"],
    dataSources: ["Public GitHub repository metadata", "Repository activity signals", "Repository star counts"],
    methodology: ["Calculate Momentum Signal V1", "Use stars, forks, issues, and update recency", "Add daily snapshots later"]
  },
  "github-builders": {
    eyebrow: "GitHub Ranking 03",
    title: "GitHub Builders Ranking",
    description: "A builder ranking based on public GitHub contributor metadata across tracked AI Agent repositories.",
    modelLabel: "Signal Model",
    modelValue: "Builder Signal V1",
    statusValue: "Public GitHub data",
    notice: "This table ranks people, not software and not skills. It does not represent AIAA identity certification or employment verification.",
    criteria: ["Contributions", "Tracked repositories", "Open source activity", "Builder signal"],
    dataSources: ["Public GitHub contributor metadata", "Repository contributor lists", "Public profile URLs"],
    methodology: ["Aggregate public contributors", "Combine repo count and contribution count", "Keep identity certification separate"]
  },
  "agent-frameworks": {
    eyebrow: "Framework Ranking",
    title: "Agent Framework Ranking",
    description: "A framework ranking based on public GitHub metadata across reviewed AI Agent framework repositories.",
    modelLabel: "Signal Model",
    modelValue: "Agent Framework Signal V1",
    statusValue: "Public GitHub data",
    notice: "This table ranks frameworks, not products, people, or skills. Product ranking and skill ranking are tracked separately.",
    criteria: ["Agent workflow", "Tool calling", "Multi agent support", "Developer infrastructure"],
    dataSources: ["Public GitHub repository metadata", "Repository contributor samples", "AIAA framework scope review"],
    methodology: ["Review whether each repo is an agent framework", "Score stars, forks, contributors, activity, and issues", "Keep product ranking and skill ranking separate"]
  }
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function githubHeaders(userAgent: string) {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": userAgent,
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {})
  };
}

function daysSince(dateText: string) {
  const now = Date.now();
  const then = new Date(dateText).getTime();
  return Math.max(0, Math.floor((now - then) / 86400000));
}

function calculateMomentum(repo: GitHubRepo) {
  const pushedDays = daysSince(repo.pushed_at);
  const updatedDays = daysSince(repo.updated_at);
  const recencyScore = Math.max(0, 100 - pushedDays * 3);
  const updateScore = Math.max(0, 60 - updatedDays * 2);
  const starScore = Math.min(100, repo.stargazers_count / 1500);
  const forkScore = Math.min(60, repo.forks_count / 700);
  const issueScore = Math.min(40, repo.open_issues_count / 20);
  return Math.round(recencyScore + updateScore + starScore + forkScore + issueScore);
}

function calculateFrameworkScore(repo: GitHubRepo, contributorSample: number) {
  const activityDays = daysSince(repo.pushed_at);
  const activityScore = Math.max(0, 120 - activityDays * 2);
  const starScore = Math.min(160, repo.stargazers_count / 800);
  const forkScore = Math.min(90, repo.forks_count / 350);
  const contributorScore = Math.min(80, contributorSample * 4);
  const issueScore = Math.min(50, repo.open_issues_count / 15);

  return Math.round(activityScore + starScore + forkScore + contributorScore + issueScore);
}

function getRepoProfile(fullName: string, description: string | null) {
  return repoProfiles[fullName] ?? {
    scope: "AI Agent Repository",
    summary: description ?? "Tracked open source repository reviewed for AI Agent relevance.",
    relevance: "Included because it appears in the tracked AI Agent repository set."
  };
}

async function getRepoRows(mode: "stars" | "trending") {
  const rows = await Promise.all(
    trackedRepos.map(async (repo) => {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: githubHeaders("AIAA Ranking System"),
        next: {
          revalidate: 3600
        }
      });

      if (!response.ok) return null;

      const data = (await response.json()) as GitHubRepo;

      return {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        url: data.html_url,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        language: data.language,
        pushedAt: data.pushed_at,
        updatedAt: data.updated_at,
        ownerLogin: data.owner.login,
        ownerAvatarUrl: data.owner.avatar_url,
        momentumScore: calculateMomentum(data)
      } satisfies Omit<RepoRow, "rank">;
    })
  );

  return rows
    .filter((row): row is Exclude<(typeof rows)[number], null> => row !== null)
    .sort((a, b) => mode === "stars" ? b.stars - a.stars : (b.momentumScore ?? 0) - (a.momentumScore ?? 0))
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      ...item
    }));
}

function scoreBuilder(repoCount: number, totalContributions: number) {
  return Math.round(repoCount * 120 + totalContributions);
}

async function getBuilderRows() {
  const builderMap = new Map<string, Omit<BuilderRow, "rank">>();

  await Promise.all(
    trackedRepos.map(async (repo) => {
      const response = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=30`, {
        headers: githubHeaders("AIAA Builder Signal"),
        next: {
          revalidate: 3600
        }
      });

      if (!response.ok) return;

      const contributors = (await response.json()) as GitHubContributor[];

      contributors
        .filter((item) => item.login && item.type === "User")
        .forEach((item) => {
          const current = builderMap.get(item.login);

          if (!current) {
            builderMap.set(item.login, {
              login: item.login,
              avatarUrl: item.avatar_url,
              profileUrl: item.html_url,
              repoCount: 1,
              totalContributions: item.contributions,
              repositories: [repo],
              builderScore: scoreBuilder(1, item.contributions)
            });
            return;
          }

          const repositories = current.repositories.includes(repo) ? current.repositories : [...current.repositories, repo];
          const totalContributions = current.totalContributions + item.contributions;
          const repoCount = repositories.length;

          builderMap.set(item.login, {
            ...current,
            repoCount,
            totalContributions,
            repositories,
            builderScore: scoreBuilder(repoCount, totalContributions)
          });
        });
    })
  );

  return Array.from(builderMap.values())
    .sort((a, b) => b.builderScore - a.builderScore)
    .slice(0, 30)
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      ...item
    }));
}

async function getContributorSample(repo: string) {
  const response = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=30`, {
    headers: githubHeaders("AIAA Framework Signal"),
    next: {
      revalidate: 3600
    }
  });

  if (!response.ok) return 0;

  const contributors = (await response.json()) as GitHubContributor[];

  return contributors.filter((item) => item.type === "User").length;
}

async function getFrameworkRows() {
  const rows = await Promise.all(
    frameworkConfigs.map(async (framework) => {
      const response = await fetch(`https://api.github.com/repos/${framework.repo}`, {
        headers: githubHeaders("AIAA Framework Signal"),
        next: {
          revalidate: 3600
        }
      });

      if (!response.ok) return null;

      const data = (await response.json()) as GitHubRepo;
      const contributorSample = await getContributorSample(framework.repo);

      return {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        scope: framework.scope,
        summary: framework.summary,
        whyIncluded: framework.whyIncluded,
        url: data.html_url,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        language: data.language,
        ownerLogin: data.owner.login,
        ownerAvatarUrl: data.owner.avatar_url,
        pushedAt: data.pushed_at,
        updatedAt: data.updated_at,
        contributorSample,
        frameworkScore: calculateFrameworkScore(data, contributorSample)
      } satisfies Omit<FrameworkRow, "rank">;
    })
  );

  return rows
    .filter((row): row is Exclude<(typeof rows)[number], null> => row !== null)
    .sort((a, b) => b.frameworkScore - a.frameworkScore)
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      ...item
    }));
}

function SignalBadge() {
  return (
    <span className="inline-flex w-full max-w-[8.8rem] justify-center rounded-full border border-emerald-300/30 bg-emerald-300/[0.10] px-3 py-1.5 text-xs font-medium leading-5 text-emerald-100">
      Public GitHub
    </span>
  );
}

function ScopeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-full max-w-[9.5rem] justify-center rounded-full border border-white/18 bg-white/[0.04] px-3 py-1.5 text-center text-xs font-medium leading-5 text-white/80">
      {label}
    </span>
  );
}

function RankingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.85rem] border border-white/8 bg-white/[0.035] px-3 py-2">
      <div className="text-[0.55rem] uppercase tracking-[0.18em] text-white/38">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  );
}


function InfoStrip({ items, label }: { items: string[]; label: string }) {
  return (
    <details className="rounded-[1.35rem] border border-white/10 bg-white/[0.025] p-4">
      <summary className="cursor-pointer text-xs uppercase tracking-[0.28em] text-white/52">
        {label}
      </summary>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-white/68">
            {item}
          </span>
        ))}
      </div>
    </details>
  );
}

function LiveHero({ slug }: { slug: keyof typeof liveCopy }) {
  const copy = liveCopy[slug];

  return (
    <section className="pt-28 md:pt-30">
      <a href="/rankings" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 hover:text-white">
        ← Back to rankings
      </a>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">{copy.eyebrow}</div>
          <h1 className="mt-4 max-w-[52rem] text-[clamp(2.35rem,4.8vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
            {copy.title}
          </h1>
        </div>

        <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.035] p-5 md:p-6">
          <p className="text-base leading-7 text-white/66 md:text-lg md:leading-8">{copy.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/12 bg-white/[0.035] p-4">
              <div className="text-xs uppercase tracking-[0.26em] text-white/38">{copy.modelLabel}</div>
              <div className="mt-2 text-lg font-medium text-white/88">{copy.modelValue}</div>
            </div>
            <div className="rounded-[1.25rem] border border-white/12 bg-white/[0.035] p-4">
              <div className="text-xs uppercase tracking-[0.26em] text-white/38">Data Status</div>
              <div className="mt-2 text-lg font-medium text-white/88">{copy.statusValue}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 rounded-[1.35rem] border border-white/14 bg-white/[0.025] px-5 py-4 text-sm leading-6 text-white/68">
        {copy.notice}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <InfoStrip label="Ranking Criteria" items={copy.criteria} />
        <InfoStrip label="Data Sources" items={copy.dataSources} />
        <InfoStrip label="Methodology" items={copy.methodology} />
      </div>
    </section>
  );
}

function RepoTable({ items, mode }: { items: RepoRow[]; mode: "stars" | "trending" }) {
  const metricLabel = mode === "trending" ? "Momentum" : "Stars";

  return (
    <section className="mt-6 rounded-[1.6rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
      <div className="grid grid-cols-[0.35fr_2.1fr_0.9fr_0.82fr_0.58fr_0.58fr_0.62fr] gap-3 border-b border-white/12 px-3 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
        <div>Rank</div>
        <div>Repository</div>
        <div>Scope</div>
        <div>Public Signal</div>
        <div>{metricLabel}</div>
        <div>Forks</div>
        <div>Language</div>
      </div>

      {items.map((item) => {
        const profile = getRepoProfile(item.fullName, item.description);
        const primaryMetric = mode === "trending" ? item.momentumScore ?? 0 : item.stars;

        return (
          <div key={`${mode}-${item.fullName}`} className="grid grid-cols-[0.35fr_2.1fr_0.9fr_0.82fr_0.58fr_0.58fr_0.62fr] gap-3 border-b border-white/8 px-3 py-3.5 last:border-b-0">
            <div className="text-[1.55rem] font-semibold leading-none tracking-[-0.08em] text-white">{item.rank}</div>
            <div className="flex min-w-0 gap-3">
              <img src={item.ownerAvatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
              <div className="min-w-0">
                <a href={item.url} target="_blank" rel="noreferrer" className="break-words text-base font-medium text-white hover:text-white/70">
                  {item.name}
                </a>
                <div className="mt-0.5 break-words text-xs text-white/44">{item.fullName}</div>
                <p className="mt-1.5 text-xs leading-5 text-white/62">{profile.summary}</p>
              </div>
            </div>
            <div><ScopeBadge label={profile.scope} /></div>
            <div><SignalBadge /></div>
            <div className="text-base font-semibold text-white">{formatNumber(primaryMetric)}</div>
            <div className="text-base font-semibold text-white">{formatNumber(item.forks)}</div>
            <div className="break-words text-base font-semibold text-white">{item.language ?? "Public"}</div>
          </div>
        );
      })}
    </section>
  );
}

function BuilderTable({ items }: { items: BuilderRow[] }) {
  return (
    <section className="mt-6 rounded-[1.6rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
      <div className="grid grid-cols-[0.35fr_2.05fr_0.9fr_0.82fr_0.62fr_0.42fr_0.5fr] gap-3 border-b border-white/12 px-3 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
        <div>Rank</div>
        <div>Builder</div>
        <div>Scope</div>
        <div>Public Signal</div>
        <div>Contrib.</div>
        <div>Repos</div>
        <div>Score</div>
      </div>

      {items.map((item) => (
        <div key={item.login} className="grid grid-cols-[0.35fr_2.05fr_0.9fr_0.82fr_0.62fr_0.42fr_0.5fr] gap-3 border-b border-white/8 px-3 py-3.5 last:border-b-0">
          <div className="text-[1.55rem] font-semibold leading-none tracking-[-0.08em] text-white">{item.rank}</div>
          <div className="flex min-w-0 gap-3">
            <img src={item.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
            <div className="min-w-0">
              <a href={item.profileUrl} target="_blank" rel="noreferrer" className="break-words text-base font-medium text-white hover:text-white/70">
                {item.login}
              </a>
              <p className="mt-1.5 text-xs leading-5 text-white/62">Public contributor across tracked AI Agent repositories.</p>
              <div className="mt-0.5 break-words text-[0.72rem] leading-5 text-white/42">Repos: {item.repositories.slice(0, 2).join(", ")}{item.repositories.length > 2 ? "..." : ""}</div>
            </div>
          </div>
          <div><ScopeBadge label="Open Source Builder" /></div>
          <div><SignalBadge /></div>
          <div className="text-base font-semibold text-white">{formatNumber(item.totalContributions)}</div>
          <div className="text-base font-semibold text-white">{formatNumber(item.repoCount)}</div>
          <div className="text-base font-semibold text-white">{formatNumber(item.builderScore)}</div>
        </div>
      ))}
    </section>
  );
}

function FrameworkTable({ items }: { items: FrameworkRow[] }) {
  return (
    <section className="mt-6 rounded-[1.6rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
      <div className="grid grid-cols-[0.35fr_2.05fr_0.9fr_0.82fr_0.45fr_0.58fr_0.52fr_0.55fr] gap-3 border-b border-white/12 px-3 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
        <div>Rank</div>
        <div>Framework</div>
        <div>Scope</div>
        <div>Public Signal</div>
        <div>Score</div>
        <div>Stars</div>
        <div>Forks</div>
        <div>Lang.</div>
      </div>

      {items.map((item) => (
        <div key={item.fullName} className="grid grid-cols-[0.35fr_2.05fr_0.9fr_0.82fr_0.45fr_0.58fr_0.52fr_0.55fr] gap-3 border-b border-white/8 px-3 py-3.5 last:border-b-0">
          <div className="text-[1.55rem] font-semibold leading-none tracking-[-0.08em] text-white">{item.rank}</div>
          <div className="flex min-w-0 gap-3">
            <img src={item.ownerAvatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl border border-white/12 bg-white/[0.04] object-cover" />
            <div className="min-w-0">
              <a href={item.url} target="_blank" rel="noreferrer" className="break-words text-base font-medium text-white hover:text-white/70">
                {item.name}
              </a>
              <div className="mt-0.5 break-words text-xs text-white/44">{item.fullName}</div>
              <p className="mt-1.5 text-xs leading-5 text-white/62">{item.summary}</p>
              <p className="mt-0.5 text-[0.72rem] leading-5 text-white/42">{item.whyIncluded}</p>
            </div>
          </div>
          <div><ScopeBadge label={item.scope} /></div>
          <div><SignalBadge /></div>
          <div className="text-base font-semibold text-white">{formatNumber(item.frameworkScore)}</div>
          <div className="text-base font-semibold text-white">{formatNumber(item.stars)}</div>
          <div className="text-base font-semibold text-white">{formatNumber(item.forks)}</div>
          <div className="break-words text-base font-semibold text-white">{item.language ?? "Public"}</div>
        </div>
      ))}
    </section>
  );
}


function Background() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.18),rgba(6,7,10,0.92)_56%,rgba(6,7,10,1))]" />
      <div className="absolute left-[-12%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(100,122,168,0.18),transparent_64%)] blur-[140px]" />
      <div className="absolute right-[-10%] top-[2%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(112,85,132,0.18),transparent_64%)] blur-[150px]" />
      <div className="absolute inset-0 opacity-[0.04] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
    </div>
  );
}

function PageFrame({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <SiteHeader />
      <Background />
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 md:px-8 md:pb-32">
        {children}
      </div>
    </main>
  );
}

async function GitHubStarsPage() {
  const rows = await getRepoRows("stars");
  return (
    <PageFrame>
      <LiveHero slug="github-stars" />
      <RepoTable items={rows} mode="stars" />
    </PageFrame>
  );
}

async function GitHubTrendingPage() {
  const rows = await getRepoRows("trending");
  return (
    <PageFrame>
      <LiveHero slug="github-trending" />
      <RepoTable items={rows} mode="trending" />
    </PageFrame>
  );
}

async function GitHubBuildersPage() {
  const rows = await getBuilderRows();
  return (
    <PageFrame>
      <LiveHero slug="github-builders" />
      <BuilderTable items={rows} />
    </PageFrame>
  );
}

async function AgentFrameworksPage() {
  const rows = await getFrameworkRows();
  return (
    <PageFrame>
      <LiveHero slug="agent-frameworks" />
      <FrameworkTable items={rows} />
    </PageFrame>
  );
}

function StaticPreviewPage({ slug }: { slug: string }) {
  const category = rankingCategories.find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <PageFrame>
      <section className="pt-28 md:pt-30">
        <a href="/rankings" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 hover:text-white">
          ← Back to rankings
        </a>
        <div className="mt-8">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">{category.eyebrow}</div>
          <h1 className="mt-4 max-w-[56rem] text-[clamp(2.35rem,4.8vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
            {category.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/64 md:text-lg md:leading-8">{category.description}</p>
        </div>
        <div className="mt-7 rounded-[1.35rem] border border-white/14 bg-white/[0.025] px-5 py-4 text-sm leading-6 text-white/68">
          This page is a public preview. Final rankings will be published after source review and AIAA methodology approval.
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <InfoStrip label="Ranking Criteria" items={category.criteria} />
          <InfoStrip label="Data Sources" items={category.dataSource ?? ["Public data onboarding"]} />
          <InfoStrip label="Methodology" items={category.methodology ?? ["Preview framework"]} />
        </div>
      </section>

      <section className="mt-6 rounded-[1.6rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
        <div className="grid grid-cols-[0.38fr_1.55fr_0.85fr_1fr_0.95fr_0.65fr] gap-3 border-b border-white/12 px-3 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
          <div>Rank</div>
          <div>Name</div>
          <div>Level</div>
          <div>Category</div>
          <div>Signal</div>
          <div>Score</div>
        </div>
        {category.entries.map((entry) => (
          <div key={`${entry.rank}-${entry.name}`} className="grid grid-cols-[0.38fr_1.55fr_0.85fr_1fr_0.95fr_0.65fr] gap-3 border-b border-white/8 px-3 py-3.5 last:border-b-0">
            <div className="text-[1.55rem] font-semibold leading-none tracking-[-0.08em] text-white">{entry.rank}</div>
            <div className="text-base font-medium text-white">{entry.name}</div>
            <div><ScopeBadge label={entry.level} /></div>
            <div className="text-base text-white/76">{entry.category}</div>
            <div className="text-base text-white/76">{entry.signal}</div>
            <div className="text-base font-semibold text-white">{entry.score}</div>
          </div>
        ))}
      </section>
    </PageFrame>
  );
}

export function generateStaticParams() {
  return rankingCategories.map((category) => ({ slug: category.slug }));
}

export default async function RankingDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "github-stars") return <GitHubStarsPage />;
  if (slug === "github-trending") return <GitHubTrendingPage />;
  if (slug === "github-builders") return <GitHubBuildersPage />;
  if (slug === "agent-frameworks") return <AgentFrameworksPage />;

  return <StaticPreviewPage slug={slug} />;
}
