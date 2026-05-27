import { AIAAFrame, PageHero } from "@/components/aiaa-page-kit";
import { MemberExamWorkspace } from "@/components/certification-application-flow";

export default function MemberExamPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Exam"
        title="Complete the active level exam."
        copy="The exam belongs to your active application. Submitting the exam moves the file to reviewer review. It does not issue a certificate automatically."
        stats={[["Application", "required"], ["Exam", "answers"], ["Review", "manual"], ["Certificate", "not automatic"], ["Ranking", "after approval"]]}
      />
      <MemberExamWorkspace />
    </AIAAFrame>
  );
}
