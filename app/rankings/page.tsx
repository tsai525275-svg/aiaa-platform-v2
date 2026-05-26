import Link from "next/link";
import { AIAAFrame, PageHero, StatusPill, ThinTable } from "@/components/aiaa-page-kit";
import { rankingConfigs } from "./ranking-live";

const frameWidth = "mx-auto w-[min(1360px,calc(100vw-32px))]";

const boards = [
  ["01", "AI Agent Product Ranking", "Commercial agents and certified systems", "AIAA review", "Preview", "/rankings/ai-agent-products"],
  ["02", "GitHub Stars Ranking", "Open source AI Agent repositories", "GitHub API", "Live", "/rankings/github-stars"],
  ["03", "GitHub Trending Ranking", "Fast growing agent repositories", "Daily snapshots", "Live", "/rankings/github-trending"],
  ["04", "GitHub Builders Ranking", "Maintainers and contributors", "GitHub graph", "Live", "/rankings/github-builders"],
  ["05", "Agent Framework Ranking", "Agent orchestration frameworks", "Review layer", "Live", "/rankings/agent-frameworks"]
];

const logicRows = [
  ["Certification", "Review based trust", "AIAA certificate", "AI Agent Product Ranking"],
  ["Popularity", "Public repository attention", "GitHub stars", "GitHub Stars Ranking"],
  ["Momentum", "Short term movement", "Daily snapshots", "GitHub Trending Ranking"],
  ["Builder", "Maintainer and contributor signal", "GitHub contributors", "GitHub Builders Ranking"],
  ["Framework", "Agent infrastructure adoption", "Repository plus review context", "Agent Framework Ranking"]
];

function CompactSection({
  eyebrow,
  title,
  copy,
  children
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-200 bg-white px-4 py-9 lg:py-10">
      <div className={`${frameWidth} grid gap-8 lg:grid-cols-[240px_1fr]`}>
        <aside>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 max-w-[220px] text-3xl font-semibold leading-[1.02] tracking-[-0.05em] text-neutral-950 lg:text-4xl">
            {title}
          </h2>
          <p className="mt-5 max-w-[220px] text-sm leading-6 text-neutral-600">{copy}</p>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

export default function RankingsPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="AIAA Rankings"
        title="Rankings for the AI Agent economy."
        copy="Track products, repositories, builders, and frameworks with public data, daily snapshots, and review context. Each board has a separate source and meaning."
        stats={[["5", "ranking systems"], ["120+", "snapshot rows"], ["Daily", "update cadence"], ["GitHub", "primary source"], ["AIAA", "review layer"]]}
        action={<Link href="/rankings/trends" className="aiaa-button-dark">View Trends</Link>}
      />

      <CompactSection
        eyebrow="Systems"
        title="Five layers."
        copy="Each board has its own source, metric, and trust meaning."
      >
        <ThinTable
          headers={["No.", "Ranking", "Scope", "Source", "Status"]}
          rows={boards.map(([no, title, scope, source, status, href]) => [
            <span key="no" className="font-mono text-neutral-950">{no}</span>,
            <Link key="title" href={href} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">{title}</Link>,
            scope,
            source,
            <Link key="status" href={href} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">{status} →</Link>
          ])}
        />
      </CompactSection>

      <CompactSection
        eyebrow="Logic"
        title="Signal separation."
        copy="GitHub popularity and AIAA certification stay separate to avoid false trust claims."
      >
        <ThinTable
          headers={["Layer", "Question", "Signal", "Board"]}
          rows={logicRows.map(([layer, question, signal, board]) => [
            <span key="layer" className="font-semibold text-neutral-950">{layer}</span>,
            question,
            signal,
            board
          ])}
        />
      </CompactSection>

      <CompactSection
        eyebrow="Routes"
        title="Route map."
        copy="These links stay stable for headers, ranking records, and trend views."
      >
        <ThinTable
          headers={["Slug", "Title", "Mode", "Metric", "Source"]}
          rows={Object.entries(rankingConfigs).map(([slug, config]) => [
            <Link key="slug" href={`/rankings/${slug}`} className="font-mono text-neutral-950 underline-offset-4 hover:underline">{slug}</Link>,
            <span key="title" className="font-semibold text-neutral-950">{config.title}</span>,
            <StatusPill key="mode">{config.mode}</StatusPill>,
            config.metricLabel,
            config.source
          ])}
        />
      </CompactSection>
    </AIAAFrame>
  );
}
