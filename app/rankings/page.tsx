import { SiteHeader } from "@/components/site-header";
import { rankingCategories } from "./ranking-data";

const rankingStats = [
  { label: "Ranking systems", value: rankingCategories.length.toString() },
  {
    label: "Tracked entries",
    value: rankingCategories
      .reduce((total, group) => total + group.entries.length, 0)
      .toString()
  },
  { label: "Data phase", value: "V1" },
  { label: "Update model", value: "Manual first" }
];

export default function RankingsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080b] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
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
          {rankingCategories.map((group) => (
            <article
              key={group.slug}
              id={group.slug}
              className="glass-panel overflow-hidden rounded-[2.5rem] p-6 md:p-8"
            >
              <div className="grid gap-8 xl:grid-cols-[0.78fr_1.45fr]">
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
                    View Full Ranking <span className="ml-3">→</span>
                  </a>
                </div>

                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-black/20">
                  <table className="w-full border-collapse text-left" style={{ minWidth: "980px" }}>
                    <thead>
                      <tr className="border-b border-white/8 text-[0.62rem] uppercase tracking-[0.22em] text-white/34">
                        <th className="px-4 py-4 font-medium">Rank</th>
                        <th className="px-4 py-4 font-medium">Name</th>
                        <th className="px-4 py-4 font-medium">Level</th>
                        <th className="px-4 py-4 font-medium">Category</th>
                        <th className="px-4 py-4 font-medium">Signal</th>
                        <th className="px-4 py-4 font-medium">Verification</th>
                        <th className="px-4 py-4 text-right font-medium">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.entries.slice(0, 5).map((row) => (
                        <tr key={`${group.slug}-${row.rank}`} className="border-b border-white/6 last:border-b-0">
                          <td className="px-4 py-5 text-sm font-semibold text-white/80">
                            {row.rank}
                          </td>
                          <td className="px-4 py-5 text-sm font-medium text-white">
                            {row.name}
                          </td>
                          <td className="px-4 py-5">
                            <span className="inline-flex min-w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/64">
                              {row.level}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-sm text-white/52">
                            {row.category}
                          </td>
                          <td className="px-4 py-5 text-sm text-white/52">
                            {row.signal}
                          </td>
                          <td className="px-4 py-5">
                            <span className="inline-flex min-w-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-right text-sm font-semibold text-white/80">
                            {row.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
