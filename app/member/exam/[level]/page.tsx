import { AiaaV61ExamWorkspace } from "@/components/aiaa-v61-exam-workspace";

export const metadata = {
  title: "AIAA Certification Exam"
};

export default async function MemberLevelExamPage({ params }: { params: Promise<{ level: string }> }) {
  const resolved = await params;
  return <AiaaV61ExamWorkspace levelSlug={resolved.level} />;
}
