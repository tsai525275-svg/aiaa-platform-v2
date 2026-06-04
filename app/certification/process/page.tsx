import Link from "next/link";
import { AIAAFrame, CTASection, DotMatrix, IndexList, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const steps = [
  ["01", "Application Intake", "Collect owner identity, Agent name, category, country, product URL, and requested level."],
  ["02", "Identity Screening", "Check owner consistency, public footprint, contact path, and registry eligibility."],
  ["03", "AI Assistance Declaration", "Require disclosure of AI tools used, what AI helped with, what the candidate personally verified, and confirmation that the candidate can explain the submission."],
  ["04", "Evidence Review", "Inspect logs, screenshots, workflow proof, documentation, repository or deployment context, and whether the evidence is reproducible."],
  ["05", "Capability Assessment", "Review engineering judgment, debugging ability, reliability, task claims, scope limits, and evaluator notes."],
  ["06", "Decision", "Issue approval, request information, reject, mark watchlist, or route to higher review."],
  ["07", "Publication", "Create certificate page, registry row, status field, issue date, expiry date, and review summary."]
];

export default function CertificationProcessPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Certification Process"
        title="A review flow that ends in public proof."
        copy="The process turns an application into a decision, then turns the decision into a registry record and certificate page."
        stats={[["7", "review steps"], ["5", "status states"], ["Evidence", "review base"], ["Registry", "public output"], ["Expiry", "renewal rule"]]}
        action={<Link href="/apply/agent" className="aiaa-button-dark">Start Application</Link>}
      />

      <Section eyebrow="Workflow" title="The review path should feel procedural." copy="AIAA needs a process page that reads like infrastructure, not marketing copy.">
        <IndexList rows={steps.map(([index, title, copy]) => ({ index, title, copy, meta: "Step" }))} />
      </Section>

      <Section eyebrow="AI Assisted Policy" title="AIAA exams are AI assisted." copy="AIAA does not ban AI support. AIAA requires disclosure, verifiable evidence, and the ability to explain the final work in the candidate's own words.">
        <ThinTable
          headers={["Policy Area", "Expectation", "Fail Condition"]}
          rows={[
            ["Allowed tools", "Candidates may use ChatGPT, Claude, Codex, Cursor, GitHub Copilot, and official documentation.", "Undisclosed AI assistance or hidden dependence on generated output."],
            ["Certification standard", "AIAA certifies engineering judgment, system execution, evidence quality, debugging ability, reliability, and production readiness.", "Memorization claims without runnable or reviewable evidence."],
            ["Disclosure", "Candidates must declare what AI was used, what AI helped with, what they personally verified, and confirm they can explain the submission.", "Missing AI Assistance Declaration."],
            ["Review model", "AIAA uses evidence based review rather than invasive monitoring or browser lockdown.", "Prompt only, UI only, demo only, or non reproducible submissions."]
          ].map(([area, expectation, fail]) => [<span key="area" className="font-semibold text-neutral-950">{area}</span>, expectation, fail])}
        />
      </Section>

      <Section eyebrow="Reviewer Checklist" title="What reviewers inspect." copy="The checklist helps applicants understand what evidence to prepare before review starts.">
        <ThinTable
          headers={["Review Area", "Evidence", "Decision Impact"]}
          rows={[
            ["Owner Identity", "Company records, owner contact, product URL, public profile.", "Controls whether a registry record is created."],
            ["AI Assistance Disclosure", "AI tools used, what AI helped with, what the candidate personally verified, and explanation confirmation.", "Controls whether the evidence package is reviewable."],
            ["Agent Capability", "Task examples, workflow logs, tool calls, supported use cases, debugging records, and reproducible output.", "Controls claimed scope and level eligibility."],
            ["Safety Boundary", "Permission limits, fallback behavior, human override, prohibited use notes, and reproducibility constraints.", "Controls review conditions and warnings."],
            ["Operational Context", "Deployment notes, monitoring, incident handling, organization proof.", "Controls Level 4 and Level 5 readiness."],
            ["Public Presentation", "Website claims, docs, labels, user facing promises.", "Controls registry wording and certificate text."]
          ].map(([area, evidence, impact]) => [<span key="area" className="font-semibold text-neutral-950">{area}</span>, evidence, impact])}
        />
      </Section>

      <Section eyebrow="Decision Map" title="Every decision needs a next action." copy="No applicant should reach a dead end. Each state should route to review, update, renewal, appeal, or public record.">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <DotMatrix labels={["Pending", "Verified", "Info Needed", "Expired", "Revoked"]} />
          <ThinTable
            headers={["State", "Next Action", "Public Output"]}
            rows={[
              ["Pending", "Wait for reviewer or submit missing details.", "Pending registry row when enabled."],
              ["Verified", "Publish certificate and registry record.", "Public record and certificate URL."],
              ["Information Needed", "Applicant uploads missing proof.", "Private review state."],
              ["Expired", "Applicant requests renewal.", "Expired status remains visible."],
              ["Revoked", "Applicant may appeal or submit remediation.", "Revoked status remains visible."]
            ].map(([state, action, output]) => [<StatusPill key="state">{state}</StatusPill>, action, output])}
          />
        </div>
      </Section>

      <CTASection title="Prepare an Agent review file." copy="Start with identity, ownership, product URL, capability claims, and evidence links." primaryHref="/apply/agent" primaryLabel="Submit Agent" secondaryHref="/certification" secondaryLabel="Certification Levels" />
    </AIAAFrame>
  );
}
