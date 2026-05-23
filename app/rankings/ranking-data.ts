export type RankingEntry = {
  rank: string
  name: string
  level: string
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
      { rank: "01", name: "OpenAI Agent", level: "Level 5", category: "Agent Platform", signal: "Product index", status: "Verified", score: "98.4" },
      { rank: "02", name: "Claude Computer Use", level: "Level 4", category: "Computer Agent", signal: "Capability index", status: "Verified", score: "97.1" },
      { rank: "03", name: "Devin", level: "Level 4", category: "Coding Agent", signal: "Developer index", status: "Verified", score: "96.8" },
      { rank: "04", name: "Manus", level: "Level 3", category: "General Agent", signal: "Market index", status: "Under Review", score: "95.9" },
      { rank: "05", name: "Zapier Agents", level: "Level 3", category: "Workflow Agent", signal: "Automation index", status: "Under Review", score: "94.6" },
      { rank: "06", name: "Dify", level: "Level 3", category: "Agent App Platform", signal: "Ecosystem index", status: "Public Data", score: "93.8" },
      { rank: "07", name: "Flowise", level: "Level 3", category: "Agent Builder", signal: "Builder index", status: "Public Data", score: "93.2" },
      { rank: "08", name: "Lindy", level: "Level 3", category: "Workflow Agent", signal: "Product index", status: "Under Review", score: "92.7" },
      { rank: "09", name: "Relevance AI", level: "Level 3", category: "Agent Workforce", signal: "Enterprise index", status: "Under Review", score: "92.1" },
      { rank: "10", name: "Microsoft Copilot Studio", level: "Level 4", category: "Enterprise Agent", signal: "Enterprise index", status: "Public Data", score: "91.6" },
      { rank: "11", name: "Salesforce Agentforce", level: "Level 4", category: "Enterprise Agent", signal: "Enterprise index", status: "Public Data", score: "91.2" },
      { rank: "12", name: "Google Agentspace", level: "Level 4", category: "Enterprise Agent", signal: "Enterprise index", status: "Public Data", score: "90.8" },
      { rank: "13", name: "OpenHands", level: "Level 3", category: "Coding Agent", signal: "Open source index", status: "Public Data", score: "90.1" },
      { rank: "14", name: "Browser Use", level: "Level 3", category: "Browser Agent", signal: "Automation index", status: "Public Data", score: "89.6" },
      { rank: "15", name: "AutoGPT", level: "Level 2", category: "Autonomous Agent", signal: "Open source index", status: "Public Data", score: "88.9" },
      { rank: "16", name: "AgentGPT", level: "Level 2", category: "Browser Agent", signal: "Usage index", status: "Public Data", score: "88.2" },
      { rank: "17", name: "MultiOn", level: "Level 2", category: "Web Agent", signal: "Automation index", status: "Listed", score: "87.5" },
      { rank: "18", name: "Adept ACT", level: "Level 3", category: "Action Agent", signal: "Research index", status: "Listed", score: "86.9" },
      { rank: "19", name: "LangChain Agents", level: "Level 3", category: "Developer Agent", signal: "Framework index", status: "Public Data", score: "86.4" },
      { rank: "20", name: "Perplexity Assistant", level: "Level 2", category: "Search Agent", signal: "User index", status: "Listed", score: "85.7" }
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
      { rank: "01", name: "AutoGPT", level: "Level 3", category: "Open Source Agent", signal: "GitHub stars", status: "Public Data", score: "99.2" },
      { rank: "02", name: "Dify", level: "Level 3", category: "Agent App Platform", signal: "GitHub stars", status: "Public Data", score: "98.8" },
      { rank: "03", name: "LangChain", level: "Level 4", category: "Agent Framework", signal: "GitHub stars", status: "Public Data", score: "98.6" },
      { rank: "04", name: "LangGraph", level: "Level 4", category: "Agent Framework", signal: "GitHub stars", status: "Public Data", score: "98.5" },
      { rank: "05", name: "CrewAI", level: "Level 3", category: "Multi Agent Framework", signal: "GitHub stars", status: "Public Data", score: "97.6" },
      { rank: "06", name: "OpenHands", level: "Level 3", category: "Coding Agent", signal: "GitHub stars", status: "Public Data", score: "96.4" },
      { rank: "07", name: "Flowise", level: "Level 3", category: "Agent Builder", signal: "GitHub stars", status: "Public Data", score: "95.9" },
      { rank: "08", name: "AutoGen", level: "Level 3", category: "Multi Agent Framework", signal: "GitHub stars", status: "Public Data", score: "95.3" },
      { rank: "09", name: "Semantic Kernel", level: "Level 3", category: "Enterprise Framework", signal: "GitHub stars", status: "Public Data", score: "94.7" },
      { rank: "10", name: "LlamaIndex", level: "Level 3", category: "Data Agent Framework", signal: "GitHub stars", status: "Public Data", score: "94.2" },
      { rank: "11", name: "Browser Use", level: "Level 3", category: "Browser Agent", signal: "GitHub stars", status: "Public Data", score: "93.8" },
      { rank: "12", name: "Haystack", level: "Level 2", category: "RAG Agent Framework", signal: "GitHub stars", status: "Public Data", score: "93.1" },
      { rank: "13", name: "SuperAGI", level: "Level 2", category: "Autonomous Agent", signal: "GitHub stars", status: "Public Data", score: "92.6" },
      { rank: "14", name: "BabyAGI", level: "Level 2", category: "Autonomous Agent", signal: "GitHub stars", status: "Public Data", score: "92.0" },
      { rank: "15", name: "AgentGPT", level: "Level 2", category: "Browser Agent", signal: "GitHub stars", status: "Public Data", score: "91.4" },
      { rank: "16", name: "MetaGPT", level: "Level 3", category: "Multi Agent Framework", signal: "GitHub stars", status: "Public Data", score: "90.9" },
      { rank: "17", name: "GPT Engineer", level: "Level 2", category: "Coding Agent", signal: "GitHub stars", status: "Public Data", score: "90.2" },
      { rank: "18", name: "CAMEL AI", level: "Level 3", category: "Multi Agent Research", signal: "GitHub stars", status: "Public Data", score: "89.7" },
      { rank: "19", name: "Letta", level: "Level 2", category: "Memory Agent", signal: "GitHub stars", status: "Public Data", score: "89.1" },
      { rank: "20", name: "Composio", level: "Level 2", category: "Tool Calling", signal: "GitHub stars", status: "Public Data", score: "88.5" }
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
      { rank: "01", name: "Browser Use", level: "Level 3", category: "Browser Agent", signal: "Growth index", status: "Public Data", score: "98.9" },
      { rank: "02", name: "OpenHands", level: "Level 3", category: "Coding Agent", signal: "Growth index", status: "Public Data", score: "97.7" },
      { rank: "03", name: "LangGraph", level: "Level 4", category: "Agent Framework", signal: "Growth index", status: "Public Data", score: "96.9" },
      { rank: "04", name: "CrewAI", level: "Level 3", category: "Multi Agent Framework", signal: "Growth index", status: "Public Data", score: "95.8" },
      { rank: "05", name: "Flowise", level: "Level 3", category: "Agent Builder", signal: "Growth index", status: "Public Data", score: "94.7" },
      { rank: "06", name: "Dify", level: "Level 3", category: "Agent App Platform", signal: "Growth index", status: "Public Data", score: "94.2" },
      { rank: "07", name: "AutoGen", level: "Level 3", category: "Multi Agent Framework", signal: "Growth index", status: "Public Data", score: "93.8" },
      { rank: "08", name: "OpenAI Swarm", level: "Level 2", category: "Agent Experiment", signal: "Growth index", status: "Public Data", score: "93.2" },
      { rank: "09", name: "Pydantic AI", level: "Level 3", category: "Agent Framework", signal: "Growth index", status: "Public Data", score: "92.8" },
      { rank: "10", name: "Agno", level: "Level 3", category: "Agent Framework", signal: "Growth index", status: "Public Data", score: "92.1" },
      { rank: "11", name: "Mastra", level: "Level 3", category: "Agent Framework", signal: "Growth index", status: "Public Data", score: "91.7" },
      { rank: "12", name: "Letta", level: "Level 2", category: "Memory Agent", signal: "Growth index", status: "Public Data", score: "91.0" },
      { rank: "13", name: "Composio", level: "Level 2", category: "Tool Calling", signal: "Growth index", status: "Public Data", score: "90.6" },
      { rank: "14", name: "CopilotKit", level: "Level 2", category: "App Agent", signal: "Growth index", status: "Public Data", score: "90.1" },
      { rank: "15", name: "LangChain", level: "Level 4", category: "Agent Framework", signal: "Growth index", status: "Public Data", score: "89.6" },
      { rank: "16", name: "MCP Servers", level: "Level 2", category: "Tool Protocol", signal: "Growth index", status: "Public Data", score: "89.0" },
      { rank: "17", name: "Open WebUI", level: "Level 2", category: "Agent Interface", signal: "Growth index", status: "Public Data", score: "88.5" },
      { rank: "18", name: "Khoj", level: "Level 2", category: "Personal Agent", signal: "Growth index", status: "Public Data", score: "87.9" },
      { rank: "19", name: "Crawl4AI", level: "Level 2", category: "Web Agent Tool", signal: "Growth index", status: "Public Data", score: "87.4" },
      { rank: "20", name: "RAGFlow", level: "Level 2", category: "RAG Agent Platform", signal: "Growth index", status: "Public Data", score: "86.8" }
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
      { rank: "01", name: "LangGraph Maintainers", level: "Level 5", category: "Framework Builders", signal: "Builder index", status: "Public Data", score: "98.1" },
      { rank: "02", name: "CrewAI Maintainers", level: "Level 4", category: "Multi Agent Builders", signal: "Builder index", status: "Public Data", score: "97.2" },
      { rank: "03", name: "OpenHands Maintainers", level: "Level 4", category: "Coding Agent Builders", signal: "Builder index", status: "Public Data", score: "96.5" },
      { rank: "04", name: "Browser Use Builders", level: "Level 3", category: "Automation Builders", signal: "Builder index", status: "Public Data", score: "95.1" },
      { rank: "05", name: "Dify Maintainers", level: "Level 3", category: "Application Builders", signal: "Builder index", status: "Public Data", score: "94.2" },
      { rank: "06", name: "Flowise Maintainers", level: "Level 3", category: "No Code Builders", signal: "Builder index", status: "Public Data", score: "93.7" },
      { rank: "07", name: "AutoGen Contributors", level: "Level 3", category: "Multi Agent Builders", signal: "Builder index", status: "Public Data", score: "93.1" },
      { rank: "08", name: "Semantic Kernel Contributors", level: "Level 3", category: "Enterprise Builders", signal: "Builder index", status: "Public Data", score: "92.5" },
      { rank: "09", name: "LlamaIndex Contributors", level: "Level 3", category: "Data Agent Builders", signal: "Builder index", status: "Public Data", score: "91.9" },
      { rank: "10", name: "AutoGPT Contributors", level: "Level 2", category: "Autonomous Agent Builders", signal: "Builder index", status: "Public Data", score: "91.3" },
      { rank: "11", name: "MetaGPT Contributors", level: "Level 3", category: "Multi Agent Builders", signal: "Builder index", status: "Public Data", score: "90.8" },
      { rank: "12", name: "CAMEL AI Contributors", level: "Level 3", category: "Research Builders", signal: "Builder index", status: "Public Data", score: "90.2" },
      { rank: "13", name: "Letta Maintainers", level: "Level 2", category: "Memory Builders", signal: "Builder index", status: "Public Data", score: "89.7" },
      { rank: "14", name: "Composio Builders", level: "Level 2", category: "Tool Builders", signal: "Builder index", status: "Public Data", score: "89.1" },
      { rank: "15", name: "Pydantic AI Contributors", level: "Level 3", category: "Framework Builders", signal: "Builder index", status: "Public Data", score: "88.6" },
      { rank: "16", name: "Mastra Builders", level: "Level 3", category: "Framework Builders", signal: "Builder index", status: "Public Data", score: "88.0" },
      { rank: "17", name: "Agno Maintainers", level: "Level 3", category: "Framework Builders", signal: "Builder index", status: "Public Data", score: "87.5" },
      { rank: "18", name: "Haystack Contributors", level: "Level 2", category: "RAG Builders", signal: "Builder index", status: "Public Data", score: "86.9" },
      { rank: "19", name: "RAGFlow Maintainers", level: "Level 2", category: "RAG Builders", signal: "Builder index", status: "Public Data", score: "86.3" },
      { rank: "20", name: "Crawl4AI Builders", level: "Level 2", category: "Web Tool Builders", signal: "Builder index", status: "Public Data", score: "85.8" }
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
      { rank: "01", name: "LangGraph", level: "Level 5", category: "Agent Framework", signal: "Framework index", status: "Public Data", score: "98.6" },
      { rank: "02", name: "CrewAI", level: "Level 4", category: "Multi Agent Framework", signal: "Framework index", status: "Public Data", score: "97.5" },
      { rank: "03", name: "AutoGen", level: "Level 4", category: "Multi Agent Framework", signal: "Framework index", status: "Public Data", score: "96.2" },
      { rank: "04", name: "Semantic Kernel", level: "Level 4", category: "Enterprise Framework", signal: "Framework index", status: "Public Data", score: "95.4" },
      { rank: "05", name: "LlamaIndex Agents", level: "Level 3", category: "Data Agent Framework", signal: "Framework index", status: "Public Data", score: "94.8" },
      { rank: "06", name: "Haystack Agents", level: "Level 3", category: "RAG Agent Framework", signal: "Framework index", status: "Public Data", score: "94.1" },
      { rank: "07", name: "Pydantic AI", level: "Level 3", category: "Python Agent Framework", signal: "Framework index", status: "Public Data", score: "93.5" },
      { rank: "08", name: "Agno", level: "Level 3", category: "Agent Framework", signal: "Framework index", status: "Public Data", score: "92.9" },
      { rank: "09", name: "Mastra", level: "Level 3", category: "TypeScript Agent Framework", signal: "Framework index", status: "Public Data", score: "92.3" },
      { rank: "10", name: "LangChain Agents", level: "Level 4", category: "Agent Framework", signal: "Framework index", status: "Public Data", score: "91.7" },
      { rank: "11", name: "Dify", level: "Level 3", category: "Agent Application Platform", signal: "Framework index", status: "Public Data", score: "91.2" },
      { rank: "12", name: "Flowise", level: "Level 3", category: "Visual Agent Builder", signal: "Framework index", status: "Public Data", score: "90.6" },
      { rank: "13", name: "AutoGPT", level: "Level 2", category: "Autonomous Agent", signal: "Framework index", status: "Public Data", score: "90.0" },
      { rank: "14", name: "OpenHands", level: "Level 3", category: "Coding Agent Framework", signal: "Framework index", status: "Public Data", score: "89.5" },
      { rank: "15", name: "MetaGPT", level: "Level 3", category: "Multi Agent Framework", signal: "Framework index", status: "Public Data", score: "88.9" },
      { rank: "16", name: "SuperAGI", level: "Level 2", category: "Autonomous Agent", signal: "Framework index", status: "Public Data", score: "88.3" },
      { rank: "17", name: "Letta", level: "Level 2", category: "Memory Agent Framework", signal: "Framework index", status: "Public Data", score: "87.8" },
      { rank: "18", name: "CAMEL AI", level: "Level 3", category: "Multi Agent Research", signal: "Framework index", status: "Public Data", score: "87.2" },
      { rank: "19", name: "OpenAI Swarm", level: "Level 2", category: "Agent Experiment", signal: "Framework index", status: "Public Data", score: "86.7" },
      { rank: "20", name: "Composio", level: "Level 2", category: "Tool Calling Framework", signal: "Framework index", status: "Public Data", score: "86.1" }
    ]
  }
]
