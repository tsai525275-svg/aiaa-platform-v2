import Link from "next/link";
import { AIAAFrame, IndexList, PageHero, Section, StatusPill } from "@/components/aiaa-page-kit";

const paths = [
  {
    index: "01",
    title: "Submit application",
    copy: "Enter the application page. Signed out users sign in first. Signed in users submit Level 1 application data directly.",
    meta: "Start",
    href: "/apply/agent"
  },
  {
    index: "02",
    title: "Complete exam",
    copy: "After the application is created, the member can enter the Level 1 exam workspace.",
    meta: "After application",
    href: "/member/exam"
  },
  {
    index: "03",
    title: "Awaiting review",
    copy: "After exam submission, the application enters manual review. It is not approved automatically.",
    meta: "After exam",
    href: "/member/applications"
  },
  {
    index: "04",
    title: "Issue certificate",
    copy: "The member page shows an approved level only  after  review approval and certificate issuance.",
    meta: "Approved after ",
    href: "/member"
  },
  {
    index: "05",
    title: "Unlock next level",
    copy: "Level 2 unlocks only  after  Level 1 approval. The same rule applies to each next level.",
    meta: "Upgrade",
    href: "/certification"
  }
];

export default function ApplicationPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Application"
        title="Application through a member record."
        copy="AIAA certification is attached to one member account. New members do not receive Level 1 automatically."
        stats={[
          ["Account", "required"],
          ["Level 1", "first"],
          ["Exam", "required"],
          ["Review", "manual"],
          ["Certificate", " after  approval"]
        ]}
        action={<Link href="/apply/agent" className="aiaa-button-dark">Submit application</Link>}
      />

      <Section compact eyebrow="Flow" title="Complete application flow。" copy="One flow handles signed out users, signed in members, applications, exams, review, and certificate status.">
        <IndexList rows={paths} />
      </Section>

      <Section compact eyebrow="Status rules" title="What members see" copy="All status data comes from the application record. The site does not show fake approval states.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill>New member</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">No certification yet.</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Creating an account does not grant Level 1 automatically.</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="warn">Application in progress</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">Exam and review required.</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">After submission, the member page shows exam, review, and certificate stages.</p>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
            <StatusPill tone="good">Approved</StatusPill>
            <h3 className="mt-4 text-xl font-semibold text-neutral-950">Certificate appears  after  issuance.</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Only review approved records with a certificate ID display as certified.</p>
          </div>
        </div>
      </Section>
    </AIAAFrame>
  );
}
