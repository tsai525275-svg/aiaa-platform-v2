import { AIAAFrame, PageHero } from "@/components/aiaa-page-kit";
import { MemberApplicationsTracker } from "@/components/certification-application-flow";

export default function MemberApplicationsPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Applications"
        title="Track your certification path."
        copy="This page reads your real application system application records. It does not show fake approvals. New members start with no certificate."
        stats={[["Profile", "member"], ["Level 1", "first"], ["Exam", "required"], ["Review", "manual"], ["Certificate", " after  approval"]]}
      />
      <MemberApplicationsTracker />
    </AIAAFrame>
  );
}
