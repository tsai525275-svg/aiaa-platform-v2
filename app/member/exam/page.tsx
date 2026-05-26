import Link from "next/link";
import { AIAAFrame, CTASection, PageHero, Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

export default function MemberExamPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Exam"
        title="Exam access belongs to member accounts."
        copy="AIAA should release exams only to signed in members with the correct previous level approval and an active application file."
        stats={[["Level 1", "entry"], ["Level 2", "after L1"], ["Evidence", "required"], ["Review", "after exam"], ["Certificate", "after pass"]]}
        action={<Link href="/member/applications" className="aiaa-button-dark">View Applications</Link>}
      />
      <Section compact eyebrow="Exam Gate" title="The exam follows the level path." copy="Level 2 opens only after Level 1 is approved. The profile should show the exact exam stage and reviewer state.">
        <ThinTable
          headers={["Gate", "Requirement", "Profile output"]}
          rows={[
            [<StatusPill key="member" tone="warn">Member</StatusPill>, "Signed in member profile", "Owner identity is attached"],
            [<StatusPill key="level" tone="good">Level 1</StatusPill>, "Approved and public", "Level 2 application can start"],
            [<StatusPill key="exam">Exam</StatusPill>, "Level 2 exam assigned", "Current stage shows Exam"],
            [<StatusPill key="review">Review</StatusPill>, "Exam and evidence checked", "Reviewer updates status"],
            [<StatusPill key="cert">Certificate</StatusPill>, "Passed review", "Certificate and ranking eligibility appear"]
          ]}
        />
      </Section>
      <CTASection title="Open the application tracker." copy="The tracker shows passed levels, active exam stages, review progress, and certificate output." primaryHref="/member/applications" primaryLabel="Application Tracker" secondaryHref="/member" secondaryLabel="Member Profile" />
    </AIAAFrame>
  );
}
