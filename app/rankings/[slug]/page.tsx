import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { rankingCategories } from "../ranking-data";

export const revalidate = 3600;

const liveGitHubRepos = [
  "Significant-Gravitas/AutoGPT",
  "langchain-ai/langgraph",
  "crewAIInc/crewAI",
  "All-Hands-AI/OpenHands",
  "browser-use/browser-use",
  "microsoft/autogen",
  "run-llama/llama_index",
  "FlowiseAI/Flowise",
  "microsoft/semantic-kernel",
  "langgenius/dify"
];

type GitHubRepo = {
  id: number;
  full_name: string;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  updated_at: string;
  language: string | null;
};

type DisplayEntry = {
  rank: string;
  name: string;
  level: string;
  category: string;
  signal: string;
  verification: string;
  score: string;
  url?: string;
};

async function getGitHubStarsEntries(): Promise<DisplayEntry[]> {
  const results = await Promise.all(
    liveGitHubRepos.map(async (repo) => {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "AIAA Ranking System"
        },
        next: {
          revalidate: 3600
        }
      });

      if (!response.ok) return null;

      const data = (await response.json()) as GitHubRepo;
      return data;
    })
  );

  return results
    .filter((repo): repo is GitHubRepo => repo !== null)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .map((repo, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      name: repo.name,
      level: "Public Data",
      category: repo.language ?? "Repository",
      signal: `${repo.stargazers_count.toLocaleString()} stars`,
      verification: "GitHub API",
      score: repo.forks_count.toLocaleString(),
      url: repo.html_url
    }));
}


const levelBadgeClass = (level: string) => {
  if (level === "Level 1") return "border-sky-300/35 bg-sky-300/[0.12] text-sky-100";
  if (level === "Level 2") return "border-purple-300/35 bg-purple-300/[0.12] text-purple-100";
  if (level === "Level 3") return "border-amber-300/35 bg-amber-300/[0.14] text-amber-100";
  if (level === "Level 4") return "border-yellow-200/30 bg-black/55 text-yellow-100";
  if (level === "Level 5") return "border-white/35 bg-white/[0.18] text-white";

  if (level === "Public Data") return "border-sky-300/25 bg-sky-300/[0.10] text-sky-100";

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

  if (verification === "GitHub API") {
    return "border-emerald-300/25 bg-emerald-300/[0.12] text-emerald-100";
  }

  return "border-white/10 bg-white/[0.04] text-white/58";
};

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

  const isGitHubStarsLive = slug === "github-stars";
  const liveEntries = isGitHubStarsLive ? await getGitHubStarsEntries() : [];
  const entries: DisplayEntry[] = liveEntries.length > 0 ? liveEntries : category.entries;

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

        <div className="relative z-10 mx-auto max-w-[1280px]">
          <a
            href="/rankings"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/68 transition-colors duration-300 hover:text-white"
          >
            ← Back to rankings
          </a>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                {category.eyebrow}
              </div>
              <h1 className="mt-5 max-w-4xl text-[clamp(3rem,6.5vw,6rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
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
                    Last updated
                  </div>
                  <div className="mt-2 text-lg font-medium text-white/86">
                    {category.lastUpdated}
                  </div>
                </div>
                <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-4">
                  <div className="text-xs uppercase tracking-[0.26em] text-white/36">
                    Update frequency
                  </div>
                  <div className="mt-2 text-lg font-medium text-white/86">
                    {category.updateFrequency}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-amber-200/16 bg-amber-200/[0.06] px-5 py-4 text-sm leading-7 text-amber-50/74">
            {isGitHubStarsLive
              ? "This GitHub Stars table is powered by the GitHub REST API and refreshed through an hourly cache. AIAA certification status is not assigned from GitHub data. Certification requires separate AIAA review."
              : "This page is a public preview of the AIAA ranking framework. Candidate order, scores, and verification states are not final rankings. Final rankings will be published after source review, data verification, and AIAA methodology approval."}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="space-y-5">
              <div className="glass-panel rounded-[2rem] p-6 md:p-8">
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
              </div>

              <div className="glass-panel rounded-[2rem] p-6 md:p-8">
                <div className="text-xs uppercase tracking-[0.3em] text-white/42">
                  Data sources
                </div>
                <div className="mt-6 space-y-3">
                  {category.dataSource.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.2rem] border border-white/8 bg-white/[0.035] px-4 py-3 text-sm text-white/70"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] p-6 md:p-8">
                <div className="text-xs uppercase tracking-[0.3em] text-white/42">
                  Methodology
                </div>
                <div className="mt-6 space-y-3">
                  {category.methodology.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.2rem] border border-white/8 bg-white/[0.035] px-4 py-3 text-sm text-white/70"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="/#access"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.02]"
              >
                Submit data for review
              </a>
            </aside>

            <div className="glass-panel overflow-hidden rounded-[2.2rem] p-4 md:p-5">
              <div className="overflow-x-auto">
                <div className="min-w-[1040px]">
                  <div className="grid grid-cols-[0.5fr_1.45fr_0.85fr_1fr_1fr_1fr_0.7fr] gap-4 border-b border-white/8 px-4 pb-4 text-xs uppercase tracking-[0.26em] text-white/36">
                    <div>Rank</div>
                    <div>Name</div>
                    <div className="text-center">Level</div>
                    <div>Category</div>
                    <div>Signal</div>
                    <div className="text-center">Verification</div>
                    <div className="text-right">{isGitHubStarsLive ? "Forks" : "Score"}</div>
                  </div>

                  <div className="divide-y divide-white/8">
                    {entries.map((entry) => (
                      <div
                        key={`${entry.rank}-${entry.name}`}
                        className="grid grid-cols-[0.5fr_1.45fr_0.85fr_1fr_1fr_1fr_0.7fr] items-center gap-4 px-4 py-5 text-sm"
                      >
                        <div className="text-[1.7rem] font-semibold tracking-[-0.07em] text-white/36">
                          {entry.rank}
                        </div>
                        <div className="font-medium text-white">
                          {entry.url ? (
                            <a href={entry.url} target="_blank" rel="noreferrer" className="transition-colors duration-300 hover:text-sky-100">
                              {entry.name}
                            </a>
                          ) : (
                            entry.name
                          )}
                        </div>
                        <div className="flex justify-center">
                          <span className={`inline-flex min-w-[6.8rem] justify-center rounded-full border px-3 py-1 text-xs ${levelBadgeClass(entry.level)}`}>
                            {entry.level}
                          </span>
                        </div>
                        <div className="text-white/56">
                          {entry.category}
                        </div>
                        <div className="text-white/56">
                          {entry.signal}
                        </div>
                        <div className="flex justify-center">
                          <span className={`inline-flex min-w-[7.2rem] justify-center rounded-full border px-3 py-1 text-xs ${verificationBadgeClass(entry.verification)}`}>
                            {entry.verification}
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
