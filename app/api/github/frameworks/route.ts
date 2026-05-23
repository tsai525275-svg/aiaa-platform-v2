import { NextResponse } from "next/server";

export const revalidate = 3600;

const githubToken = process.env.GITHUB_TOKEN;

function githubHeaders(userAgent: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": userAgent,
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  return headers;
}

type FrameworkConfig = {
  repo: string;
  scope: string;
  summary: string;
  whyIncluded: string;
};

const frameworks: FrameworkConfig[] = [
  {
    repo: "langchain-ai/langgraph",
    scope: "Agent Orchestration",
    summary:
      "A graph based framework for stateful agent workflows, tool calling, routing, and multi step AI systems.",
    whyIncluded:
      "Included because it helps developers build structured AI Agent workflows and orchestration systems."
  },
  {
    repo: "crewAIInc/crewAI",
    scope: "Multi Agent Framework",
    summary:
      "A framework for coordinating multiple AI agents through roles, tasks, crews, and workflow execution.",
    whyIncluded:
      "Included because it focuses on multi agent collaboration, task delegation, and agent workflow execution."
  },
  {
    repo: "microsoft/autogen",
    scope: "Multi Agent Framework",
    summary:
      "A framework for building agent systems, multi agent conversations, tool use, and automated collaboration.",
    whyIncluded:
      "Included because it supports multi agent architecture and developer controlled agent systems."
  },
  {
    repo: "microsoft/semantic-kernel",
    scope: "Enterprise Agent Framework",
    summary:
      "An application framework for connecting models, tools, plugins, planners, and enterprise AI workflows.",
    whyIncluded:
      "Included because it supports production agent architecture, tool calling, and enterprise integration."
  },
  {
    repo: "run-llama/llama_index",
    scope: "Data Agent Framework",
    summary:
      "A data framework for connecting AI systems to documents, retrieval, indexes, tools, and agent workflows.",
    whyIncluded:
      "Included because retrieval, data access, and tool backed context are core parts of agent systems."
  },
  {
    repo: "FlowiseAI/Flowise",
    scope: "Agent Workflow Builder",
    summary:
      "A visual builder for LLM workflows, agent flows, tool usage, and low code AI applications.",
    whyIncluded:
      "Included because it helps teams build agent workflows through a visual development interface."
  },
  {
    repo: "langgenius/dify",
    scope: "Agent App Platform",
    summary:
      "A platform for building AI applications, agent workflows, RAG systems, and production LLM apps.",
    whyIncluded:
      "Included because it provides agent application infrastructure and production workflow tooling."
  },
  {
    repo: "browser-use/browser-use",
    scope: "Browser Agent Toolkit",
    summary:
      "A toolkit that lets AI agents operate browsers, interact with websites, and complete web based tasks.",
    whyIncluded:
      "Included because browser operation is an important agent infrastructure capability."
  },
  {
    repo: "langchain-ai/langchain",
    scope: "Agent Tooling Framework",
    summary:
      "A developer framework for LLM applications, chains, tool calling, integrations, and agent workflows.",
    whyIncluded:
      "Included because it provides foundational tooling used across many agent based systems."
  },
  {
    repo: "Significant-Gravitas/AutoGPT",
    scope: "Autonomous Agent Framework",
    summary:
      "An open source autonomous agent project focused on goal driven task execution and agent experiments.",
    whyIncluded:
      "Included as an early autonomous agent framework reference with major public ecosystem signal."
  }
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
  };
};

type GitHubContributor = {
  login: string;
  contributions: number;
  type: string;
};

type FrameworkResult = {
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

type FrameworkError = {
  repo: string;
  error: string;
};

function daysSince(dateText: string) {
  const now = Date.now();
  const then = new Date(dateText).getTime();
  return Math.max(0, Math.floor((now - then) / 86400000));
}

function calculateFrameworkScore(repo: GitHubRepo, contributorSample: number) {
  const activityDays = daysSince(repo.pushed_at);
  const activityScore = Math.max(0, 120 - activityDays * 2);
  const starScore = Math.min(160, repo.stargazers_count / 800);
  const forkScore = Math.min(90, repo.forks_count / 350);
  const contributorScore = Math.min(80, contributorSample * 4);
  const issueScore = Math.min(50, repo.open_issues_count / 15);

  return Math.round(
    activityScore + starScore + forkScore + contributorScore + issueScore
  );
}

function isFrameworkResult(
  item: FrameworkResult | FrameworkError
): item is FrameworkResult {
  return "frameworkScore" in item;
}

async function fetchContributorSample(repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contributors?per_page=30`,
    {
      headers: githubHeaders("AIAA Framework Signal"),
      next: {
        revalidate: 3600
      }
    }
  );

  if (!response.ok) return 0;

  const contributors = (await response.json()) as GitHubContributor[];

  return contributors.filter((item) => item.type === "User").length;
}

export async function GET() {
  const results: Array<FrameworkResult | FrameworkError> = await Promise.all(
    frameworks.map(async (framework) => {
      const response = await fetch(
        `https://api.github.com/repos/${framework.repo}`,
        {
          headers: githubHeaders("AIAA Framework Signal"),
          next: {
            revalidate: 3600
          }
        }
      );

      if (!response.ok) {
        return {
          repo: framework.repo,
          error: `GitHub request failed with status ${response.status}`
        };
      }

      const repo = (await response.json()) as GitHubRepo;
      const contributorSample = await fetchContributorSample(framework.repo);

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        scope: framework.scope,
        summary: framework.summary,
        whyIncluded: framework.whyIncluded,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        language: repo.language,
        ownerLogin: repo.owner.login,
        ownerAvatarUrl: repo.owner.avatar_url,
        pushedAt: repo.pushed_at,
        updatedAt: repo.updated_at,
        contributorSample,
        frameworkScore: calculateFrameworkScore(repo, contributorSample)
      };
    })
  );

  const validResults = results
    .filter(isFrameworkResult)
    .sort((a, b) => b.frameworkScore - a.frameworkScore)
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      ...item
    }));

  return NextResponse.json({
    source: "GitHub REST API",
    model: "Agent Framework Signal V1",
    rankingSubject: "AI Agent development frameworks",
    updateFrequency: "Hourly cache",
    note:
      "This ranking includes repositories reviewed as agent frameworks, agent infrastructure, or agent workflow builders. Product ranking and skill ranking are tracked separately.",
    total: validResults.length,
    results: validResults,
    errors: results.filter((item) => !isFrameworkResult(item))
  });
}
