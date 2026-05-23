import { SiteHeader } from "@/components/site-header";
import { rankingCategories } from "./ranking-data";

const levelBadgeClass = (level: string) => {
  if (level === "Level 1") return "border-sky-300/35 bg-sky-300/[0.12] text-sky-100";
  if (level === "Level 2") return "border-purple-300/35 bg-purple-300/[0.12] text-purple-100";
  if (level === "Level 3") return "border-amber-300/35 bg-amber-300/[0.14] text-amber-100";
  if (level === "Level 4") return "border-yellow-200/30 bg-black/55 text-yellow-100";
  if (level === "Level 5") return "border-white/35 bg-white/[0.18] text-white";

  return "border-white/12 bg-white/[0.05] text-white/62";
};

const verificationBadgeClass = (verification: string) => {
  if (verification === "Source Review") {
    return "border-amber-300/25 bg-amber-300/[0.12] text-amber-100";
  }

  if (verification === "Data Pending") {
    return "border-sky-300/25 bg-sky-300/[0.12] text-sky-100";
  }

  if (verification === "Preview") {
    return "border-white/12 bg-white/[0.05] text-white/58";
  }

  return "border-white/10 bg-white/[0.04] text-white/58";
};

const rankingStats = [
  { label: "Ranking frameworks", value: rankingCategories.length.toString() },
  {
    label: "Preview entries",
    value: rankingCategories
      .reduce((total, group) => total + group.entries.length, 0)
      .toString()
  },
  { label: "Data phase", value: "Preview" },
  { label: "Verification", value: "Pending" }
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
              AIAA Rankings Preview
            </div>
            <h1 className="mt-5 text-[clamp(3.2rem,8vw,7.2rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
              Ranking framework for the AI Agent economy.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/64 md:text-xl md:leading-9">
              AIAA is preparing ranking frameworks for agent products, open source repositories, GitHub builders, and agent frameworks. Public data collection is in progress.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-4xl rounded-[1.5rem] border border-amber-200/16 bg-amber-200/[0.06] px-5 py-4 text-center text-sm leading-7 text-amber-50/74">
            This page is a public preview of the AIAA ranking framework. Final rankings will be published after source review, data verification, and AIAA methodology approval.
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
          {rankingCategories.map((group) => (
            <article
              key={group.slug}
              id={group.slug}
              className="glass-panel overflow-hidden rounded-[2.5rem] p-6 md:p-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
                <div>
                  <div className="text-[0.72rem] uppercase tracking-[0.3em] text-white/38">
                    {group.eyebrow}
                  </div>
                  <h2 className="mt-4 text-[clamp(2rem,4vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-white">
                    {group.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/58 md:text-base md:leading-8">
                    {group.description}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {group.criteria.map((metric) => (
                      <span
                        key={metric}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/62"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`/rankings/${group.slug}`}
                    className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white px-5 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.03]"
                  >
                    View Preview Framework <span className="ml-3">→</span>
                  </a>
                </div>

                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-black/20">
                  <div className="min-w-[920px]">
                    <div className="grid grid-cols-[0.42fr_1.3fr_0.86fr_1fr_1fr_1fr_0.75fr] border-b border-white/8 px-4 py-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/34">
                      <span>Rank</span>
                      <span>Name</span>
                      <span className="text-center">Level</span>
                      <span>Category</span>
                      <span>Signal</span>
                      <span className="text-center">Verification</span>
                      <span className="text-right">Score</span>
                    </div>

                    {group.entries.slice(0, 5).map((row) => (
                      <div
                        key={`${group.slug}-${row.rank}`}
                        className="grid grid-cols-[0.42fr_1.3fr_0.86fr_1fr_1fr_1fr_0.75fr] items-center gap-2 border-b border-white/6 px-4 py-4 text-sm last:border-b-0"
                      >
                        <span className="font-semibold text-white/80">{row.rank}</span>
                        <span className="font-medium text-white">{row.name}</span>
                        <span className="flex justify-center">
                          <span className={`inline-flex min-w-[6.8rem] justify-center rounded-full border px-3 py-1 text-xs ${levelBadgeClass(row.level)}`}>
                            {row.level}
                          </span>
                        </span>
                        <span className="text-white/52">{row.category}</span>
                        <span className="text-white/52">{row.signal}</span>
                        <span className="flex justify-center">
                          <span className={`inline-flex min-w-[7.2rem] justify-center rounded-full border px-3 py-1 text-xs ${verificationBadgeClass(row.verification)}`}>
                            {row.verification}
                          </span>
                        </span>
                        <span className="text-right font-semibold text-white/80">{row.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
