import Link from "next/link";
import { AIAAFrame, PageHero, Section, ThinTable } from "@/components/aiaa-page-kit";
import { CertificationApplicationForm } from "@/components/certification-application-flow";

const reviewChecklist = [
  ["身份", "代理人名稱、產品網站、類別、國家或地區"],
  ["擁有者", "負責人、公司、聯絡信箱"],
  ["能力", "代理人處理哪些任務、服務哪些使用者、目前狀態"],
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

      <Section compact eyebrow="Review checklist" title="審核員會檢查哪些內容？" copy="申請頁只處理真實申請流程。未登入者會先導向登入，Signed in者會直接看到提交申請表。">
        <ThinTable
          headers={["區域", "所需資料"]}
          rows={reviewChecklist.map(([area, info]) => [
            <span key="area" className="font-semibold text-neutral-950">{area}</span>,
            info
          ])}
        />
      </Section>
    </AIAAFrame>
  );
}
