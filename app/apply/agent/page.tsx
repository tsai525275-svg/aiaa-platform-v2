"use client";

import { useState } from "react";

const pageShell = "mx-auto w-full max-w-[1440px]";
const inputClass =
  "h-12 w-full rounded-2xl border border-white/[0.10] bg-black/28 px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/35";
const textareaClass =
  "min-h-32 w-full rounded-2xl border border-white/[0.10] bg-black/28 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-white/35";
const fileClass =
  "w-full rounded-2xl border border-dashed border-white/[0.16] bg-black/24 px-4 py-4 text-sm text-white/72 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black";

const fillFields = [
  {
    title: "Applicant Identity",
    description: "Who is submitting the Level 1 application.",
    fields: [
      { label: "Applicant name", name: "applicantName", type: "text", placeholder: "Full legal name", required: true },
      { label: "Company or owner", name: "owner", type: "text", placeholder: "Company, project owner, or individual", required: true },
      { label: "Contact email", name: "email", type: "email", placeholder: "review@example.com", required: true },
      { label: "Country", name: "country", type: "text", placeholder: "Country or region", required: true },
      { label: "Role", name: "role", type: "text", placeholder: "Founder, engineer, maintainer, operator", required: true },
      { label: "Public profile", name: "profile", type: "url", placeholder: "LinkedIn, GitHub, website, or public profile", required: false }
    ]
  },
  {
    title: "Agent Profile",
    description: "The AI Agent or workflow being submitted for Level 1 review.",
    fields: [
      { label: "Agent name", name: "agentName", type: "text", placeholder: "Product or project name", required: true },
      { label: "Category", name: "category", type: "text", placeholder: "Automation, coding, browser control, support", required: true },
      { label: "Website", name: "website", type: "url", placeholder: "https://", required: false },
      { label: "GitHub", name: "github", type: "url", placeholder: "https://github.com/owner/repo", required: false },
      { label: "Demo URL", name: "demoUrl", type: "url", placeholder: "Public demo or private review link", required: true },
      { label: "Target level", name: "targetLevel", type: "text", placeholder: "Level 1 only for new applicants", required: true }
    ]
  }
];

const writtenSections = [
  {
    label: "Short description",
    name: "shortDescription",
    placeholder: "Explain what the agent does, who uses it, and what workflow it completes.",
    required: true
  },
  {
    label: "Workflow description",
    name: "workflowDescription",
    placeholder: "Describe the full workflow from input to output. Include triggers, tool calls, API calls, decisions, and final result.",
    required: true
  },
  {
    label: "Tool calling proof",
    name: "toolCallingProof",
    placeholder: "List the tools used by the agent. Explain at least one real tool call and its output.",
    required: true
  },
  {
    label: "External API proof",
    name: "externalApiProof",
    placeholder: "Name the external API, explain why it is called, and show what data is returned.",
    required: true
  },
  {
    label: "Retry logic and error handling",
    name: "errorHandling",
    placeholder: "Explain how the agent handles failure, retry, timeout, invalid response, and fallback.",
    required: true
  },
  {
    label: "Human override plan",
    name: "humanOverride",
    placeholder: "Explain when a human must review, pause, correct, or stop the agent.",
    required: true
  }
];

const uploadFields = [
  {
    label: "README file",
    name: "readmeFile",
    helper: "Upload a README or technical overview file. PDF, Markdown, DOCX, or TXT.",
    accept: ".pdf,.md,.doc,.docx,.txt",
    required: true
  },
  {
    label: "Execution log",
    name: "executionLog",
    helper: "Upload real execution logs that show workflow execution, tool calls, API responses, retry behavior, and final output.",
    accept: ".log,.txt,.json,.csv,.pdf",
    required: true
  },
  {
    label: "Demo video or screen recording",
    name: "demoVideo",
    helper: "Upload MP4, MOV, or WEBM showing the working agent. A screen recording is preferred.",
    accept: ".mp4,.mov,.webm",
    required: true
  },
  {
    label: "Technical evidence package",
    name: "technicalPackage",
    helper: "Upload a workflow diagram, API documentation, code package, or deployment notes.",
    accept: ".zip,.pdf,.md,.doc,.docx,.json",
    required: false
  },
  {
    label: "Security and data handling notes",
    name: "securityNotes",
    helper: "Upload permission rules, data handling notes, secrets policy, or safety boundary notes.",
    accept: ".pdf,.md,.doc,.docx,.txt",
    required: false
  },
  {
    label: "Benchmark or test evidence",
    name: "benchmarkEvidence",
    helper: "Upload test results, benchmark tables, QA checklists, or reliability evidence.",
    accept: ".pdf,.csv,.xlsx,.json,.txt",
    required: false
  }
];

const minimumEvidence = [
  "At least one real tool call",
  "At least one external API",
  "Complete workflow execution",
  "Complete README",
  "Error handling",
  "Retry logic",
  "Execution log",
  "No prompt only submissions",
  "No UI only submissions",
  "No slide deck only submissions"
];

const reviewSteps = [
  "Application intake",
  "Evidence screening",
  "Level 1 practical exam assignment",
  "Technical review",
  "Decision and score",
  "Certificate ID issuance"
];

export default function AgentApplicationPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen overflow-x-hidden px-4 pb-28 pt-32 text-white sm:px-6 lg:px-8">
      <section className={pageShell}>
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-10">
          <span className="eyebrow notranslate" translate="no">AIAA Level 1 Application</span>
          <h1 className="max-w-5xl break-words text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            Submit evidence for Level 1 certification.
          </h1>
          <p className="section-copy mt-7 max-w-3xl">
            Level 1 checks whether a real AI Agent workflow can operate with tool calling, an external API, retry logic, error handling, and reviewable execution logs.
          </p>
          {submitted ? (
            <div className="mt-7 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] p-5 text-sm leading-6 text-emerald-100">
              Application draft validated in the browser. Backend intake is not connected yet. The next development step is Supabase submission, reviewer status, exam assignment, and certificate ID generation.
            </div>
          ) : null}
        </div>
      </section>

      <section className={`${pageShell} mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]`}>
        <form onSubmit={handleSubmit} className="glass-panel min-w-0 rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Submission form</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">Fill in required data and upload evidence.</h2>
            </div>
            <div className="rounded-full border border-white/[0.12] px-4 py-2 text-sm text-white/58">Level 1 only</div>
          </div>

          <div className="mt-6 grid gap-6">
            {fillFields.map((section) => (
              <div key={section.title} className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em]">{section.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/52">{section.description}</p>
                  </div>
                  <span className="w-fit rounded-full border border-white/[0.12] px-3 py-1 text-xs text-white/48">Typed fields</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <label key={field.name} className="block min-w-0">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
                        {field.label} {field.required ? <span className="text-white/75">Required</span> : <span>Optional</span>}
                      </span>
                      <input name={field.name} type={field.type} required={field.required} placeholder={field.placeholder} className={inputClass} />
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">Written technical answers</h3>
                  <p className="mt-2 text-sm leading-6 text-white/52">These answers are typed because reviewers need searchable, structured text.</p>
                </div>
                <span className="w-fit rounded-full border border-white/[0.12] px-3 py-1 text-xs text-white/48">Typed evidence</span>
              </div>
              <div className="mt-5 grid gap-4">
                {writtenSections.map((field) => (
                  <label key={field.name} className="block min-w-0">
                    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
                      {field.label} {field.required ? <span className="text-white/75">Required</span> : <span>Optional</span>}
                    </span>
                    <textarea name={field.name} required={field.required} placeholder={field.placeholder} className={textareaClass} />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">File evidence upload</h3>
                  <p className="mt-2 text-sm leading-6 text-white/52">Upload proof files when reviewers need logs, recordings, documents, diagrams, or evidence packages.</p>
                </div>
                <span className="w-fit rounded-full border border-white/[0.12] px-3 py-1 text-xs text-white/48">Upload required</span>
              </div>
              <div className="mt-5 grid gap-4">
                {uploadFields.map((field) => (
                  <label key={field.name} className="block min-w-0 rounded-2xl border border-white/[0.06] bg-black/16 p-4">
                    <span className="block text-sm font-medium text-white">
                      {field.label} {field.required ? <span className="text-white/60">Required</span> : <span className="text-white/36">Optional</span>}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-white/46">{field.helper}</span>
                    <input name={field.name} type="file" required={field.required} accept={field.accept} className={`${fileClass} mt-4`} />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.08] bg-black/24 p-5">
              <label className="flex gap-3 text-sm leading-6 text-white/64">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-white/20 bg-black" />
                <span>I confirm this submission contains a real working agent, not a prompt only submission, UI only demo, or slide deck only proposal.</span>
              </label>
              <label className="mt-4 flex gap-3 text-sm leading-6 text-white/64">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-white/20 bg-black" />
                <span>I understand that Level 2 certification cannot be requested until Level 1 certification is approved and active.</span>
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-white/88">
                Submit Level 1 Application
              </button>
              <a href="/certification/process" className="rounded-full border border-white/[0.12] px-7 py-4 text-center text-sm text-white/76 transition hover:border-white/30 hover:text-white">
                Review certification process
              </a>
            </div>
          </div>
        </form>

        <aside className="min-w-0 space-y-6">
          <div className="glass-panel rounded-[2rem] p-6 md:p-8">
            <span className="eyebrow">What is typed</span>
            <div className="mt-5 space-y-3 text-sm leading-6 text-white/62">
              <p>Names, URLs, country, category, workflow description, tool list, API description, retry logic, error handling, and human override rules.</p>
              <p>Typed answers help reviewers search, compare, and score the submission.</p>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 md:p-8">
            <span className="eyebrow">What is uploaded</span>
            <div className="mt-5 space-y-3 text-sm leading-6 text-white/62">
              <p>README, execution logs, demo videos, workflow diagrams, API documentation, security notes, data handling notes, and benchmark evidence.</p>
              <p>Uploads prove that the agent actually runs and can be reviewed like a certification exam submission.</p>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 md:p-8">
            <span className="eyebrow">Level 1 pass gate</span>
            <h2 className="text-3xl font-semibold tracking-[-0.045em] md:text-4xl">Minimum evidence required.</h2>
            <div className="mt-7 space-y-3">
              {minimumEvidence.map((item) => (
                <div key={item} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/66">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 md:p-8">
            <span className="eyebrow">Review path</span>
            <div className="mt-5 grid gap-3">
              {reviewSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/66">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
