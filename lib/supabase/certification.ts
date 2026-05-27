import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/browser";

export type AIAACertificationStage = "Application" | "Exam" | "Review" | "Certificate" | "Ranking";
export type AIAACertificationStatus = "submitted" | "exam" | "under_review" | "approved" | "rejected";

export type AIAACertificationApplication = {
  id: string;
  user_id: string;
  target_level: number;
  status: AIAACertificationStatus;
  stage: AIAACertificationStage;
  agent_name: string;
  agent_category: string;
  github_repo: string;
  demo_url: string;
  video_url: string;
  readme_url: string;
  evidence_summary: string;
  exam_status: string;
  exam_answers?: Record<string, unknown>;
  review_notes: string;
  reviewer_status: string;
  certificate_id: string;
  certificate_url: string;
  ranking_status: string;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type AIAACertificationApplicationInput = {
  user_id: string;
  target_level: number;
  agent_name: string;
  agent_category: string;
  github_repo: string;
  demo_url: string;
  video_url: string;
  readme_url: string;
  evidence_summary: string;
};

export type AIAAExamAnswers = {
  architecture: string;
  toolCalling: string;
  errorHandling: string;
  runbook: string;
};

const table = "aiaa_certification_applications";

function restHeaders(accessToken: string) {
  const anonKey = getSupabaseAnonKey();
  return {
    "Content-Type": "application/json",
    apikey: anonKey,
    Authorization: `Bearer ${accessToken}`
  };
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function readError(response: Response, fallback: string) {
  const text = await response.text().catch(() => "");
  if (text.includes("JWT") || text.includes("expired") || text.includes("PGRST303")) {
    return "Your sign in session has expired. Sign in again before submitting.";
  }
  return text || fallback;
}

export function levelName(level: number) {
  const names: Record<number, string> = {
    1: "Level 1, AI Agent Operator",
    2: "Level 2, AI Agent Engineer",
    3: "Level 3, AI Agent Systems Architect",
    4: "Level 4, Certified AI Agent Company",
    5: "Level 5, AIAA Association Fellow"
  };
  return names[level] ?? `Level ${level}`;
}

export function statusLabel(status?: string) {
  const labels: Record<string, string> = {
    submitted: "Submitted",
    exam: "Exam in progress",
    under_review: "Under review",
    approved: "Approved",
    rejected: "notApproved"
  };
  return labels[status || ""] ?? "Not submitted";
}

export function stageLabel(stage?: string) {
  const labels: Record<string, string> = {
    Application: "Application",
    Exam: "Exam",
    Review: "Review",
    Certificate: "Certificate",
    Ranking: "Rankings"
  };
  return labels[stage || ""] ?? "Application";
}

export function stageIndex(stage?: string) {
  const stages = ["Application", "Exam", "Review", "Certificate", "Ranking"];
  const index = stages.indexOf(stage || "");
  return index >= 0 ? index : 0;
}

export function getApprovedLevel(applications: AIAACertificationApplication[]) {
  return applications.reduce((level, application) => {
    if (application.status === "approved" && application.certificate_id) {
      return Math.max(level, Number(application.target_level || 0));
    }
    return level;
  }, 0);
}

export function getActiveCertificationApplication(applications: AIAACertificationApplication[]) {
  return applications.find((application) => !["approved", "rejected"].includes(application.status)) ?? null;
}

export function getNextCertificationLevel(applications: AIAACertificationApplication[]) {
  return Math.min(getApprovedLevel(applications) + 1, 5);
}

export async function readOwnCertificationApplications(accessToken: string, userId: string) {
  const response = await fetch(
    `${getSupabaseUrl()}/rest/v1/${table}?select=*&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`,
    {
      headers: restHeaders(accessToken),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response, "Unable to load application records."));
  }

  return (await response.json().catch(() => [])) as AIAACertificationApplication[];
}

export async function createCertificationApplication(accessToken: string, input: AIAACertificationApplicationInput) {
  const payload = {
    user_id: input.user_id,
    target_level: Number(input.target_level || 1),
    status: "submitted" as AIAACertificationStatus,
    stage: "Application" as AIAACertificationStage,
    agent_name: cleanText(input.agent_name),
    agent_category: cleanText(input.agent_category),
    github_repo: cleanText(input.github_repo),
    demo_url: cleanText(input.demo_url),
    video_url: cleanText(input.video_url),
    readme_url: cleanText(input.readme_url),
    evidence_summary: cleanText(input.evidence_summary),
    exam_status: "not_started",
    exam_answers: {},
    review_notes: "",
    reviewer_status: "waiting",
    certificate_id: "",
    certificate_url: "",
    ranking_status: "not_eligible",
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...restHeaders(accessToken),
      Prefer: "return=representation"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Application submission failed."));
  }

  const rows = (await response.json().catch(() => [])) as AIAACertificationApplication[];
  return rows[0];
}

export async function updateCertificationApplication(accessToken: string, id: string, updates: Partial<AIAACertificationApplication>) {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...restHeaders(accessToken),
      Prefer: "return=representation"
    },
    body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() })
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Unable to update application status."));
  }

  const rows = (await response.json().catch(() => [])) as AIAACertificationApplication[];
  return rows[0];
}
