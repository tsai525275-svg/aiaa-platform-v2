import { SiteHeader } from "@/components/site-header";

const intelligenceStats = [
  { label: "News pipeline", value: "Preview" },
  { label: "GitHub signals", value: "Onboarding" },
  { label: "Research watch", value: "Manual" },
  { label: "Company moves", value: "Review" }
];

const worldNav = [
  { label: "News", href: "#news" },
  { label: "GitHub", href: "#github" },
  { label: "Research", href: "#research" },
  { label: "Companies", href: "#companies" }
];

const newsCards = [
  {
    label: "Agent product news",
    title: "Product launch tracking pipeline",
    copy:
      "AIAA is preparing an editorial workflow for AI Agent product launches, platform updates, and enterprise agent releases.",
    href: "/rankings/ai-agent-products"
  },
  {
    label: "Open source news",
    title: "Repository movement watchlist",
    copy:
      "GitHub signals will track stars, releases, contributors, forks, and repository activity for AI Agent projects.",
    href: "/rankings/github-stars"
  },
  {
    label: "Market news",
    title: "Company activity review queue",
    copy:
      "AIAA is building a source review process for company moves, product announcements, and market activity.",
    href: "#companies"
  }
];

const githubSignals = [
  {
    title: "GitHub Stars Preview",
    copy: "Repository attention framework for open source AI Agent projects.",
    href: "/rankings/github-stars"
  },
  {
    title: "GitHub Trending Preview",
    copy: "Growth signal framework for repositories gaining developer attention.",
    href: "/rankings/github-trending"
  },
  {
    title: "GitHub Builders Preview",
    copy: "Builder signal framework for maintainers, contributors, and agent engineers.",
    href: "/rankings/github-builders"
  }
];

const researchCards = [
  "Agent Evaluation",
  "Tool Use",
  "Memory Systems",
  "Multi Agent Collaboration",
  "Safety Review",
  "Human Handoff"
];

const companyCards = [
  "Product updates",
  "Enterprise launches",
  "Partnership signals",
  "Funding signals",
  "Developer platform moves",
  "Regulation watch"
];

export default function WorldPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080b] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,11,0.34),rgba(7,8,11,0.9)_62%,rgba(7,8,11,1))]" />
          <div className="absolute left-[-8%] top-[8%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(89,112,162,0.2),transparent_64%)] blur-[150px]" />
          <div className="absolute right-[-8%] top-[4%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(120,94,76,0.16),transparent_64%)] blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.045] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px]">
          <div className="mx-auto max-w-5xl text-center">
            <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/44">
              AIAA AI World Preview
            </div>
            <h1 className="mt-5 text-[clamp(3.1rem,7vw,6.6rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
              Intelligence layer for the AI Agent world.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/64 md:text-xl md:leading-9">
              AIAA is preparing a public intelligence layer for AI Agent news, GitHub signals, research movement, company activity, and market data.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-4xl rounded-[1.5rem] border border-amber-200/16 bg-amber-200/[0.06] px-5 py-4 text-center text-sm leading-7 text-amber-50/74">
            This page is a public preview. News, GitHub signals, research watchlists, and company activity will be published after source review and editorial verification.
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {worldNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/64 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-4">
            {intelligenceStats.map((item) => (
              <div key={item.label} className="glass-panel rounded-[1.8rem] p-5 text-center">
                <div className="text-2xl font-semibold tracking-[-0.05em] text-white md:text-3xl">
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

      <section id="news" className="relative px-5 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38">
                AI Agent News
              </div>
              <h2 className="mt-3 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-white">
                Editorial tracking preview.
              </h2>
            </div>
            <a href="/rankings" className="inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
              View Rankings
            </a>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {newsCards.map((item) => (
              <a key={item.title} href={item.href} className="glass-panel block rounded-[2rem] p-6 transition-transform duration-300 hover:scale-[1.015]">
                <div className="text-xs uppercase tracking-[0.26em] text-white/36">
                  {item.label}
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  {item.copy}
                </p>
                <div className="mt-6 text-sm font-medium text-white/78">
                  Open preview →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="github" className="relative px-5 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-[1280px] glass-panel rounded-[2.5rem] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38">
                GitHub Signal Board
              </div>
              <h2 className="mt-3 text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-white">
                Public repository signal pipeline.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/58 md:text-base md:leading-8">
                GitHub data will power open source ranking views after repository matching, source validation, and ingestion logic are complete.
              </p>
            </div>

            <div className="grid gap-3">
              {githubSignals.map((item) => (
                <a key={item.title} href={item.href} className="rounded-[1.5rem] border border-white/8 bg-white/[0.035] p-5 transition-colors duration-300 hover:bg-white/[0.055]">
                  <div className="text-lg font-medium text-white">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/54">
                    {item.copy}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative grid gap-6 px-5 pb-24 md:px-8 md:pb-36 lg:grid-cols-2" id="research">
        <div className="mx-auto w-full max-w-[630px] glass-panel rounded-[2.4rem] p-6 md:p-8 lg:mr-0">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38">
            Research Watch
          </div>
          <h2 className="mt-3 text-[clamp(2.1rem,4.2vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.07em] text-white">
            Research topics under review.
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {researchCards.map((item) => (
              <div key={item} className="rounded-[1.3rem] border border-white/8 bg-white/[0.035] p-4 text-sm text-white/66">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[630px] glass-panel rounded-[2.4rem] p-6 md:p-8 lg:ml-0" id="companies">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38">
            Company Moves
          </div>
          <h2 className="mt-3 text-[clamp(2.1rem,4.2vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.07em] text-white">
            Market activity watchlist.
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {companyCards.map((item) => (
              <div key={item} className="rounded-[1.3rem] border border-white/8 bg-white/[0.035] p-4 text-sm text-white/66">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
