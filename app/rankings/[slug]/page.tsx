import Link from "next/link";
import { notFound } from "next/navigation";
import { AIAAFrame, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";
import {
  ApiListResponse,
  BuilderHistoryRow,
  BuilderRow,
  HistoryResponse,
  RankingSlug,
  RepoHistoryRow,
  RepoRow,
  formatNumber,
  getRepoMetric,
  historyByBuilder,
  historyByRepo,
  previewRows,
  rankingConfigs,
  repoApiPath,
  repoHistoryPath,
  safeFetchJson,
  slugify
} from "../ranking-live";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(rankingConfigs).map((slug) => ({ slug }));
}

function DeltaText({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) return <span className="text-neutral-400">No prior</span>;
  if (value > 0) return <span className="font-semibold text-emerald-700">▲ +{formatNumber(value)}</span>;
  if (value < 0) return <span className="font-semibold text-rose-700">▼ {formatNumber(value)}</span>;
  return <span className="text-neutral-500">0</span>;
}

function BoardMeta({ items }: { items: Array<[string, string]> }) {
  return (
    <section className="border-b border-neutral-200 bg-white px-4 py-6">
      <div className="mx-auto grid w-[min(1360px,calc(100vw-32px))] border-y border-neutral-300 bg-white md:grid-cols-2 lg:grid-cols-5">
        {items.map(([label, value]) => (
          <div key={label} className="border-b border-neutral-200 px-5 py-4 md:border-r md:last:border-r-0 lg:border-b-0">
            <div className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-neutral-500">{label}</div>
            <div className="mt-2 text-base font-semibold text-neutral-950">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function repoRows(items: RepoRow[], historyRows: RepoHistoryRow[], slug: RankingSlug) {
  const historyMap = historyByRepo(historyRows);
  const config = rankingConfigs[slug];

  return items.map((item) => {
    const history = historyMap.get(item.fullName);
    const scope = item.scope ?? history?.scope ?? "AI Agent Repository";
    const summary = item.summary ?? history?.summary ?? item.description ?? "Tracked AI Agent repository.";
    const metricChange = slug === "github-stars" ? history?.stars_change : history?.score_change;

    return [
      <span key="rank" className="font-mono text-neutral-950">{item.rank}</span>,
      <div key="repo" className="flex min-w-[260px] gap-3">
        <img src={item.ownerAvatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover" />
        <div>
          <a href={item.url} target="_blank" rel="noreferrer" className="font-semibold text-neutral-950 underline-offset-4 hover:underline">{item.name}</a>
          <div className="mt-1 font-mono text-xs text-neutral-500">{item.fullName}</div>
          <p className="mt-2 max-w-xl text-xs leading-5 text-neutral-600">{summary}</p>
        </div>
      </div>,
      <StatusPill key="scope">{scope}</StatusPill>,
      config.signal,
      <span key="metric" className="font-semibold text-neutral-950">{formatNumber(getRepoMetric(item, config.mode))}</span>,
      <DeltaText key="rankDelta" value={history?.rank_change} />,
      <DeltaText key="metricDelta" value={metricChange} />,
      item.language ?? "Public",
      <Link key="details" href={`/rankings/${slug}/${slugify(item.name)}`} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">View</Link>
    ];
  });
}

function builderRows(items: BuilderRow[], historyRows: BuilderHistoryRow[]) {
  const historyMap = historyByBuilder(historyRows);

  return items.map((item) => {
    const history = historyMap.get(item.login);

    return [
      <span key="rank" className="font-mono text-neutral-950">{item.rank}</span>,
      <div key="builder" className="flex min-w-[240px] gap-3">
        <img src={item.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover" />
        <div>
          <a href={item.profileUrl} target="_blank" rel="noreferrer" className="font-semibold text-neutral-950 underline-offset-4 hover:underline">{item.login}</a>
          <p className="mt-2 max-w-xl text-xs leading-5 text-neutral-600">Public contributor across tracked AI Agent repositories.</p>
          <div className="mt-1 text-xs leading-5 text-neutral-500">{item.repositories.slice(0, 2).join(", ")}{item.repositories.length > 2 ? "..." : ""}</div>
        </div>
      </div>,
      <StatusPill key="signal">Public GitHub</StatusPill>,
      <span key="repo-count" className="font-semibold text-neutral-950">{formatNumber(item.repoCount)}</span>,
      <span key="contrib" className="font-semibold text-neutral-950">{formatNumber(item.totalContributions)}</span>,
      <span key="score" className="font-semibold text-neutral-950">{formatNumber(item.builderScore)}</span>,
      <DeltaText key="rankDelta" value={history?.rank_change} />,
      <DeltaText key="scoreDelta" value={history?.builder_score_change} />,
      <Link key="details" href={`/rankings/github-builders/${slugify(item.login)}`} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">View</Link>
    ];
  });
}

function previewTableRows() {
  return previewRows.map((entry) => [
    <span key="rank" className="font-mono text-neutral-950">{entry.rank}</span>,
    <Link key="name" href={`/rankings/ai-agent-products/${entry.slug}`} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">{entry.name}</Link>,
    entry.level,
    entry.category,
    entry.signal,
    entry.score,
    <StatusPill key="status">Preview</StatusPill>
  ]);
}

export default async function RankingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = rankingConfigs[slug as RankingSlug];

  if (!config) notFound();

  let repoItems: RepoRow[] = [];
  let builderItems: BuilderRow[] = [];
  let repoHistory: HistoryResponse<RepoHistoryRow> | null = null;
  let builderHistory: HistoryResponse<BuilderHistoryRow> | null = null;

  if (config.mode === "repo-stars" || config.mode === "repo-trending" || config.mode === "frameworks") {
    const data = await safeFetchJson<ApiListResponse<RepoRow>>(repoApiPath(slug as RankingSlug), { results: [] });
    repoItems = data.results ?? [];
    repoHistory = await safeFetchJson<HistoryResponse<RepoHistoryRow>>(repoHistoryPath(slug as RankingSlug), {
      ok: false,
      latestDate: null,
      previousDate: null,
      latest: [],
      history: [],
      total: 0
    });
  }

  if (config.mode === "builders") {
    const data = await safeFetchJson<ApiListResponse<BuilderRow>>("/api/github/builders", { results: [] });
    builderItems = data.results ?? [];
    builderHistory = await safeFetchJson<HistoryResponse<BuilderHistoryRow>>("/api/snapshots/github/history?type=builder", {
      ok: false,
      latestDate: null,
      previousDate: null,
      latest: [],
      history: [],
      total: 0
    });
  }

  const latestDate = repoHistory?.latestDate ?? builderHistory?.latestDate ?? "Pending";
  const previousDate = repoHistory?.previousDate ?? builderHistory?.previousDate ?? "Pending";
  const historyTotal = repoHistory?.total ?? builderHistory?.total ?? 0;
  const rowCount = config.mode === "preview" ? previewRows.length : config.mode === "builders" ? builderItems.length : repoItems.length;

  return (
    <AIAAFrame>
      <PageHero
        eyebrow={config.eyebrow}
        title={config.title}
        copy={config.description}
        stats={[[String(rowCount), "visible rows"], [latestDate, "latest snapshot"], [previousDate, "previous snapshot"], [formatNumber(historyTotal), "history rows"], [config.metricLabel, "metric"]]}
        action={<Link href="/rankings/trends" className="aiaa-button-light">View Trends</Link>}
      />

      <BoardMeta
        items={[
          ["Source", config.source],
          ["Signal", config.signal],
          ["Mode", config.mode],
          ["Metric", config.metricLabel],
          ["Status", config.mode === "preview" ? "Preview" : "Live"]
        ]}
      />

      <Section compact eyebrow="Ranking Table" copy="Rows link to detail pages. GitHub boards keep reading live data and snapshot deltas through the existing API layer.">
        {config.mode === "preview" ? (
          <ThinTable headers={["Rank", "Name", "Level", "Category", "Signal", "Score", "Status"]} rows={previewTableRows()} />
        ) : config.mode === "builders" ? (
          <ThinTable headers={["Rank", "Builder", "Signal", "Repos", "Contrib.", "Score", "Rank Δ", "Score Δ", "Details"]} rows={builderRows(builderItems, builderHistory?.latest ?? [])} minWidth="1080px" />
        ) : (
          <ThinTable headers={["Rank", "Repository", "Scope", "Signal", config.metricLabel, "Rank Δ", config.mode === "repo-stars" ? "Star Δ" : "Score Δ", "Lang.", "Details"]} rows={repoRows(repoItems, repoHistory?.latest ?? [], slug as RankingSlug)} minWidth="1120px" />
        )}
      </Section>
    </AIAAFrame>
  );
}
