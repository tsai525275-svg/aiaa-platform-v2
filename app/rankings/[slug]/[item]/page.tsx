import Link from "next/link";
import { notFound } from "next/navigation";
import { AIAAFrame, CTASection, DataPanel, PageHero, Section, SplitLedger, StatusPill, ThinTable } from "@/components/aiaa-page-kit";
import { SocialActions } from "@/components/social-actions";
import {
  ApiListResponse,
  BuilderRow,
  RankingSlug,
  RepoRow,
  formatNumber,
  getRepoMetric,
  previewRows,
  rankingConfigs,
  repoApiPath,
  safeFetchJson,
  slugify
} from "../../ranking-live";

export const dynamic = "force-dynamic";

function previewRecord(item: string) {
  return previewRows.find((row) => row.slug === item || row.rank === item);
}

async function repoRecord(slug: RankingSlug, item: string) {
  const data = await safeFetchJson<ApiListResponse<RepoRow>>(repoApiPath(slug), { results: [] });
  return (data.results ?? []).find((row) => slugify(row.name) === item || slugify(row.fullName) === item || row.rank === item) ?? null;
}

async function builderRecord(item: string) {
  const data = await safeFetchJson<ApiListResponse<BuilderRow>>("/api/github/builders", { results: [] });
  return (data.results ?? []).find((row) => slugify(row.login) === item || row.rank === item) ?? null;
}

export default async function RankingItemPage({ params }: { params: Promise<{ slug: string; item: string }> }) {
  const { slug, item } = await params;
  const config = rankingConfigs[slug as RankingSlug];

  if (!config) notFound();

  if (config.mode === "preview") {
    const record = previewRecord(item);
    if (!record) notFound();

    return (
      <AIAAFrame>
        <PageHero
          eyebrow="Ranking Record"
          title={record.name}
          copy={`This preview record belongs to ${config.title}. Product ranking rows will connect to certified AIAA registry records  after  review data exists.`}
          stats={[[record.rank, "rank"], [record.level, "level"], [record.category, "category"], [record.signal, "signal"], [record.score, "score"]]}
          action={
            <div className="flex flex-wrap items-center gap-3">
              <SocialActions targetId={`ranking:${slug}:${record.slug}`} targetName={record.name} targetType="ranking" />
              <Link href={`/rankings/${slug}`} className="aiaa-button-light">Back to Board</Link>
            </div>
          }
        />

        <Section eyebrow="Preview Record" title="Certification ranking records need approval first." copy="This page creates the detail surface for future certified Agent products.">
          <ThinTable
            headers={["Field", "Value"]}
            rows={[
              ["Name", record.name],
              ["Ranking", config.title],
              ["Level", record.level],
              ["Category", record.category],
              ["Signal", record.signal],
              ["Score", record.score],
              ["Status", "Preview"]
            ].map(([field, value]) => [<span key="field" className="font-semibold text-neutral-950">{field}</span>, value])}
          />
        </Section>

        <CTASection title="Connect product records to registry." copy="After certification approval, this item should link to certificate, owner, status, evidence summary, and expiry date." primaryHref="/registry" primaryLabel="View Registry" secondaryHref={`/rankings/${slug}`} secondaryLabel="Back to Ranking" />
      </AIAAFrame>
    );
  }

  if (config.mode === "builders") {
    const record = await builderRecord(item);
    if (!record) notFound();

    return (
      <AIAAFrame>
        <PageHero
          eyebrow="Builder Record"
          title={record.login}
          copy="This builder record comes from public GitHub contributor metadata across tracked AI Agent repositories. It is a public signal, not an identity certification."
          stats={[[record.rank, "rank"], [formatNumber(record.repoCount), "repos"], [formatNumber(record.totalContributions), "contrib."], [formatNumber(record.builderScore), "score"], ["GitHub", "source"]]}
          action={
            <div className="flex flex-wrap items-center gap-3">
              <SocialActions targetId={`builder:${record.login}`} targetName={record.login} targetType="builder" />
              <a href={record.profileUrl} target="_blank" rel="noreferrer" className="aiaa-button-dark">Open GitHub</a>
            </div>
          }
        />

        <Section eyebrow="Record Detail" title="Builder signal and source context." copy="The detail page keeps public builder activity separate from AIAA certification.">
          <SplitLedger
            left={
              <DataPanel label="Public Profile" title={record.login} copy="Builder ranking uses contribution metadata from tracked AI Agent repositories.">
                <div className="flex flex-wrap gap-2">
                  <StatusPill>Public GitHub</StatusPill>
                  <StatusPill>Builder Signal</StatusPill>
                </div>
              </DataPanel>
            }
            right={
              <ThinTable
                headers={["Field", "Value"]}
                rows={[
                  ["Rank", record.rank],
                  ["Profile", record.profileUrl],
                  ["Repository Count", formatNumber(record.repoCount)],
                  ["Total Contributions", formatNumber(record.totalContributions)],
                  ["Builder Score", formatNumber(record.builderScore)],
                  ["Repositories", record.repositories.join(", ")]
                ].map(([field, value]) => [<span key="field" className="font-semibold text-neutral-950">{field}</span>, value])}
              />
            }
          />
        </Section>

        <CTASection title="Return to the builder board." copy="Use the ranking board to compare this builder with other public contributors." primaryHref="/rankings/github-builders" primaryLabel="Back to Builders" secondaryHref="/rankings/trends" secondaryLabel="View Trends" />
      </AIAAFrame>
    );
  }

  const record = await repoRecord(slug as RankingSlug, item);
  if (!record) notFound();

  const metric = getRepoMetric(record, config.mode);
  const summary = record.summary ?? record.description ?? "Tracked AI Agent repository.";

  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Repository Record"
        title={record.name}
        copy={summary}
        stats={[[record.rank, "rank"], [formatNumber(metric), config.metricLabel], [formatNumber(record.stars), "stars"], [formatNumber(record.forks), "forks"], [record.language ?? "Public", "language"]]}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <SocialActions targetId={`repository:${record.fullName}`} targetName={record.fullName} targetType="repository" />
            <a href={record.url} target="_blank" rel="noreferrer" className="aiaa-button-dark">Open Repository</a>
          </div>
        }
      />

      <Section eyebrow="Record Detail" title="Repository signal and ranking context." copy="This page keeps source metadata, ranking signal, and future registry linkage in one place.">
        <SplitLedger
          left={
            <div className="space-y-6">
              <DataPanel label="Repository" title={record.fullName} copy={record.whyIncluded ?? "This repository is tracked because it belongs to the AI Agent ecosystem."}>
                <div className="flex flex-wrap gap-2">
                  <StatusPill>{config.signal}</StatusPill>
                  <StatusPill>{config.metricLabel}</StatusPill>
                </div>
              </DataPanel>
              <DataPanel label="Owner" title={record.ownerLogin} copy="Owner metadata comes from public GitHub repository data." />
            </div>
          }
          right={
            <ThinTable
              headers={["Field", "Value"]}
              rows={[
                ["Rank", record.rank],
                ["Ranking", config.title],
                ["Full Name", record.fullName],
                ["Scope", record.scope ?? "AI Agent Repository"],
                ["Stars", formatNumber(record.stars)],
                ["Forks", formatNumber(record.forks)],
                ["Open Issues", formatNumber(record.openIssues)],
                ["Language", record.language ?? "Public"],
                ["Updated", record.updatedAt],
                ["Pushed", record.pushedAt]
              ].map(([field, value]) => [<span key="field" className="font-semibold text-neutral-950">{field}</span>, value])}
            />
          }
        />
      </Section>

      <CTASection title="Return to the ranking board." copy="Use the board to compare current rank, public signal, and movement across tracked AI Agent projects." primaryHref={`/rankings/${slug}`} primaryLabel="Back to Ranking" secondaryHref="/rankings/trends" secondaryLabel="View Trends" />
    </AIAAFrame>
  );
}
