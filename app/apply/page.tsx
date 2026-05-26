import Link from "next/link";
import { AIAAFrame, CTASection, IndexList, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const applicationPaths = [
  {
    index: "00",
    title: "Create member account",
    copy: "Required before application submission, exam access, review tracking, certificate issuance, and ranking eligibility.",
    href: "/signup",
    meta: "Required"
  },
  {
    index: "01",
    title: "Submit an AI Agent",
    copy: "For product owners who want AIAA review, certification, and a public registry record.",
    href: "/apply/agent",
    meta: "Start here"
  },
  {
    index: "02",
    title: "Request owner access",
    copy: "For the person or company that will manage the Agent record after review.",
    href: "/access",
    meta: "Access"
  },
  {
    index: "03",
    title: "Prepare evidence",
    copy: "For teams that need to collect docs, demos, workflow examples, safety notes, and repository links.",
    href: "/certification/process",
    meta: "Checklist"
  },
  {
    index: "04",
    title: "Review certification levels",
    copy: "For applicants who need to choose Level 1, Level 2, Level 3, Level 4, or Level 5 before applying.",
    href: "/certification",
    meta: "Levels"
  }
];

const submissionItems = [
  ["Product website", "Reviewers check the public product, product name, and public claims.", "Required"],
  ["Owner contact", "Reviewers need one accountable person or company for follow up.", "Required"],
  ["Agent description", "The application must state what the Agent does and what it should not claim.", "Required"],
  ["Evidence links", "Docs, demos, screenshots, workflow logs, repository links, or benchmark pages support the review.", "Recommended"],
  ["Target level", "Level 1 is the normal starting point. Higher levels need stronger evidence.", "Required"]
];

const processRows = [
  ["01", "Application received", "AIAA creates a private review file."],
  ["02", "Identity check", "The product name, owner, website, and category are checked."],
  ["03", "Evidence review", "Reviewer checks product claims, workflow proof, and safety notes."],
  ["04", "Decision", "The Agent is approved, paused for more evidence, or rejected."],
  ["05", "Public output", "Approved Agents receive a public registry record and certification status."]
];

function Status({ value }: { value: string }) {
  if (value === "Required") return <StatusPill tone="warn">Required</StatusPill>;
  return <StatusPill>{value}</StatusPill>;
}

export default function ApplyPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Apply"
        title="Choose the right AIAA application path."
        copy="Create or sign in to a member account first. Then submit the Agent application, take the required exam, follow review status, receive a certificate, and become eligible for public ranking records."
        stats={[["01", "Agent application"], ["Level 1", "normal start"], ["Evidence", "review base"], ["Registry", "public output"], ["Owner", "accountability"]]}
        action={<Link href="/signup" className="aiaa-button-dark">Create Member Account</Link>}
      />

      <Section compact eyebrow="Start" title="Pick one path." copy="Most applicants should start with a member account. The other pages explain access, evidence, and certification levels before you send the form.">
        <IndexList rows={applicationPaths} />
      </Section>

      <Section compact eyebrow="Requirements" title="Prepare these items before applying." copy="The application should be clear enough for a reviewer to identify the Agent, contact the owner, and inspect evidence without extra guesswork.">
        <ThinTable
          headers={["Item", "Why it matters", "Status"]}
          rows={submissionItems.map(([item, reason, status]) => [
            <span key="item" className="font-semibold text-neutral-950">{item}</span>,
            reason,
            <Status key="status" value={status} />
          ])}
        />
      </Section>

      <Section compact eyebrow="Process" title="What happens after you submit." copy="AIAA reviews the application before any public listing appears. A registry record is created only after approval.">
        <ThinTable
          headers={["Step", "Review action", "Result"]}
          rows={processRows.map(([step, action, result]) => [
            <span key="step" className="font-mono font-semibold text-neutral-950">{step}</span>,
            <span key="action" className="font-semibold text-neutral-950">{action}</span>,
            result
          ])}
        />
      </Section>

      <CTASection title="Start with the Agent form." copy="Submit the product first. Owner access and higher level review can follow after identity is clear." primaryHref="/signup" primaryLabel="Create Account" secondaryHref="/apply/agent" secondaryLabel="View Agent Form" />
    </AIAAFrame>
  );
}
