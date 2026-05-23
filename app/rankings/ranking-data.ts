export type RankingEntry = {
  rank: string;
  name: string;
  level: string;
  category: string;
  signal: string;
  status: string;
  score: string;
};

export type RankingCategory = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  updateFrequency: string;
  criteria: string[];
  entries: RankingEntry[];
};

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
        level: "Level 5",
        category: "Agent Platform",
        signal: "Product index",
        status: "Verified",
        score: "98.4"
      },
      {
        rank: "02",
        name: "Claude Computer Use",
        level: "Level 4",
        category: "Computer Agent",
        signal: "Capability index",
        status: "Verified",
        score: "97.1"
      },
      {
        rank: "03",
        name: "Devin",
        level: "Level 4",
        category: "Coding Agent",
        signal: "Developer index",
        status: "Verified",
        score: "96.8"
      },
      {
        rank: "04",
        name: "Manus",
        level: "Level 3",
        category: "General Agent",
        signal: "Market index",
        status: "Under Review",
        score: "95.9"
      },
      {
        rank: "05",
        name: "Zapier Agents",
        level: "Level 3",
        category: "Workflow Agent",
        signal: "Automation index",
        status: "Under Review",
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
        level: "Open Source",
        category: "Open Source Agent",
        signal: "GitHub stars",
        status: "Public Data",
        score: "99.2"
      },
      {
        rank: "02",
        name: "LangGraph",
        level: "Framework",
        category: "Agent Framework",
        signal: "GitHub stars",
        status: "Public Data",
        score: "98.5"
      },
      {
        rank: "03",
        name: "CrewAI",
        level: "Framework",
        category: "Multi Agent Framework",
        signal: "GitHub stars",
        status: "Public Data",
        score: "97.6"
      },
      {
        rank: "04",
        name: "OpenHands",
        level: "Open Source",
        category: "Coding Agent",
        signal: "GitHub stars",
        status: "Public Data",
        score: "96.4"
      },
      {
        rank: "05",
        name: "Dify",
        level: "Platform",
        category: "Agent Application Platform",
        signal: "GitHub stars",
        status: "Public Data",
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
        level: "Open Source",
        category: "Browser Agent",
        signal: "Growth index",
        status: "Public Data",
        score: "98.9"
      },
      {
        rank: "02",
        name: "OpenHands",
        level: "Open Source",
        category: "Coding Agent",
        signal: "Growth index",
        status: "Public Data",
        score: "97.7"
      },
      {
        rank: "03",
        name: "LangGraph",
        level: "Framework",
        category: "Agent Framework",
        signal: "Growth index",
        status: "Public Data",
        score: "96.9"
      },
      {
        rank: "04",
        name: "CrewAI",
        level: "Framework",
        category: "Multi Agent Framework",
        signal: "Growth index",
        status: "Public Data",
        score: "95.8"
      },
      {
        rank: "05",
        name: "Flowise",
        level: "Builder",
        category: "Agent Builder",
        signal: "Growth index",
        status: "Public Data",
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
        level: "Builder Track",
        category: "Open Source Builders",
        signal: "Builder index",
        status: "Listed",
        score: "98.1"
      },
      {
        rank: "02",
        name: "Coding Agent Maintainers",
        level: "Builder Track",
        category: "Developer Tool Builders",
        signal: "Builder index",
        status: "Listed",
        score: "97.2"
      },
      {
        rank: "03",
        name: "Browser Agent Builders",
        level: "Builder Track",
        category: "Automation Builders",
        signal: "Builder index",
        status: "Listed",
        score: "96.5"
      },
      {
        rank: "04",
        name: "Workflow Agent Builders",
        level: "Builder Track",
        category: "No Code Builders",
        signal: "Builder index",
        status: "Listed",
        score: "95.1"
      },
      {
        rank: "05",
        name: "Evaluation Tool Builders",
        level: "Builder Track",
        category: "Safety Builders",
        signal: "Builder index",
        status: "Listed",
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
        level: "Framework",
        category: "Agent Framework",
        signal: "Framework index",
        status: "Public Data",
        score: "98.6"
      },
      {
        rank: "02",
        name: "CrewAI",
        level: "Framework",
        category: "Multi Agent Framework",
        signal: "Framework index",
        status: "Public Data",
        score: "97.5"
      },
      {
        rank: "03",
        name: "AutoGen",
        level: "Framework",
        category: "Multi Agent Framework",
        signal: "Framework index",
        status: "Public Data",
        score: "96.2"
      },
      {
        rank: "04",
        name: "Semantic Kernel",
        level: "Framework",
        category: "Enterprise Framework",
        signal: "Framework index",
        status: "Public Data",
        score: "95.4"
      },
      {
        rank: "05",
        name: "LlamaIndex Agents",
        level: "Framework",
        category: "Data Agent Framework",
        signal: "Framework index",
        status: "Public Data",
        score: "94.8"
      }
    ]
  }
];
