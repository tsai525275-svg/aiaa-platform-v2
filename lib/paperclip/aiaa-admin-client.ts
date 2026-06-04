import "server-only";

export type PaperclipAdminApplication = {
  id: string;
  user_id: string;
  target_level: number;
  status: string;
  stage: string;
  agent_name: string;
  agent_category: string;
  contact_email: string;
  github_repo: string;
  demo_url: string;
  video_url: string;
  readme_url: string;
  evidence_summary: string;
  precheck_status?: string | null;
  precheck_note?: string | null;
  exam_access_status?: string | null;
  exam_status?: string | null;
  exam_submitted_at?: string | null;
  exam_multiple_choice_score?: number | null;
  exam_multiple_choice_total?: number | null;
  exam_score_percent?: number | null;
  exam_scoring_status?: string | null;
  exam_review_required?: boolean | null;
  review_status?: string | null;
  review_note?: string | null;
  review_decision?: string | null;
  reviewed_at?: string | null;
  certificate_status?: string | null;
  certificate_id?: string | null;
  certificate_issued_at?: string | null;
  certificate_expires_at?: string | null;
  ranking_eligibility_status?: string | null;
  next_level_unlocked?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PaperclipReviewerAction = {
  id: string;
  application_id: string;
  user_id: string;
  actor_id?: string | null;
  action: string;
  note?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export type PaperclipExamAnswer = {
  id: string;
  application_id: string;
  user_id: string;
  level: number;
  answers: Record<string, string>;
  status: string;
  multiple_choice_score?: number | null;
  multiple_choice_total?: number | null;
  score_percent?: number | null;
  auto_pass?: boolean | null;
  scoring_status?: string | null;
  scoring_summary?: Record<string, unknown> | null;
  submitted_at?: string | null;
  locked_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApplicationsResponse = {
  ok: boolean;
  applications?: PaperclipAdminApplication[];
  error?: string;
};

type ApplicationDetailResponse = {
  ok: boolean;
  application?: PaperclipAdminApplication;
  examAnswers?: PaperclipExamAnswer[];
  reviewerActions?: PaperclipReviewerAction[];
  error?: string;
};

type ApplicationExamResponse = {
  ok: boolean;
  application?: PaperclipAdminApplication;
  examAnswers?: PaperclipExamAnswer[];
  reviewerActions?: PaperclipReviewerAction[];
  error?: string;
};

type RequestFailure = {
  status: number;
  message: string;
  body: string;
};

function requireEnv(name: "AIAA_ADMIN_BASE_URL" | "PAPERCLIP_ADMIN_API_KEY") {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getBaseUrl() {
  return requireEnv("AIAA_ADMIN_BASE_URL").replace(/\/$/, "");
}

function getAdminApiKey() {
  return requireEnv("PAPERCLIP_ADMIN_API_KEY");
}

async function readResponseBody(response: Response) {
  const text = await response.text().catch(() => "");
  if (!text) return "";

  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return text;
  }
}

async function buildRequestFailure(response: Response, fallback: string): Promise<RequestFailure> {
  const body = await readResponseBody(response);

  if (!body) {
    return {
      status: response.status,
      message: fallback,
      body: ""
    };
  }

  try {
    const parsed = JSON.parse(body) as { error?: string; message?: string };
    return {
      status: response.status,
      message: parsed.error || parsed.message || fallback,
      body
    };
  } catch {
    return {
      status: response.status,
      message: fallback,
      body
    };
  }
}

async function adminGet<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAdminApiKey()}`,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const failure = await buildRequestFailure(
      response,
      `Paperclip admin API request failed: GET ${path}`
    );
    const parts = [
      failure.message,
      `HTTP ${failure.status}`
    ];

    if (failure.body) {
      parts.push(`Response body: ${failure.body}`);
    }

    throw new Error(parts.join(" | "));
  }

  const text = await response.text().catch(() => "");
  if (!text) {
    throw new Error(`Paperclip admin API returned an empty response for GET ${path}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Paperclip admin API returned invalid JSON for GET ${path}`);
  }
}

export async function readApplications() {
  const payload = await adminGet<ApplicationsResponse>("/api/admin/applications");

  if (!payload.ok) {
    throw new Error(payload.error || "Paperclip admin API returned ok=false for readApplications");
  }

  return payload.applications || [];
}

export async function readApplicationDetail(id: string) {
  const applicationId = id.trim();
  if (!applicationId) {
    throw new Error("Application id is required for readApplicationDetail");
  }

  const payload = await adminGet<ApplicationDetailResponse>(
    `/api/admin/applications/${encodeURIComponent(applicationId)}`
  );

  if (!payload.ok || !payload.application) {
    throw new Error(
      payload.error || `Paperclip admin API returned an incomplete payload for application ${applicationId}`
    );
  }

  return {
    application: payload.application,
    examAnswers: payload.examAnswers || [],
    reviewerActions: payload.reviewerActions || []
  };
}

export async function readApplicationExam(id: string) {
  const applicationId = id.trim();
  if (!applicationId) {
    throw new Error("Application id is required for readApplicationExam");
  }

  const payload = await adminGet<ApplicationExamResponse>(
    `/api/admin/applications/${encodeURIComponent(applicationId)}/exam`
  );

  if (!payload.ok || !payload.application) {
    throw new Error(
      payload.error || `Paperclip admin API returned an incomplete exam payload for application ${applicationId}`
    );
  }

  return {
    application: payload.application,
    examAnswers: payload.examAnswers || [],
    reviewerActions: payload.reviewerActions || []
  };
}
