import Link from "next/link";
import { AIAAFrame, CTASection, IndexList, PageHero, Section, StatusPill } from "@/components/aiaa-page-kit";

const paths = [
  {
    index: "01",
    title: "Member application",
    copy: "Create or sign in to a member account before submitting evidence. Every application must attach to one account.",
    meta: "Required",
    href: "/apply/agent"
  },
  {
    index: "02",
    title: "Level exam",
    copy: "After the application exists, the member opens the exam workspace and submits answers for reviewer assessment.",
    meta: "After submit",
    href: "/member/exam"
  },
  {
    index: "03",
    title: "Review and certificate",
    copy: "A reviewer must approve the file before the profile shows an approved level or certificate.",
    meta: "Manual review",
    href: "/member/applications"
  }
];

export default function ApplyPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Apply"
        title="Apply through a member record."
        copy="AIAA certification is not issued at signup. Members submit evidence, complete an exam, enter review, and receive a certificate only after approval."
        stats={[["Account", "required"], ["Level 1", "first"], ["Exam", "required"], ["Review", "manual"], ["Ranking", "after approval"]]}
        action={<Link href="/apply/agent" className="aiaa-button-dark">Submit Level 1 application</Link>}
      />

      <Section compact eyebrow="Flow" title="What happens after you apply." copy="This flow keeps every step tied to the member profile. New users do not receive Level 1 automatically.">
        <IndexList rows={paths} />
      </Section>

      <Section compact eyebrow="Access" title="What each member sees." copy="The profile shows only real status from the application table.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill>New member</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">No certification yet.</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">The account can edit profile data, but the level remains empty until review approval.</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="warn">Submitted</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">Exam and review are active.</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">The tracker shows application, exam, review, certificate, and ranking stages.</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="good">Approved</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">Certificate appears.</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Only approved records show certificate ID, public level, and next level access.</p>
          </div>
        </div>
      </Section>

      <CTASection title="Start with Level 1." copy="Submit your Agent evidence under your member account." primaryHref="/apply/agent" primaryLabel="Submit Application" secondaryHref="/member/applications" secondaryLabel="Open Tracker" />
    </AIAAFrame>
  );
}
