import Link from "next/link";
import { AIAAFrame, DataPanel, PageHero, Section, SplitLedger, StatusPill, ThinTable } from "@/components/aiaa-page-kit";
import {
  BuilderHistoryRow,
  HistoryResponse,
  RepoHistoryRow,
  formatNumber,
  safeFetchJson
} from "../ranking-live";

export const dynamic = "force-dynamic";

const groups = [
  ["github-stars", "GitHub Stars", "Most watched projects", "/rankings/github-stars"],
  ["github-trending", "GitHub Momentum", "Projects moving fastest", "/rankings/github-trending"],
  ["agent-frameworks", "Agent Frameworks", "Framework adoption signal", "/rankings/agent-frameworks"]
];

function DeltaText({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) return <span className="text-neutral-400">No prior</span>;
  if (value > 0) return <span className="font-semibold text-emerald-700">▲ +{formatNumber(value)}</span>;
  if (value < 0) return <span className="font-semibold text-rose-700">▼ {formatNumber(value)}</span>;
  return <span className="text-neutral-500">0</span>;
}

async function repoHistory(key: string) {
  return await safeFetchJson<HistoryResponse<RepoHistoryRow>>(`/api/snapshots/github/history?rankingKey=${key}&days=90`, {
    ok: false,
    latestDate: null,
    previousDate: null,
    latest: [],
    history: [],
    total: 0
  });
}

async function builderHistory() {
  return await safeFetchJson<HistoryResponse<BuilderHistoryRow>>("/api/snapshots/github/history?type=builder&days=90", {
    ok: false,
    latestDate: null,
    previousDate: null,
    latest: [],
    history: [],
    total: 0
  });
}

export default async function RankingTrendsPage() {
  const [stars, trending, frameworks, builders] = await Promise.all([
    repoHistory("github-stars"),
    repoHistory("github-trending"),
    repoHistory("agent-frameworks"),
    builderHistory()
  ]);

  const latestDate = stars.latestDate ?? trending.latestDate ?? frameworks.latestDate ?? builders.latestDate ?? "Pending";
  const totalRows = (stars.total ?? 0) + (trending.total ?? 0) + (frameworks.total ?? 0) + (builders.total ?? 0);

  const repoMovementRows = [
    ...stars.latest.slice(0, 4).map((row) => ({
      board: "GitHub Stars",
      rank: row.rank,
      name: row.repo_name,
      metric: row.stars,
      metricLabel: "Stars",
      rankDelta: row.rank_change,
      signalDelta: row.stars_change,
      href: "/rankings/github-stars"
    })),
    ...trending.latest.slice(0, 4).map((row) => ({
      board: "GitHub Trending",
      rank: row.rank,
      name: row.repo_name,
      metric: row.score,
      metricLabel: "Score",
      rankDelta: row.rank_change,
      signalDelta: row.score_change,
      href: "/rankings/github-trending"
    })),
    ...frameworks.latest.slice(0, 4).map((row) => ({
      board: "Agent Frameworks",
      rank: row.rank,
      name: row.repo_name,
      metric: row.score,
      metricLabel: "Score",
      rankDelta: row.rank_change,
      signalDelta: row.score_change,
      href: "/rankings/agent-frameworks"
    }))
  ];

  const builderRows = builders.latest.slice(0, 8);

  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Ranking Trends"
        title="Movement across AI Agent public signals."
        copy="Trends explain change over time. This page pulls snapshot history from the existing API layer and keeps movement separate from static ranking lists."
        stats={[[latestDate, "latest snapshot"], [formatNumber(totalRows), "history rows"], ["90", "day window"], ["4", "trend groups"], ["GitHub", "source"]]}
        action={<Link href="/rankings" className="aiaa-button-dark">All Rankings</Link>}
      />

      <Section compact eyebrow="Trend Index" copy="Growth, rank movement, and source changes stay separate from each ranking board.">
        <ThinTable
          headers={["No.", "Trend", "Signal", "Latest", "Rows", "Open"]}
          rows={[
            ...groups.map(([key, title, signal, href], index) => {
              const data = key === "github-stars" ? stars : key === "github-trending" ? trending : frameworks;
              return [
                <span key="no" className="font-mono text-neutral-950">{String(index + 1).padStart(2, "0")}</span>,
                <span key="title" className="font-semibold text-neutral-950">{title}</span>,
                signal,
                data.latestDate ?? "Pending",
                formatNumber(data.total),
                <Link key="open" href={href} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">Open</Link>
              ];
            }),
            [
              <span key="no" className="font-mono text-neutral-950">04</span>,
              <span key="title" className="font-semibold text-neutral-950">GitHub Builders</span>,
              "Contributor movement",
              builders.latestDate ?? "Pending",
              formatNumber(builders.total),
              <Link key="open" href="/rankings/github-builders" className="font-semibold text-neutral-950 underline-offset-4 hover:underline">Open</Link>
            ]
          ]}
        />
      </Section>

      <Section compact eyebrow="Repository Movement" copy="These rows use the latest snapshot comparison when available. If only one snapshot exists, deltas show No prior.">
        <SplitLedger
          left={
            <div className="space-y-6">
              <DataPanel label="Snapshot Rule" title="Latest vs previous" copy="Movement becomes stronger  after  daily jobs run for more days. The UI already supports rank and signal deltas." />
              <DataPanel label="Data Source" title="Existing API only" copy="This page does not change app/api. It reads snapshot history from the current endpoint." />
            </div>
          }
          right={
            <ThinTable
              headers={["Board", "Rank", "Name", "Metric", "Rank Δ", "Signal Δ", "Open"]}
              rows={repoMovementRows.map((row) => [
                <StatusPill key="board">{row.board}</StatusPill>,
                <span key="rank" className="font-mono text-neutral-950">{row.rank}</span>,
                <span key="name" className="font-semibold text-neutral-950">{row.name}</span>,
                `${formatNumber(row.metric)} ${row.metricLabel}`,
                <DeltaText value={row.rankDelta} />,
                <DeltaText value={row.signalDelta} />,
                <Link key="open" href={row.href} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">Open</Link>
              ])}
            />
          }
        />
      </Section>

      <Section compact eyebrow="Builder Movement" copy="Builder movement uses contributor score, contribution count, and rank change from daily snapshots.">
        <ThinTable
          headers={["Rank", "Builder", "Repos", "Contrib.", "Score", "Rank Δ", "Score Δ", "Open"]}
          rows={builderRows.map((row) => [
            <span key="rank" className="font-mono text-neutral-950">{row.rank}</span>,
            <span key="builder" className="font-semibold text-neutral-950">{row.login}</span>,
            formatNumber(row.repo_count),
            formatNumber(row.total_contributions),
            formatNumber(row.builder_score),
            <DeltaText value={row.rank_change} />,
            <DeltaText value={row.builder_score_change} />,
            <Link key="open" href="/rankings/github-builders" className="font-semibold text-neutral-950 underline-offset-4 hover:underline">Open</Link>
          ])}
        />
      </Section>
    </AIAAFrame>
  );
}
