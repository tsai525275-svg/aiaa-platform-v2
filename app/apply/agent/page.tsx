import Link from "next/link";
import { AIAAFrame, PageHero, Section, ThinTable } from "@/components/aiaa-page-kit";
import { CertificationApplicationForm } from "@/components/certification-application-flow";

const reviewChecklist = [
  ["Identity", "Agent name、Product website、Category、Country或地區"],
  ["Owner", "Responsible owner、Company、Contact email"],
  ["能力", "代理人處理哪些任務、服務哪些使用者、目前Status"],
  ["證據", "GitHub Repo、README、Demo、影片、執行截圖、流程紀錄"],
  ["安全", "權限、資料處理、限制、人工審核點、錯誤處理"]
];

export default function ApplyAgentPage() {
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
          ["Exam", "after submit"],
          ["Certificate", "after approval"]
        ]}
        action={<Link href="/member/applications" className="aiaa-button-light">View applications</Link>}
      />

      <CertificationApplicationForm />

      <Section compact eyebrow="Review checklist" title="審核員會檢查哪些內容？" copy="Apply頁只處理真實Apply流程。未Sign in者會先導向Sign in，Signed in者會直接看到提交Apply表。">
        <ThinTable
          headers={["Area", "所需資料"]}
          rows={reviewChecklist.map(([area, info]) => [
            <span key="area" className="font-semibold text-neutral-950">{area}</span>,
            info
          ])}
        />
      </Section>
    </AIAAFrame>
  );
}
