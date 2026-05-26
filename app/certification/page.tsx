import Link from "next/link";
import { AIAAFrame, CTASection, DotMatrix, IndexList, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const levels = [
  {
    no: "01",
    level: "Level 1",
    identity: "AI Agent Operator",
    label: "L1 Operator",
    difficulty: "Basic",
    scarcity: "High volume",
    core: "Workflow",
    entryRule: "Open application",
    action: "Apply",
    href: "/apply/agent",
    locked: false
  },
  {
    no: "02",
    level: "Level 2",
    identity: "AI Agent Engineer",
    label: "L2 Engineer",
    difficulty: "Intermediate",
    scarcity: "Medium volume",
    core: "Production",
    entryRule: "Requires approved Level 1",
    action: "Locked",
    href: "/certification/process",
    locked: true
  },
  {
    no: "03",
    level: "Level 3",
    identity: "AI Agent Systems Architect",
    label: "L3 Architect",
    difficulty: "Advanced",
    scarcity: "Scarce",
    core: "Multi Agent",
    entryRule: "Requires approved Level 2",
    action: "Locked",
    href: "/certification/process",
    locked: true
  },
  {
    no: "04",
    level: "Level 4",
    identity: "Certified AI Agent Company",
    label: "L4 Company",
    difficulty: "Enterprise",
    scarcity: "Highly scarce",
    core: "Infrastructure",
    entryRule: "Requires approved Level 3",
    action: "Locked",
    href: "/certification/process",
    locked: true
  },
  {
    no: "05",
    level: "Level 5",
    identity: "AIAA Association Fellow",
    label: "L5 Fellow",
    difficulty: "World class",
    scarcity: "Extremely scarce",
    core: "Standards",
    entryRule: "Requires approved Level 4 or council review",
    action: "Locked",
    href: "/certification/process",
    locked: true
  }
] as const;

const systemParts = [
  ["Identity system", "AIAA records who owns the Agent, what the system is, and how the public should verify it."],
  ["Capability system", "Levels separate operation, production engineering, architecture, company infrastructure, and ecosystem influence."],
  ["Commercial trust system", "Higher levels support buyer confidence, organization review, revenue ranking, and public proof."],
  ["Global ranking system", "Certification, benchmark, revenue, and registry records become ranking signals."],
  ["Governance system", "Level 5 connects public trust, standards design, ecosystem contribution, and council review."]
];

const revenueTiers = [
  ["Tier 0", "Unverified"],
  ["Tier 1", "USD 0 to 1,000 per month"],
  ["Tier 2", "USD 1,000 to 10,000 per month"],
  ["Tier 3", "USD 10,000 to 50,000 per month"],
  ["Tier 4", "USD 50,000 to 100,000 per month"],
  ["Tier 5", "USD 100,000 to 500,000 per month"],
  ["Tier 6", "USD 500,000 plus per month"]
];

export default function CertificationPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Certification"
        title="Start at Level 1. Upgrade after approval."
        copy="AIAA certification reviews AI Agent engineering, production systems, autonomous infrastructure, benchmark capability, commercial execution, and global influence. New applicants create a member account first, then start at Level 1."
        stats={[["Level 1", "Operator"], ["Level 2", "Engineer"], ["Level 3", "Architect"], ["Level 4", "Company"], ["Level 5", "Fellow"]]}
        action={<Link href="/signup" className="aiaa-button-dark">Create Member Account</Link>}
      />

      <Section eyebrow="Worldview" title="AIAA certifies systems, not casual AI usage." copy="The certification system is built for Agent engineering, production operation, commercial trust, global ranking, and public registry records." compact>
        <IndexList rows={systemParts.map(([title, copy], index) => ({ index: String(index + 1).padStart(2, "0"), title, copy, meta: "System" }))} />
      </Section>

      <Section eyebrow="Level System" title="One path, five review levels." copy="Level 2 to Level 5 are upgrade reviews. A new applicant should not jump directly to a higher level before the previous level is approved and recorded." compact>
        <ThinTable
          headers={["No.", "Level", "Identity", "Label", "Difficulty", "Scarcity", "Core", "Entry Rule", "Action"]}
          rows={levels.map((item) => [
            <span key="no" className="font-mono text-neutral-950">{item.no}</span>,
            <Link key="level" href={`/certification/${item.level.toLowerCase().replace(" ", "-")}`} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">{item.level}</Link>,
            item.identity,
            <StatusPill key="label">{item.label}</StatusPill>,
            item.difficulty,
            item.scarcity,
            item.core,
            <span key="rule" className="font-semibold text-neutral-950">{item.entryRule}</span>,
            item.locked ? (
              <span key="action" className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{item.action}</span>
            ) : (
              <Link key="action" href={item.href} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">{item.action}</Link>
            )
          ])}
        />
      </Section>

      <Section eyebrow="Revenue Index" title="Commercial influence is tracked separately." copy="Revenue ranking is not a flex board. It is a commercial capability, market trust, and global AI Agent business ranking signal." compact>
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <DotMatrix labels={["Tier 0", "Tier 1", "Tier 2", "Tier 3", "Tier 6"]} />
          <ThinTable
            headers={["Tier", "Monthly revenue"]}
            rows={revenueTiers.map(([tier, revenue]) => [<span key="tier" className="font-semibold text-neutral-950">{tier}</span>, revenue])}
          />
        </div>
      </Section>

      <Section eyebrow="Ranking Systems" title="Three public ranking families." copy="Certification ranking, benchmark ranking, and revenue ranking remain separate. This prevents popularity from being confused with verified capability or commercial execution." compact>
        <ThinTable
          headers={["Ranking", "What it measures", "Primary records"]}
          rows={[
            ["Certification Ranking", "Capability and trust level", "AIAA certificate and registry status"],
            ["Benchmark Ranking", "Technical performance and reliability", "Benchmark score, latency, cost, success rate"],
            ["Revenue Ranking", "Commercial execution and market trust", "Revenue tier, verification status, growth rate"]
          ].map(([ranking, measure, records]) => [<span key="ranking" className="font-semibold text-neutral-950">{ranking}</span>, measure, records])}
        />
      </Section>

      <CTASection title="Apply for Level 1 first." copy="Create a member account, then submit Agent identity, owner record, public links, first workflow evidence, and README. Upgrade reviews open after approval." primaryHref="/signup" primaryLabel="Create Account" secondaryHref="/certification/process" secondaryLabel="Review Process" />
    </AIAAFrame>
  );
}
