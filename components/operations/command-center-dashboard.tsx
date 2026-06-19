import Link from "next/link";
import {
  AIAAFrame,
  CTASection,
  DataPanel,
  PageHero,
  Section,
  StatusPill,
  ThinTable
} from "@/components/aiaa-page-kit";
import {
  automationMaturityLevels,
  blockedProductionActions,
  operationsDocumentLinks,
  operationsHighlights,
  operationsModes,
  paperclipAgents
} from "@/lib/operations/command-center";

function DisabledActionPanel() {
  return (
    <div className="aiaa-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Production safety</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Dangerous actions are visible but disabled</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            This dashboard is intentionally read-only and recommendation-only. It helps human operators understand the current operating boundary without exposing a live production mutation path.
          </p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400"
        >
          Production write blocked
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {blockedProductionActions.map((action) => (
          <div key={action} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">{action}</span>
              <StatusPill tone="bad">blocked</StatusPill>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">Human approval, explicit verification, and a documented rollback plan are required before any future activation.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OperationsCommandCenterDashboard() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Operations Command Center"
        title="Read-safe control plane for AIAA operations."
        copy="This internal overview shows workflow mode, Paperclip departments, maturity gates, and blocked production actions. It is designed for recommendation-only coordination, not autonomous production mutation."
        stats={[
          ["3", "Workflow modes"],
          ["6", "Paperclip agents"],
          ["6", "Blocked actions"],
          ["L2", "Current maturity"]
        ]}
        action={
          <div className="flex flex-wrap gap-3">
            <StatusPill tone="good">Read-only</StatusPill>
            <StatusPill tone="warn">Recommendation-only</StatusPill>
            <StatusPill tone="bad">Human-gated</StatusPill>
          </div>
        }
      />

      <Section
        eyebrow="Current state"
        title="AIAA is operating at automation maturity Level 2."
        copy="The current system can observe production state, prepare recommendations, and support human decision preparation. Production writes remain blocked here."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {operationsHighlights.map((item) => (
            <DataPanel key={item.title} label={item.title} title={item.value} copy={item.copy} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Workflow modes"
        title="Three active control modes guard the platform."
        copy="Every future production action must pass through these layers before human review can even consider approval."
        compact
      >
        <div className="grid gap-4 md:grid-cols-3">
          {operationsModes.map((mode) => (
            <div key={mode} className="aiaa-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{mode}</h3>
                <StatusPill tone={mode === "read-only" ? "good" : mode === "recommendation-only" ? "warn" : "bad"}>{mode}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {mode === "read-only"
                  ? "Routes, queues, and current state may be observed without changing production data."
                  : mode === "recommendation-only"
                    ? "Paperclip and Codex may propose next actions, but may not execute them from this dashboard."
                    : "Sensitive actions remain blocked until a human owner approves an exact action with current-state verification."}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Paperclip departments"
        title="Six operating agents are visible, but none can mutate production here."
        copy="Each agent has a role in observation, recommendation, or risk control. Their presence in the dashboard is descriptive and operational, not an authorization shortcut."
      >
        <ThinTable
          headers={["Agent", "Role", "Current focus", "Status"]}
          rows={paperclipAgents.map((agent) => [
            <span key={`${agent.name}-name`} className="font-semibold text-slate-950">{agent.name}</span>,
            agent.role,
            agent.focus,
            <StatusPill key={`${agent.name}-status`} tone={agent.status === "active" ? "good" : agent.status === "ready" ? "warn" : "bad"}>{agent.status}</StatusPill>
          ])}
        />
      </Section>

      <Section
        eyebrow="Maturity ladder"
        title="Automation maturity is explicit and reviewable."
        copy="The system does not claim full autonomy. Instead, it declares a staged maturity model so every operator understands the live boundary."
        compact
      >
        <div className="aiaa-card overflow-hidden">
          {automationMaturityLevels.map((level) => (
            <div
              key={level.level}
              className={`grid gap-4 border-b border-slate-200 px-5 py-5 last:border-b-0 md:grid-cols-[100px_1fr_180px] ${level.active ? "bg-[#f4f8ff]" : ""}`}
            >
              <div className="font-mono text-2xl font-semibold tracking-[-0.05em] text-[var(--aiaa-blue)]">L{level.level}</div>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{level.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{level.detail}</p>
              </div>
              <div className="md:justify-self-end">
                <StatusPill tone={level.active ? "good" : level.level < 2 ? "neutral" : "warn"}>
                  {level.active ? "current" : "future"}
                </StatusPill>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Production guardrails"
        title="Blocked actions stay visible so the team cannot forget the boundary."
        copy="The command center is designed to prevent accidental overreach. Controls are discoverable for documentation purposes, but not available for execution."
        compact
      >
        <DisabledActionPanel />
      </Section>

      <Section
        eyebrow="Reference docs"
        title="Operations policy and supporting memos remain linked for operators."
        copy="These links point to the public repository so the team can trace decisions back to the exact operating documents behind the dashboard."
        compact
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {operationsDocumentLinks.map((item) => (
            <DataPanel key={item.title} label="Repository doc" title={item.title} copy={item.copy}>
              <Link href={item.href} target="_blank" rel="noreferrer" className="aiaa-button-light">
                Open source document
              </Link>
            </DataPanel>
          ))}
        </div>
      </Section>

      <CTASection
        title="Use community and support surfaces without unlocking production writes."
        copy="AIAA can now expose public-safe operational context, community discussion, and support guidance while keeping review, payment, and certificate mutation under human control."
        primaryHref="/community"
        primaryLabel="Open community MVP"
        secondaryHref="/support"
        secondaryLabel="Open support MVP"
      />
    </AIAAFrame>
  );
}
