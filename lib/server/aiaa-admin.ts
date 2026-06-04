import { NextRequest, NextResponse } from "next/server";

export type AdminApplication = {
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
  exam_auto_pass?: boolean | null;
  exam_scoring_status?: string | null;
  exam_review_required?: boolean | null;
  exam_started_at?: string | null;
  exam_locked_at?: string | null;
  review_status?: string | null;
  review_note?: string | null;
  review_notes?: string | null;
  review_decision?: string | null;
  reviewer_id?: string | null;
  reviewer_status?: string | null;
  reviewed_at?: string | null;
  certificate_status?: string | null;
  certificate_id?: string | null;
  certificate_url?: string | null;
  certificate_issued_at?: string | null;
  certificate_expires_at?: string | null;
  ranking_eligibility_status?: string | null;
  next_level_unlocked?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ReviewerAction = {
  id: string;
  application_id: string;
  user_id: string;
  actor_id?: string | null;
  action: string;
  note?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

type MemberNotification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  metadata?: Record<string, unknown> | null;
  is_read?: boolean | null;
  created_at?: string | null;
};

type ExamAnswer = {
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

type EmailQueueResult = {
  queued: boolean;
  recipientEmail: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing`);
  return value;
}

function getSupabaseUrl() {
  const value = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!value) throw new Error("SUPABASE_URL is missing");
  return value.replace(/\/$/, "");
}

function getServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function getAdminApiKey() {
  const paperclipKey = cleanText(process.env.PAPERCLIP_ADMIN_API_KEY);
  const legacyKey = cleanText(process.env.AIAA_ADMIN_API_KEY);
  const cronSecret = cleanText(process.env.CRON_SECRET);
  const isProduction = process.env.NODE_ENV === "production";

  if (paperclipKey) return paperclipKey;
  if (legacyKey) return legacyKey;

  // Only allow CRON_SECRET as a local/dev fallback. Production admin auth should
  // use a dedicated admin key so it does not silently authenticate against the
  // cron secret.
  if (!isProduction && cronSecret) return cronSecret;

  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function readResponseError(response: Response, fallback: string) {
  try {
    const payload = await response.json();
    return payload?.message || payload?.error_description || payload?.error || fallback;
  } catch {
    const text = await response.text().catch(() => "");
    return text || fallback;
  }
}

async function restRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: getServiceRoleKey(),
      Authorization: `Bearer ${getServiceRoleKey()}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, `Supabase request failed for ${path}`));
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function authAdminRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${getSupabaseUrl()}/auth/v1/admin/${path}`, {
    ...init,
    headers: {
      apikey: getServiceRoleKey(),
      Authorization: `Bearer ${getServiceRoleKey()}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, `Supabase auth admin request failed for ${path}`));
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function jsonError(status: number, error: string, details?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...(details || {}) }, { status });
}

export function jsonGuardrailError(input: {
  status?: number;
  errorCode: string;
  message: string;
  requiredFields?: string[];
  missingFields?: string[];
  currentState?: Record<string, unknown>;
}) {
  return NextResponse.json(
    {
      ok: false,
      error_code: input.errorCode,
      message: input.message,
      required_fields: input.requiredFields || [],
      missing_fields: input.missingFields || [],
      current_state: input.currentState || {}
    },
    { status: input.status || 422 }
  );
}

export function assertAdminRequest(request: NextRequest) {
  const adminApiKey = getAdminApiKey();
  if (!adminApiKey) {
    return jsonError(500, "PAPERCLIP_ADMIN_API_KEY or AIAA_ADMIN_API_KEY is not configured.");
  }

  const authHeader = cleanText(request.headers.get("authorization"));
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const bearerToken = bearerMatch ? cleanText(bearerMatch[1]) : "";
  const headerToken = cleanText(request.headers.get("x-aiaa-admin-key"));
  const provided = bearerToken || headerToken;

  if (!provided || provided !== adminApiKey) {
    return jsonError(401, "Unauthorized");
  }

  return null;
}

export async function listAdminApplications() {
  return restRequest<AdminApplication[]>(
    "aiaa_certification_applications?select=*&order=created_at.desc&limit=200"
  );
}

export async function getApplicationById(id: string) {
  const rows = await restRequest<AdminApplication[]>(
    `aiaa_certification_applications?select=*&id=eq.${encodeURIComponent(id)}&limit=1`
  );
  const application = rows?.[0];
  if (!application) throw new Error("Application not found.");
  return application;
}

export async function getApplicationExamPackage(id: string) {
  const application = await getApplicationById(id);
  const [answers, reviewerActions] = await Promise.all([
    restRequest<ExamAnswer[]>(
      `aiaa_exam_answers?select=*&application_id=eq.${encodeURIComponent(id)}&order=created_at.desc`
    ),
    restRequest<ReviewerAction[]>(
      `aiaa_reviewer_actions?select=*&application_id=eq.${encodeURIComponent(id)}&order=created_at.desc`
    )
  ]);

  return {
    application,
    examAnswers: answers || [],
    reviewerActions: reviewerActions || []
  };
}

export async function updateApplication(id: string, updates: Record<string, unknown>) {
  const rows = await restRequest<AdminApplication[]>(
    `aiaa_certification_applications?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString()
      })
    }
  );

  const application = rows?.[0];
  if (!application) throw new Error("Application update returned no record.");
  return application;
}

export async function createReviewerAction(input: {
  application: AdminApplication;
  action: string;
  note?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}) {
  const payload = {
    application_id: input.application.id,
    user_id: input.application.user_id,
    actor_id: input.actorId && isUuid(input.actorId) ? input.actorId : null,
    action: input.action,
    note: cleanText(input.note),
    metadata: input.metadata || {}
  };

  const rows = await restRequest<ReviewerAction[]>("aiaa_reviewer_actions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(payload)
  });

  return rows?.[0];
}

export async function createMemberNotification(input: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}) {
  const rows = await restRequest<MemberNotification[]>("aiaa_notifications", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: cleanText(input.link),
      metadata: input.metadata || {},
      is_read: false
    })
  });

  return rows?.[0];
}

async function getAuthUserEmail(userId: string) {
  const payload = await authAdminRequest<{ user?: { email?: string | null } }>(`users/${userId}`);
  return cleanText(payload?.user?.email);
}

export async function queueEmailHook(input: {
  application?: AdminApplication | null;
  userId: string;
  type: string;
  subject: string;
  body: string;
  payload?: Record<string, unknown>;
}) {
  const recipientEmail =
    cleanText(input.application?.contact_email) || (await getAuthUserEmail(input.userId));

  if (!recipientEmail) {
    return {
      queued: false,
      recipientEmail: ""
    } satisfies EmailQueueResult;
  }

  await restRequest("aiaa_email_notification_queue", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      application_id: input.application?.id || null,
      user_id: input.userId,
      recipient_email: recipientEmail,
      type: input.type,
      subject: input.subject,
      body: input.body,
      payload: input.payload || {},
      status: "pending"
    })
  });

  return {
    queued: true,
    recipientEmail
  } satisfies EmailQueueResult;
}

export function parseActionBody(body: unknown) {
  const payload = isRecord(body) ? body : {};
  const note = cleanText(payload.note);
  const actorId = cleanText(payload.actorId);
  const reviewerId = cleanText(payload.reviewer_id) || actorId;
  const humanOverride = payload.human_override === true;
  const overrideReason = cleanText(payload.override_reason);
  const revisionReason = cleanText(payload.revision_reason);
  const rejectReason = cleanText(payload.reject_reason);
  const metadata = isRecord(payload.metadata) ? payload.metadata : {};
  return {
    note,
    actorId,
    reviewerId,
    humanOverride,
    overrideReason,
    revisionReason,
    rejectReason,
    metadata
  };
}

export function certificationPassingScore(level: number) {
  const thresholds: Record<number, number | null> = {
    1: 80,
    2: 85,
    3: 90,
    4: null,
    5: null
  };
  return thresholds[level] ?? null;
}

export function summarizeApplicationState(application: AdminApplication) {
  return {
    application_id: application.id,
    target_level: application.target_level,
    status: application.status,
    stage: application.stage,
    precheck_status: application.precheck_status || null,
    exam_access_status: application.exam_access_status || null,
    exam_status: application.exam_status || null,
    exam_score_percent: application.exam_score_percent ?? null,
    exam_auto_pass: application.exam_auto_pass ?? null,
    exam_review_required: application.exam_review_required ?? null,
    review_status: application.review_status || null,
    certificate_status: application.certificate_status || null,
    reviewer_id: application.reviewer_id || null
  };
}

export function addMonths(isoDate: string, months: number) {
  const date = new Date(isoDate);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString();
}

export function buildCertificateId(application: AdminApplication) {
  return `AIAA-L${application.target_level}-${application.id.slice(0, 8).toUpperCase()}`;
}

export function certificateExpiryForLevel(level: number, issuedAt: string) {
  if (level === 3) return addMonths(issuedAt, 6);
  if (level === 4) return addMonths(issuedAt, 3);
  return addMonths(issuedAt, 12);
}

export async function syncIssuedCertificateToProfile(application: AdminApplication) {
  await restRequest(
    `aiaa_member_profiles?user_id=eq.${encodeURIComponent(application.user_id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        approved_level: application.target_level,
        certification_status: "certified",
        current_certificate_id: application.certificate_id || "",
        certification_expires_at: application.certificate_expires_at || null,
        ranking_eligibility_status: "eligible",
        updated_at: new Date().toISOString()
      })
    }
  );
}
