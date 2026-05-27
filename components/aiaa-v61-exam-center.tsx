"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AiaaApplication,
  fetchAiaaApplications,
  getApplicationLevel,
  getStoredAiaaSession,
  isAiaaV61SupabaseReady,
  isExamUnlocked,
  levelName,
  shortLevelName,
  statusTitle
} from "@/lib/supabase/aiaa-v61-client";

const levels = [1, 2, 3, 4, 5];

function CardShell({ children }: { children: React.ReactNode }) {
  return <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)]">{children}</div>;
}

function Pill({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warn" | "danger"; children: React.ReactNode }) {
  const classes = {
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warn: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700"
  };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] ${classes[tone]}`}>{children}</span>;
}

function LevelCard({ level, application }: { level: number; application?: AiaaApplication }) {
  const precheck = String(application?.precheck_status || "pending").toLowerCase();
  const exam = String(application?.exam_status || "not_started").toLowerCase();
  const review = String(application?.review_status || "pending").toLowerCase();
  const certificate = String(application?.certificate_status || "not_issued").toLowerCase();
  const unlocked = isExamUnlocked(application);

  let tone: "neutral" | "good" | "warn" | "danger" = "neutral";
  let title = "Application required";
  let description = "Submit an application before this exam is opened.";
  let actionHref = "/apply/agent";
  let actionLabel = "Apply first";

  if (application) {
    if (certificate === "issued" || review === "approved") {
      tone = "good";
      title = certificate === "issued" ? "Certificate issued" : "Approved, certificate pending";
      description = "This level has passed review. The certificate status controls public certification output.";
      actionHref = "/member/applications";
      actionLabel = "View status";
    } else if (review === "rejected" || precheck === "rejected") {
      tone = "danger";
      title = "Rejected";
      description = application.precheck_note || "The application did not meet the current review requirements.";
      actionHref = "/apply/agent";
      actionLabel = "Submit again";
    } else if (precheck === "revision_required" || review === "revision_required") {
      tone = "warn";
      title = "Revision required";
      description = application.precheck_note || "Reviewers need additional evidence before this application can continue.";
      actionHref = "/member/applications";
      actionLabel = "View notes";
    } else if (exam === "submitted") {
      tone = "warn";
      title = "Exam submitted";
      description = "Your exam is locked and waiting for manual reviewer assessment.";
      actionHref = "/member/applications";
      actionLabel = "View status";
    } else if (unlocked) {
      tone = "good";
      title = "Exam unlocked";
      description = "Your application passed precheck. Continue to the exam workspace.";
      actionHref = `/member/exam/level-${level}`;
      actionLabel = "Start exam";
    } else {
      tone = "warn";
      title = "Precheck pending";
      description = "A reviewer must approve the application before the exam is unlocked.";
      actionHref = "/member/applications";
      actionLabel = "View status";
    }
  }

  return (
    <CardShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Pill tone={tone}>{title}</Pill>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{levelName(level)}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{description}</p>
          {application ? (
            <div className="mt-5 grid gap-3 text-sm text-neutral-600 md:grid-cols-3">
              <div><span className="font-semibold text-neutral-950">Precheck:</span> {statusTitle(application.precheck_status)}</div>
              <div><span className="font-semibold text-neutral-950">Exam:</span> {statusTitle(application.exam_status)}</div>
              <div><span className="font-semibold text-neutral-950">Review:</span> {statusTitle(application.review_status)}</div>
            </div>
          ) : null}
        </div>
        <Link href={actionHref} className={tone === "good" ? "aiaa-button-dark shrink-0" : "aiaa-button-light shrink-0"}>{actionLabel}</Link>
      </div>
    </CardShell>
  );
}

export function AiaaV61ExamCenter() {
  const [applications, setApplications] = useState<AiaaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!isAiaaV61SupabaseReady()) {
        setMessage("Authentication is not configured yet.");
        setLoading(false);
        return;
      }
      const session = getStoredAiaaSession();
      if (!session) {
        setMessage("Sign in to view your certification exams.");
        setLoading(false);
        return;
      }
      try {
        const rows = await fetchAiaaApplications(session);
        setApplications(rows || []);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load exams.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const applicationsByLevel = useMemo(() => {
    const map = new Map<number, AiaaApplication>();
    for (const application of applications) {
      const level = getApplicationLevel(application);
      if (!map.has(level)) map.set(level, application);
    }
    return map;
  }, [applications]);

  return (
    <main className="min-h-screen bg-slate-50 text-neutral-950">
      <section className="border-b border-slate-200 bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs font-semibold uppercase tracking-[0.38em] text-blue-700">Certification exams</div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <h1 className="text-6xl font-semibold tracking-[-0.07em] md:text-8xl">AIAA exam workspace.</h1>
            <p className="text-lg leading-8 text-neutral-600">Exams unlock only after application precheck approval. Submit the exam, then wait for manual review and certificate issuance.</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          {loading ? <CardShell><p className="text-sm text-neutral-600">Loading exam status.</p></CardShell> : null}
          {!loading && message ? (
            <CardShell>
              <p className="text-sm leading-7 text-neutral-600">{message}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/login" className="aiaa-button-dark">Sign in</Link>
                <Link href="/apply/agent" className="aiaa-button-light">Apply</Link>
              </div>
            </CardShell>
          ) : null}
          {!loading && !message ? levels.map((level) => <LevelCard key={level} level={level} application={applicationsByLevel.get(level)} />) : null}
        </div>
      </section>
    </main>
  );
}
