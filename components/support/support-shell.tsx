import {
  AIAAFrame,
  CTASection,
  DataPanel,
  PageHero,
  Section,
  StatusPill
} from "@/components/aiaa-page-kit";
import { supportArticles, suggestedQuestions } from "@/lib/support/knowledge-base";
import { SupportChatWidget } from "@/components/support/support-chat";

export function SupportPageShell() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="AI Automated Customer Support MVP"
        title="Safe support guidance without production authority."
        copy="This MVP provides a maintainable knowledge base, suggested questions, a rules-based chat widget, escalation UI, and feedback flow while keeping all sensitive operations blocked."
        stats={[
          [String(supportArticles.length), "Knowledge articles"],
          [String(suggestedQuestions.length), "Suggested prompts"],
          ["FAQ", "Current answer mode"],
          ["0", "Production mutations"]
        ]}
        action={
          <div className="flex flex-wrap gap-3">
            <StatusPill tone="good">FAQ-safe</StatusPill>
            <StatusPill tone="warn">Human escalation</StatusPill>
            <StatusPill tone="bad">No decision authority</StatusPill>
          </div>
        }
      />

      <Section
        eyebrow="Support boundary"
        title="The assistant can explain policy, but it cannot make decisions."
        copy="This page is explicit about what the assistant can and cannot do, so users do not mistake support guidance for a production approval or certificate action."
        compact
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DataPanel
            label="Allowed"
            title="What the assistant may answer"
            copy="AIAA overview, Levels 1 to 5, application flow, exam flow, evidence submission, AI Assistance Declaration, payment explanation, common errors, community usage, and human support routing."
          />
          <DataPanel
            label="Blocked"
            title="What the assistant may not do"
            copy="Approve or reject applications, issue or revoke certificates, mutate payment state, access unauthorized private data, reveal secrets, send real email, or guarantee certification outcomes."
          />
        </div>
      </Section>

      <Section
        eyebrow="Knowledge base"
        title="A maintainable support source exists separately from the chat UI."
        copy="Articles are stored in a dedicated knowledge file so the answer logic and the public support content can evolve without turning the page into a giant hardcoded component."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {supportArticles.map((article) => (
            <div key={article.slug} className="aiaa-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill tone="neutral">{article.slug}</StatusPill>
                <StatusPill tone="good">{article.audience.join(", ")}</StatusPill>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-slate-950">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{article.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                {article.body.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Conversation UI"
        title="Suggested questions, answers, escalation, and feedback are all visible in one safe flow."
        copy="The current assistant is intentionally rules-based and local-safe. It does not require a production AI API key and does not modify any database state."
      >
        <SupportChatWidget />
      </Section>

      <Section
        eyebrow="Future review"
        title="Admin review and safety event concepts are defined before backend wiring."
        copy="This MVP shows the operating concept for future safety queues, rate limits, and review surfaces without pretending those production systems already exist."
        compact
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <DataPanel label="Safety event" title="Risky prompt review" copy="Future support safety events should log ambiguous payment, approval, or certificate requests for human review." />
          <DataPanel label="Escalation queue" title="Human support handoff" copy="A future queue can receive policy-sensitive or account-specific cases, but this MVP stops at UI and documentation." />
          <DataPanel label="Rate limiting" title="Abuse protection concept" copy="A future server-side API should limit spam, repeated escalation requests, and high-risk prompt patterns." />
        </div>
      </Section>

      <CTASection
        title="Pair support guidance with operations visibility and community discussion."
        copy="AIAA can answer common questions safely, route humans to the right next step, and keep sensitive decisions under explicit ownership."
        primaryHref="/operations"
        primaryLabel="Open operations command center"
        secondaryHref="/community"
        secondaryLabel="Open community MVP"
      />
    </AIAAFrame>
  );
}
