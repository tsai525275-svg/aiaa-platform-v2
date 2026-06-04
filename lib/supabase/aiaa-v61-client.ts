export type AiaaSession = {
  accessToken: string;
  userId: string;
  email: string;
  expiresAt?: number;
};

export type AiaaApplication = {
  id: string;
  user_id: string;
  target_level?: number | string | null;
  level?: number | string | null;
  agent_name?: string | null;
  category?: string | null;
  contact_email?: string | null;
  status?: string | null;
  stage?: string | null;
  precheck_status?: string | null;
  precheck_note?: string | null;
  exam_access_status?: string | null;
  exam_status?: string | null;
  exam_started_at?: string | null;
  exam_submitted_at?: string | null;
  exam_multiple_choice_score?: number | null;
  exam_multiple_choice_total?: number | null;
  exam_score_percent?: number | null;
  exam_auto_pass?: boolean | null;
  exam_scoring_status?: string | null;
  exam_review_required?: boolean | null;
  review_status?: string | null;
  review_note?: string | null;
  reviewed_at?: string | null;
  certificate_status?: string | null;
  certificate_id?: string | null;
  certificate_issued_at?: string | null;
  certificate_expires_at?: string | null;
  ranking_eligibility_status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AiaaExamQuestion = {
  id: string;
  level: number;
  position: number;
  category: string;
  question: string;
  prompt: string;
  required: boolean;
  exam_section?: string | null;
  question_type?: string | null;
  points?: number | null;
  reviewer_notes?: string | null;
  expected_answer_format?: string | null;
  is_active?: boolean | null;
};

export type AiaaExamAnswer = {
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
};

export type AiaaNotification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
};

export type AiaaExamScoringResult = {
  multipleChoiceScore: number;
  multipleChoiceTotal: number;
  multipleChoicePercent: number | null;
  passingScore: number | null;
  multipleChoicePassed: boolean | null;
  reviewRequired: boolean;
  scoringStatus: string;
  submittedAt: string;
};

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

export function isAiaaV61SupabaseReady() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getStoredAiaaSession(): AiaaSession | null {
  if (typeof window === "undefined") return null;

  function fromCandidate(candidate: any): AiaaSession | null {
    if (!candidate || typeof candidate !== "object") return null;

    const session = candidate.currentSession || candidate.session || candidate;
    const accessToken = session.access_token || session.accessToken;
    if (!accessToken || typeof accessToken !== "string") return null;

    const payload = decodeJwtPayload(accessToken);
    const user = session.user || candidate.user || {};
    const userId = user.id || payload?.sub || "";
    const email = user.email || payload?.email || "";
    const expiresAt = Number(session.expires_at || session.expiresAt || payload?.exp || 0) || undefined;

    if (!userId) return null;
    if (expiresAt && expiresAt * 1000 < Date.now()) return null;

    return { accessToken, userId, email, expiresAt };
  }

  const directKeys = ["aiaa-member-session"];
  for (const key of directKeys) {
    try {
      const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
      if (!raw) continue;
      const session = fromCandidate(JSON.parse(raw));
      if (session) return session;
    } catch {
      // Continue scanning other stored sessions.
    }
  }

  const storages = [window.localStorage, window.sessionStorage];
  for (const storage of storages) {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key) continue;
      const searchable = key.toLowerCase();
      if (!searchable.includes("auth") && !searchable.includes("session") && !searchable.includes("token") && !searchable.includes("aiaa") && !searchable.startsWith("sb-")) continue;

      try {
        const raw = storage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const session = fromCandidate(parsed);
        if (session) return session;
      } catch {
        continue;
      }
    }
  }

  return null;
}

function restHeaders(session?: AiaaSession | null) {
  const anonKey = getSupabaseAnonKey();
  return {
    apikey: anonKey,
    Authorization: "Bearer " + (session?.accessToken || anonKey),
    "Content-Type": "application/json"
  };
}

async function restFetch<T>(path: string, init: RequestInit = {}, session?: AiaaSession | null): Promise<T> {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl || !getSupabaseAnonKey()) {
    throw new Error("Authentication is not configured yet.");
  }

  const response = await fetch(supabaseUrl + path, {
    ...init,
    headers: {
      ...restHeaders(session),
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    let message = "Request failed with status " + response.status + ".";
    try {
      const body = await response.json();
      message = body?.message || body?.error_description || body?.error || message;
    } catch {
      try {
        message = await response.text();
      } catch {
        // keep fallback message
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function encodeFilter(value: string) {
  return encodeURIComponent(value);
}

export function parseAiaaLevel(value: string | number | null | undefined) {
  if (typeof value === "number") return Math.min(5, Math.max(1, value));
  const match = String(value || "").match(/(\d+)/);
  const level = match ? Number(match[1]) : 1;
  return Math.min(5, Math.max(1, Number.isFinite(level) ? level : 1));
}

export function levelName(level: number) {
  const labels: Record<number, string> = {
    1: "Level 1, AI Agent Operator",
    2: "Level 2, AI Agent Engineer",
    3: "Level 3, AI Agent Systems Architect",
    4: "Level 4, Certified AI Agent Company",
    5: "Level 5, AIAA Association Fellow"
  };
  return labels[level] || "Level " + level;
}

export function shortLevelName(level: number) {
  const labels: Record<number, string> = {
    1: "Level 1",
    2: "Level 2",
    3: "Level 3",
    4: "Level 4",
    5: "Level 5"
  };
  return labels[level] || "Level " + level;
}

export function statusTitle(value?: string | null) {
  const normalized = String(value || "").replace(/_/g, " ").trim();
  if (!normalized) return "Not started";
  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getApplicationLevel(application: AiaaApplication) {
  return parseAiaaLevel(application.target_level ?? application.level ?? 1);
}

export function isExamUnlocked(application?: AiaaApplication | null) {
  if (!application) return false;
  const precheck = String(application.precheck_status || "").toLowerCase();
  const access = String(application.exam_access_status || "").toLowerCase();
  const exam = String(application.exam_status || "").toLowerCase();
  return precheck === "approved" || access === "unlocked" || access === "in_progress" || access === "submitted" || exam === "in_progress" || exam === "submitted";
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

function isMultipleChoiceQuestion(question: AiaaExamQuestion) {
  const type = String(question.question_type || "").toLowerCase();
  return type.includes("multiple choice") || parseOptions(question.prompt || "").length >= 2;
}

function isEvidenceQuestion(question: AiaaExamQuestion) {
  const type = String(question.question_type || "").toLowerCase();
  const level = Number(question.level);
  const position = Number(question.position);
  if (level === 1 && position === 31) return true;
  if (level === 2 && position >= 41) return true;
  if (level === 3 && position >= 51) return true;
  if (level === 4 && position >= 21) return true;
  if (level === 5) return true;
  return type.includes("practical") || type.includes("review") || type.includes("document") || type.includes("impact") || type.includes("demo");
}

function extractCorrectAnswer(question: AiaaExamQuestion) {
  const notes = String(question.reviewer_notes || "");
  const match = notes.match(/correct\s+answer\s*:\s*([A-D])/i);
  return match ? match[1].toUpperCase() : "";
}

function passingScoreForLevel(level: number) {
  const map: Record<number, number | null> = { 1: 80, 2: 85, 3: 90, 4: 88, 5: null };
  return map[level] ?? null;
}

export function scoreAiaaExamAnswers(level: number, questions: AiaaExamQuestion[], answers: Record<string, string>): AiaaExamScoringResult {
  let multipleChoiceScore = 0;
  let multipleChoiceTotal = 0;

  for (const question of questions) {
    if (!isMultipleChoiceQuestion(question) || isEvidenceQuestion(question)) continue;
    const correct = extractCorrectAnswer(question);
    const points = Number(question.points || 1) || 1;
    if (!correct) continue;
    multipleChoiceTotal += points;
    const submitted = String(answers[question.id] || "").trim().toUpperCase();
    if (submitted === correct) multipleChoiceScore += points;
  }

  const multipleChoicePercent = multipleChoiceTotal > 0 ? Math.round((multipleChoiceScore / multipleChoiceTotal) * 10000) / 100 : null;
  const passingScore = passingScoreForLevel(level);
  const multipleChoicePassed = multipleChoicePercent === null || passingScore === null ? null : multipleChoicePercent >= passingScore;
  const reviewRequired = questions.some((question) => isEvidenceQuestion(question));
  let scoringStatus = "manual_review_only";

  if (multipleChoicePercent !== null && passingScore !== null) {
    if (multipleChoicePassed && reviewRequired) scoringStatus = "knowledge_passed_manual_review_required";
    else if (multipleChoicePassed) scoringStatus = "knowledge_passed";
    else scoringStatus = "knowledge_failed_manual_review_required";
  } else if (reviewRequired) {
    scoringStatus = "manual_review_required";
  }

  return {
    multipleChoiceScore,
    multipleChoiceTotal,
    multipleChoicePercent,
    passingScore,
    multipleChoicePassed,
    reviewRequired,
    scoringStatus,
    submittedAt: new Date().toISOString()
  };
}

export async function fetchAiaaApplications(session: AiaaSession) {
  return restFetch<AiaaApplication[]>(
    "/rest/v1/aiaa_certification_applications?select=*&user_id=eq." + encodeFilter(session.userId) + "&order=target_level.asc,created_at.desc",
    { method: "GET" },
    session
  );
}

export async function fetchAiaaApplication(session: AiaaSession, applicationId: string) {
  const rows = await restFetch<AiaaApplication[]>(
    "/rest/v1/aiaa_certification_applications?select=*&id=eq." + encodeFilter(applicationId) + "&user_id=eq." + encodeFilter(session.userId) + "&limit=1",
    { method: "GET" },
    session
  );
  return rows[0] || null;
}

export async function fetchAiaaQuestions(level: number, session: AiaaSession) {
  return restFetch<AiaaExamQuestion[]>(
    "/rest/v1/aiaa_exam_questions?select=*&level=eq." + level + "&is_active=eq.true&order=position.asc",
    { method: "GET" },
    session
  );
}

export async function fetchAiaaExamAnswer(session: AiaaSession, applicationId: string, level: number) {
  const rows = await restFetch<AiaaExamAnswer[]>(
    "/rest/v1/aiaa_exam_answers?select=*&user_id=eq." + encodeFilter(session.userId) + "&application_id=eq." + encodeFilter(applicationId) + "&level=eq." + level + "&limit=1",
    { method: "GET" },
    session
  );
  return rows[0] || null;
}

export async function saveAiaaExamDraft(session: AiaaSession, applicationId: string, level: number, answers: Record<string, string>) {
  const [existing, application] = await Promise.all([
    fetchAiaaExamAnswer(session, applicationId, level),
    fetchAiaaApplication(session, applicationId)
  ]);
  const revisionRequired = String(application?.review_status || "").toLowerCase() === "revision_required";
  if (existing?.status === "submitted" && !revisionRequired) throw new Error("This exam has already been submitted and locked.");

  if (existing) {
    const rows = await restFetch<AiaaExamAnswer[]>(
      "/rest/v1/aiaa_exam_answers?id=eq." + encodeFilter(existing.id),
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ answers, status: "draft", locked_at: revisionRequired ? null : existing.locked_at || null })
      },
      session
    );
    return rows[0];
  }

  const rows = await restFetch<AiaaExamAnswer[]>(
    "/rest/v1/aiaa_exam_answers",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ application_id: applicationId, user_id: session.userId, level, answers, status: "draft" })
    },
    session
  );
  return rows[0];
}

export async function submitAiaaExam(session: AiaaSession, applicationId: string, level: number, answers: Record<string, string>) {
  const [existing, questions, application] = await Promise.all([
    fetchAiaaExamAnswer(session, applicationId, level),
    fetchAiaaQuestions(level, session),
    fetchAiaaApplication(session, applicationId)
  ]);
  const revisionRequired = String(application?.review_status || "").toLowerCase() === "revision_required";

  if (existing?.status === "submitted" && !revisionRequired) throw new Error("This exam has already been submitted and locked.");

  const scoring = scoreAiaaExamAnswers(level, questions || [], answers);
  const summary = {
    level,
    multipleChoiceScore: scoring.multipleChoiceScore,
    multipleChoiceTotal: scoring.multipleChoiceTotal,
    multipleChoicePercent: scoring.multipleChoicePercent,
    passingScore: scoring.passingScore,
    multipleChoicePassed: scoring.multipleChoicePassed,
    reviewRequired: scoring.reviewRequired,
    scoringStatus: scoring.scoringStatus,
    submittedAt: scoring.submittedAt
  };

  const answerBody = {
    answers,
    status: "submitted",
    submitted_at: scoring.submittedAt,
    locked_at: scoring.submittedAt,
    multiple_choice_score: scoring.multipleChoiceScore,
    multiple_choice_total: scoring.multipleChoiceTotal,
    score_percent: scoring.multipleChoicePercent,
    auto_pass: scoring.multipleChoicePassed,
    scoring_status: scoring.scoringStatus,
    scoring_summary: summary
  };

  if (existing) {
    await restFetch(
      "/rest/v1/aiaa_exam_answers?id=eq." + encodeFilter(existing.id),
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(answerBody)
      },
      session
    );
  } else {
    await restFetch(
      "/rest/v1/aiaa_exam_answers",
      {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ application_id: applicationId, user_id: session.userId, level, ...answerBody })
      },
      session
    );
  }

  await restFetch(
    "/rest/v1/aiaa_certification_applications?id=eq." + encodeFilter(applicationId) + "&user_id=eq." + encodeFilter(session.userId),
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "under_review",
        stage: "Review",
        exam_status: "submitted",
        exam_access_status: "submitted",
        review_status: "pending",
        certificate_status: "not_issued",
        exam_submitted_at: scoring.submittedAt,
        exam_locked_at: scoring.submittedAt,
        exam_multiple_choice_score: scoring.multipleChoiceScore,
        exam_multiple_choice_total: scoring.multipleChoiceTotal,
        exam_score_percent: scoring.multipleChoicePercent,
        exam_auto_pass: scoring.multipleChoicePassed,
        exam_scoring_status: scoring.scoringStatus,
        exam_review_required: scoring.reviewRequired,
        ranking_eligibility_status: "not_eligible"
      })
    },
    session
  );

  return { scoring };
}

export async function fetchAiaaNotifications(session: AiaaSession) {
  return restFetch<AiaaNotification[]>(
    "/rest/v1/aiaa_notifications?user_id=eq." + encodeFilter(session.userId) + "&order=created_at.desc",
    { method: "GET" },
    session
  );
}

export async function createAiaaNotification(session: AiaaSession, input: { type: string; title: string; message: string; link?: string }) {
  return restFetch(
    "/rest/v1/aiaa_notifications",
    {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ user_id: session.userId, ...input, is_read: false })
    },
    session
  );
}

export async function markAiaaNotificationRead(session: AiaaSession, id: string) {
  return restFetch(
    "/rest/v1/aiaa_notifications?id=eq." + encodeFilter(id) + "&user_id=eq." + encodeFilter(session.userId),
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ is_read: true, read_at: new Date().toISOString() })
    },
    session
  );
}
