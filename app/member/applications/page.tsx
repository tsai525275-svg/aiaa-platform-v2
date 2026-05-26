import Link from "next/link";
import { AIAAFrame, CTASection, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const rows = [
  ["Level 1", "Approved", "Public", "Certificate issued", "Visible on profile and registry output"],
  ["Level 2", "In progress", "Exam", "Member action needed", "Complete exam and submit production workflow evidence"],
  ["Level 3", "Locked", "Waiting", "Requires Level 2 approval", "Opens after Level 2 certificate is issued"],
  ["Level 4", "Locked", "Waiting", "Requires Level 3 approval", "Company review path"],
  ["Level 5", "Locked", "Waiting", "Requires Level 4 or council review", "Fellow review path"]
];

function Tone({ value }: { value: string }) {
  if (value === "Approved" || value === "Public") return <StatusPill tone="good">{value}</StatusPill>;
  if (value === "In progress" || value === "Exam" || value === "Member action needed") return <StatusPill tone="warn">{value}</StatusPill>;
  return <StatusPill>{value}</StatusPill>;
}

export default function MemberApplicationsPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Applications"
        title="Track every level under one member account."
        copy="The member profile connects approved levels, active exams, reviewer stages, certificate output, and ranking eligibility."
        stats={[["Level 1", "approved"], ["Level 2", "exam"], ["Review", "tracked"], ["Certificate", "issued"], ["Ranking", "eligible"]]}
        action={<Link href="/apply/agent" className="aiaa-button-dark">Start Application</Link>}
      />
      <Section compact eyebrow="Level State" title="Approved levels and current applications." copy="A member should see public approved levels and private in progress applications in the same profile.">
        <ThinTable
          headers={["Level", "Status", "Stage", "Current result", "Next step"]}
          rows={rows.map(([level, status, stage, result, next]) => [
            <span key="level" className="font-semibold text-neutral-950">{level}</span>,
            <Tone key="status" value={status} />,
            <Tone key="stage" value={stage} />,
            result,
            next
          ])}
        />
      </Section>
      <CTASection title="Member account first." copy="Application submission, exam access, review updates, certificate issuance, and ranking eligibility must stay tied to a member profile." primaryHref="/member" primaryLabel="Open Profile" secondaryHref="/signup" secondaryLabel="Create Account" />
    </AIAAFrame>
  );
}
