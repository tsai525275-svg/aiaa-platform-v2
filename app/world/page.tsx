import Link from "next/link";
import { AIAAFrame, CTASection, DotMatrix, IndexList, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const atlas = [
  ["01", "Agent Products", "Commercial and public AI Agent products with identity, category, and review status."],
  ["02", "Agent Frameworks", "Frameworks for orchestration, memory, tools, state, workflow, and deployment."],
  ["03", "Agent Tools", "Tool layers that agents call, control, execute, or monitor during workflows."],
  ["04", "Agent Companies", "Organizations building agent products, infrastructure, labs, or services."],
  ["05", "Agent Developers", "Builders, maintainers, contributors, reviewers, and technical operators."],
  ["06", "Agent Communities", "Communities, forums, events, and local ecosystems around AI Agents."],
  ["07", "Agent Datasets", "Datasets that support evaluation, memory, retrieval, reasoning, and safety review."],
  ["08", "Agent Benchmarks", "Benchmark systems and review methods for capability and reliability."],
  ["09", "Agent Papers", "Research movement, papers, experiments, and emerging technical directions."],
  ["10", "Agent Jobs", "Roles related to agent engineering, operations, review, and deployment."],
  ["11", "Agent Investors", "Capital, funds, angels, accelerators, and investment signals in the agent economy."]
];

export default function WorldPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="World"
        title="A data atlas for the AI Agent economy."
        copy="World organizes products, frameworks, tools, companies, developers, communities, datasets, benchmarks, papers, jobs, and investors without using a globe visual."
        stats={[["11", "atlas groups"], ["No globe", "visual rule"], ["Data", "atlas model"], ["Public", "signal layer"], ["AIAA", "identity layer"]]}
        action={<Link href="/rankings" className="aiaa-button-dark">Open Rankings</Link>}
      />

      <Section eyebrow="Atlas" title="The world view is an index, not decoration." copy="Each group can become its own directory, report, ranking, registry view, or research surface later.">
        <IndexList rows={atlas.map(([index, title, copy]) => ({ index, title, copy, meta: "Index" }))} />
      </Section>

      <Section eyebrow="Data Model" title="World connects public signals to identity records." copy="This page gives AIAA room to expand into news, directory, benchmarks, jobs, and reports without changing the homepage.">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <DotMatrix labels={["Products", "Frameworks", "Builders", "Benchmarks", "Jobs"]} />
          <ThinTable
            headers={["Layer", "Input", "Output"]}
            rows={[
              ["Signal intake", "GitHub, product pages, public websites, research sources", "Raw candidate list"],
              ["Source review", "Website, repository, documentation, company proof", "Verified source group"],
              ["Classification", "Product, framework, tool, company, developer, community", "World atlas category"],
              ["Publication", "Registry record, ranking page, report, directory profile", "Public AIAA surface"],
              ["Maintenance", "Daily snapshots, reviewer notes, expiry rules", "Current public trust state"]
            ].map(([layer, input, output]) => [<span key="layer" className="font-semibold text-neutral-950">{layer}</span>, input, output])}
          />
        </div>
      </Section>

      <Section eyebrow="Expansion" title="Which surfaces World should feed next." copy="The atlas should not stay as a static directory. It should route signals into product pages, framework pages, reports, benchmarks, and hiring surfaces.">
        <ThinTable
          headers={["Surface", "Source", "Next route"]}
          rows={[
            ["News Hub", "Public announcements, launches, funding, releases", "News"],
            ["Directory", "Companies, builders, products, tools", "Directory"],
            ["Benchmarks", "Evaluations, test suites, task results", "Benchmarks"],
            ["Reports", "Monthly ecosystem analysis", "Reports"],
            ["Jobs", "Agent engineering roles and reviewer roles", "Jobs"]
          ].map(([surface, source, route]) => [<span key="surface" className="font-semibold text-neutral-950">{surface}</span>, source, <StatusPill key="route">{route}</StatusPill>])}
        />
      </Section>

      <CTASection title="Use World as the ecosystem map." copy="Keep rankings, registry, certification, and standards separate. World should connect them through a clean data atlas." primaryHref="/rankings" primaryLabel="Open Rankings" secondaryHref="/standards" secondaryLabel="View Standards" />
    </AIAAFrame>
  );
}
