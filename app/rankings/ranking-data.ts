export type RankingEntry = {
  rank: string
  name: string
  category: string
  signal: string
  status: string
  score: string
}

export type RankingCategory = {
  slug: string
  eyebrow: string
  title: string
  description: string
  updateFrequency: string
  criteria: string[]
  entries: RankingEntry[]
}

export const rankingCategories: RankingCategory[] = [
  {
    slug: "ai-agent-products",
    eyebrow: "Ranking 01",
    title: "AI Agent Product Ranking",
    description:
      "A market ranking for AI Agent products, automation platforms, coding agents, browser agents, and enterprise agent systems.",
    updateFrequency: "Weekly",
    criteria: [
      "Product maturity",
      "Real usage",
      "Automation depth",
      "Safety control"
    ],
    entries: [
      {
        rank: "01",
        name: "OpenAI Agent",
        category: "Agent Platform",
        signal: "Product index",
        status: "Tracking",
        score: "98.4"
      },
      {
        rank: "02",
        name: "Claude Computer Use",
        category: "Computer Agent",
        signal: "Capability index",
        status: "Tracking",
        score: "97.1"
      },
      {
        rank: "03",
        name: "Devin",
        category: "Coding Agent",
        signal: "Developer index",
        status: "Tracking",
        score: "96.8"
      },
      {
        rank: "04",
        name: "Manus",
        category: "General Agent",
        signal: "Market index",
        status: "Tracking",
        score: "95.9"
      },
      {
        rank: "05",
        name: "Zapier Agents",
        category: "Workflow Agent",
        signal: "Automation index",
        status: "Tracking",
        score: "94.6"
      }
    ]
  },
  {
    slug: "github-stars",
    eyebrow: "Ranking 02",
    title: "GitHub Stars Ranking",
    description:
      "A ranking for open source AI Agent projects based on public GitHub attention, repository scale, and ecosystem visibility.",
    updateFrequency: "Weekly",
    criteria: [
      "Stars",
      "Forks",
      "Contributor count",
      "Repository activity"
    ],
    entries: [
      {
        rank: "01",
        name: "AutoGPT",
        category: "Open Source Agent",
        signal: "GitHub stars",
        status: "Tracking",
        score: "99.2"
      },
      {
        rank: "02",
        name: "LangGraph",
        category: "Agent Framework",
        signal: "GitHub stars",
        status: "Tracking",
        score: "98.5"
      },
      {
        rank: "03",
        name: "CrewAI",
        category: "Multi Agent Framework",
        signal: "GitHub stars",
        status: "Tracking",
        score: "97.6"
      },
      {
        rank: "04",
        name: "OpenHands",
        category: "Coding Agent",
        signal: "GitHub stars",
        status: "Tracking",
        score: "96.4"
      },
      {
        rank: "05",
        name: "Dify",
        category: "Agent Application Platform",
        signal: "GitHub stars",
        status: "Tracking",
        score: "95.8"
      }
    ]
  },
  {
    slug: "github-trending",
    eyebrow: "Ranking 03",
    title: "GitHub Trending Ranking",
    description:
      "A growth ranking for AI Agent repositories based on recent momentum, developer attention, and update velocity.",
    updateFrequency: "Weekly",
    criteria: [
      "7 day star growth",
      "30 day star growth",
      "Commit activity",
      "Release frequency"
    ],
    entries: [
      {
        rank: "01",
        name: "Browser Use",
        category: "Browser Agent",
        signal: "Growth index",
        status: "Tracking",
        score: "98.9"
      },
      {
        rank: "02",
        name: "OpenHands",
        category: "Coding Agent",
        signal: "Growth index",
        status: "Tracking",
        score: "97.7"
      },
      {
        rank: "03",
        name: "LangGraph",
        category: "Agent Framework",
        signal: "Growth index",
        status: "Tracking",
        score: "96.9"
      },
      {
        rank: "04",
        name: "CrewAI",
        category: "Multi Agent Framework",
        signal: "Growth index",
        status: "Tracking",
        score: "95.8"
      },
      {
        rank: "05",
        name: "Flowise",
        category: "Agent Builder",
        signal: "Growth index",
        status: "Tracking",
        score: "94.7"
      }
    ]
  },
  {
    slug: "github-builders",
    eyebrow: "Ranking 04",
    title: "GitHub Builders Ranking",
    description:
      "A builder ranking for developers who shape the AI Agent open source ecosystem through repositories, commits, and influence.",
    updateFrequency: "Monthly",
    criteria: [
      "Agent repository impact",
      "Follower signal",
      "Contribution depth",
      "Recent activity"
    ],
    entries: [
      {
        rank: "01",
        name: "Agent Framework Maintainers",
        category: "Open Source Builders",
        signal: "Builder index",
        status: "Tracking",
        score: "98.1"
      },
      {
        rank: "02",
        name: "Coding Agent Maintainers",
        category: "Developer Tool Builders",
        signal: "Builder index",
        status: "Tracking",
        score: "97.2"
      },
      {
        rank: "03",
        name: "Browser Agent Builders",
        category: "Automation Builders",
        signal: "Builder index",
        status: "Tracking",
        score: "96.5"
      },
      {
        rank: "04",
        name: "Workflow Agent Builders",
        category: "No Code Builders",
        signal: "Builder index",
        status: "Tracking",
        score: "95.1"
      },
      {
        rank: "05",
        name: "Evaluation Tool Builders",
        category: "Safety Builders",
        signal: "Builder index",
        status: "Tracking",
        score: "94.2"
      }
    ]
  },
  {
    slug: "agent-frameworks",
    eyebrow: "Ranking 05",
    title: "AI Agent Framework Ranking",
    description:
      "A framework ranking for developers and companies choosing infrastructure for agent workflows, orchestration, memory, and tool calling.",
    updateFrequency: "Monthly",
    criteria: [
      "Developer experience",
      "Documentation",
      "Tool calling",
      "Enterprise fit"
    ],
    entries: [
      {
        rank: "01",
        name: "LangGraph",
        category: "Agent Framework",
        signal: "Framework index",
        status: "Tracking",
        score: "98.6"
      },
      {
        rank: "02",
        name: "CrewAI",
        category: "Multi Agent Framework",
        signal: "Framework index",
        status: "Tracking",
        score: "97.5"
      },
      {
        rank: "03",
        name: "AutoGen",
        category: "Multi Agent Framework",
        signal: "Framework index",
        status: "Tracking",
        score: "96.2"
      },
      {
        rank: "04",
        name: "Semantic Kernel",
        category: "Enterprise Framework",
        signal: "Framework index",
        status: "Tracking",
        score: "95.4"
      },
      {
        rank: "05",
        name: "LlamaIndex Agents",
        category: "Data Agent Framework",
        signal: "Framework index",
        status: "Tracking",
        score: "94.8"
      }
    ]
  }
]
