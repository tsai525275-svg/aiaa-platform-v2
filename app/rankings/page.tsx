import { SiteHeader } from "@/components/site-header";

const rankingGroups = [
  {
    id: "agent-products",
    label: "01",
    title: "AI Agent Product Ranking",
    description:
      "A market ranking for AI Agent products, automation platforms, coding agents, browser agents, and enterprise agent systems.",
    metrics: ["Product maturity", "Real usage", "Automation depth", "Safety control"],
    rows: [
      { rank: "01", name: "OpenAI Agent", category: "Agent Platform", signal: "Product index", status: "Tracking" },
      { rank: "02", name: "Claude Computer Use", category: "Computer Agent", signal: "Capability index", status: "Tracking" },
      { rank: "03", name: "Devin", category: "Coding Agent", signal: "Developer index", status: "Tracking" },
      { rank: "04", name: "Manus", category: "General Agent", signal: "Market index", status: "Tracking" },
      { rank: "05", name: "Zapier Agents", category: "Workflow Agent", signal: "Automation index", status: "Tracking" }
    ]
  },
  {
    id: "github-stars",
    label: "02",
    title: "GitHub Stars Ranking",
    description:
      "A public open source ranking for AI Agent frameworks and tools, based on stars, forks, contributors, and update frequency.",
    metrics: ["Stars", "Forks", "Contributors", "Last update"],
    rows: [
      { rank: "01", name: "LangGraph", category: "Agent Framework", signal: "GitHub data pending", status: "API ready" },
      { rank: "02", name: "CrewAI", category: "Multi Agent Framework", signal: "GitHub data pending", status: "API ready" },
      { rank: "03", name: "AutoGen", category: "Multi Agent Framework", signal: "GitHub data pending", status: "API ready" },
      { rank: "04", name: "OpenHands", category: "Coding Agent", signal: "GitHub data pending", status: "API ready" },
      { rank: "05", name: "Browser Use", category: "Browser Agent", signal: "GitHub data pending", status: "API ready" }
    ]
  },
  {
    id: "github-trending",
    label: "03",
    title: "GitHub Trending Growth Ranking",
    description:
      "A growth ranking that tracks which AI Agent projects are gaining attention fastest over 7, 30, and 90 day windows.",
    metrics: ["7 day growth", "30 day growth", "Commit activity", "Release cadence"],
    rows: [
      { rank: "01", name: "Fastest rising project", category: "Open Source", signal: "Growth data pending", status: "Planned" },
      { rank: "02", name: "Fastest rising framework", category: "Framework", signal: "Growth data pending", status: "Planned" },
      { rank: "03", name: "Fastest rising tool", category: "Developer Tool", signal: "Growth data pending", status: "Planned" },
      { rank: "04", name: "Fastest rising benchmark", category: "Evaluation", signal: "Growth data pending", status: "Planned" },
      { rank: "05", name: "Fastest rising agent app", category: "Product", signal: "Growth data pending", status: "Planned" }
    ]
  },
  {
    id: "github-builders",
    label: "04",
    title: "GitHub AI Agent Builders Ranking",
    description:
      "A talent ranking for engineers, builders, and maintainers who contribute to the AI Agent ecosystem.",
    metrics: ["Followers", "Agent repos", "Total stars", "Recent activity"],
    rows: [
      { rank: "01", name: "Agent framework maintainer", category: "Builder", signal: "Profile data pending", status: "Planned" },
      { rank: "02", name: "Open source agent creator", category: "Builder", signal: "Profile data pending", status: "Planned" },
      { rank: "03", name: "Benchmark contributor", category: "Research Builder", signal: "Profile data pending", status: "Planned" },
      { rank: "04", name: "Automation engineer", category: "Operator", signal: "Profile data pending", status: "Planned" },
      { rank: "05", name: "Tooling contributor", category: "Developer Tooling", signal: "Profile data pending", status: "Planned" }
    ]
  },
  {
    id: "frameworks",
    label: "05",
    title: "AI Agent Framework Ranking",
    description:
      "A technical ranking for frameworks used to build, deploy, evaluate, and manage AI Agent systems.",
    metrics: ["Developer experience", "Documentation", "Tool calling", "Enterprise fit"],
    rows: [
      { rank: "01", name: "LangGraph", category: "Framework", signal: "Framework index", status: "Tracking" },
      { rank: "02", name: "CrewAI", category: "Framework", signal: "Framework index", status: "Tracking" },
      { rank: "03", name: "AutoGen", category: "Framework", signal: "Framework index", status: "Tracking" },
      { rank: "04", name: "Semantic Kernel", category: "Framework", signal: "Framework index", status: "Tracking" },
      { rank: "05", name: "LlamaIndex Agents", category: "Framework", signal: "Framework index", status: "Tracking" }
    ]
  }
];

const rankingStats = [
  { label: "Ranking systems", value: "5" },
  { label: "Tracked categories", value: "25" },
  { label: "Data phase", value: "V1" },
  { label: "Update model", value: "Manual first" }
];

export default function RankingsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080b] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.42),rgba(7,8,11,0.92)_65%,rgba(7,8,11,1))]" />
          <div className="absolute left-[-8%] top-[8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(104,118,164,0.2),transparent_62%)] blur-[140px]" />
          <div className="absolute right-[-6%] top-[4%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(120,94,76,0.16),transparent_64%)] blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.045] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
        </div>

        <div className="section-shell relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/44">
              AIAA Rankings Hub
            </div>
            <h1 className="mt-5 text-[clamp(3.6rem,9vw,8.2rem)] font-semibold leading-[0.88] tracking-[-0.08em] text-white">
              Ranking the AI Agent economy.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/64 md:text-xl md:leading-9">
              AIAA tracks products, frameworks, open source projects, GitHub builders, and verified certification signals across the AI Agent ecosystem.
            </p>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-4">
            {rankingStats.map((item) => (
              <div key={item.label} className="glass-panel rounded-[1.8rem] p-5 text-center">
                <div className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-4xl">
                  {item.value}
                </div>
                <div className="mt-2 text-[0.72rem] uppercase tracking-[0.22em] text-white/42">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24 md:pb-40">
        <div className="section-shell grid gap-6">
          {rankingGroups.map((group) => (
            <article key={group.id} id={group.id} className="glass-panel overflow-hidden rounded-[2.5rem] p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
                <div>
                  <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/38">
                    Ranking {group.label}
                  </div>
                  <h2 className="mt-4 text-[clamp(2rem,4vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-white">
                    {group.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/58 md:text-base md:leading-8">
                    {group.description}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {group.metrics.map((metric) => (
                      <span key={metric} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/62">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
                  <div className="grid grid-cols-[0.42fr_1.25fr_1fr_1fr_0.8fr] border-b border-white/8 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/34">
                    <span>Rank</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Signal</span>
                    <span>Status</span>
                  </div>

                  {group.rows.map((row) => (
                    <div key={`${group.id}-${row.rank}`} className="grid grid-cols-[0.42fr_1.25fr_1fr_1fr_0.8fr] items-center gap-2 border-b border-white/6 px-4 py-4 text-sm last:border-b-0">
                      <span className="font-semibold text-white/80">{row.rank}</span>
                      <span className="font-medium text-white">{row.name}</span>
                      <span className="text-white/52">{row.category}</span>
                      <span className="text-white/52">{row.signal}</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-center text-xs text-white/60">
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
