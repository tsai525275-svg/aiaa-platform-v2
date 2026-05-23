import { NextResponse } from "next/server";

export const revalidate = 3600;

const repos = [
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
  };
};

type MomentumResult = {
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
  momentumScore: number;
};

type GitHubRepoError = {
  repo: string;
  error: string;
};

function githubHeaders(userAgent: string) {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": userAgent,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
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

function isMomentumResult(
  item: MomentumResult | GitHubRepoError
): item is MomentumResult {
  return "momentumScore" in item;
}

export async function GET() {
  const results: Array<MomentumResult | GitHubRepoError> = await Promise.all(
    repos.map(async (repo) => {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: githubHeaders("AIAA Momentum Signal"),
        next: {
          revalidate: 3600
        }
      });

      if (!response.ok) {
        return {
          repo,
          error: `GitHub request failed with status ${response.status}`
        };
      }

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
      };
    })
  );

  const validResults = results
    .filter(isMomentumResult)
    .sort((a, b) => b.momentumScore - a.momentumScore)
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      ...item
    }));

  return NextResponse.json({
    source: "GitHub REST API",
    model: "Momentum Signal V1",
    updateFrequency: "Hourly cache",
    note: "This is not seven day star growth. It is a public metadata momentum score until daily snapshots are added.",
    total: validResults.length,
    results: validResults,
    errors: results.filter((item) => !isMomentumResult(item))
  });
}
