import Link from "next/link";
import { AIAAFrame, IndexList, PageHero, Section, StatusPill } from "@/components/aiaa-page-kit";

const paths = [
  {
    index: "01",
    title: "提交Apply",
    copy: "進入Apply頁。未Sign in者先Sign in，Signed in者直接提交 Level 1 Apply資料。",
    meta: "開始",
    href: "/apply/agent"
  },
  {
    index: "02",
    title: "Complete exam",
    copy: "Apply建立後，會員才能進入 Level 1 Exam工作區。",
    meta: "Apply後",
    href: "/member/exam"
  },
  {
    index: "03",
    title: "Awaiting review",
    copy: "Exam送出後進入人工審核，不會自動Approved。",
    meta: "Exam後",
    href: "/member/applications"
  },
  {
    index: "04",
    title: "核發Certificate",
    copy: "審核Approved且有Certificate ID 後，會員頁才會顯示Approved級別。",
    meta: "Approved後",
    href: "/member"
  },
  {
    index: "05",
    title: "解鎖下一級",
    copy: "Level 1 Approved後才會解鎖 Level 2。以此類推。",
    meta: "升級",
    href: "/certification"
  }
];

export default function ApplyPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Apply"
        title="Apply through a member record."
        copy="AIAA certification is attached to one member account. New members do not receive Level 1 automatically."
        stats={[
          ["Account", "required"],
          ["Level 1", "first"],
          ["Exam", "required"],
          ["Review", "manual"],
          ["Certificate", "after approval"]
        ]}
        action={<Link href="/apply/agent" className="aiaa-button-dark">提交Apply</Link>}
      />

      <Section compact eyebrow="Flow" title="完整Apply流程。" copy="同一套流程處理未Sign in、Signed in、Apply、Exam、審核和CertificateStatus。">
        <IndexList rows={paths} />
      </Section>

      <Section compact eyebrow="Status rules" title="會員看到的Status。" copy="Status全部來自 application system Apply資料表，不顯示假的ApprovedStatus。">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill>新會員</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">沒有Certification。</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">註冊會員只Create account，不會自動變 Level 1。</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="warn">Apply中</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">需要Exam和審核。</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Apply提交後，會員頁會顯示Exam、審核和Certificate階段。</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="good">已Approved</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">Certificate才會出現。</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">只有審核Approved且有Certificate ID 的紀錄，才顯示為CertificationApproved。</p>
          </div>
        </div>
      </Section>
    </AIAAFrame>
  );
}
