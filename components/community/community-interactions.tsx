"use client";

import { useMemo, useState } from "react";
import type { CommunityCategory, CommunityPost } from "@/lib/community/mock-data";

function simulateUnsafeInput(value: string) {
  return /(api[_ -]?key|secret|token|password)/i.test(value);
}

export function CommunityComposer({ categories }: { categories: CommunityCategory[] }) {
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "error">("idle");

  const currentCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug) ?? null,
    [categories, categorySlug]
  );

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !body.trim() || simulateUnsafeInput(body) || simulateUnsafeInput(title)) {
      setStatus("error");
      return;
    }
    setStatus("submitted");
  }

  return (
    <form onSubmit={onSubmit} className="aiaa-card space-y-5 p-5">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Create post UI</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Draft a safe community post</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This MVP captures a local draft only. It does not write to production or claim that a live forum post has been published.
        </p>
      </div>

      <label className="block">
        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Category</span>
        <select
          aria-label="Choose forum category"
          value={categorySlug}
          onChange={(event) => setCategorySlug(event.target.value)}
          className="mt-3 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
        >
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Post title</span>
        <input
          aria-label="Community post title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Describe your question, project, or discussion topic"
          className="mt-3 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
        />
      </label>

      <label className="block">
        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Post body</span>
        <textarea
          aria-label="Community post body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={6}
          placeholder="Keep it evidence-based. Do not share API keys, secrets, or fake certification claims."
          className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
        />
      </label>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
        <strong className="text-slate-900">Posting policy:</strong> {currentCategory?.postingPolicy}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="aiaa-button-dark">
          Save local draft
        </button>
        <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
          Publish to production blocked
        </button>
      </div>

      {status === "submitted" ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          Local-safe draft saved. This confirms the UI flow only; no production forum post was created.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800">
          Draft blocked. Add both title and body, and remove anything that looks like a secret or credential.
        </div>
      ) : null}
    </form>
  );
}

export function ReplyAndReportPanel({ post }: { post: CommunityPost }) {
  const [reply, setReply] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [lastAction, setLastAction] = useState<"" | "reply" | "report" | "error">("");

  function handleReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reply.trim() || simulateUnsafeInput(reply)) {
      setLastAction("error");
      return;
    }
    setLastAction("reply");
  }

  function handleReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reportReason.trim()) {
      setLastAction("error");
      return;
    }
    setLastAction("report");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
      <form onSubmit={handleReply} className="aiaa-card p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Reply UI</p>
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Prepare a reply</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">Replies in this MVP are local-only. They demonstrate form flow, moderation reminders, and safe error handling.</p>
        <textarea
          aria-label={`Reply to ${post.title}`}
          rows={5}
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          placeholder="Reply with evidence-based guidance. Do not impersonate AIAA staff or share secrets."
          className="mt-4 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="submit" className="aiaa-button-dark">Save local reply draft</button>
          <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
            Live reply blocked
          </button>
        </div>
      </form>

      <form onSubmit={handleReport} className="aiaa-card p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--aiaa-blue)]">Report content UI</p>
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">Send to moderation review</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">Reports are represented safely here. No automatic deletion or ban action will occur.</p>
        <textarea
          aria-label={`Report ${post.title}`}
          rows={5}
          value={reportReason}
          onChange={(event) => setReportReason(event.target.value)}
          placeholder="State why this content should enter moderation review."
          className="mt-4 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[var(--aiaa-blue)]"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="submit" className="aiaa-button-light">Create local moderation note</button>
          <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-400">
            Auto removal blocked
          </button>
        </div>
      </form>

      {lastAction === "reply" ? (
        <div className="xl:col-span-2 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          Local reply draft saved. No production community write occurred.
        </div>
      ) : null}
      {lastAction === "report" ? (
        <div className="xl:col-span-2 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          Local report captured. In a future production workflow this would enter a human moderation queue.
        </div>
      ) : null}
      {lastAction === "error" ? (
        <div className="xl:col-span-2 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800">
          Action blocked. Add content and avoid secrets, impersonation, or unsafe text.
        </div>
      ) : null}
    </div>
  );
}
