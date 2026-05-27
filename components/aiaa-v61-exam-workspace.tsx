"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AiaaApplication,
  AiaaExamQuestion,
  fetchAiaaApplications,
  fetchAiaaExamAnswer,
  fetchAiaaQuestions,
  getApplicationLevel,
  getStoredAiaaSession,
  isAiaaV61SupabaseReady,
  isExamUnlocked,
  levelName,
  parseAiaaLevel,
  saveAiaaExamDraft,
  shortLevelName,
  statusTitle,
  submitAiaaExam
} from "@/lib/supabase/aiaa-v61-client";

const textareaClass = "min-h-32 w-full border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-neutral-900 outline-none transition focus:border-blue-600";

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-8">{children}</div>;
}

function Field({ question, value, onChange, disabled }: { question: AiaaExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
  return (
    <label className="block border-b border-slate-200 py-7 last:border-b-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Question {question.position} · {question.category}</div>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">{question.question}</h3>
        </div>
        {question.required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Required</span> : null}
      </div>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-600">{question.prompt}</p>
      <textarea disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className={`${textareaClass} mt-5 disabled:bg-slate-50 disabled:text-neutral-500`} />
    </label>
  );
}

export function AiaaV61ExamWorkspace({ levelSlug }: { levelSlug: string }) {
  const level = parseAiaaLevel(levelSlug);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [application, setApplication] = useState<AiaaApplication | null>(null);
  const [questions, setQuestions] = useState<AiaaExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isAiaaV61SupabaseReady()) {
        setMessage("Authentication is not configured yet.");
        setLoading(false);
        return;
      }

      const session = getStoredAiaaSession();
      if (!session) {
        setMessage("Sign in before opening the exam workspace.");
        setLoading(false);
        return;
      }

      try {
        const applications = await fetchAiaaApplications(session);
        const current = (applications || []).find((item) => getApplicationLevel(item) === level) || null;
        setApplication(current);

        if (!current) {
          setLoading(false);
          return;
        }

        const loadedQuestions = await fetchAiaaQuestions(level, session);
        setQuestions(loadedQuestions || []);

        const existingAnswer = await fetchAiaaExamAnswer(session, current.id, level);
        if (existingAnswer?.answers) setAnswers(existingAnswer.answers);
        if (existingAnswer?.status === "submitted" || current.exam_status === "submitted") setSubmitted(true);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load the exam workspace.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [level]);

  const lockedReason = useMemo(() => {
    if (!application) return "Submit an application before this exam can open.";
    if (String(application.precheck_status || "").toLowerCase() === "rejected") return application.precheck_note || "The application did not pass precheck.";
    if (String(application.precheck_status || "").toLowerCase() === "revision_required") return application.precheck_note || "Reviewers requested revisions before the exam can open.";
    if (!isExamUnlocked(application)) return "A reviewer must approve the application precheck before this exam is unlocked.";
    return "";
  }, [application]);

  function updateAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  async function handleSaveDraft() {
    const session = getStoredAiaaSession();
    if (!session || !application) return;
    setSaving(true);
    setMessage("");
    try {
      await saveAiaaExamDraft(session, application.id, level, answers);
      setMessage("Draft saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save draft.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    const session = getStoredAiaaSession();
    if (!session || !application) return;
    const missing = questions.filter((question) => question.required && !String(answers[question.id] || "").trim());
    if (missing.length) {
      setMessage("Complete every required answer before submitting the exam.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await submitAiaaExam(session, application.id, level, answers);
      setSubmitted(true);
      setMessage("Exam submitted. The application is now awaiting manual review.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit exam.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-neutral-950">
      <section className="border-b border-slate-200 bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs font-semibold uppercase tracking-[0.38em] text-blue-700">{shortLevelName(level)} exam</div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <h1 className="text-6xl font-semibold tracking-[-0.07em] md:text-8xl">{levelName(level)}.</h1>
            <p className="text-lg leading-8 text-neutral-600">Answer the AIAA exam questions with concrete architecture details, proof links, operational evidence, and reviewer instructions.</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? <Panel><p className="text-sm text-neutral-600">Loading exam workspace.</p></Panel> : null}

          {!loading && message ? <div className="mb-5 border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-900">{message}</div> : null}

          {!loading && !application ? (
            <Panel>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Application required.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">Submit a certification application first. A reviewer must approve the precheck before the exam opens.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/apply/agent" className="aiaa-button-dark">Submit application</Link>
                <Link href="/member/exam" className="aiaa-button-light">Back to exams</Link>
              </div>
            </Panel>
          ) : null}

          {!loading && application && lockedReason ? (
            <Panel>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Exam locked.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{lockedReason}</p>
              <div className="mt-6 grid gap-3 text-sm text-neutral-600 md:grid-cols-3">
                <div><span className="font-semibold text-neutral-950">Precheck:</span> {statusTitle(application.precheck_status)}</div>
                <div><span className="font-semibold text-neutral-950">Exam:</span> {statusTitle(application.exam_status)}</div>
                <div><span className="font-semibold text-neutral-950">Review:</span> {statusTitle(application.review_status)}</div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/member/applications" className="aiaa-button-dark">View application status</Link>
                <Link href="/member/exam" className="aiaa-button-light">Back to exams</Link>
              </div>
            </Panel>
          ) : null}

          {!loading && application && !lockedReason ? (
            <Panel>
              <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-700">Exam workspace</div>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-neutral-950">{submitted ? "Exam submitted." : "Complete the exam."}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{submitted ? "Answers are locked. Wait for reviewer assessment." : "Save a draft as you work. Submit only when every answer is ready for manual review."}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-neutral-600">
                  <div><span className="font-semibold text-neutral-950">Application:</span> {application.agent_name || "Untitled agent"}</div>
                  <div className="mt-1"><span className="font-semibold text-neutral-950">Status:</span> {statusTitle(application.exam_status)}</div>
                </div>
              </div>

              {questions.length ? questions.map((question) => (
                <Field key={question.id} question={question} value={answers[question.id] || ""} onChange={(value) => updateAnswer(question.id, value)} disabled={submitted || saving} />
              )) : <p className="py-8 text-sm text-neutral-600">No active questions found for this level. Run the V61 SQL seed file in Supabase.</p>}

              <div className="mt-8 flex flex-wrap gap-3">
                {!submitted ? <button type="button" onClick={handleSaveDraft} disabled={saving} className="aiaa-button-light disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving" : "Save draft"}</button> : null}
                {!submitted ? <button type="button" onClick={handleSubmit} disabled={saving || !questions.length} className="aiaa-button-dark disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Submitting" : "Submit exam"}</button> : null}
                <Link href="/member/applications" className="aiaa-button-light">View application status</Link>
              </div>
            </Panel>
          ) : null}
        </div>
      </section>
    </main>
  );
}
