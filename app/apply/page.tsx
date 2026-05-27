import Link from "next/link";
import { AIAAFrame, IndexList, PageHero, Section, StatusPill } from "@/components/aiaa-page-kit";

const paths = [
  {
    index: "01",
    title: "提交申請",
    copy: "進入申請頁。未登入者先登入，Signed in者直接提交 Level 1 申請資料。",
    meta: "開始",
    href: "/apply/agent"
  },
  {
    index: "02",
    title: "完成考試",
    copy: "申請建立後，會員才能進入 Level 1 考試工作區。",
    meta: "申請後",
    href: "/member/exam"
  },
  {
    index: "03",
    title: "等待審核",
    copy: "考試送出後進入人工審核，不會自動通過。",
    meta: "考試後",
    href: "/member/applications"
  },
  {
    index: "04",
    title: "核發證書",
    copy: "審核通過且有證書 ID 後，會員頁才會顯示通過級別。",
    meta: "通過後",
    href: "/member"
  },
  {
    index: "05",
    title: "解鎖下一級",
    copy: "Level 1 通過後才會解鎖 Level 2。以此類推。",
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
        action={<Link href="/apply/agent" className="aiaa-button-dark">提交申請</Link>}
      />

      <Section compact eyebrow="Flow" title="完整申請流程。" copy="同一套流程處理未登入、Signed in、申請、考試、審核和證書狀態。">
        <IndexList rows={paths} />
      </Section>

      <Section compact eyebrow="Status rules" title="會員看到的狀態。" copy="狀態全部來自 Supabase 申請資料表，不顯示假的通過狀態。">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill>新會員</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">沒有認證。</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">註冊會員只建立帳戶，不會自動變 Level 1。</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="warn">申請中</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">需要考試和審核。</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">申請提交後，會員頁會顯示考試、審核和證書階段。</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="good">已通過</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">證書才會出現。</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">只有審核通過且有證書 ID 的紀錄，才顯示為認證通過。</p>
          </div>
        </div>
      </Section>
    </AIAAFrame>
  );
}
