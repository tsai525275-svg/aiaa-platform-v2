import { NextResponse } from "next/server"

export const revalidate = 3600

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
]

type GitHubContributor = {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

type BuilderRecord = {
  login: string
  avatarUrl: string
  profileUrl: string
  repoCount: number
  totalContributions: number
  repositories: string[]
  builderScore: number
}

type GitHubRepoError = {
  repo: string
  error: string
}

function scoreBuilder(repoCount: number, totalContributions: number) {
  return Math.round(repoCount * 120 + totalContributions)
}

export async function GET() {
  const builderMap = new Map<string, BuilderRecord>()
  const errors: GitHubRepoError[] = []

  await Promise.all(
    repos.map(async (repo) => {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contributors?per_page=30`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "AIAA Builder Signal"
          },
          next: {
            revalidate: 3600
          }
        }
      )

      if (!response.ok) {
        errors.push({
          repo,
          error: `GitHub request failed with status ${response.status}`
        })
        return
      }

      const contributors = (await response.json()) as GitHubContributor[]

      contributors
        .filter((item) => item.login && item.type === "User")
        .forEach((item) => {
          const current = builderMap.get(item.login)

          if (!current) {
            builderMap.set(item.login, {
              login: item.login,
              avatarUrl: item.avatar_url,
              profileUrl: item.html_url,
              repoCount: 1,
              totalContributions: item.contributions,
              repositories: [repo],
              builderScore: scoreBuilder(1, item.contributions)
            })
            return
          }

          const nextRepoCount = current.repositories.includes(repo)
            ? current.repoCount
            : current.repoCount + 1

          const nextRepositories = current.repositories.includes(repo)
            ? current.repositories
            : [...current.repositories, repo]

          const nextTotalContributions =
            current.totalContributions + item.contributions

          builderMap.set(item.login, {
            ...current,
            repoCount: nextRepoCount,
            totalContributions: nextTotalContributions,
            repositories: nextRepositories,
            builderScore: scoreBuilder(nextRepoCount, nextTotalContributions)
          })
        })
    })
  )

  const results = Array.from(builderMap.values())
    .sort((a, b) => b.builderScore - a.builderScore)
    .slice(0, 30)
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      ...item
    }))

  return NextResponse.json({
    source: "GitHub REST API",
    model: "Builder Signal V1",
    updateFrequency: "Hourly cache",
    note: "This ranking is based on public GitHub contributor metadata across tracked AI Agent repositories. It is not an AIAA identity certification.",
    total: results.length,
    trackedRepositories: repos.length,
    results,
    errors
  })
}
