"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Section, StatusPill, ThinTable } from "@/components/aiaa-page-kit";
import {
  ensureMemberProfile,
  getLoginUrl,
  getStoredSession,
  isSupabaseAuthConfigured,
  readUser,
  saveStoredSession,
  type AIAAMemberUser
} from "@/lib/supabase/browser";
import {
  createCertificationApplication,
  getActiveCertificationApplication,
  getApprovedLevel,
  getNextCertificationLevel,
  levelName,
  readOwnCertificationApplications,
  stageIndex,
  stageLabel,
  statusLabel,
  updateCertificationApplication,
  type AIAAExamAnswers,
  type AIAACertificationApplication
} from "@/lib/supabase/certification";

type FlowState = {
  loading: boolean;
  authRequired: boolean;
  error: string;
  accessToken: string;
  user: AIAAMemberUser | null;
  applications: AIAACertificationApplication[];
};

const emptyState: FlowState = {
  loading: true,
  authRequired: false,
  error: "",
  accessToken: "",
  user: null,
  applications: []
};

const steps = ["Application", "Exam", "Review", "Certificate", "Ranking"] as const;
const inputClass = "h-12 w-full border border-slate-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(29,78,216,0.10)]";
const textareaClass = "min-h-32 w-full resize-y border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(29,78,216,0.10)]";

function getNextPath() {
  if (typeof window === "undefined") return "/apply/agent";
  return `${window.location.pathname}${window.location.search}`;
}

function sessionIsExpired(expiresAt?: number) {
  if (!expiresAt) return false;
  return expiresAt <= Math.floor(Date.now() / 1000) + 20;
}

function toneForStatus(status: string): "neutral" | "good" | "warn" | "bad" {
  if (status === "approved") return "good";
  if (status === "rejected") return "bad";
  if (["submitted", "exam", "under_review"].includes(status)) return "warn";
  return "neutral";
}

function stageTone(index: number, activeIndex: number, approved: boolean): "neutral" | "good" | "warn" {
  if (approved || index < activeIndex) return "good";
  if (index === activeIndex) return "warn";
  return "neutral";
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-neutral-500">{label}</span>
      <div className="mt-2">{children}</div>
      {hint ? <span className="mt-2 block text-xs leading-5 text-neutral-500">{hint}</span> : null}
    </label>
  );
}

function FlowStep({ name, index, activeIndex, approved }: { name: string; index: number; activeIndex: number; approved: boolean }) {
  const tone = stageTone(index, activeIndex, approved);
  const label = approved || index < activeIndex ? "Done" : index === activeIndex ? "Current" : "Waiting";

  return (
    <div className="border border-slate-200 bg-white p-4 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="font-mono text-lg font-semibold tracking-[-0.05em] text-neutral-950">{String(index + 1).padStart(2, "0")}</div>
        <StatusPill tone={tone}>{label}</StatusPill>
      </div>
      <div className="mt-5 text-sm font-semibold text-neutral-950">{stageLabel(name)}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">{label}</div>
      <div className="mt-1 break-words font-semibold text-neutral-950">{value || "Not set"}</div>
    </div>
  );
}

function ApplicationCard({ application }: { application: AIAACertificationApplication }) {
  const activeIndex = stageIndex(application.stage);
  const approved = application.status === "approved";
  const reviewStatus = application.review_status || application.reviewer_status || "waiting";

  return (
    <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">{levelName(application.target_level)}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{application.agent_name || "AIAA Certification Application"}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{application.evidence_summary || "No evidence summary yet."}</p>
        </div>
        <StatusPill tone={toneForStatus(application.status)}>{statusLabel(application.status)}</StatusPill>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => <FlowStep key={step} name={step} index={index} activeIndex={activeIndex} approved={approved} />)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Info label="Current stage" value={stageLabel(application.stage)} />
        <Info label="Contact email" value={application.contact_email || "Not set"} />
        <Info label="Exam status" value={application.exam_status || "not_started"} />
        <Info label="Review status" value={reviewStatus} />
        <Info label="Certificate" value={application.certificate_id || "Not issued"} />
      </div>
    </div>
  );
}

function AuthGate({ copy = "Sign in to submit and track your AIAA certification application." }: { copy?: string }) {
  const loginUrl = getLoginUrl(getNextPath());
  return (
    <Section compact eyebrow="Member gate" title="Sign in first." copy={copy}>
      <div className="flex flex-wrap gap-3">
        <Link href={loginUrl} className="aiaa-button-dark">Sign in</Link>
        <Link href="/signup" className="aiaa-button-light">Create member account</Link>
      </div>
    </Section>
  );
}

function useCertificationFlow() {
  const [state, setState] = useState<FlowState>(emptyState);

  async function reload() {
    if (!isSupabaseAuthConfigured()) {
      setState({ ...emptyState, loading: false, error: "The application system is not configured yet." });
      return;
    }

    const session = getStoredSession();
    if (!session?.access_token || sessionIsExpired(session.expires_at)) {
      saveStoredSession(null);
      setState({ ...emptyState, loading: false, authRequired: true });
      return;
    }

    try {
      const user = session.user?.id ? session.user : await readUser(session.access_token);
      if (!user?.id) {
        saveStoredSession(null);
        setState({ ...emptyState, loading: false, authRequired: true });
        return;
      }

      await ensureMemberProfile(session.access_token, user);
      const applications = await readOwnCertificationApplications(session.access_token, user.id);
      setState({ loading: false, authRequired: false, error: "", accessToken: session.access_token, user, applications });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load the application flow.";
      if (message.includes("expired") || message.includes("JWT")) {
        saveStoredSession(null);
        setState({ ...emptyState, loading: false, authRequired: true });
        return;
      }
      setState({ ...emptyState, loading: false, error: message });
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return { ...state, reload };
}

export function CertificationApplicationForm() {
  const router = useRouter();
  const { loading, authRequired, error, user, accessToken, applications } = useCertificationFlow();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    agentName: "",
    category: "Workflow Agent",
    contactEmail: "",
    githubRepo: "",
    demoUrl: "",
    videoUrl: "",
    readmeUrl: "",
    evidenceSummary: ""
  });

  const approvedLevel = useMemo(() => getApprovedLevel(applications), [applications]);
  const activeApplication = useMemo(() => getActiveCertificationApplication(applications), [applications]);
  const nextLevel = useMemo(() => getNextCertificationLevel(applications), [applications]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    const email = (user as { email?: string } | null)?.email || "";
    if (!email) return;

    setForm((current) => {
      if (current.contactEmail) return current;
      return { ...current, contactEmail: email };
    });
  }, [user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!user?.id || !accessToken) {
      router.push(getLoginUrl("/apply/agent"));
      return;
    }

    if (activeApplication) {
      router.push("/member/applications");
      return;
    }

    if (nextLevel > 1 && approvedLevel < nextLevel - 1) {
      setMessage(`You must be approved for ${levelName(nextLevel - 1)} before applying for ${levelName(nextLevel)}.`);
      return;
    }

    const contactEmail = form.contactEmail.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      setMessage("Enter a valid contact email.");
      return;
    }

    if (!form.agentName.trim() || !form.githubRepo.trim() || !form.readmeUrl.trim() || !form.evidenceSummary.trim()) {
      setMessage("Agent name, GitHub repo, README URL, and evidence summary are required. Demo and video can be added later.");
      return;
    }

    setSubmitting(true);
    try {
      await createCertificationApplication(accessToken, {
        user_id: user.id,
        target_level: nextLevel,
        agent_name: form.agentName,
        agent_category: form.category,
        contact_email: form.contactEmail,
        github_repo: form.githubRepo,
        demo_url: form.demoUrl,
        video_url: form.videoUrl,
        readme_url: form.readmeUrl,
        evidence_summary: form.evidenceSummary
      });
      router.push("/member/applications");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Application submission failed. Sign in again and try once more.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Section compact><p className="text-sm text-neutral-600">Loading member status.</p></Section>;
  if (authRequired) return <AuthGate copy="After sign in, this page shows the application form directly." />;
  if (error) return <Section compact><p className="text-sm text-rose-700">{error}</p></Section>;

  if (activeApplication) {
    return (
      <Section compact eyebrow="Active application" title="You already have an application in progress." copy="Complete the current application, exam, review, certificate, and ranking eligibility flow before starting the next level.">
        <ApplicationCard application={activeApplication} />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/member/applications" className="aiaa-button-dark">View application status</Link>
          <Link href="/member/exam" className="aiaa-button-light">Open exam</Link>
        </div>
      </Section>
    );
  }

  return (
    <Section compact eyebrow="Application form" title={`Submit ${levelName(nextLevel)} application.`} copy="Submitting this form starts the application process. It does not approve the application and it does not issue a certificate automatically.">
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-6">
          <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)]">
            <StatusPill tone="warn">{levelName(nextLevel)}</StatusPill>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-neutral-950">Current application to submit.</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-600">New members start at Level 1. Before approval, no certification is shown and the next level stays locked.</p>
          </div>
          <ThinTable
            headers={["Step", "Status"]}
            rows={[
              ["01", "Submit application"],
              ["02", "Complete exam"],
              ["03", "Awaiting review"],
              ["04", "Certificate issued after approval"],
              ["05", "Ranking eligibility after approval"]
            ]}
          />
        </aside>

        <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Agent name">
              <input value={form.agentName} onChange={(event) => update("agentName", event.target.value)} className={inputClass} placeholder="Atlas Workflow Agent" />
            </Field>
            <Field label="Category">
              <input value={form.category} onChange={(event) => update("category", event.target.value)} className={inputClass} placeholder="Workflow Agent, Browser Agent, Coding Agent" />
            </Field>
            <Field label="Contact email" hint="Application notices will be sent to this email.">
              <input type="email" value={form.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} className={inputClass} placeholder="member@example.com" autoComplete="email" />
            </Field>
            <Field label="GitHub Repo" hint="Required. Use a public repository or a reviewer access link.">
              <input value={form.githubRepo} onChange={(event) => update("githubRepo", event.target.value)} className={inputClass} placeholder="https://github.com/account/repo" />
            </Field>
            <Field label="README URL" hint="Required. Explain setup, workflow, and testing.">
              <input value={form.readmeUrl} onChange={(event) => update("readmeUrl", event.target.value)} className={inputClass} placeholder="https://github.com/account/repo#readme" />
            </Field>
            <Field label="Demo URL">
              <input value={form.demoUrl} onChange={(event) => update("demoUrl", event.target.value)} className={inputClass} placeholder="https://demo.example.com" />
            </Field>
            <Field label="Video URL">
              <input value={form.videoUrl} onChange={(event) => update("videoUrl", event.target.value)} className={inputClass} placeholder="https://youtube.com/..." />
            </Field>
            <div className="md:col-span-2">
              <Field label="Evidence summary" hint="Required. Describe what the agent does, how it works, APIs, tools, error handling, and human review points.">
                <textarea value={form.evidenceSummary} onChange={(event) => update("evidenceSummary", event.target.value)} className={textareaClass} placeholder="Describe the Agent workflow, tool calls, API integrations, logs, retry logic, and review evidence." />
              </Field>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
            <button type="submit" disabled={submitting} className="aiaa-button-dark disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Submitting" : "Submit application"}</button>
            <Link href="/member/applications" className="aiaa-button-light">View application status</Link>
            {message ? <span className="text-sm leading-6 text-rose-700">{message}</span> : null}
          </div>
        </div>
      </form>
    </Section>
  );
}

export function MemberApplicationsTracker() {
  const { loading, authRequired, error, applications } = useCertificationFlow();
  const activeApplication = useMemo(() => getActiveCertificationApplication(applications), [applications]);
  const approvedLevel = useMemo(() => getApprovedLevel(applications), [applications]);

  if (loading) return <Section compact><p className="text-sm text-neutral-600">Loading application records.</p></Section>;
  if (authRequired) return <AuthGate copy="Sign in to view your application, exam, review, and certificate status." />;
  if (error) return <Section compact><p className="text-sm text-rose-700">{error}</p></Section>;

  if (!applications.length) {
    return (
      <Section compact eyebrow="Application tracker" title="Level 1 application not submitted yet." copy="New members do not receive Level 1 automatically. Submit an application, complete the exam, then wait for review.">
        <Link href="/apply/agent" className="aiaa-button-dark">Submit Level 1 application</Link>
      </Section>
    );
  }

  return (
    <>
      <Section compact eyebrow="Certification status" title={approvedLevel ? `${levelName(approvedLevel)} approved.` : "No approved certification yet."} copy="Only review approved records with a certificate ID display as certified.">
        <div className="grid gap-4 md:grid-cols-3">
          <Info label="Approved level" value={approvedLevel ? levelName(approvedLevel) : "None"} />
          <Info label="Current application" value={activeApplication ? levelName(activeApplication.target_level) : "No application in progress"} />
          <Info label="Next step" value={activeApplication ? stageLabel(activeApplication.stage) : "Submit next level application"} />
        </div>
      </Section>
      <Section compact eyebrow="Applications" title="Your application records." copy="This page reads real application data and does not show fake approval states.">
        <div className="space-y-5">
          {applications.map((application) => <ApplicationCard key={application.id} application={application} />)}
        </div>
      </Section>
    </>
  );
}

export function MemberExamWorkspace() {
  const { loading, authRequired, error, accessToken, applications, reload } = useCertificationFlow();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<AIAAExamAnswers>({
    architecture: "",
    toolCalling: "",
    errorHandling: "",
    runbook: ""
  });

  const activeApplication = useMemo(() => getActiveCertificationApplication(applications), [applications]);

  function update<K extends keyof AIAAExamAnswers>(key: K, value: AIAAExamAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function startExam() {
    if (!activeApplication || !accessToken) return;
    setSaving(true);
    setMessage("");
    try {
      await updateCertificationApplication(accessToken, activeApplication.id, {
        status: "exam",
        stage: "Exam",
        exam_status: "in_progress"
      });
      await reload();
      setMessage("Exam started. Complete all answers, then submit for review.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start exam.");
    } finally {
      setSaving(false);
    }
  }

  async function submitExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeApplication || !accessToken) return;
    setMessage("");

    if (!answers.architecture.trim() || !answers.toolCalling.trim() || !answers.errorHandling.trim() || !answers.runbook.trim()) {
      setMessage("Complete all exam answers before submitting.");
      return;
    }

    setSaving(true);
    try {
      await updateCertificationApplication(accessToken, activeApplication.id, {
        status: "under_review",
        stage: "Review",
        exam_status: "submitted",
        review_status: "pending",
        reviewer_status: "waiting",
        exam_answers: answers
      });
      await reload();
      setMessage("Exam submitted. The application is now under review. A certificate is not issued automatically.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Exam submission failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Section compact><p className="text-sm text-neutral-600">Loading exam data.</p></Section>;
  if (authRequired) return <AuthGate copy="Sign in to enter your exam workspace." />;
  if (error) return <Section compact><p className="text-sm text-rose-700">{error}</p></Section>;

  if (!activeApplication) {
    return (
      <Section compact eyebrow="Exam" title="No exam available yet." copy="Submit a Level 1 application first. The exam appears after the application record is created.">
        <Link href="/apply/agent" className="aiaa-button-dark">Submit Level 1 application</Link>
      </Section>
    );
  }

  if (activeApplication.status === "under_review") {
    return (
      <Section compact eyebrow="Exam submitted" title="Submitted and awaiting review." copy="Reviewers must check the exam and evidence before a certificate is issued.">
        <ApplicationCard application={activeApplication} />
      </Section>
    );
  }

  return (
    <Section compact eyebrow="Exam workspace" title={`${levelName(activeApplication.target_level)} exam.`} copy="After exam submission, the application enters review. This does not approve the application and it does not issue a certificate automatically.">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <ApplicationCard application={activeApplication} />
          {activeApplication.stage === "Application" ? <button type="button" onClick={startExam} disabled={saving} className="aiaa-button-dark disabled:cursor-not-allowed disabled:opacity-50">Start exam</button> : null}
        </div>
        <form onSubmit={submitExam} className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
          <div className="grid gap-5">
            <Field label="Architecture explanation">
              <textarea value={answers.architecture} onChange={(event) => update("architecture", event.target.value)} className={textareaClass} placeholder="Explain the agent workflow, execution environment, state management, inputs, and outputs." />
            </Field>
            <Field label="Tool calling evidence">
              <textarea value={answers.toolCalling} onChange={(event) => update("toolCalling", event.target.value)} className={textareaClass} placeholder="Explain which APIs or tools are called, the input, and the output." />
            </Field>
            <Field label="Error handling and retry logic">
              <textarea value={answers.errorHandling} onChange={(event) => update("errorHandling", event.target.value)} className={textareaClass} placeholder="Explain error messages, retries, records, recovery rules, and human intervention points." />
            </Field>
            <Field label="Reviewer runbook">
              <textarea value={answers.runbook} onChange={(event) => update("runbook", event.target.value)} className={textareaClass} placeholder="Explain how reviewers install, run, test, and verify your agent." />
            </Field>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
            <button type="submit" disabled={saving || activeApplication.stage === "Application"} className="aiaa-button-dark disabled:cursor-not-allowed disabled:opacity-50">Submit exam for review</button>
            <Link href="/member/applications" className="aiaa-button-light">View application status</Link>
            {message ? <span className="text-sm leading-6 text-rose-700">{message}</span> : null}
          </div>
        </form>
      </div>
    </Section>
  );
}

export function MemberApplicationSnapshot() {
  const { loading, authRequired, error, applications } = useCertificationFlow();
  const approvedLevel = useMemo(() => getApprovedLevel(applications), [applications]);
  const activeApplication = useMemo(() => getActiveCertificationApplication(applications), [applications]);
  const currentIndex = activeApplication ? stageIndex(activeApplication.stage) : -1;

  if (loading) return <section className="border border-slate-200 bg-white p-6 text-sm text-neutral-600 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">Loading certification status.</section>;
  if (authRequired) return <section className="border border-slate-200 bg-white p-6 text-sm text-neutral-600 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">Sign in again to view certification status.</section>;
  if (error) return <section className="border border-slate-200 bg-white p-6 text-sm text-rose-700 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">{error}</section>;

  return (
    <>
      <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Certification status</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{approvedLevel ? `${levelName(approvedLevel)} approved.` : "No approved certification yet."}</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">{approvedLevel ? "Approved certification appears in member data, registry records, certificates, and ranking eligibility." : "New members do not receive Level 1 automatically. Submit an application, complete the exam, and pass review first."}</p>
        <div className="mt-5">
          <Info label="Approved level" value={approvedLevel ? levelName(approvedLevel) : "None"} />
          <Info label="Certificate" value={applications.find((item) => item.target_level === approvedLevel)?.certificate_id || "Not issued"} />
          <Info label="Ranking eligibility" value={approvedLevel ? "Waiting for ranking review" : "Not eligible"} />
        </div>
        <Link href={activeApplication ? "/member/applications" : "/apply/agent"} className="aiaa-button-dark mt-6">{activeApplication ? "View application status" : "Submit Level 1 application"}</Link>
      </section>

      <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Current application</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{activeApplication ? `${levelName(activeApplication.target_level)}, ${statusLabel(activeApplication.status)}.` : "Level 1 application not submitted."}</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">{activeApplication ? "This status comes from your application record." : "Submit a Level 1 application first. After submission, this page shows application, exam, review, certificate, and ranking stages."}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {steps.map((stage, index) => <FlowStep key={stage} name={stage} index={index} activeIndex={currentIndex} approved={false} />)}
        </div>
      </section>
    </>
  );
}
