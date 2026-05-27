export type AIAAProvider = "github" | "google";

export type AIAAMemberUser = {
  id?: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export type AIAASession = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  user?: AIAAMemberUser;
};

export type AIAAMemberProfileRecord = {
  id?: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  headline: string;
  summary: string;
  bio: string;
  country: string;
  city: string;
  website: string;
  github: string;
  linkedin: string;
  public_email: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AIAAMemberProfileInput = Omit<AIAAMemberProfileRecord, "id" | "created_at" | "updated_at">;

const sessionKey = "aiaa-member-session";
const authToastKey = "aiaa-auth-toast";
const profileTable = "aiaa_member_profiles";

export function isSupabaseAuthConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
}

export function isTurnstileConfigured() {
  return Boolean(getTurnstileSiteKey());
}

export function getAuthRedirectUrl(path = "/auth/callback") {
  if (typeof window === "undefined") {
    return path;
  }

  const url = new URL(path, window.location.origin);

  if (path === "/auth/callback") {
    url.searchParams.set("next", "/");
  }

  return url.toString();
}
export function getCurrentPath() {
  if (typeof window === "undefined") return "/member";
  return `${window.location.pathname}${window.location.search}`;
}

export function getLoginUrl(next = getCurrentPath()) {
  return `/login?next=${encodeURIComponent(next)}`;
}

export function getStoredSession(): AIAASession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(sessionKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AIAASession;
  } catch {
    return null;
  }
}

export function saveStoredSession(session: AIAASession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(sessionKey);
    window.dispatchEvent(new CustomEvent("aiaa-auth-change"));
    return;
  }
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("aiaa-auth-change"));
}



export type AIAAAuthToast = {
  message: string;
  tone?: "success" | "info" | "error";
};

export function queueAuthToast(message: string, tone: AIAAAuthToast["tone"] = "success") {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(authToastKey, JSON.stringify({ message, tone }));

  // Defer the event. If the caller redirects immediately after queuing the toast,
  // this timer is cancelled by navigation and the next page consumes the queued toast.
  window.setTimeout(() => {
    window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent("aiaa-auth-toast"));
  }, 80);
  }, 80);
}

export function consumeAuthToast(): AIAAAuthToast | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(authToastKey);
  if (!raw) return null;
  window.sessionStorage.removeItem(authToastKey);
  try {
    return JSON.parse(raw) as AIAAAuthToast;
  } catch {
    return { message: raw, tone: "success" };
  }
}

export async function signOutCurrentUser() {
  const session = getStoredSession();
  const accessToken = session?.access_token;

  if (accessToken && isSupabaseAuthConfigured()) {
    try {
      await fetch(`${getSupabaseUrl()}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: getSupabaseAnonKey(),
          Authorization: `Bearer ${accessToken}`
        }
      });
    } catch {
      // Local sign out still continues even if the remote logout request fails.
    }
  }

  saveStoredSession(null);
}

export function startOAuth(provider: AIAAProvider) {
  const supabaseUrl = getSupabaseUrl();
  const redirectTo = encodeURIComponent(getAuthRedirectUrl());
  window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectTo}`;
}

function extractSeconds(value: string) {
  const match = value.match(/after\s+(\d+)\s+seconds?/i);
  return match?.[1] ?? "a moment";
}

export function friendlyAuthErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error || "");
  let parsed: { msg?: string; message?: string; error_code?: string; code?: number } | null = null;

  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }

  const code = parsed?.error_code || "";
  const message = parsed?.msg || parsed?.message || raw;

  if (code === "over_email_send_rate_limit" || message.toLowerCase().includes("only request this after")) {
    return `For security, please wait ${extractSeconds(message)} before requesting another email verification code.`;
  }

  if (message.toLowerCase().includes("invalid login credentials")) {
    return "The email or password is incorrect.";
  }

  if (message.toLowerCase().includes("email not confirmed")) {
    return "Open the confirmation email first, then sign in again.";
  }

  return message && !message.trim().startsWith("{") ? message : "Unable to send the verification code. Try again in a moment.";
}

export async function sendEmailSignInLink(email: string, captchaToken?: string) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    },
    body: JSON.stringify({
      email,
      create_user: true,
      options: {
        email_redirect_to: getAuthRedirectUrl()
      },
      ...(captchaToken ? { gotrue_meta_security: { captcha_token: captchaToken } } : {})
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(friendlyAuthErrorMessage(text || "Unable to send email verification code."));
  }
}


export async function verifyEmailOtpCode(email: string, token: string) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const response = await fetch(`${supabaseUrl}/auth/v1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    },
    body: JSON.stringify({
      email,
      token,
      type: "email"
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(friendlyAuthErrorMessage(text || "Unable to verify this code."));
  }

  const payload = await response.json().catch(() => ({}));
  const accessToken = payload.access_token ?? payload.session?.access_token;
  const refreshToken = payload.refresh_token ?? payload.session?.refresh_token;
  const expiresIn = Number(payload.expires_in ?? payload.session?.expires_in ?? 3600);
  const user = (payload.user ?? payload.session?.user) as AIAAMemberUser | undefined;

  if (!accessToken) {
    throw new Error("The code was accepted, but no session was returned. Try signing in again.");
  }

  const session: AIAASession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    user
  };

  saveStoredSession(session);

  if (user?.id) {
    await ensureMemberProfile(accessToken, user);
  }

  return session;
}

export async function readUser(accessToken: string) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) return null;
  return (await response.json()) as AIAAMemberUser;
}

export async function updateAuthUserMetadata(accessToken: string, data: Record<string, unknown>) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ data })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to update auth profile.");
  }

  return (await response.json()) as AIAAMemberUser;
}

function restHeaders(accessToken?: string) {
  const anonKey = getSupabaseAnonKey();
  return {
    "Content-Type": "application/json",
    apikey: anonKey,
    Authorization: `Bearer ${accessToken || anonKey}`
  };
}

export function normalizeUsername(value: string) {
  const cleaned = value
    .toLowerCase()
    .trim()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  if (!cleaned) return "aiaa-member";
  if (cleaned.length < 3) return `${cleaned}-ai`.slice(0, 32);
  return cleaned;
}

function metadataText(user: AIAAMemberUser | null | undefined, keys: string[]) {
  const metadata = user?.user_metadata ?? {};
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function defaultProfileForUser(user: AIAAMemberUser): AIAAMemberProfileInput {
  const emailPrefix = user.email?.split("@")[0] ?? "aiaa-member";
  const displayName = metadataText(user, ["full_name", "name", "user_name", "preferred_username", "username"]) || emailPrefix || "AIAA Member";
  const username = normalizeUsername(metadataText(user, ["user_name", "preferred_username", "username"]) || emailPrefix);
  const avatarUrl = metadataText(user, ["avatar_url", "picture"]);

  return {
    user_id: user.id || "",
    username,
    display_name: displayName,
    avatar_url: avatarUrl,
    headline: "AI Agent Operator",
    summary: "Building AI Agent workflows, tools, and production review records.",
    bio: "This profile stores certification status, active applications, exam progress, certificates, and ranking eligibility.",
    country: "",
    city: "",
    website: "",
    github: "",
    linkedin: "",
    public_email: "",
    is_public: true
  };
}

export async function readOwnMemberProfile(accessToken: string, userId: string) {
  const response = await fetch(
    `${getSupabaseUrl()}/rest/v1/${profileTable}?select=*&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    {
      headers: restHeaders(accessToken),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to load member profile.");
  }

  const rows = (await response.json().catch(() => [])) as AIAAMemberProfileRecord[];
  return rows[0] ?? null;
}

export async function upsertMemberProfile(accessToken: string, profile: AIAAMemberProfileInput) {
  const cleanProfile = {
    ...profile,
    username: normalizeUsername(profile.username),
    updated_at: new Date().toISOString()
  };

  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${profileTable}?on_conflict=user_id`, {
    method: "POST",
    headers: {
      ...restHeaders(accessToken),
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(cleanProfile)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to save member profile.");
  }

  const rows = (await response.json().catch(() => [])) as AIAAMemberProfileRecord[];
  return rows[0] ?? ({ ...cleanProfile } as AIAAMemberProfileRecord);
}

export async function ensureMemberProfile(accessToken: string, user: AIAAMemberUser) {
  if (!user.id) throw new Error("Missing signed in user id.");

  const existing = await readOwnMemberProfile(accessToken, user.id);
  if (existing) return existing;

  return upsertMemberProfile(accessToken, defaultProfileForUser(user));
}

export async function readPublicMemberProfile(username: string) {
  if (!isSupabaseAuthConfigured()) return null;

  const clean = normalizeUsername(username);
  const response = await fetch(
    `${getSupabaseUrl()}/rest/v1/${profileTable}?select=*&username=eq.${encodeURIComponent(clean)}&is_public=eq.true&limit=1`,
    {
      headers: restHeaders(),
      cache: "no-store"
    }
  );

  if (!response.ok) return null;
  const rows = (await response.json().catch(() => [])) as AIAAMemberProfileRecord[];
  return rows[0] ?? null;
}



export type AIAACertificationStage = "Application" | "Exam" | "Review" | "Certificate" | "Ranking";
export type AIAACertificationStatus = "draft" | "submitted" | "exam" | "under_review" | "approved" | "rejected";

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

const certificationApplicationsTable = "aiaa_certification_applications";

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

export function stageIndex(stage?: string) {
  const stages = ["Application", "Exam", "Review", "Certificate", "Ranking"];
  const index = stages.indexOf(stage || "");
  return index >= 0 ? index : 0;
}

export function statusLabel(status?: string) {
  const labels: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    exam: "Exam in progress",
    under_review: "Under review",
    approved: "Approved",
    rejected: "Rejected"
  };
  return labels[status || ""] ?? "Not submitted";
}

export async function readOwnCertificationApplications(accessToken: string, userId: string) {
  const response = await fetch(
    `${getSupabaseUrl()}/rest/v1/${certificationApplicationsTable}?select=*&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`,
    {
      headers: restHeaders(accessToken),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to load certification applications.");
  }

  return (await response.json().catch(() => [])) as AIAACertificationApplication[];
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
  const approved = getApprovedLevel(applications);
  return Math.min(approved + 1, 5);
}

export async function createCertificationApplication(accessToken: string, input: AIAACertificationApplicationInput) {
  const payload = {
    ...input,
    target_level: Number(input.target_level || 1),
    status: "submitted" as AIAACertificationStatus,
    stage: "Application" as AIAACertificationStage,
    exam_status: "not_started",
    reviewer_status: "waiting",
    certificate_id: "",
    certificate_url: "",
    ranking_status: "not_eligible",
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${certificationApplicationsTable}`, {
    method: "POST",
    headers: {
      ...restHeaders(accessToken),
      Prefer: "return=representation"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to submit certification application.");
  }

  const rows = (await response.json().catch(() => [])) as AIAACertificationApplication[];
  return rows[0];
}

export async function updateCertificationApplication(
  accessToken: string,
  id: string,
  updates: Partial<AIAACertificationApplication>
) {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${certificationApplicationsTable}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...restHeaders(accessToken),
      Prefer: "return=representation"
    },
    body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to update certification application.");
  }

  const rows = (await response.json().catch(() => [])) as AIAACertificationApplication[];
  return rows[0];
}

export async function parseAuthCallbackFromUrl() {
  if (typeof window === "undefined") return null;

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = hashParams.get("access_token") ?? queryParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token") ?? queryParams.get("refresh_token") ?? undefined;
  const expiresIn = Number(hashParams.get("expires_in") ?? queryParams.get("expires_in") ?? 3600);

  if (!accessToken) return null;

  const user = await readUser(accessToken);
  const session: AIAASession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    user: user ?? undefined
  };

  saveStoredSession(session);

  if (user?.id) {
    await ensureMemberProfile(accessToken, user);
  }

  return session;
}
