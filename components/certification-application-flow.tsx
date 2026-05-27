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
  const label = approved || index < activeIndex ? "完成" : index === activeIndex ? "目前" : "Waiting";

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
      <div className="mt-1 break-words font-semibold text-neutral-950">{value || "未設定"}</div>
    </div>
  );
}

function ApplicationCard({ application }: { application: AIAACertificationApplication }) {
  const activeIndex = stageIndex(application.stage);
  const approved = application.status === "approved";

  return (
    <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">{levelName(application.target_level)}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{application.agent_name || "AIAA CertificationApply"}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{application.evidence_summary || "尚未填寫Evidence summary。"}</p>
        </div>
        <StatusPill tone={toneForStatus(application.status)}>{statusLabel(application.status)}</StatusPill>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => <FlowStep key={step} name={step} index={index} activeIndex={activeIndex} approved={approved} />)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Info label="目前階段" value={stageLabel(application.stage)} />
        <Info label="ExamStatus" value={application.exam_status || "not_started"} />
        <Info label="審核Status" value={application.reviewer_status || "waiting"} />
        <Info label="Certificate" value={application.certificate_id || "Not issued"} />
      </div>
    </div>
  );
}

function AuthGate({ copy = "Sign in後才能提交和追蹤 AIAA CertificationApply。" }: { copy?: string }) {
  const loginUrl = getLoginUrl(getNextPath());
  return (
    <Section compact eyebrow="Member gate" title="請先Sign in會員。" copy={copy}>
      <div className="flex flex-wrap gap-3">
        <Link href={loginUrl} className="aiaa-button-dark">Sign in後Apply</Link>
        <Link href="/signup" className="aiaa-button-light">註冊會員</Link>
      </div>
    </Section>
  );
}

function useCertificationFlow() {
  const [state, setState] = useState<FlowState>(emptyState);

  async function reload() {
    if (!isapplication systemAuthConfigured()) {
      setState({ ...emptyState, loading: false, error: "application system 尚未設定。" });
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
      const message = error instanceof Error ? error.message : "無法讀取Apply流程。";
      if (message.includes("過期") || message.includes("JWT")) {
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
      setMessage(`你必須先Approved ${levelName(nextLevel - 1)}，才能Apply ${levelName(nextLevel)}。`);
      return;
    }

    if (!form.agentName.trim() || !form.githubRepo.trim() || !form.readmeUrl.trim() || !form.evidenceSummary.trim()) {
      setMessage("Agent name、GitHub Repo、README URL、Evidence summary都要填。Demo 和影片可先空著。");
      return;
    }

    setSubmitting(true);
    try {
      await createCertificationApplication(accessToken, {
        user_id: user.id,
        target_level: nextLevel,
        agent_name: form.agentName,
        agent_category: form.category,
        github_repo: form.githubRepo,
        demo_url: form.demoUrl,
        video_url: form.videoUrl,
        readme_url: form.readmeUrl,
        evidence_summary: form.evidenceSummary
      });
      router.push("/member/applications");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交Apply失敗。請重新Sign in後再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Section compact><p className="text-sm text-neutral-600">正在讀取會員Status。</p></Section>;
  if (authRequired) return <AuthGate copy="Sign in後，這裡會直接顯示提交Apply表，不會再顯示Create account流程。" />;
  if (error) return <Section compact><p className="text-sm text-rose-700">{error}</p></Section>;

  if (activeApplication) {
    return (
      <Section compact eyebrow="Active application" title="你已有一個In progress的Apply。" copy="完成目前的Apply、Exam、審核、Certificate和Rankings流程後，才能開下一級。">
        <ApplicationCard application={activeApplication} />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/member/applications" className="aiaa-button-dark">查看Apply進度</Link>
          <Link href="/member/exam" className="aiaa-button-light">進入Exam</Link>
        </div>
      </Section>
    );
  }

  return (
    <Section compact eyebrow="Application form" title={`提交 ${levelName(nextLevel)} Apply。`} copy="This form starts application system Apply資料表。提交後只代表進入Apply流程，It does not approve the application and it does not issue a certificate automatically.">
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-6">
          <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)]">
            <StatusPill tone="warn">{levelName(nextLevel)}</StatusPill>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-neutral-950">目前要提交的Apply。</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-600">新會員從 Level 1 開始。Approved前，不會顯示已Certification，也不會解鎖下一級。</p>
          </div>
          <ThinTable
            headers={["Step", "Status"]}
            rows={[
              ["01", "提交Apply"],
              ["02", "Complete exam"],
              ["03", "Awaiting review"],
              ["04", "Certificate issued after approval"],
              ["05", "Approved後才進入Rankings資格"]
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
            <button type="submit" disabled={submitting} className="aiaa-button-dark disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "提交中" : "提交Apply"}</button>
            <Link href="/member/applications" className="aiaa-button-light">查看Apply進度</Link>
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

  if (loading) return <Section compact><p className="text-sm text-neutral-600">正在讀取Apply紀錄。</p></Section>;
  if (authRequired) return <AuthGate copy="Sign in後才能查看自己的Apply、Exam、審核和CertificateStatus。" />;
  if (error) return <Section compact><p className="text-sm text-rose-700">{error}</p></Section>;

  if (!applications.length) {
    return (
      <Section compact eyebrow="Application tracker" title="尚未提交 Level 1 Apply。" copy="新會員不會自動獲得 Level 1。先提交Apply，再Complete exam，然後Awaiting review。">
        <Link href="/apply/agent" className="aiaa-button-dark">提交 Level 1 Apply</Link>
      </Section>
    );
  }

  return (
    <>
      <Section compact eyebrow="Certification status" title={approvedLevel ? `${levelName(approvedLevel)} 已Approved。` : "尚未有Approved的Certification。"} copy="只有審核Approved且有Certificate ID 的紀錄，才會顯示為已Certification。">
        <div className="grid gap-4 md:grid-cols-3">
          <Info label="已Approved級別" value={approvedLevel ? levelName(approvedLevel) : "None"} />
          <Info label="目前Apply" value={activeApplication ? levelName(activeApplication.target_level) : "沒有In progress的Apply"} />
          <Info label="下一步" value={activeApplication ? stageLabel(activeApplication.stage) : "提交下一級Apply"} />
        </div>
      </Section>
      <Section compact eyebrow="Applications" title="你的Apply紀錄。" copy="這裡讀取 application system 真實資料，不顯示假的ApprovedStatus。">
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
      setMessage("Exam已開始。完成所有回答後送出審核。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "無法開始Exam。");
    } finally {
      setSaving(false);
    }
  }

  async function submitExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeApplication || !accessToken) return;
    setMessage("");

    if (!answers.architecture.trim() || !answers.toolCalling.trim() || !answers.errorHandling.trim() || !answers.runbook.trim()) {
      setMessage("送出前要填完所有Exam回答。");
      return;
    }

    setSaving(true);
    try {
      await updateCertificationApplication(accessToken, activeApplication.id, {
        status: "under_review",
        stage: "Review",
        exam_status: "submitted",
        reviewer_status: "waiting",
        exam_answers: answers
      });
      await reload();
      setMessage("Exam已送出。現在進入審核，不會自動核發Certificate。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "送出Exam失敗。");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Section compact><p className="text-sm text-neutral-600">正在讀取Exam資料。</p></Section>;
  if (authRequired) return <AuthGate copy="Sign in後才能進入你的Exam工作區。" />;
  if (error) return <Section compact><p className="text-sm text-rose-700">{error}</p></Section>;

  if (!activeApplication) {
    return (
      <Section compact eyebrow="Exam" title="目前沒有Exam。" copy="先提交 Level 1 Apply，Apply紀錄建立後才會出現Exam。">
        <Link href="/apply/agent" className="aiaa-button-dark">提交 Level 1 Apply</Link>
      </Section>
    );
  }

  if (activeApplication.status === "under_review") {
    return (
      <Section compact eyebrow="Exam submitted" title="已送出，Awaiting review。" copy="審核員必須檢查Exam和證據後，才會核發Certificate。">
        <ApplicationCard application={activeApplication} />
      </Section>
    );
  }

  return (
    <Section compact eyebrow="Exam workspace" title={`${levelName(activeApplication.target_level)} Exam。`} copy="Exam送出後，Apply會進入審核。這It does not approve the application and it does not issue a certificate automatically.">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <ApplicationCard application={activeApplication} />
          {activeApplication.stage === "Application" ? <button type="button" onClick={startExam} disabled={saving} className="aiaa-button-dark disabled:cursor-not-allowed disabled:opacity-50">開始Exam</button> : null}
        </div>
        <form onSubmit={submitExam} className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
          <div className="grid gap-5">
            <Field label="架構說明">
              <textarea value={answers.architecture} onChange={(event) => update("architecture", event.target.value)} className={textareaClass} placeholder="說明 Agent 的工作流、執行環境、Status管理和輸入輸出。" />
            </Field>
            <Field label="工具呼叫證明">
              <textarea value={answers.toolCalling} onChange={(event) => update("toolCalling", event.target.value)} className={textareaClass} placeholder="說明呼叫哪些 API 或工具，輸入是什麼，輸出是什麼。" />
            </Field>
            <Field label="錯誤處理和重試邏輯">
              <textarea value={answers.errorHandling} onChange={(event) => update("errorHandling", event.target.value)} className={textareaClass} placeholder="說明錯誤訊息、重試、Records、回復規則和人工介入點。" />
            </Field>
            <Field label="審核執行說明">
              <textarea value={answers.runbook} onChange={(event) => update("runbook", event.target.value)} className={textareaClass} placeholder="說明審核員如何安裝、執行、測試和驗證你的 Agent。" />
            </Field>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
            <button type="submit" disabled={saving || activeApplication.stage === "Application"} className="aiaa-button-dark disabled:cursor-not-allowed disabled:opacity-50">送出Exam並進入審核</button>
            <Link href="/member/applications" className="aiaa-button-light">查看Apply進度</Link>
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

  if (loading) return <section className="border border-slate-200 bg-white p-6 text-sm text-neutral-600 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">正在讀取CertificationStatus。</section>;
  if (authRequired) return <section className="border border-slate-200 bg-white p-6 text-sm text-neutral-600 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">請重新Sign in以查看CertificationStatus。</section>;
  if (error) return <section className="border border-slate-200 bg-white p-6 text-sm text-rose-700 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">{error}</section>;

  return (
    <>
      <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Certification status</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{approvedLevel ? `${levelName(approvedLevel)} 已Approved。` : "尚未有Approved的Certification。"}</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">{approvedLevel ? "Approved的Certification會顯示在會員資料、註冊紀錄、Certificate和Rankings資格中。" : "新會員不會自動得到 Level 1。必須提交Apply、Complete exam、Approved審核後才會顯示。"}</p>
        <div className="mt-5">
          <Info label="已Approved級別" value={approvedLevel ? levelName(approvedLevel) : "None"} />
          <Info label="Certificate" value={applications.find((item) => item.target_level === approvedLevel)?.certificate_id || "Not issued"} />
          <Info label="Rankings資格" value={approvedLevel ? "WaitingRankings審核" : "未符合"} />
        </div>
        <Link href={activeApplication ? "/member/applications" : "/apply/agent"} className="aiaa-button-dark mt-6">{activeApplication ? "查看Apply進度" : "提交 Level 1 Apply"}</Link>
      </section>

      <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Current application</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">{activeApplication ? `${levelName(activeApplication.target_level)}，${statusLabel(activeApplication.status)}。` : "Level 1 Apply尚未提交。"}</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">{activeApplication ? "此Status來自你的 application system Apply紀錄。" : "先提交 Level 1 Apply。提交後，這裡會顯示Apply、Exam、審核、Certificate和Rankings階段。"}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {steps.map((stage, index) => <FlowStep key={stage} name={stage} index={index} activeIndex={currentIndex} approved={false} />)}
        </div>
      </section>
    </>
  );
}
