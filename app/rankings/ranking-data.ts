export type RankingEntry = {
  rank: string;
  name: string;
  level: string;
  category: string;
  signal: string;
  verification: string;
  score: string;
};

export type RankingCategory = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  updateFrequency: string;
  lastUpdated: string;
  dataSource: string[];
  methodology: string[];
  criteria: string[];
  entries: RankingEntry[];
};

const makePreviewEntries = (prefix: string, category: string, signal: string): RankingEntry[] =>
  Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      rank: number,
      name: `${prefix} Candidate ${number}`,
      level: "Pending",
      category,
      signal,
      verification: index < 5 ? "Source Review" : index < 12 ? "Data Pending" : "Preview",
      score: "Pending"
    };
  });

export const rankingCategories: RankingCategory[] = [
  {
    slug: "ai-agent-products",
    eyebrow: "Ranking 01",
    title: "AI Agent Product Ranking",
    description:
      "A public preview of the AIAA ranking framework for AI Agent products, automation platforms, coding agents, browser agents, and enterprise agent systems.",
    updateFrequency: "Preview",
    lastUpdated: "Data collection in progress",
    dataSource: [
      "Public product pages",
      "Company announcements",
      "Public usage signals",
      "AIAA manual review queue"
    ],
    methodology: [
      "Product maturity review",
      "Public usage signal review",
      "Automation capability review",
      "Safety and control review",
      "Final ranking pending AIAA verification"
    ],
    criteria: ["Product maturity", "Real usage", "Automation depth", "Safety control"],
    entries: makePreviewEntries("Agent Product", "Product Candidate", "Product review")
  },
  {
    slug: "github-stars",
    eyebrow: "Ranking 02",
    title: "GitHub Stars Ranking",
    description:
      "A public preview of the AIAA GitHub stars ranking framework for open source AI Agent repositories and developer projects.",
    updateFrequency: "Preview",
    lastUpdated: "Data collection in progress",
    dataSource: [
      "GitHub repository metadata",
      "Public star counts",
      "Fork counts",
      "Contributor activity"
    ],
    methodology: [
      "Repository identification",
      "Stars and fork signal review",
      "Contributor activity review",
      "Repository freshness review",
      "Final ranking pending automated GitHub ingestion"
    ],
    criteria: ["Stars", "Forks", "Contributor count", "Repository activity"],
    entries: makePreviewEntries("Open Source Project", "Repository Candidate", "GitHub signal")
  },
  {
    slug: "github-trending",
    eyebrow: "Ranking 03",
    title: "GitHub Trending Ranking",
    description:
      "A public preview of the AIAA growth ranking framework for AI Agent repositories gaining attention across short term time windows.",
    updateFrequency: "Preview",
    lastUpdated: "Data collection in progress",
    dataSource: [
      "GitHub repository metadata",
      "Recent star growth",
      "Commit activity",
      "Release activity"
    ],
    methodology: [
      "Seven day growth review",
      "Thirty day growth review",
      "Commit velocity review",
      "Release cadence review",
      "Final ranking pending automated GitHub ingestion"
    ],
    criteria: ["7 day growth", "30 day growth", "Commit activity", "Release cadence"],
    entries: makePreviewEntries("Trending Repository", "Growth Candidate", "Growth signal")
  },
  {
    slug: "github-builders",
    eyebrow: "Ranking 04",
    title: "GitHub Builders Ranking",
    description:
      "A public preview of the AIAA builder ranking framework for engineers, maintainers, and contributors shaping the AI Agent ecosystem.",
    updateFrequency: "Preview",
    lastUpdated: "Data collection in progress",
    dataSource: [
      "Public GitHub profiles",
      "Repository ownership signals",
      "Contributor activity",
      "Open source influence signals"
    ],
    methodology: [
      "Agent repository impact review",
      "Contribution depth review",
      "Public profile signal review",
      "Recent activity review",
      "Final ranking pending AIAA profile review"
    ],
    criteria: ["Agent repository impact", "Contribution depth", "Profile signal", "Recent activity"],
    entries: makePreviewEntries("GitHub Builder", "Builder Candidate", "Builder signal")
  },
  {
    slug: "agent-frameworks",
    eyebrow: "Ranking 05",
    title: "AI Agent Framework Ranking",
    description:
      "A public preview of the AIAA framework ranking model for agent orchestration, workflow design, memory, and tool calling infrastructure.",
    updateFrequency: "Preview",
    lastUpdated: "Data collection in progress",
    dataSource: [
      "Public framework documentation",
      "Repository metadata",
      "Developer adoption signals",
      "Enterprise readiness signals"
    ],
    methodology: [
      "Developer experience review",
      "Documentation review",
      "Tool calling capability review",
      "Enterprise fit review",
      "Final ranking pending AIAA technical review"
    ],
    criteria: ["Developer experience", "Documentation", "Tool calling", "Enterprise fit"],
    entries: makePreviewEntries("Agent Framework", "Framework Candidate", "Framework review")
  }
];
