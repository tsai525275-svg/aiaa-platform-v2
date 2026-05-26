import Link from "next/link";
import { AIAAFrame, CTASection, FieldGroup, PageHero, Section, StaticInput, StaticTextarea, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const reviewPath = [
  ["01", "Confirm Agent identity"],
  ["02", "Confirm owner"],
  ["03", "Review product evidence"],
  ["04", "Assign certification result"],
  ["05", "Publish registry record"]
];

const checklist = [
  ["Identity", "Agent name, product website, category, country"],
  ["Owner", "Accountable person, company, contact email"],
  ["Capability", "What the Agent does, target users, current product status"],
  ["Evidence", "Docs, demo, repository, screenshots, workflow examples"],
  ["Safety", "Permissions, data handling, limits, human review points"]
];

export default function ApplyAgentPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Agent Application"
        title="Submit an AI Agent for AIAA review."
        copy="A member account is required before the form is submitted. The same profile will track application, exam, review, certificate, and ranking eligibility states."
        stats={[["Level 1", "default start"], ["Owner", "required"], ["Evidence", "recommended"], ["Registry", "after approval"], ["AIAA ID", "after review"]]}
        action={<Link href="/signup" className="aiaa-button-dark">Create Member Account</Link>}
      />

      <Section compact eyebrow="Application Form" title="Enter the Agent and owner information." copy="Keep the first submission focused. Reviewers need a clear product identity, accountable owner, capability claim, and evidence links.">
        <div className="mb-8 border-y border-neutral-300 py-6">
          <p className="eyebrow">Member Gate</p>
          <h3 className="text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Application submission requires a member profile.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">Create or sign in to an AIAA member account first. The profile stores your name, avatar, approved levels, active exam stage, review state, certificate record, and ranking eligibility.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/signup" className="aiaa-button-dark">Create Account</Link>
            <Link href="/login" className="aiaa-button-light">Sign In</Link>
            <Link href="/member" className="aiaa-button-light">Member Profile</Link>
          </div>
        </div>

        <form className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-6">
            <FieldGroup title="Status">
              <div className="flex flex-wrap gap-2">
                <StatusPill>Draft</StatusPill>
                <StatusPill tone="warn">Level 1 start</StatusPill>
                <StatusPill>Registry after approval</StatusPill>
              </div>
              <p className="text-sm leading-6 text-neutral-600">Submit the product first. Higher certification levels require stronger proof after the first identity review.</p>
            </FieldGroup>

            <FieldGroup title="Review path">
              {reviewPath.map(([no, label]) => (
                <div key={no} className="grid grid-cols-[48px_1fr] border-t border-neutral-200 pt-3 text-sm">
                  <span className="font-mono text-neutral-500">{no}</span>
                  <span className="font-semibold text-neutral-950">{label}</span>
                </div>
              ))}
            </FieldGroup>
          </aside>

          <div className="space-y-8">
            <FieldGroup title="Agent identity">
              <div className="grid gap-5 md:grid-cols-2">
                <StaticInput label="Agent name" placeholder="Example: Atlas Workflow Agent" />
                <StaticInput label="Product website" placeholder="https://example.com" />
                <StaticInput label="Category" placeholder="Workflow Agent, Browser Agent, Coding Agent" />
                <StaticInput label="Country" placeholder="United States, Vietnam, Taiwan" />
              </div>
            </FieldGroup>

            <FieldGroup title="Owner information">
              <div className="grid gap-5 md:grid-cols-2">
                <StaticInput label="Owner name" placeholder="Company or accountable person" />
                <StaticInput label="Owner email" placeholder="review@example.com" type="email" />
                <StaticInput label="Company" placeholder="Legal or operating company" />
                <StaticInput label="Company website" placeholder="https://company.com" />
              </div>
            </FieldGroup>

            <FieldGroup title="Review request">
              <div className="grid gap-5 md:grid-cols-2">
                <StaticInput label="Requested level" placeholder="Level 1" />
                <StaticInput label="Product status" placeholder="Public beta, production, private pilot" />
                <StaticTextarea label="Capability claim" placeholder="Describe what the Agent does, who uses it, and which tasks it handles." />
                <StaticTextarea label="Safety notes" placeholder="Describe permissions, data handling, limits, human approval points, and failure handling." />
              </div>
            </FieldGroup>

            <FieldGroup title="Evidence links">
              <div className="grid gap-5 md:grid-cols-2">
                <StaticInput label="Documentation URL" placeholder="https://docs.example.com" />
                <StaticInput label="Repository URL" placeholder="GitHub or private review link" />
                <StaticInput label="Demo URL" placeholder="Public demo or reviewer access URL" />
                <StaticInput label="Benchmark URL" placeholder="Optional evaluation link" />
                <StaticTextarea label="Evidence summary" placeholder="List screenshots, logs, workflow examples, test cases, customer proof, or reviewer notes." />
              </div>
            </FieldGroup>

            <div className="border-y border-neutral-300 py-6">
              <div className="flex flex-wrap gap-3">
                <Link href="/signup" className="aiaa-button-dark">Create account to submit</Link>
                <Link href="/member" className="aiaa-button-light">Open member profile</Link>
                <Link href="/certification" className="aiaa-button-light">View Levels</Link>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-500">After account sign in, this form should save under the member profile and display application, exam, review, certificate, and ranking stages.</p>
            </div>
          </div>
        </form>
      </Section>

      <Section compact eyebrow="Review Checklist" title="What reviewers check." copy="The review should separate public claims from private evidence. The public registry should show only approved identity and certification information.">
        <ThinTable
          headers={["Area", "Information needed"]}
          rows={checklist.map(([area, info]) => [
            <span key="area" className="font-semibold text-neutral-950">{area}</span>,
            info
          ])}
        />
      </Section>

      <CTASection title="Need the process first?" copy="Review the certification process before sending the Agent application." primaryHref="/signup" primaryLabel="Create Account" secondaryHref="/member" secondaryLabel="Member Profile" />
    </AIAAFrame>
  );
}
