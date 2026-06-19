"use client";

import { useMemo, useState } from "react";
import { matchSuggestedQuestion, suggestedQuestions, type SupportSuggestedQuestion } from "@/lib/support/knowledge-base";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  safety?: "safe" | "escalate";
  sources?: string[];
};

function formatAssistantAnswer(match: SupportSuggestedQuestion | null) {
  if (!match) {
    return {
      content:
        "I can help with AIAA overview, Levels 1 to 5, application flow, exam flow, AI Assistance Declaration, payment explanation, common errors, and community usage. For approvals, certificate actions, or account-specific sensitive decisions, please escalate to a human owner.",
      safety: "safe" as const,
      sources: ["knowledge-base"]
    };
  }

  return {
    content: match.answer,
    safety: match.safety,
    sources: match.sources
  };
}

export function SupportChatWidget() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-intro",
      role: "assistant",
      content:
        "Welcome to the AIAA support MVP. I can answer policy and process questions, but I cannot approve, reject, issue certificates, mutate payment status, or access private data without authorization.",
      safety: "safe",
      sources: ["knowledge-base"]
    }
  ]);
  const [feedback, setFeedback] = useState<"" | "helpful" | "needs-review">("");
  const [escalationState, setEscalationState] = useState<"" | "opened">("");

  const latestSafety = useMemo(
    () => messages.findLast((message) => message.role === "assistant")?.safety ?? "safe",
    [messages]
  );

  function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const match = matchSuggestedQuestion(trimmed);
    const answer = formatAssistantAnswer(match);

    setMessages((current) => [
      ...current,
      { id: `user-${current.length}`, role: "user", content: trimmed },
      {
        id: `assistant-${current.length + 1}`,
        role: "assistant",
        content: answer.content,
        safety: answer.safety,
        sources: answer.sources
      }
    ]);
    setInput("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuestion(input);
  }

  return (
    <div className="aiaa-card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">AI support chat widget</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Rules-based MVP assistant</h3>
          </div>
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${latestSafety === "escalate" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {latestSafety === "escalate" ? "human escalation suggested" : "policy-safe answer"}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap gap-3">
          {suggestedQuestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => submitQuestion(item.question)}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-[var(--aiaa-blue)] hover:text-[var(--aiaa-blue)]"
            >
              {item.question}
            </button>
          ))}
        </div>

        <div className="space-y-3 rounded-[2rem] bg-slate-50 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-3xl px-4 py-4 text-sm leading-6 ${message.role === "assistant" ? "bg-white text-slate-700" : "bg-[var(--aiaa-blue)] text-white"}`}
            >
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] opacity-75">
                {message.role === "assistant" ? "AIAA Support" : "You"}
              </div>
              <p className="mt-2 whitespace-pre-line">{message.content}</p>
              {message.sources?.length ? (
                <p className="mt-3 text-xs opacity-70">Sources: {message.sources.join(", ")}</p>
              ) : null}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Ask a support question</span>
            <textarea
              aria-label="Ask AIAA support a question"
              rows={4}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Example: How do I prepare Level 1 evidence?"
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="aiaa-button-dark">Get policy-safe answer</button>
            <button
              type="button"
              onClick={() => {
                setEscalationState("opened");
                setMessages((current) => [
                  ...current,
                  {
                    id: `assistant-escalation-${current.length}`,
                    role: "assistant",
                    content:
                      "Human escalation requested. In this MVP, no real ticket or email is sent. A future production flow would create a reviewed support escalation record instead.",
                    safety: "escalate",
                    sources: ["human-escalation-policy"]
                  }
                ]);
              }}
              className="aiaa-button-light"
            >
              Escalate to human support
            </button>
          </div>
        </form>

        <div className="grid gap-4 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Feedback UI</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={() => setFeedback("helpful")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${feedback === "helpful" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                Helpful
              </button>
              <button type="button" onClick={() => setFeedback("needs-review")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${feedback === "needs-review" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                Needs human review
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {feedback === "helpful"
                ? "Feedback captured locally for MVP validation only."
                : feedback === "needs-review"
                  ? "This answer should be reviewed by a human owner in a future safety queue."
                  : "Feedback stays local in this MVP and does not create a production record."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Safety notice</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>• No approval, rejection, payment mutation, or certificate issuance is available in this widget.</li>
              <li>• No private data is fetched here.</li>
              <li>• No real email is sent when escalation is requested.</li>
              <li>• {escalationState === "opened" ? "Human escalation was requested locally in the UI." : "Human escalation remains available as a concept UI without production side effects."}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
