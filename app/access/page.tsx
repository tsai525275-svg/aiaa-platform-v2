import Link from "next/link";
import { AIAAFrame, CTASection, DataPanel, IndexList, PageHero, Section, SplitLedger, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const entrances = [
  ["00", "Member Account", "Create or sign in before application submission, exam access, review tracking, certificate issuance, and ranking eligibility.", "/member"],
  ["01", "Agent Owner", "Register an AI Agent, apply for certification, and manage public registry records.", "/apply/agent"],
  ["02", "Builder", "Submit technical evidence, workflow logs, repository links, and builder identity.", "/apply"],
  ["03", "Organization", "Prepare company level verification, public product records, and institutional review.", "/certification"],
  ["04", "Reviewer", "Review evidence, decision states, registry consistency, and public verification output.", "/certification/process"]
];

export default function AccessPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Access"
        title="The entry point for AIAA identity records."
        copy="Access starts with membership. Every application, exam, review, certificate, and ranking eligible record must belong to a signed in member profile."
        stats={[["Member", "required"], ["Owner", "agent record"], ["Builder", "evidence"], ["Org", "review"], ["Reviewer", "decision"]]}
        action={<Link href="/signup" className="aiaa-button-dark">Create Account</Link>}
      />

      <Section eyebrow="Entrances" title="Choose the correct starting point." copy="Start with a member account. Then route the user to Agent owner, builder, organization, or reviewer work.">
        <IndexList rows={entrances.map(([index, title, copy, href]) => ({ index, title, copy, meta: "Enter", href }))} />
      </Section>

      <Section eyebrow="Access Rules" title="Permissions should follow record purpose." copy="Different actors need different permission scopes. This keeps public trust pages separate from private review work.">
        <SplitLedger
          left={
            <div className="space-y-6">
              <DataPanel label="Portal State" title="Member portal now" copy="This page links into sign in, profile editing, application status, reviewer access, and organization permissions." />
              <DataPanel label="Main Output" title="Registry plus certificate" copy="Access should always route back to public proof, not private dashboards only." />
            </div>
          }
          right={
            <ThinTable
              headers={["Actor", "Allowed work", "Public output"]}
              rows={[
                ["Agent Owner", "Create and update agent application records", "Registry record and certificate page"],
                ["Builder", "Submit workflow evidence and technical proof", "Builder profile and contribution context"],
                ["Organization", "Submit company proof and ownership documents", "Organization linked registry records"],
                ["Reviewer", "Inspect evidence and issue decision states", "Verified, Pending, Expired, Revoked, Watchlist"]
              ].map(([actor, work, output]) => [<span key="actor" className="font-semibold text-neutral-950">{actor}</span>, work, output])}
            />
          }
        />
      </Section>

      <Section eyebrow="Account States" title="The portal needs clear states later." copy="The UI is ready for account status, application status, reviewer status, and public record status.">
        <ThinTable
          headers={["State", "Meaning", "Next Action"]}
          rows={[
            [<StatusPill key="new">New</StatusPill>, "No application exists.", "Start an Agent application."],
            [<StatusPill key="draft">Draft</StatusPill>, "Application has unsent fields.", "Complete identity and evidence."],
            [<StatusPill key="review">Under Review</StatusPill>, "Reviewer is checking materials.", "Wait or answer information request."],
            [<StatusPill key="approved" tone="good">Approved</StatusPill>, "Certificate and registry record are ready.", "Publish and monitor expiry."],
            [<StatusPill key="action" tone="warn">Action Needed</StatusPill>, "Reviewer needs more material.", "Upload missing proof."]
          ]}
        />
      </Section>

      <CTASection title="Start from the correct access path." copy="For now, the fastest route is submitting an Agent application and entering Level 1 review." primaryHref="/signup" primaryLabel="Create Account" secondaryHref="/member" secondaryLabel="Member Profile" />
    </AIAAFrame>
  );
}
