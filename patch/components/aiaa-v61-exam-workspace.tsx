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

type ExamQuestion = AiaaExamQuestion & {
  exam_section?: string | null;
  question_type?: string | null;
  points?: number | null;
  reviewer_notes?: string | null;
  expected_answer_format?: string | null;
  is_active?: boolean | null;
};

type EvidenceField = {
  key: string;
  label: string;
  helper: string;
  type?: "url" | "textarea" | "text";
  required?: boolean;
  placeholder?: string;
};

type EvidenceValue = Record<string, string>;

const inputClass = "w-full border border-slate-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-600 disabled:bg-slate-50 disabled:text-neutral-500";
const textareaClass = "min-h-32 w-full border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-neutral-900 outline-none transition focus:border-blue-600 disabled:bg-slate-50 disabled:text-neutral-500";

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-8">{children}</div>;
}

function parseOptions(prompt: string) {
  const options: Array<{ letter: string; label: string }> = [];
  const pattern = /(?:^|\n)\s*([A-D])\.\s*([\s\S]*?)(?=\n\s*[A-D]\.\s|$)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(prompt || "")) !== null) {
    const label = String(match[2] || "").trim();
    if (label) options.push({ letter: match[1], label });
  }
  return options;
}

function isMultipleChoice(question: ExamQuestion) {
  const type = String(question.question_type || "").toLowerCase();
  return type.includes("multiple choice") || parseOptions(question.prompt || "").length >= 2;
}

function isEvidenceQuestion(level: number, question: ExamQuestion) {
  const type = String(question.question_type || "").toLowerCase();
  if (level === 1 && Number(question.position) === 31) return true;
  if (level === 2 && Number(question.position) >= 41) return true;
  if (level === 3 && Number(question.position) >= 51) return true;
  if (level === 4 && Number(question.position) >= 21) return true;
  if (level === 5) return true;
  return type.includes("practical") || type.includes("review") || type.includes("document") || type.includes("impact") || type.includes("demo");
}

function parseEvidence(value: string): EvidenceValue {
  try {
    const parsed = JSON.parse(value || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as EvidenceValue;
  } catch {
    return value ? { summary: value } : {};
  }
  return {};
}

function stringifyEvidence(value: EvidenceValue) {
  return JSON.stringify(value, null, 2);
}

function levelMeta(level: number) {
  const map: Record<number, { time: string; pass: string; structure: string; note: string }> = {
    1: { time: "90 minutes", pass: "80 points", structure: "30 multiple choice questions and 1 practical evidence task", note: "Level 1 proves that a candidate can build a basic runnable agent workflow." },
    2: { time: "3 hours", pass: "85 points", structure: "40 multiple choice questions and 2 production evidence tasks", note: "Level 2 proves production workflow engineering with state, queue, notification, and recovery." },
    3: { time: "1 day", pass: "90 points with controlled pass rate", structure: "50 multiple choice questions, 3 practical tasks, and 1 architecture review", note: "Level 3 proves multi agent production architecture, monitoring, security, benchmark, and recovery." },
    4: { time: "Quarterly review", pass: "Reviewer score above 88 recommended", structure: "20 company questionnaire items, 8 document evidence items, and 1 demo review", note: "Level 4 is a company or team certification. It is not a personal exam." },
    5: { time: "Annual review", pass: "Council approval", structure: "10 impact review items", note: "Level 5 is Fellow review. It uses nomination, public reputation, impact, and council review." }
  };
  return map[level] || map[1];
}

function evidenceTitle(level: number, position: number, question: ExamQuestion) {
  if (level === 1 && position === 31) return "Basic Agent Workflow Build";
  if (level === 2 && position === 41) return "Production Workflow System";
  if (level === 2 && position === 42) return "Failure Recovery Test";
  if (level === 3 && position === 51) return "Production Multi Agent System";
  if (level === 3 && position === 52) return "Monitoring and Cost Tracking";
  if (level === 3 && position === 53) return "Security and Recovery Layer";
  if (level === 3 && position === 54) return "Architecture Review";
  if (level === 4 && position >= 21) return question.question || "Company evidence review";
  if (level === 5) return question.question || "Fellow impact review";
  return question.question || "Evidence submission";
}

function evidenceIntro(level: number, position: number) {
  if (level === 1 && position === 31) return "Submit evidence that proves your agent workflow can run. Do not write a general essay. Reviewers need links and notes that verify a working agent with user input, task analysis, one external API or tool, one tool call, execution logs, retry logic, error handling, README, and demo evidence.";
  if (level === 2 && position === 41) return "Submit evidence for a production workflow with at least 3 tools, task state, queue or scheduling, retry, logging, state persistence, human override, notification, cost estimate, and deployment documentation.";
  if (level === 2 && position === 42) return "Submit evidence that shows the workflow recovering from failures. Reviewers need proof of API failure simulation, interrupted task handling, error records, retry behavior, and human restart or cancel control.";
  if (level === 3 && position === 51) return "Submit evidence for a production multi agent system. Reviewers need at least 3 agents, clear roles, supervisor or planner, shared memory, state recovery, tool routing, and API documentation.";
  if (level === 3 && position === 52) return "Submit evidence for monitoring and cost tracking. Reviewers need dashboard, cost record, error rate, latency tracking, success rate, and searchable execution records.";
  if (level === 3 && position === 53) return "Submit evidence for security and recovery. Reviewers need permission control, secrets management, audit logs, data isolation, failure recovery, and benchmark report.";
  if (level === 3 && position === 54) return "Submit the architecture review package. Reviewers need system diagram, agent role diagram, data flow, memory design, security design, cost design, deployment architecture, benchmark result, and API documentation.";
  if (level === 4) return "Submit company evidence for manual reviewer assessment. Reviewers need proof that the company or team has a real product, real users or customers, operating infrastructure, security, support, revenue evidence, and production readiness.";
  if (level === 5) return "Submit public evidence for Fellow review. AIAA Level 5 is not a normal exam. Reviewers need evidence of global influence, open source impact, original technical work, public trust, ecosystem contribution, and standards capability.";
  return "Submit links and notes that allow reviewers to verify your evidence.";
}

function baseFields(): EvidenceField[] {
  return [
    { key: "repositoryUrl", label: "GitHub repository URL", helper: "Public repository or private reviewer access link.", type: "url", required: true },
    { key: "readmeUrl", label: "README URL", helper: "README must explain setup, environment variables, workflow steps, run command, and testing.", type: "url", required: true },
    { key: "demoUrl", label: "Live demo URL", helper: "Optional hosted demo, app preview, or workflow page.", type: "url" },
    { key: "demoVideoUrl", label: "Demo video URL", helper: "Use YouTube unlisted, Loom, Vimeo, Google Drive, or GitHub release.", type: "url" },
    { key: "screenshotUrl", label: "Screenshot URL", helper: "Use GitHub repo assets, README image, GitHub issue, Notion public page, or Google Drive.", type: "url" },
    { key: "executionLogUrl", label: "Execution log URL", helper: "Link to GitHub Gist, log file, README section, or hosted text page.", type: "url", required: true }
  ];
}

function practicalFields(level: number, position: number): EvidenceField[] {
  if (level === 1 && position === 31) {
    return [
      ...baseFields(),
      { key: "workflowSummary", label: "Workflow summary", helper: "Explain the user input, task analysis, tool call, external API or tool, output, and execution flow.", type: "textarea", required: true, placeholder: "This agent receives user input, analyzes the task, calls an external API, executes one tool call, logs the run, retries on failure, and returns a final result." },
      { key: "toolCallingEvidence", label: "Tool calling evidence", helper: "Name the tool and explain where the tool call happens in the workflow or code.", type: "textarea", required: true },
      { key: "externalApiEvidence", label: "External API or tool evidence", helper: "Name the API or external service and explain what data or action it provides.", type: "textarea", required: true },
      { key: "retryErrorHandling", label: "Retry logic and error handling", helper: "Explain retries, failure path, user facing error message, and log record.", type: "textarea", required: true }
    ];
  }

  if (level === 2 && position === 41) {
    return [
      ...baseFields(),
      { key: "architectureDiagramUrl", label: "Architecture diagram URL", helper: "Show workflow components, tools, queue, state, and notification flow.", type: "url", required: true },
      { key: "toolList", label: "Tool list", helper: "List at least 3 tools and explain each tool responsibility.", type: "textarea", required: true },
      { key: "statePersistence", label: "State persistence evidence", helper: "Explain where task status, checkpoints, inputs, and outputs are stored.", type: "textarea", required: true },
      { key: "queueSchedule", label: "Queue or scheduling evidence", helper: "Explain the queue, scheduler, async job, or equivalent long task mechanism.", type: "textarea", required: true },
      { key: "notificationEvidence", label: "Notification evidence", helper: "Submit Telegram, Discord, email, or dashboard notification proof.", type: "textarea", required: true },
      { key: "humanOverride", label: "Human override evidence", helper: "Explain how a human can approve, cancel, restart, or override the workflow.", type: "textarea", required: true },
      { key: "costEstimate", label: "Cost estimate", helper: "Explain model, API, infrastructure, or task cost estimate.", type: "textarea", required: true },
      { key: "deploymentGuide", label: "Deployment guide URL", helper: "Link to deployment documentation or README deployment section.", type: "url", required: true }
    ];
  }

  if (level === 2 && position === 42) {
    return [
      { key: "failureTestVideoUrl", label: "Failure test video URL", helper: "Show an API failure, task interruption, retry, and human restart or cancel flow.", type: "url", required: true },
      { key: "failureLogUrl", label: "Failure log URL", helper: "Link to log output that records the failure and recovery path.", type: "url", required: true },
      { key: "apiFailureSimulation", label: "API failure simulation", helper: "Explain how the API failure was simulated.", type: "textarea", required: true },
      { key: "taskInterruptionSimulation", label: "Task interruption simulation", helper: "Explain how task interruption was simulated and recovered.", type: "textarea", required: true },
      { key: "retryBehavior", label: "Retry behavior", helper: "Explain retry count, backoff, and final failure path.", type: "textarea", required: true },
      { key: "manualRecovery", label: "Manual recovery control", helper: "Explain how a human can stop, restart, or override the task.", type: "textarea", required: true }
    ];
  }

  if (level === 3 && position === 51) {
    return [
      ...baseFields(),
      { key: "architectureDiagramUrl", label: "Architecture diagram URL", helper: "Show agents, supervisor or planner, worker agents, memory, tools, API, and state flow.", type: "url", required: true },
      { key: "agentRoles", label: "Agent role design", helper: "List at least 3 agents and describe each responsibility.", type: "textarea", required: true },
      { key: "supervisorPlanner", label: "Supervisor or planner evidence", helper: "Explain how tasks are planned, delegated, and verified.", type: "textarea", required: true },
      { key: "sharedMemory", label: "Shared memory evidence", helper: "Explain vector database, retrieval, long term memory, or shared context storage.", type: "textarea", required: true },
      { key: "stateRecovery", label: "State recovery evidence", helper: "Explain how the system resumes after failure or interruption.", type: "textarea", required: true },
      { key: "apiDocumentationUrl", label: "API documentation URL", helper: "Link to API docs with endpoints, auth, schemas, examples, errors, and limits.", type: "url", required: true }
    ];
  }

  if (level === 3 && position === 52) {
    return [
      { key: "monitoringDashboardUrl", label: "Monitoring dashboard URL", helper: "Submit screenshot, dashboard URL, or private reviewer access link.", type: "url", required: true },
      { key: "costTrackingUrl", label: "Cost tracking URL", helper: "Show token, model, API, infrastructure, or per task cost tracking.", type: "url", required: true },
      { key: "errorRate", label: "Error rate evidence", helper: "Explain how error rate is measured and where reviewers can verify it.", type: "textarea", required: true },
      { key: "latencyTracking", label: "Latency tracking evidence", helper: "Explain latency metrics and thresholds.", type: "textarea", required: true },
      { key: "successRate", label: "Success rate evidence", helper: "Explain success rate calculation and sample results.", type: "textarea", required: true },
      { key: "executionRecordSearch", label: "Execution record search", helper: "Explain how reviewers can inspect past runs.", type: "textarea", required: true }
    ];
  }

  if (level === 3 && position === 53) {
    return [
      { key: "securityDesignUrl", label: "Security design URL", helper: "Link to security design document.", type: "url", required: true },
      { key: "benchmarkReportUrl", label: "Benchmark report URL", helper: "Link to benchmark report, test result, or evaluation record.", type: "url", required: true },
      { key: "permissionControl", label: "Permission control", helper: "Explain user, tool, API, role, or data access controls.", type: "textarea", required: true },
      { key: "secretsManagement", label: "Secrets management", helper: "Explain how API keys and secrets are stored and protected.", type: "textarea", required: true },
      { key: "auditLogs", label: "Audit logs", helper: "Explain audit trail and log access.", type: "textarea", required: true },
      { key: "dataIsolation", label: "Data isolation", helper: "Explain tenant, user, or task isolation.", type: "textarea", required: true },
      { key: "failureRecovery", label: "Failure recovery", helper: "Explain recovery design for agent, memory, queue, and tool failures.", type: "textarea", required: true }
    ];
  }

  if (level === 3 && position === 54) {
    return [
      { key: "systemArchitectureUrl", label: "System architecture diagram URL", helper: "High level architecture diagram.", type: "url", required: true },
      { key: "agentRoleDiagramUrl", label: "Agent role diagram URL", helper: "Show supervisor, planner, worker, memory, and notification roles.", type: "url", required: true },
      { key: "dataFlowUrl", label: "Data flow diagram URL", helper: "Show input, processing, storage, tool calls, and outputs.", type: "url", required: true },
      { key: "memoryDesign", label: "Memory design", helper: "Explain retrieval, persistence, shared memory, and context boundaries.", type: "textarea", required: true },
      { key: "securityDesign", label: "Security design", helper: "Explain permissions, sandboxing, secrets, audit, and data isolation.", type: "textarea", required: true },
      { key: "costDesign", label: "Cost design", helper: "Explain cost control, limits, estimation, and reporting.", type: "textarea", required: true },
      { key: "deploymentArchitecture", label: "Deployment architecture", helper: "Explain services, queue, database, monitoring, and CI CD path.", type: "textarea", required: true },
      { key: "benchmarkResultUrl", label: "Benchmark result URL", helper: "Link to benchmark report or evaluation artifact.", type: "url", required: true },
      { key: "apiDocsUrl", label: "API documentation URL", helper: "Link to complete API documentation.", type: "url", required: true }
    ];
  }

  if (level === 4) {
    const common = [
      { key: "evidenceUrl", label: "Evidence URL", helper: "Submit the main document, page, dashboard, folder, or reviewer access link.", type: "url", required: true },
      { key: "reviewerAccess", label: "Reviewer access notes", helper: "Explain passwords, access instructions, private repo access, or meeting link if needed.", type: "textarea" },
      { key: "summary", label: "Evidence summary", helper: "Explain what this evidence proves and which reviewer criteria it supports.", type: "textarea", required: true }
    ];
    return common;
  }

  if (level === 5) {
    return [
      { key: "publicEvidenceUrl", label: "Public evidence URL", helper: "Submit public profile, GitHub, paper, media, talk, project, standard, or community record.", type: "url", required: true },
      { key: "thirdPartyEvidenceUrl", label: "Third party reference URL", helper: "Submit independent reference, media mention, industry citation, or recommendation if available.", type: "url" },
      { key: "impactSummary", label: "Impact summary", helper: "Explain the contribution, public evidence, ecosystem impact, and why this meets Fellow review standards.", type: "textarea", required: true },
      { key: "aiaaRelevance", label: "AIAA relevance", helper: "Explain how this contribution advances AI Agent engineering, standards, public trust, or infrastructure.", type: "textarea", required: true }
    ];
  }

  return [
    { key: "evidenceUrl", label: "Evidence URL", helper: "Submit reviewer access link.", type: "url", required: true },
    { key: "summary", label: "Evidence summary", helper: "Explain what reviewers should verify.", type: "textarea", required: true }
  ];
}

function passFailText(level: number, position: number) {
  if (level === 1 && position === 31) {
    return {
      pass: "Pass requires repository, README, demo evidence, execution log, one tool call, one external API or tool, retry logic, and error handling.",
      fail: "Fail conditions include prompt only, UI only, no tool calling, no external API or tool, no README, no execution log, no runnable workflow, or unclear reviewer access."
    };
  }
  if (level === 2) {
    return { pass: "Pass requires production workflow evidence with state, queue or scheduling, retry, logging, human override, notification, and deployment proof.", fail: "Fail conditions include local demo only, no state, no recovery, no notification, no deployment guide, or unreproducible demo." };
  }
  if (level === 3) {
    return { pass: "Pass requires production multi agent architecture, shared memory, monitoring, cost tracking, security, recovery, benchmark, and API documentation.", fail: "Fail conditions include unclear agent roles, no shared memory, no monitoring, no security layer, no benchmark, or demo only architecture." };
  }
  if (level === 4) {
    return { pass: "Pass requires a real company or team product with customers or users, infrastructure, security, support, revenue evidence, benchmark, and demo review.", fail: "Fail conditions include no real product, no customers or users, no security document, no uptime or benchmark, no revenue proof, or demo only product." };
  }
  if (level === 5) {
    return { pass: "Pass requires public evidence of global influence, open source impact, technical originality, public trust, ecosystem contribution, and standards capability.", fail: "Fail conditions include influence gaps, no public contribution, no technical originality, no ecosystem contribution, commercial promotion only, or weak third party evidence." };
  }
  return { pass: "Submit complete evidence for reviewer verification.", fail: "Incomplete or unverifiable evidence can fail review." };
}

function EvidenceInput({ field, value, onChange, disabled }: { field: EvidenceField; value: string; onChange: (value: string) => void; disabled: boolean }) {
  const control = field.type === "textarea" ? (
    <textarea disabled={disabled} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || "Explain your evidence."} className={textareaClass} />
  ) : (
    <input disabled={disabled} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || (field.type === "url" ? "https://" : "")} className={inputClass} />
  );

  return (
    <label className="block">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        <span>{field.label}</span>
        {field.required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] tracking-[0.16em] text-blue-700">Required</span> : null}
      </div>
      <p className="mb-2 text-xs leading-6 text-neutral-500">{field.helper}</p>
      {control}
    </label>
  );
}

function MultipleChoiceField({ question, value, onChange, disabled }: { question: ExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
  const options = parseOptions(question.prompt || "");
  const promptWithoutOptions = String(question.prompt || "").split(/\n\s*A\.\s/)[0]?.trim();

  return (
    <fieldset className="border-b border-slate-200 py-7 last:border-b-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Question {question.position} · {question.category}</div>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">{question.question}</h3>
          {promptWithoutOptions ? <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-600">{promptWithoutOptions}</p> : null}
        </div>
        {question.required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Required</span> : null}
      </div>
      <div className="mt-5 grid gap-3">
        {options.map((option) => {
          const selected = value === option.letter;
          return (
            <label key={option.letter} className={`flex cursor-pointer gap-3 border px-4 py-4 text-sm leading-6 transition ${selected ? "border-blue-600 bg-blue-50 text-blue-950" : "border-slate-200 bg-white text-neutral-700 hover:border-blue-200"}`}>
              <input type="radio" disabled={disabled} name={`question-${question.id}`} checked={selected} onChange={() => onChange(option.letter)} className="mt-1 h-4 w-4 accent-blue-700 disabled:cursor-not-allowed" />
              <span><span className="font-semibold text-neutral-950">{option.letter}.</span> {option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
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
      <textarea disabled={disabled} value={value || ""} onChange={(event) => onChange(event.target.value)} className={`${textareaClass} mt-5`} />
    </label>
  );
}

function EvidenceFieldGroup({ level, question, value, onChange, disabled }: { level: number; question: ExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
  const position = Number(question.position);
  const fields = practicalFields(level, position);
  const evidence = parseEvidence(value);
  const title = evidenceTitle(level, position, question);
  const intro = evidenceIntro(level, position);
  const passFail = passFailText(level, position);

  function update(key: string, nextValue: string) {
    onChange(stringifyEvidence({ ...evidence, [key]: nextValue }));
  }

  return (
    <div className="border-b border-slate-200 py-7 last:border-b-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Question {question.position} · {level === 5 ? "Fellow Review" : "Evidence Submission"}</div>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{title}.</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {question.required ? <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Required</span> : null}
          {question.points ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{question.points} points</span> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:p-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-700">Instructions</div>
          <p className="mt-3 max-w-5xl text-sm leading-7 text-neutral-700">{intro}</p>
        </div>
        <div className="grid gap-3 text-sm leading-7 text-neutral-700 lg:grid-cols-2">
          <div className="border border-slate-200 bg-white p-4"><span className="font-semibold text-neutral-950">Pass standard:</span> {passFail.pass}</div>
          <div className="border border-slate-200 bg-white p-4"><span className="font-semibold text-neutral-950">Fail conditions:</span> {passFail.fail}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.type === "textarea" ? "lg:col-span-2" : undefined}>
            <EvidenceInput field={field} value={evidence[field.key] || ""} onChange={(nextValue) => update(field.key, nextValue)} disabled={disabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionField({ level, question, value, onChange, disabled }: { level: number; question: ExamQuestion; value: string; onChange: (value: string) => void; disabled: boolean }) {
  if (isEvidenceQuestion(level, question)) return <EvidenceFieldGroup level={level} question={question} value={value} onChange={onChange} disabled={disabled} />;
  if (isMultipleChoice(question)) return <MultipleChoiceField question={question} value={value} onChange={onChange} disabled={disabled} />;
  return <WrittenField question={question} value={value} onChange={onChange} disabled={disabled} />;
}

function missingEvidenceFields(level: number, questions: ExamQuestion[], answers: Record<string, string>) {
  const missing: string[] = [];
  for (const question of questions) {
    if (!isEvidenceQuestion(level, question)) continue;
    const evidence = parseEvidence(answers[question.id] || "");
    for (const field of practicalFields(level, Number(question.position))) {
      if (field.required && !String(evidence[field.key] || "").trim()) missing.push(`Question ${question.position} ${field.label}`);
    }
  }
  return missing;
}

export function AiaaV61ExamWorkspace({ levelSlug }: { levelSlug: string }) {
  const level = parseAiaaLevel(levelSlug);
  const meta = levelMeta(level);
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
        const loadedQuestions = await fetchAiaaQuestions(level, session) as ExamQuestion[];
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

  const multipleChoiceCount = questions.filter((question) => isMultipleChoice(question) && !isEvidenceQuestion(level, question)).length;
  const evidenceCount = questions.filter((question) => isEvidenceQuestion(level, question)).length;

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
    const missingBasic = questions.filter((question) => question.required && !isEvidenceQuestion(level, question) && !String(answers[question.id] || "").trim()).map((question) => `Question ${question.position}`);
    const missingEvidence = missingEvidenceFields(level, questions, answers);
    const missing = [...missingBasic, ...missingEvidence];
    if (missing.length) {
      setMessage(`Complete required fields before submitting: ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? " and more" : ""}.`);
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
          <div className="text-xs font-semibold uppercase tracking-[0.38em] text-blue-700">AIAA Exam Workspace V70</div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <h1 className="text-6xl font-semibold tracking-[-0.07em] md:text-8xl">{levelName(level)}.</h1>
            <div className="text-lg leading-8 text-neutral-600">
              <p>{meta.note}</p>
              <p className="mt-4 text-sm leading-7"><span className="font-semibold text-neutral-950">Structure:</span> {meta.structure}</p>
              <p className="text-sm leading-7"><span className="font-semibold text-neutral-950">Time:</span> {meta.time}</p>
              <p className="text-sm leading-7"><span className="font-semibold text-neutral-950">Passing standard:</span> {meta.pass}</p>
            </div>
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
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-neutral-950">{submitted ? "Exam submitted." : "Complete the official exam."}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{submitted ? "Answers are locked. Wait for reviewer assessment." : "Save a draft as you work. Submit only when every required answer and evidence field is ready for review."}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-neutral-600">
                  <div><span className="font-semibold text-neutral-950">Application:</span> {application.agent_name || "Untitled application"}</div>
                  <div className="mt-1"><span className="font-semibold text-neutral-950">Status:</span> {statusTitle(application.exam_status)}</div>
                  <div className="mt-1"><span className="font-semibold text-neutral-950">Loaded:</span> {multipleChoiceCount} knowledge questions, {evidenceCount} evidence tasks</div>
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
