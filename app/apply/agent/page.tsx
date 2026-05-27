import Link from "next/link";
import { AIAAFrame, PageHero, Section, ThinTable } from "@/components/aiaa-page-kit";
import { CertificationApplicationForm } from "@/components/certification-application-flow";

const reviewChecklist = [
  ["Identity", "Agent name, product website, category, and country or region"],
  ["Owner", "Responsible owner、Company、Contact email"],
  ["Capability", "Tasks handled, users served, and current operating status"],
  ["Evidence", "GitHub repo, README, demo, video, execution screenshots, and workflow records"],
  ["Safety", "Permissions, data handling, limits, human review points, and error handling"]
];

export default function ApplicationAgentPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Agent Application"
        title="Submit an AI Agent for AIAA review."
        copy="Submit the application through your member account. The same record tracks application, exam, review, certificate, and ranking eligibility."
        stats={[
          ["Level 1", "first"],
          ["Owner", "required"],
          ["Evidence", "required"],
          ["Exam", " after  submit"],
          ["Certificate", " after  approval"]
        ]}
        action={<Link href="/member/applications" className="aiaa-button-light">View applications</Link>}
      />

      <CertificationApplicationForm />

      <Section compact eyebrow="Review checklist" title="What reviewers check" copy="This page handles the real application flow. Signed out users are sent to sign in first. Signed in users see the submission form directly.">
        <ThinTable
          headers={["Area", "Required information"]}
          rows={reviewChecklist.map(([area, info]) => [
            <span key="area" className="font-semibold text-neutral-950">{area}</span>,
            info
          ])}
        />
      </Section>
    </AIAAFrame>
  );
}
