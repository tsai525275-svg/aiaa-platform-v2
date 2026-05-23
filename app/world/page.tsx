import { SiteHeader } from "@/components/site-header";

const newsItems = [
  {
    label: "AI Agent News",
    title: "Product launches and agent platform updates",
    description:
      "AIAA tracks major AI Agent product releases, automation launches, coding agents, browser agents, and enterprise agent systems.",
    status: "Editorial tracking"
  },
  {
    label: "GitHub Signals",
    title: "Open source projects gaining developer attention",
    description:
      "Repository momentum, star growth, contributor activity, release cadence, and framework adoption signals are prepared for future GitHub API integration.",
    status: "API ready"
  },
  {
    label: "Research Watch",
    title: "Agent papers, evaluation methods, and benchmark movement",
    description:
      "AIAA follows research related to tool calling, memory, planning, multi agent systems, long horizon tasks, and safety evaluation.",
    status: "Research index"
  },
  {
    label: "Company Moves",
    title: "Companies building, funding, or deploying agent systems",
    description:
      "This track monitors AI Agent companies, enterprise deployments, funding signals, partnerships, and public product positioning.",
    status: "Market watch"
  }
];

const signalColumns = [
  {
    title: "Agent Products",
    items: ["Coding agents", "Browser agents", "Workflow agents", "Enterprise agents"]
  },
  {
    title: "Open Source",
    items: ["GitHub stars", "Forks", "Contributors", "Release activity"]
  },
  {
    title: "Research",
    items: ["Benchmarks", "Safety papers", "Tool use", "Multi agent systems"]
  },
  {
    title: "Market",
    items: ["Funding", "Launches", "Partnerships", "Adoption signals"]
  }
];

export default function WorldPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.2),rgba(6,7,10,0.9)_58%,rgba(6,7,10,1))]" />
          <div className="absolute left-[-10%] top-[6%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(88,120,168,0.18),transparent_64%)] blur-[150px]" />
          <div className="absolute right-[-12%] top-[0%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(132,92,150,0.16),transparent_64%)] blur-[160px]" />
          <div className="absolute inset-0 opacity-[0.04] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1320px]">
          <div className="mx-auto max-w-5xl text-center">
            <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/44">
              AIAA AI World
            </div>
            <h1 className="mt-5 text-[clamp(3rem,7vw,6.4rem)] font-semibold leading-[1.02] tracking-[-0.065em] text-white">
              The AI Agent intelligence index.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/64 md:text-xl md:leading-9">
              AIAA World tracks AI Agent news, GitHub signals, research movement, company activity, and public market signals.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-4">
            {signalColumns.map((column) => (
              <div key={column.title} className="glass-panel rounded-[1.8rem] p-5">
                <div className="text-lg font-semibold text-white">{column.title}</div>
                <div className="mt-4 space-y-2">
                  {column.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1rem] border border-white/8 bg-white/[0.035] px-3 py-2 text-sm text-white/58"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-24 md:px-8 md:pb-40">
        <div className="mx-auto grid max-w-[1320px] gap-6">
          {newsItems.map((item) => (
            <article key={item.label} className="glass-panel overflow-hidden rounded-[2.4rem] p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
                <div>
                  <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/38">
                    {item.label}
                  </div>
                  <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/54">
                    {item.status}
                  </div>
                </div>

                <div>
                  <h2 className="text-[clamp(1.9rem,4vw,4rem)] font-semibold leading-[0.96] tracking-[-0.07em] text-white">
                    {item.title}
                  </h2>
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-white/58 md:text-base md:leading-8">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
