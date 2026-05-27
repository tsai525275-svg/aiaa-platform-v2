import Link from "next/link";
import { AIAAFrame, CTASection, DataPanel, DotMatrix, FieldGroup, PageHero, Section, SplitLedger, StatusPill, ThinTable } from "@/components/aiaa-page-kit";

const records = [
  ["AIAA-AGT-0001", "Atlas Workflow Agent", "Northstar Labs", "Level 3", "Verified", "United States", "Workflow Agent", "2026-05-18", "2027-05-18"],
  ["AIAA-AGT-0002", "CodeOps Copilot", "Buildline Systems", "Level 2", "Verified", "Singapore", "Coding Agent", "2026-05-16", "2027-05-16"],
  ["AIAA-AGT-0003", "Retail Support Agent", "Meridian AI", "Level 1", "Pending", "Vietnam", "Support Agent", "2026-05-13", "Pending"],
  ["AIAA-AGT-0004", "Browser Task Agent", "Open Task Lab", "Level 2", "Watchlist", "Taiwan", "Browser Agent", "2026-04-28", "2027-04-28"],
  ["AIAA-AGT-0005", "Invoice Review Agent", "LedgerWorks", "Level 1", "Revoked", "Germany", "Finance Agent", "2026-03-22", "Revoked"],
  ["AIAA-AGT-0006", "Service Desk Agent", "Service Layer Co.", "Level 2", "Expired", "Japan", "Customer Agent", "2025-11-16", "2026-05-16"]
];

const filters = ["All", "Verified", "Pending", "Expired", "Revoked", "Watchlist"];

const statusTone = (status: string) => {
  if (status === "Verified") return "good";
  if (status === "Pending" || status === "Watchlist") return "warn";
  if (status === "Expired" || status === "Revoked") return "bad";
  return "neutral";
};

export default function RegistryPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Public Registry"
        title="Public records for certified AI Agents."
        copy="Registry turns certification into a searchable public identity layer. Each record should show owner, level, status, country, category, issue date, expiry date, and review state."
        stats={[["6", "sample records"], ["5", "status states"], ["Level 1", "entry review"], ["AIAA ID", "public key"], ["Daily", "review cadence"]]}
        action={<Link href="/apply/agent" className="aiaa-button-dark">Submit Agent</Link>}
      />

      <Section eyebrow="Registry Search" title="Search first, inspect second." copy="This page is structured like a public register. The current UI is static. The next system layer can attach database search, record URLs, and verification history.">
        <SplitLedger
          left={
            <aside className="space-y-8">
              <FieldGroup title="Search registry">
                <label>
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-neutral-500">Query</span>
                  <input className="mt-3 h-12 w-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-neutral-950" placeholder="Agent name, owner, AIAA ID" />
                </label>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => <StatusPill key={filter}>{filter}</StatusPill>)}
                </div>
              </FieldGroup>

              <DataPanel label="Record Preview" title="AIAA-AGT-0001" copy="A full record page should expose certificate status, owner identity, evidence summary, review date, expiry date, and status change history.">
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="good">Verified</StatusPill>
                  <StatusPill>Level 3</StatusPill>
                </div>
              </DataPanel>
            </aside>
          }
          right={
            <ThinTable
              headers={["AIAA ID", "Agent Name", "Owner", "Level", "Status", "Country", "Category", "Issued", "Expiry"]}
              rows={records.map((record) => [
                <span key="id" className="font-mono text-neutral-950">{record[0]}</span>,
                <span key="agent" className="font-semibold text-neutral-950">{record[1]}</span>,
                record[2],
                record[3],
                <StatusPill key="status" tone={statusTone(record[4])}>{record[4]}</StatusPill>,
                record[5],
                record[6],
                record[7],
                record[8]
              ])}
            />
          }
        />
      </Section>

      <Section eyebrow="Record Anatomy" title="Every registry page needs the same fields." copy="The field structure keeps public identity, certification status, and operational category separate.">
        <ThinTable
          headers={["Field", "Purpose", "Public rule"]}
          rows={[
            ["AIAA ID", "Stable public identifier", "Never reuse  after  revocation"],
            ["Owner", "Legal or accountable operator", "Show company or individual record owner"],
            ["Certification Level", "Review depth indicator", "Always write Level 1 to Level 5"],
            ["Verification Status", "Current trust state", "Show Verified, Pending, Expired, Revoked, or Watchlist"],
            ["Evidence Summary", "Review basis", "Show evidence categories without exposing private material"],
            ["Change History", "Audit trail", "Keep old states visible for accountability"]
          ].map(([field, purpose, rule]) => [<span key="field" className="font-semibold text-neutral-950">{field}</span>, purpose, rule])}
        />
      </Section>

      <Section eyebrow="State Model" title="Registry status must be readable." copy="The visitor should understand whether a record is valid without opening a private dashboard.">
        <DotMatrix labels={["Verified", "Pending", "Expired", "Revoked", "Watchlist"]} />
      </Section>

      <CTASection title="Register an AI Agent record." copy="Submit identity, ownership, workflow evidence, public links, and review targets for the first registry pass." primaryHref="/apply/agent" primaryLabel="Submit Agent" secondaryHref="/certification" secondaryLabel="View Certification" />
    </AIAAFrame>
  );
}
