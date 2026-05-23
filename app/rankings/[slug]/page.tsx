import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { rankingCategories } from "../ranking-data";

export function generateStaticParams() {
  return rankingCategories.map((category) => ({ slug: category.slug }));
}

export default async function RankingDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = rankingCategories.find((item) => item.slug === slug);

  if (!category) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 pb-24 pt-36 md:px-8 md:pb-32 md:pt-44">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.2),rgba(6,7,10,0.92)_56%,rgba(6,7,10,1))]" />
          <div className="absolute left-[-12%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(100,122,168,0.18),transparent_64%)] blur-[140px]" />
          <div className="absolute right-[-10%] top-[2%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(112,85,132,0.18),transparent_64%)] blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.04] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1380px]">
          <a
            href="/rankings"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/68 transition-colors duration-300 hover:text-white"
          >
            ← Back to rankings
          </a>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                {category.eyebrow}
              </div>
              <h1 className="mt-5 max-w-4xl text-[clamp(3.2rem,7vw,6.6rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-white">
                {category.title}
              </h1>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 md:p-8">
              <p className="text-base leading-8 text-white/70 md:text-lg">
                {category.description}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-4">
                  <div className="text-xs uppercase tracking-[0.26em] text-white/36">
                    Update frequency
                  </div>
                  <div className="mt-2 text-lg font-medium text-white/86">
                    {category.updateFrequency}
                  </div>
                </div>
                <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-4">
                  <div className="text-xs uppercase tracking-[0.26em] text-white/36">
                    Ranking status
                  </div>
                  <div className="mt-2 text-lg font-medium text-white/86">
                    Public tracking
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.56fr_1.44fr]">
            <aside className="glass-panel h-fit rounded-[2rem] p-6 md:p-8">
              <div className="text-xs uppercase tracking-[0.3em] text-white/42">
                Ranking criteria
              </div>
              <div className="mt-6 space-y-3">
                {category.criteria.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.2rem] border border-white/8 bg-white/[0.035] px-4 py-3 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="/#access"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.02]"
              >
                Apply for review
              </a>
            </aside>

            <div className="glass-panel overflow-hidden rounded-[2.2rem] p-4 md:p-5">
              <div className="overflow-x-auto">
                <div className="min-w-[1040px]">
                  <div className="grid grid-cols-[0.45fr_1.45fr_0.8fr_1fr_1fr_0.8fr_0.6fr] gap-4 border-b border-white/8 px-4 pb-4 text-xs uppercase tracking-[0.26em] text-white/36">
                    <div>Rank</div>
                    <div>Name</div>
                    <div>Level</div>
                    <div>Category</div>
                    <div>Signal</div>
                    <div>Verification</div>
                    <div className="text-right">Score</div>
                  </div>

                  <div className="divide-y divide-white/8">
                    {category.entries.map((entry) => (
                      <div
                        key={`${entry.rank}-${entry.name}`}
                        className="grid grid-cols-[0.45fr_1.45fr_0.8fr_1fr_1fr_0.8fr_0.6fr] items-center gap-4 px-4 py-5"
                      >
                        <div className="text-[1.55rem] font-semibold tracking-[-0.07em] text-white/42">
                          {entry.rank}
                        </div>
                        <div className="text-lg font-medium text-white">
                          {entry.name}
                        </div>
                        <div>
                          <span className="inline-flex min-w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/72">
                            {entry.level}
                          </span>
                        </div>
                        <div className="text-sm text-white/58">
                          {entry.category}
                        </div>
                        <div className="text-sm text-white/58">
                          {entry.signal}
                        </div>
                        <div>
                          <span className="inline-flex min-w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/58">
                            {entry.status}
                          </span>
                        </div>
                        <div className="text-right text-xl font-semibold text-white">
                          {entry.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
