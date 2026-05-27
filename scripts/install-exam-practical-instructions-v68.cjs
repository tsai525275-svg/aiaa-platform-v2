const fs = require("fs");
const path = require("path");

const root = process.cwd();
const target = path.join(root, "components", "aiaa-v61-exam-workspace.tsx");

if (!fs.existsSync(target)) {
  console.error("Missing file: components/aiaa-v61-exam-workspace.tsx");
  process.exit(1);
}

const source = `"use client";

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

const inputClass = "w-full border border-slate-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-600 disabled:bg-slate-50 disabled:text-neutral-500";
const textareaClass = "min-h-32 w-full border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-neutral-900 outline-none transition focus:border-blue-600 disabled:bg-slate-50 disabled:text-neutral-500";

type ExamQuestion = AiaaExamQuestion & {
  exam_section?: string | null;
  question_type?: string | null;
  points?: number | null;
  expected_answer_format?: string | null;
  reviewer_notes?: string | null;
};

type PracticalEvidence = Record<string, string>;

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-8">{children}</div>;
}

function parseOptions(prompt: string) {
  const options: Array<{ letter: string; label: string }> = [];
  const pattern = /([A-D])\.\s*([\s\S]*?)(?=\n[A-D]\.\s|$)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(prompt || "")) !== null) {
    options.push({ letter: match[1], label: match[2].trim() });
  }
  return options;
}

function isMultipleChoice(question: ExamQuestion) {
  return String(question.question_type || "").toLowerCase().includes("multiple choice") || parseOptions(question.prompt || "").length >= 2;
}

function isLevelOnePractical(level: number, question: ExamQuestion) {
  return level === 1 && Number(question.position) === 31;
}

function isEvidenceTask(level: number, question: ExamQuestion) {
  const type = String(question.question_type || "").toLowerCase();
  return isLevelOnePractical(level, question) || type.includes("practical") || type.includes("review") || type.includes("demo") || type.includes("document") || type.includes("impact");
}

function parseEvidence(value: string): PracticalEvidence {
  try {
    const parsed = JSON.parse(value || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as PracticalEvidence;
  } catch {
    // Legacy textarea answers are kept as workflow summary.
  }
  return value ? { workflowSummary: value } : {};
}

function stringifyEvidence(value: PracticalEvidence) {
  return JSON.stringify(value, null, 2);
}

function EvidenceInput({ label, helper, value, onChange, disabled, placeholder, required }: { label: string; helper?: string; value: string; onChange: (value: string) => void; disabled: boolean; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        <span>{label}</span>
        {required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] tracking-[0.16em] text-blue-700">Required</span> : null}
      </div>
      {helper ? <p className="mb-2 text-xs leading-6 text-neutral-500">{helper}</p> : null}
      <input disabled={disabled} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder || "https://"} className={inputClass} />
    </label>
  );
}

function EvidenceTextarea({ label, helper, value, onChange, disabled, placeholder, required }: { label: string; helper?: string; value: string; onChange: (value: string) => void; disabled: boolean; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        <span>{label}</span>
        {required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] tracking-[0.16em] text-blue-700">Required</span> : null}
      </div>
      {helper ? <p className="mb-2 text-xs leading-6 text-neutral-500">{helper}</p> : null}
      <textarea disabled={disabled} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={textareaClass} />
    </label>
  );
}

function MultipleChoiceField({ question, value, onChange, disabled }: { question: ExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
  const options = parseOptions(question.prompt || "");

  return (
    <fieldset className="block border-b border-slate-200 py-7 last:border-b-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Question {question.position} · {question.category}</div>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">{question.question}</h3>
        </div>
        {question.required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Required</span> : null}
      </div>

      <div className="mt-5 grid gap-3">
        {options.map((option) => {
          const selected = value === option.letter;
          return (
            <label key={option.letter} className={\`flex cursor-pointer gap-3 border px-4 py-4 text-sm leading-6 transition \${selected ? "border-blue-600 bg-blue-50 text-blue-950" : "border-slate-200 bg-white text-neutral-700 hover:border-blue-200"}\`}>
              <input
                type="radio"
                disabled={disabled}
                name={\`question-\${question.id}\`}
                checked={selected}
                onChange={() => onChange(option.letter)}
                className="mt-1 h-4 w-4 accent-blue-700 disabled:cursor-not-allowed"
              />
              <span><span className="font-semibold text-neutral-950">{option.letter}.</span> {option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function PracticalEvidenceField({ level, question, value, onChange, disabled }: { level: number; question: ExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
  const evidence = parseEvidence(value);
  function update(key: string, nextValue: string) {
    onChange(stringifyEvidence({ ...evidence, [key]: nextValue }));
  }

  if (isLevelOnePractical(level, question)) {
    return (
      <div className="block border-b border-slate-200 py-7 last:border-b-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Question 31 · Practical Task</div>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Basic Agent Workflow Build.</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Required</span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">20 points</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:p-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-700">What to submit</div>
            <p className="mt-3 max-w-5xl text-sm leading-7 text-neutral-700">This task proves that your agent workflow runs in practice. Do not write a general essay. Submit links and notes that let reviewers verify a working agent with user input, task analysis, one external API or tool, one tool call, execution logs, retry logic, clear error handling, README, and demo evidence.</p>
          </div>

          <div className="grid gap-3 text-sm leading-7 text-neutral-700 md:grid-cols-2">
            <div className="border border-slate-200 bg-white p-4"><span className="font-semibold text-neutral-950">Pass requirement:</span> repository, README, demo evidence, execution log, tool calling, external API or tool, retry logic, and error handling.</div>
            <div className="border border-slate-200 bg-white p-4"><span className="font-semibold text-neutral-950">Fail conditions:</span> prompt only, UI only, no tool call, no external API, no README, no execution log, no runnable workflow, or unclear reviewer access.</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <EvidenceInput required label="GitHub repository URL" helper="Public repository or private reviewer access link. The reviewer must be able to inspect the workflow code." value={evidence.githubRepoUrl || ""} onChange={(next) => update("githubRepoUrl", next)} disabled={disabled} placeholder="https://github.com/account/project" />
            <EvidenceInput required label="README URL" helper="The README must explain setup, environment variables, workflow steps, run command, and test method." value={evidence.readmeUrl || ""} onChange={(next) => update("readmeUrl", next)} disabled={disabled} placeholder="https://github.com/account/project#readme" />
            <EvidenceInput label="Demo URL" helper="Optional live demo or hosted workflow page." value={evidence.demoUrl || ""} onChange={(next) => update("demoUrl", next)} disabled={disabled} placeholder="https://demo.example.com" />
            <EvidenceInput label="Demo video URL" helper="YouTube unlisted, Loom, Vimeo, Google Drive, or GitHub Release link. The video should show the workflow from input to final output." value={evidence.demoVideoUrl || ""} onChange={(next) => update("demoVideoUrl", next)} disabled={disabled} placeholder="https://youtube.com/..." />
            <EvidenceInput label="Screenshot URL" helper="Screenshot of the running agent, terminal log, tool call, API response, final output, or error handling." value={evidence.screenshotUrl || ""} onChange={(next) => update("screenshotUrl", next)} disabled={disabled} placeholder="https://github.com/account/project/blob/main/docs/assets/demo.png" />
            <EvidenceInput required label="Execution log URL" helper="GitHub Gist, README section, log file link, or hosted text page showing the actual execution record." value={evidence.executionLogUrl || ""} onChange={(next) => update("executionLogUrl", next)} disabled={disabled} placeholder="https://gist.github.com/account/..." />
          </div>

          <div className="grid gap-5">
            <EvidenceTextarea required label="Workflow summary" helper="Explain what the agent receives, how it analyzes the task, what steps it runs, and what output it returns." value={evidence.workflowSummary || ""} onChange={(next) => update("workflowSummary", next)} disabled={disabled} placeholder="Example: This agent receives a research topic, calls a search API, summarizes results, logs execution, retries failed tool calls, and returns a final answer." />
            <EvidenceTextarea required label="Tool calling evidence" helper="Name the tool, explain the input schema, output, and where the tool call happens in code or workflow." value={evidence.toolCallingEvidence || ""} onChange={(next) => update("toolCallingEvidence", next)} disabled={disabled} placeholder="Example: The agent calls searchWeb(query) in app/agent.ts. The returned results are passed to the summarization step." />
            <EvidenceTextarea required label="External API or tool evidence" helper="Name the API or external service, purpose, endpoint or tool name, and required environment variables." value={evidence.externalApiEvidence || ""} onChange={(next) => update("externalApiEvidence", next)} disabled={disabled} placeholder="Example: The workflow connects to the SerpAPI search endpoint with SERPAPI_KEY to retrieve external search results." />
            <EvidenceTextarea required label="Retry logic and error handling" helper="Explain retry limit, recoverable failures, logged errors, and the clear message users see when the workflow fails." value={evidence.retryAndErrorHandling || ""} onChange={(next) => update("retryAndErrorHandling", next)} disabled={disabled} placeholder="Example: Failed API calls retry up to three times. If all attempts fail, the workflow logs the error and returns a clear failure message." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="block border-b border-slate-200 py-7 last:border-b-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Question {question.position} · {question.category}</div>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">{question.question}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {question.required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Required</span> : null}
          {question.points ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{question.points} points</span> : null}
        </div>
      </div>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-600">{question.prompt}</p>
      <div className="mt-6 grid gap-5">
        <EvidenceInput label="Primary evidence URL" value={evidence.primaryEvidenceUrl || ""} onChange={(next) => update("primaryEvidenceUrl", next)} disabled={disabled} placeholder="https://" />
        <EvidenceTextarea label="Answer and reviewer notes" value={evidence.answer || ""} onChange={(next) => update("answer", next)} disabled={disabled} placeholder="Explain the implementation, evidence, and reviewer verification steps." />
      </div>
    </div>
  );
}

function WrittenField({ question, value, onChange, disabled }: { question: ExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
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
      <textarea disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className={\`\${textareaClass} mt-5\`} />
    </label>
  );
}

function QuestionField({ level, question, value, onChange, disabled }: { level: number; question: ExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
  if (isMultipleChoice(question)) return <MultipleChoiceField question={question} value={value} onChange={onChange} disabled={disabled} />;
  if (isEvidenceTask(level, question)) return <PracticalEvidenceField level={level} question={question} value={value} onChange={onChange} disabled={disabled} />;
  return <WrittenField question={question} value={value} onChange={onChange} disabled={disabled} />;
}

function getMissingPracticalFields(level: number, questions: ExamQuestion[], answers: Record<string, string>) {
  const missing: string[] = [];
  const practical = questions.find((question) => isLevelOnePractical(level, question));
  if (!practical) return missing;

  const evidence = parseEvidence(answers[practical.id] || "");
  const requiredFields: Array<[string, string]> = [
    ["githubRepoUrl", "Question 31 GitHub repository URL"],
    ["readmeUrl", "Question 31 README URL"],
    ["executionLogUrl", "Question 31 execution log URL"],
    ["workflowSummary", "Question 31 workflow summary"],
    ["toolCallingEvidence", "Question 31 tool calling evidence"],
    ["externalApiEvidence", "Question 31 external API or tool evidence"],
    ["retryAndErrorHandling", "Question 31 retry logic and error handling"]
  ];

  for (const [key, label] of requiredFields) {
    if (!String(evidence[key] || "").trim()) missing.push(label);
  }

  const hasDemoEvidence = String(evidence.demoVideoUrl || "").trim() || String(evidence.screenshotUrl || "").trim() || String(evidence.demoUrl || "").trim();
  if (!hasDemoEvidence) missing.push("Question 31 demo video, screenshot, or demo URL");
  return missing;
}

export function AiaaV61ExamWorkspace({ levelSlug }: { levelSlug: string }) {
  const level = parseAiaaLevel(levelSlug);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [application, setApplication] = useState<AiaaApplication | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
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
        setQuestions((loadedQuestions || []) as ExamQuestion[]);

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

  const knowledgeCount = questions.filter((question) => isMultipleChoice(question)).length;
  const evidenceCount = Math.max(0, questions.length - knowledgeCount);

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
    const missingBasic = questions.filter((question) => question.required && !String(answers[question.id] || "").trim()).map((question) => `Question ${question.position}`);
    const missingPractical = getMissingPracticalFields(level, questions, answers);
    const missing = [...missingBasic, ...missingPractical];
    if (missing.length) {
      setMessage(`Complete required evidence before submitting: ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? " and more" : ""}.`);
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
            <p className="text-lg leading-8 text-neutral-600">Complete the knowledge exam and submit the required evidence. Multiple choice answers are selected directly. Practical tasks require evidence links for reviewer verification.</p>
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
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{submitted ? "Answers are locked. Wait for reviewer assessment." : "Save a draft as you work. Submit only when every answer and evidence field is ready for manual review."}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-neutral-600">
                  <div><span className="font-semibold text-neutral-950">Application:</span> {application.agent_name || "Untitled agent"}</div>
                  <div className="mt-1"><span className="font-semibold text-neutral-950">Status:</span> {statusTitle(application.exam_status)}</div>
                  <div className="mt-1"><span className="font-semibold text-neutral-950">Questions:</span> {knowledgeCount} multiple choice, {evidenceCount} evidence tasks</div>
                </div>
              </div>

              {questions.length ? questions.map((question) => (
                <QuestionField key={question.id} level={level} question={question} value={answers[question.id] || ""} onChange={(value) => updateAnswer(question.id, value)} disabled={submitted || saving} />
              )) : <p className="py-8 text-sm text-neutral-600">No active questions found for this level. Run the official AIAA exam blueprint SQL file in Supabase.</p>}

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
`;

fs.writeFileSync(target, source, "utf8");
console.log("V68 installed clearer Level 1 practical evidence instructions.");
console.log("Question 31 now has required evidence fields, pass requirements, fail conditions, and submission validation.");
console.log("Run npm run build next.");
