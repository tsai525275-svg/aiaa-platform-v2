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

type GitHubRepoResult = {
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

function isGitHubRepoResult(
  item: GitHubRepoResult | GitHubRepoError
): item is GitHubRepoResult {
  return "stars" in item;
}

export async function GET() {
  const results: Array<GitHubRepoResult | GitHubRepoError> = await Promise.all(
    repos.map(async (repo) => {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: githubHeaders("AIAA Ranking System"),
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
        ownerAvatarUrl: data.owner.avatar_url
      };
    })
  );

  const validResults = results
    .filter(isGitHubRepoResult)
    .sort((a, b) => b.stars - a.stars)
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      ...item
    }));

  return NextResponse.json({
    source: "GitHub REST API",
    updateFrequency: "Hourly cache",
    total: validResults.length,
    results: validResults,
    errors: results.filter((item) => !isGitHubRepoResult(item))
  });
}
