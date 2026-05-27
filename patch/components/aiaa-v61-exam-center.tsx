"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-8">{children}</div>;
}

const examStructures: Record<number, string> = {
  1: "30 multiple choice questions and 1 practical evidence task",
  2: "40 multiple choice questions and 2 production evidence tasks",
  3: "50 multiple choice questions, 3 practical tasks, and 1 architecture review",
  4: "20 company questionnaire items, 8 document evidence items, and 1 demo review",
  5: "10 Fellow impact review items"
};

const examStandards: Record<number, string> = {
  1: "Pass at 80 points. Valid for 12 months.",
  2: "Pass at 85 points. Valid for 12 months.",
  3: "Pass at 90 points. Pass rate controlled below 15 percent. Valid for 6 months.",
  4: "Manual company review. Reviewer score above 88 is recommended. Quarterly review.",
  5: "Council approval. Annual review. Nomination and impact evidence required."
};

function latestByLevel(applications: AiaaApplication[], level: number) {
  return applications.find((application) => getApplicationLevel(application) === level) || null;
}

export function AiaaV61ExamCenter() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applications, setApplications] = useState<AiaaApplication[]>([]);

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

  return (
    <main className="min-h-screen bg-slate-50 text-neutral-950">
      <section className="border-b border-slate-200 bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs font-semibold uppercase tracking-[0.38em] text-blue-700">Certification exams</div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <h1 className="text-6xl font-semibold tracking-[-0.07em] md:text-8xl">AIAA exam workspace.</h1>
            <p className="text-lg leading-8 text-neutral-600">Exams unlock after application precheck approval. Complete the exam, submit the required evidence, then wait for manual review and certificate issuance.</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? <Panel><p className="text-sm text-neutral-600">Loading exams.</p></Panel> : null}

          {!loading && message ? (
            <Panel>
              <p className="text-sm leading-7 text-neutral-600">{message}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/login" className="aiaa-button-dark">Sign in</Link>
                <Link href="/apply/agent" className="aiaa-button-light">Apply</Link>
              </div>
            </Panel>
          ) : null}

          {!loading && !message ? (
            <div className="grid gap-5">
              {[1, 2, 3, 4, 5].map((level) => {
                const application = latestByLevel(applications, level);
                const unlocked = isExamUnlocked(application);
                return (
                  <Panel key={level}>
                    <div className="grid gap-5 lg:grid-cols-[0.7fr_1fr_auto] lg:items-center">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-700">{shortLevelName(level)}</div>
                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{levelName(level)}</h2>
                      </div>
                      <div className="text-sm leading-7 text-neutral-600">
                        <p><span className="font-semibold text-neutral-950">Structure:</span> {examStructures[level]}</p>
                        <p><span className="font-semibold text-neutral-950">Standard:</span> {examStandards[level]}</p>
                        <p><span className="font-semibold text-neutral-950">Application:</span> {application ? statusTitle(application.precheck_status || application.status) : "No application yet"}</p>
                        <p><span className="font-semibold text-neutral-950">Exam:</span> {application ? statusTitle(application.exam_status) : "Locked"}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 lg:justify-end">
                        {unlocked ? <Link href={`/member/exam/level-${level}`} className="aiaa-button-dark">Open exam</Link> : <Link href="/apply/agent" className="aiaa-button-light">Apply first</Link>}
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
