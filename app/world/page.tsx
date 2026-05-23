import { SiteHeader } from "@/components/site-header";

const intelligenceStats = [
  { label: "AI Agent News", value: "Editorial" },
  { label: "GitHub Signals", value: "Ranking" },
  { label: "Research Watch", value: "Index" },
  { label: "Company Moves", value: "Market" }
];

const worldNav = [
  { label: "News", href: "#news" },
  { label: "GitHub", href: "#github" },
  { label: "Research", href: "#research" },
  { label: "Companies", href: "#companies" }
];

const newsCards = [
  {
    tag: "Product Watch",
    title: "Agent platforms moving from demos to operating systems",
    summary:
      "AIAA tracks products that combine planning, tool use, browser control, memory, and workflow execution into daily work systems.",
    href: "/rankings/ai-agent-products"
  },
  {
    tag: "Coding Agents",
    title: "Software agents are becoming a separate product category",
    summary:
      "Coding agents, repo agents, and developer automation tools are tracked as a core part of the agent economy.",
    href: "/rankings/ai-agent-products"
  },
  {
    tag: "Enterprise Agents",
    title: "Companies are testing agent systems inside business workflows",
    summary:
      "AIAA monitors enterprise deployment signals, governance needs, and the movement from assistant tools to agent operations.",
    href: "/rankings/agent-frameworks"
  }
];

const githubSignals = [
  {
    title: "GitHub Stars Ranking",
    label: "Open source attention",
    summary: "Track repository visibility, public developer interest, and ecosystem attention.",
    href: "/rankings/github-stars"
  },
  {
    title: "GitHub Trending Ranking",
    label: "Growth momentum",
    summary: "Track rising projects, release velocity, recent growth, and developer adoption signals.",
    href: "/rankings/github-trending"
  },
  {
    title: "GitHub Builders Ranking",
    label: "Developer influence",
    summary: "Track maintainers, builders, contributors, and public engineering influence in AI Agent systems.",
    href: "/rankings/github-builders"
  }
];

const researchCards = [
  {
    title: "Agent Evaluation",
    summary: "Benchmarks, task reliability, tool success rate, and long horizon evaluation.",
    href: "/standards"
  },
  {
    title: "Tool Use",
    summary: "Function calling, browser control, API execution, workflow automation, and safe tool boundaries.",
    href: "/standards"
  },
  {
    title: "Memory and Planning",
    summary: "Context management, task decomposition, retrieval, persistent memory, and execution planning.",
    href: "/standards"
  },
  {
    title: "Multi Agent Systems",
    summary: "Role routing, agent collaboration, supervisor patterns, evaluation loops, and orchestration.",
    href: "/rankings/agent-frameworks"
  }
];

const companyCards = [
  {
    company: "OpenAI",
    focus: "Agent platform and developer tooling",
    signal: "Product and API ecosystem tracking",
    href: "/rankings/ai-agent-products"
  },
  {
    company: "Anthropic",
    focus: "Computer use and enterprise assistant systems",
    signal: "Capability and safety signal tracking",
    href: "/rankings/ai-agent-products"
  },
  {
    company: "Google",
    focus: "Agent products, workspace agents, and model integration",
    signal: "Enterprise and platform signal tracking",
    href: "/rankings/ai-agent-products"
  },
  {
    company: "Microsoft",
    focus: "Copilot agents and business workflow systems",
    signal: "Enterprise deployment signal tracking",
    href: "/rankings/ai-agent-products"
  },
  {
    company: "Salesforce",
    focus: "CRM agents and enterprise automation",
    signal: "Company agent system tracking",
    href: "/rankings/ai-agent-products"
  },
  {
    company: "Zapier",
    focus: "Workflow agents and automation operations",
    signal: "Automation signal tracking",
    href: "/rankings/ai-agent-products"
  }
];

export default function WorldPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080b] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.3),rgba(7,8,11,0.94)_66%,rgba(7,8,11,1))]" />
          <div className="absolute left-[-12%] top-[6%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(102,119,170,0.18),transparent_64%)] blur-[150px]" />
          <div className="absolute right-[-10%] top-[4%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(120,94,76,0.16),transparent_64%)] blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.045] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="mx-auto max-w-5xl text-center">
            <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/44">
              AIAA AI World
            </div>
            <h1 className="mt-5 text-[clamp(3.4rem,8vw,7.1rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
              AI Agent intelligence index.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/64 md:text-xl md:leading-9">
              AIAA World tracks AI Agent news, GitHub signals, research movement, company activity, and public market signals.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
            {worldNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/68 transition-colors duration-300 hover:border-white/28 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-4">
            {intelligenceStats.map((item) => (
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

      <section id="news" className="relative px-5 pb-10 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/42">
                Latest AI Agent News
              </div>
              <h2 className="mt-3 text-[clamp(2rem,4vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.065em] text-white">
                Product launches and agent platform updates.
              </h2>
            </div>
            <a
              href="/rankings/ai-agent-products"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white px-5 text-sm font-medium text-black"
            >
              View product ranking
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {newsCards.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="glass-panel group rounded-[2rem] p-6 transition-transform duration-300 hover:scale-[1.015]"
              >
                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/48">
                  {item.tag}
                </div>
                <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  {item.summary}
                </p>
                <div className="mt-7 text-sm text-white/72 group-hover:text-white">
                  Open signal →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="github" className="relative px-5 py-10 md:px-8">
        <div className="mx-auto max-w-[1440px] rounded-[2.6rem] border border-white/8 bg-white/[0.035] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/42">
                GitHub Signal Board
              </div>
              <h2 className="mt-4 text-[clamp(2.4rem,5vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-white">
                Open source projects gaining developer attention.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/58">
                Repository momentum, star growth, contributor activity, release cadence, and framework adoption signals are prepared for GitHub API integration.
              </p>
            </div>

            <div className="grid gap-3">
              {githubSignals.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="rounded-[1.8rem] border border-white/8 bg-black/20 p-5 transition-colors duration-300 hover:border-white/24"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-white/38">
                    {item.label}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                      {item.title}
                    </h3>
                    <span className="text-white/50">→</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/54">
                    {item.summary}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="research" className="relative px-5 py-10 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/42">
                Research Watch
              </div>
              <h2 className="mt-3 text-[clamp(2rem,4vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.065em] text-white">
                Agent papers, evaluation methods, and benchmark movement.
              </h2>
            </div>
            <a
              href="/standards"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white px-5 text-sm font-medium text-black"
            >
              View standards
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {researchCards.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="glass-panel rounded-[2rem] p-6 transition-transform duration-300 hover:scale-[1.015]"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.045em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/56">
                  {item.summary}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="companies" className="relative px-5 py-10 pb-28 md:px-8 md:pb-40">
        <div className="mx-auto max-w-[1440px] rounded-[2.6rem] border border-white/8 bg-white/[0.035] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/42">
                Company Moves
              </div>
              <h2 className="mt-4 text-[clamp(2.4rem,5vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-white">
                Companies building, funding, or deploying agent systems.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/58">
                This track monitors AI Agent companies, enterprise deployments, funding signals, partnerships, and public product positioning.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {companyCards.map((item) => (
                <a
                  key={item.company}
                  href={item.href}
                  className="rounded-[1.8rem] border border-white/8 bg-black/20 p-5 transition-colors duration-300 hover:border-white/24"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                      {item.company}
                    </h3>
                    <span className="text-white/50">→</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/58">
                    {item.focus}
                  </p>
                  <div className="mt-4 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/52">
                    {item.signal}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
