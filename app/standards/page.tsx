import { AIAAFrame, CTASection, IndexList, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const standards = [
  ["01", "Identity Standard", "Defines agent name, owner, company, AIAA ID, country, category, and public record format."],
  ["02", "Capability Standard", "Defines what an agent does, what evidence supports the claim, and which tasks are in scope."],
  ["03", "Safety Standard", "Defines risk notes, failure behavior, human override, permission limits, and prohibited claims."],
  ["04", "Registry Standard", "Defines public registry fields, verification states, status changes, expiry, and revocation logic."],
  ["05", "Evidence Standard", "Defines logs, screenshots, repository links, deployment notes, benchmark files, and reviewer traceability."],
  ["06", "Review Standard", "Defines screening, reviewer decision states, information requests, appeals, and final certificate issuance."],
  ["07", "Public Trust Standard", "Defines how AIAA displays signals without confusing popularity, certification, and public identity."]
];

const clauses = [
  ["ID-001", "Every public agent record must have one AIAA ID.", "Visitors can verify identity without guessing."],
  ["ID-002", "Owner fields must identify the accountable operator.", "Public accountability stays visible."],
  ["EV-001", "Every certification decision must cite evidence types.", "Reviewer trust becomes visible."],
  ["EV-002", "Private evidence should be summarized without exposing sensitive data.", "Public proof stays useful and controlled."],
  ["RV-001", "Expired and revoked records must stay visible.", "Registry history remains auditable."],
  ["RK-001", "Ranking pages must separate popularity and certification.", "Signals stay honest and readable."],
  ["TR-001", "Brand and level labels must avoid ambiguous abbreviations.", "Browser translation remains stable."]
];

export default function StandardsPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Standards"
        title="A public standard index for AI Agent identity."
        copy="Standards make AIAA read like infrastructure. Each section defines how agent records, evidence, review, registry states, and public trust signals should work."
        stats={[["0.1", "draft version"], ["7", "standard groups"], ["Public", "index format"], ["Review", "decision layer"], ["Registry", "record output"]]}
      />

      <Section eyebrow="Document Index" title="Standards should look like reference material." copy="The page uses chapter rows, version metadata, clauses, and status fields instead of large marketing blocks.">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit border-y border-neutral-300 py-6 lg:sticky lg:top-28">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-neutral-500">Document Metadata</p>
            <div className="mt-5 space-y-4">
              {[
                ["Current version", "AIAA Standard Draft 0.1"],
                ["Updated", "2026-05-26"],
                ["Status", "Public structure draft"],
                ["Applies to", "Certification, registry, rankings, verification URLs"],
                ["Language", "English primary site"]
              ].map(([label, value]) => (
                <div key={label} className="border-t border-neutral-200 pt-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</div>
                  <div className="mt-2 text-sm font-semibold text-neutral-950">{value}</div>
                </div>
              ))}
            </div>
          </aside>

          <IndexList rows={standards.map(([index, title, copy]) => ({ index, title, copy, meta: "Draft" }))} />
        </div>
      </Section>

      <Section eyebrow="Clauses" title="The first clauses are practical." copy="These clauses can expand into full policy pages after the UI structure is accepted.">
        <ThinTable
          headers={["Clause", "Requirement", "Public effect"]}
          rows={clauses.map(([clause, requirement, effect]) => [<span key="clause" className="font-mono text-neutral-950">{clause}</span>, requirement, effect])}
        />
      </Section>

      <Section eyebrow="Status Labels" title="Policy status needs public labels." copy="Visitors and applicants should know whether a standard is a draft, current rule, archived rule, or review item.">
        <ThinTable
          headers={["Label", "Meaning", "Usage"]}
          rows={[
            [<StatusPill key="draft">Draft</StatusPill>, "Not final. Open for internal review.", "Early AIAA page structure."],
            [<StatusPill key="current" tone="good">Current</StatusPill>, "Accepted active rule.", "Certification and registry logic."],
            [<StatusPill key="review" tone="warn">Under Review</StatusPill>, "Active rule being checked.", "Policy updates and appeals."],
            [<StatusPill key="archived" tone="bad">Archived</StatusPill>, "Old rule preserved for history.", "Deprecated public records."]
          ]}
        />
      </Section>

      <CTASection title="Connect standards to certification." copy="The standards page should become the source of truth for registry fields, review decisions, public labels, and ranking boundaries." primaryHref="/certification" primaryLabel="View Certification" secondaryHref="/registry" secondaryLabel="View Registry" />
    </AIAAFrame>
  );
}
