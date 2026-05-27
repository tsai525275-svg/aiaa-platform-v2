"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ensureMemberProfile, getLoginUrl, getStoredSession, isSupabaseAuthConfigured, normalizeUsername, queueAuthToast, readPublicMemberProfile, readUser, saveStoredSession, signOutCurrentUser, updateAuthUserMetadata, upsertMemberProfile, type AIAAMemberProfileRecord, type AIAAMemberUser } from "@/lib/supabase/browser";
import { StatusPill } from "@/components/aiaa-page-kit";
import { SocialActions, SocialStats } from "@/components/social-actions";
import { MemberApplicationSnapshot } from "@/components/certification-application-flow";

type SessionUser = AIAAMemberUser;

type ProfileState = {
  displayName: string;
  username: string;
  avatarUrl: string;
  headline: string;
  summary: string;
  bio: string;
  country: string;
  city: string;
  website: string;
  github: string;
  linkedin: string;
  publicEmail: string;
};

type ApplicationStage = "Application" | "Exam" | "Review" | "Certificate" | "Ranking";

const stageOrder: ApplicationStage[] = ["Application", "Exam", "Review", "Certificate", "Ranking"];

const defaultProfile: ProfileState = {
  displayName: "Member Name",
  username: "aiaa-member",
  avatarUrl: "",
  headline: "AI Agent Operator",
  summary: "Building AI Agent workflows, tools, and production review records.",
  bio: "This profile stores certification status, active applications, exam progress, certificates, and ranking eligibility.",
  country: "",
  city: "",
  website: "",
  github: "",
  linkedin: "",
  publicEmail: ""
};

const defaultApplication = {
  targetLevel: "Level 1",
  currentStage: "Application" as ApplicationStage,
  status: "Not submitted",
  publicRecord: "No approved certification yet",
  certificateId: "",
  visibility: "Private until approved"
};


function profileTargetId(profile: ProfileState) {
  return `member:${profile.username || "aiaa-member"}`;
}

const inputClass = "h-12 w-full border border-slate-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(29,78,216,0.10)]";
const textareaClass = "min-h-32 w-full resize-y border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(29,78,216,0.10)]";

function profileFromRecord(record: AIAAMemberProfileRecord | null): ProfileState {
  if (!record) return defaultProfile;

  return {
    displayName: record.display_name || defaultProfile.displayName,
    username: record.username || defaultProfile.username,
    avatarUrl: record.avatar_url || "",
    headline: record.headline || defaultProfile.headline,
    summary: record.summary || defaultProfile.summary,
    bio: record.bio || defaultProfile.bio,
    country: record.country || "",
    city: record.city || "",
    website: record.website || "",
    github: record.github || "",
    linkedin: record.linkedin || "",
    publicEmail: record.public_email || ""
  };
}

function profileToRecord(profile: ProfileState, userId: string) {
  return {
    user_id: userId,
    username: normalizeUsername(profile.username),
    display_name: profile.displayName.trim() || "AIAA Member",
    avatar_url: profile.avatarUrl,
    headline: profile.headline,
    summary: profile.summary,
    bio: profile.bio,
    country: profile.country,
    city: profile.city,
    website: profile.website,
    github: profile.github,
    linkedin: profile.linkedin,
    public_email: profile.publicEmail,
    is_public: true
  };
}

function useMemberProfile({ requireAuth = false }: { requireAuth?: boolean } = {}) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!isSupabaseAuthConfigured()) {
        if (requireAuth) {
          setAuthRequired(true);
          if (typeof window !== "undefined") {
            window.location.href = getLoginUrl(window.location.pathname);
          }
        }
        if (active) setLoading(false);
        return;
      }

      const session = getStoredSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        if (requireAuth) {
          setAuthRequired(true);
          if (typeof window !== "undefined") {
            window.location.href = getLoginUrl(window.location.pathname);
          }
        }
        if (active) setLoading(false);
        return;
      }

      try {
        const authUser = session?.user?.id ? session.user : await readUser(accessToken);
        if (!authUser?.id) {
          saveStoredSession(null);
          if (requireAuth && typeof window !== "undefined") {
            window.location.href = getLoginUrl(window.location.pathname);
          }
          if (active) {
            setAuthRequired(true);
            setLoading(false);
          }
          return;
        }

        const memberProfile = await ensureMemberProfile(accessToken, authUser);
        saveStoredSession({ access_token: accessToken, refresh_token: session?.refresh_token, expires_at: session?.expires_at, user: authUser });

        if (active) {
          setUser(authUser);
          setProfile(profileFromRecord(memberProfile));
          setLoading(false);
        }
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : "Unable to load member profile.");
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [requireAuth, router]);

  return { user, setUser, profile, setProfile, loading, authRequired, error };
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z" />
      <path d="m13.5 6 4.5 4.5" />
    </svg>
  );
}

function Avatar({ profile, initials, editable, onChange }: { profile: ProfileState; initials: string; editable?: boolean; onChange?: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="relative h-36 w-36 shrink-0">
      <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 text-4xl font-semibold text-neutral-950">
        {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Member avatar" className="h-full w-full object-cover" /> : initials}
      </div>
      {editable ? (
        <label className="absolute bottom-2 right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-blue-700 shadow-[0_10px_24px_rgba(29,78,216,0.16)] transition hover:border-blue-600 hover:bg-blue-600 hover:text-white" aria-label="Update avatar">
          <PencilIcon />
          <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
        </label>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-neutral-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 py-4 text-sm md:grid-cols-[0.34fr_0.66fr]">
      <div className="font-medium text-neutral-500">{label}</div>
      <div className="break-words font-medium text-neutral-950">{value || "Not set"}</div>
    </div>
  );
}

function LinkRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 py-4 text-sm md:grid-cols-[0.34fr_0.66fr]">
      <div className="font-medium text-neutral-500">{label}</div>
      <div className="min-w-0">
        {value ? <a href={value} target="_blank" rel="noreferrer" className="break-all font-medium text-neutral-950 underline-offset-4 hover:underline">{value}</a> : <span className="font-medium text-neutral-400">Not set</span>}
      </div>
    </div>
  );
}

function ProgressStep({ stage, index, activeIndex }: { stage: ApplicationStage; index: number; activeIndex: number }) {
  const isDone = index < activeIndex;
  const isActive = index === activeIndex;

  return (
    <div className="border border-slate-200 bg-white p-4 shadow-[0_12px_44px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="font-mono text-lg font-semibold tracking-[-0.05em] text-neutral-950">{String(index + 1).padStart(2, "0")}</div>
        {isDone ? <StatusPill tone="good">Done</StatusPill> : isActive ? <StatusPill tone="warn">Current</StatusPill> : <StatusPill>Waiting</StatusPill>}
      </div>
      <div className="mt-5 text-sm font-semibold text-neutral-950">{stage}</div>
    </div>
  );
}

function ProfileCard({ profile, user, initials }: { profile: ProfileState; user: SessionUser | null; initials: string }) {
  return (
    <aside className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start lg:block">
        <Avatar profile={profile} initials={initials} />
        <div className="min-w-0 lg:mt-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-[-0.055em] text-neutral-950">{profile.displayName || "Member Name"}</h1>
          <p className="mt-2 break-all text-base leading-7 text-neutral-500">@{profile.username || "aiaa-member"}</p>
          <p className="mt-1 text-lg leading-7 text-neutral-700">{profile.headline || "AI Agent Member"}</p>
          <p className="mt-2 break-all text-sm leading-6 text-neutral-500">{profile.publicEmail || user?.email || "No public email"}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusPill tone={user ? "good" : "warn"}>{user ? "Signed in" : "Public profile"}</StatusPill>
            <StatusPill>Not certified</StatusPill>
          </div>
          <div className="mt-5">
            <SocialStats targetId={profileTargetId(profile)} />
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-slate-200 pt-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-neutral-500">Summary</p>
        <p className="mt-3 text-base leading-7 text-neutral-800">{profile.summary || "Add a short profile summary."}</p>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-neutral-500">About</p>
        <p className="mt-3 text-sm leading-7 text-neutral-600">{profile.bio || "Add your public intro."}</p>
      </div>
    </aside>
  );
}

export function MemberProfileView() {
  const { user, profile, loading, authRequired, error } = useMemberProfile({ requireAuth: true });
  const activeIndex = defaultApplication.status === "Not submitted" ? -1 : stageOrder.indexOf(defaultApplication.currentStage);
  const profileTitle = profile.displayName || user?.email || "Member Name";
  const initials = useMemo(() => {
    const name = profile.displayName || user?.email || "Member";
    return name.slice(0, 2).toUpperCase();
  }, [profile.displayName, user?.email]);

  async function signOut() {
    await signOutCurrentUser();
    queueAuthToast("Signed out.", "success");
    window.location.href = "/";
  }

  if (loading || authRequired) {
    return <div className="mx-auto w-[min(1280px,calc(100vw-32px))] py-10 text-sm text-neutral-600">Opening sign in before member profile.</div>;
  }

  if (error) {
    return <div className="mx-auto w-[min(1280px,calc(100vw-32px))] py-10 text-sm text-neutral-600">{error}</div>;
  }

  return (
    <div className="bg-[var(--aiaa-bg)] text-neutral-950">
      <div className="mx-auto w-[min(1320px,calc(100vw-32px))] py-8 lg:py-10">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-blue-700">Member profile</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2.1rem,3.8vw,4.2rem)] font-semibold leading-[1] tracking-[-0.06em] text-neutral-950">{profileTitle}</h1>
            <p className="mt-3 break-all text-base leading-7 text-neutral-500">@{profile.username || "aiaa-member"}</p>
            <div className="mt-3">
              <SocialStats targetId={profileTargetId(profile)} />
            </div>
            <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">{profile.summary || "This page shows public profile information, certificate status, and active application stage."}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/member/profile" className="aiaa-button-dark">Edit profile</Link>
            <Link href={`/members/${profile.username || "aiaa-member"}`} className="aiaa-button-light">Public page</Link>
            <button type="button" onClick={signOut} className="aiaa-button-light">Sign out</button>
            <Link href="/member/applications" className="aiaa-button-light">Applications</Link>
            <Link href="/apply/agent" className="aiaa-button-light">Submit Agent</Link>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <ProfileCard profile={profile} user={user} initials={initials} />

          <main className="space-y-8">
            <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Profile information</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Public identity.</h2>
                </div>
                <StatusPill tone="good">Editable by member</StatusPill>
              </div>
              <div className="mt-4">
                <InfoRow label="Country" value={profile.country} />
                <InfoRow label="City" value={profile.city} />
                <LinkRow label="Website" value={profile.website} />
                <LinkRow label="GitHub" value={profile.github} />
                <LinkRow label="LinkedIn" value={profile.linkedin} />
              </div>
            </section>

            <MemberApplicationSnapshot />
          </main>
        </div>
      </div>
    </div>
  );
}

export function MemberProfileEdit() {
  const router = useRouter();
  const { user, setUser, profile, setProfile, loading, authRequired, error } = useMemberProfile({ requireAuth: true });
  const [draft, setDraft] = useState<ProfileState>(defaultProfile);
  const [message, setMessage] = useState("");
  const [configured] = useState(isSupabaseAuthConfigured());

  const initials = useMemo(() => {
    const name = draft.displayName || user?.email || "Member";
    return name.slice(0, 2).toUpperCase();
  }, [draft.displayName, user?.email]);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  function updateDraft<K extends keyof ProfileState>(key: K, value: ProfileState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateDraft("avatarUrl", reader.result);
        setMessage("Avatar selected. Save changes to update your profile.");
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    setMessage("");
    const session = getStoredSession();
    if (!configured || !session?.access_token || !user?.id) {
      router.push(getLoginUrl("/member/profile"));
      return;
    }

    try {
      const cleanDraft = { ...draft, username: normalizeUsername(draft.username) };
      const savedProfile = await upsertMemberProfile(session.access_token, profileToRecord(cleanDraft, user.id));
      setProfile(profileFromRecord(savedProfile));
      const updatedUser = await updateAuthUserMetadata(session.access_token, {
        full_name: cleanDraft.displayName,
        avatar_url: cleanDraft.avatarUrl,
        headline: cleanDraft.headline,
        summary: cleanDraft.summary,
        bio: cleanDraft.bio,
        public_bio: cleanDraft.bio,
        country: cleanDraft.country,
        city: cleanDraft.city,
        website: cleanDraft.website,
        github: cleanDraft.github,
        linkedin: cleanDraft.linkedin,
        public_email: cleanDraft.publicEmail,
        username: cleanDraft.username,
        user_name: cleanDraft.username,
        preferred_username: cleanDraft.username
      });

      saveStoredSession({ access_token: session.access_token, refresh_token: session.refresh_token, expires_at: session.expires_at, user: updatedUser });
      setUser(updatedUser);
      router.push("/member");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    }
  }

  async function signOut() {
    await signOutCurrentUser();
    queueAuthToast("Signed out.", "success");
    setUser(null);
    router.push("/");
  }

  if (loading || authRequired) {
    return <div className="mx-auto w-[min(1280px,calc(100vw-32px))] py-10 text-sm text-neutral-600">Opening sign in before editing profile.</div>;
  }

  if (error) {
    return <div className="mx-auto w-[min(1280px,calc(100vw-32px))] py-10 text-sm text-neutral-600">{error}</div>;
  }

  return (
    <div className="bg-[var(--aiaa-bg)] text-neutral-950">
      <div className="mx-auto w-[min(1320px,calc(100vw-32px))] py-8 lg:py-10">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-blue-700">Edit member profile</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2rem,3.3vw,3.5rem)] font-semibold leading-[1] tracking-[-0.055em] text-neutral-950">Update your public profile information.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">Change your avatar, name, headline, summary, intro, and public links. Nothing updates until you save.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={saveProfile} className="aiaa-button-dark">Save changes</button>
            <Link href="/member" className="aiaa-button-light">Cancel</Link>
            {user ? <button type="button" onClick={signOut} className="aiaa-button-light">Sign out</button> : <Link href="/login" className="aiaa-button-light">Sign in</Link>}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Preview</p>
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start lg:block">
              <Avatar profile={draft} initials={initials} editable onChange={handleAvatarFile} />
              <div className="min-w-0 lg:mt-6">
                <h2 className="text-4xl font-semibold leading-tight tracking-[-0.055em] text-neutral-950">{draft.displayName || "Member Name"}</h2>
                <p className="mt-2 break-all text-base leading-7 text-neutral-500">@{draft.username || "aiaa-member"}</p>
                <p className="mt-1 text-lg leading-7 text-neutral-700">{draft.headline || "AI Agent Member"}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusPill tone={user ? "good" : "warn"}>{user ? "Signed in" : "Public profile"}</StatusPill>
                  <StatusPill>Not certified</StatusPill>
                </div>
              </div>
            </div>
            <div className="mt-7 border-t border-slate-200 pt-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-neutral-500">Summary</p>
              <p className="mt-3 text-base leading-7 text-neutral-800">{draft.summary || "Add a short profile summary."}</p>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-neutral-500">Intro</p>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{draft.bio || "Add your public intro."}</p>
            </div>
          </aside>

          <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Profile form</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Editable information.</h2>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Display name">
                <input value={draft.displayName} onChange={(event) => updateDraft("displayName", event.target.value)} className={inputClass} />
              </Field>
              <Field label="Username">
                <input value={draft.username} onChange={(event) => updateDraft("username", event.target.value)} placeholder="aiaa-member" className={inputClass} />
              </Field>
              <Field label="Headline">
                <input value={draft.headline} onChange={(event) => updateDraft("headline", event.target.value)} placeholder="AI Agent Operator" className={inputClass} />
              </Field>

              <div className="md:col-span-2">
                <Field label="Profile summary">
                  <textarea value={draft.summary} onChange={(event) => updateDraft("summary", event.target.value)} placeholder="Short summary shown near your public profile header." className={textareaClass} />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Intro">
                  <textarea value={draft.bio} onChange={(event) => updateDraft("bio", event.target.value)} placeholder="Longer public intro, work focus, Agent experience, and certification context." className={textareaClass} />
                </Field>
              </div>

              <Field label="Country">
                <input value={draft.country} onChange={(event) => updateDraft("country", event.target.value)} placeholder="Vietnam, Taiwan, United States" className={inputClass} />
              </Field>
              <Field label="City">
                <input value={draft.city} onChange={(event) => updateDraft("city", event.target.value)} placeholder="City" className={inputClass} />
              </Field>
              <Field label="Website">
                <input value={draft.website} onChange={(event) => updateDraft("website", event.target.value)} placeholder="https://example.com" className={inputClass} />
              </Field>
              <Field label="GitHub">
                <input value={draft.github} onChange={(event) => updateDraft("github", event.target.value)} placeholder="https://github.com/account" className={inputClass} />
              </Field>
              <Field label="LinkedIn">
                <input value={draft.linkedin} onChange={(event) => updateDraft("linkedin", event.target.value)} placeholder="https://linkedin.com/in/account" className={inputClass} />
              </Field>
              <Field label="Public email">
                <input value={draft.publicEmail} onChange={(event) => updateDraft("publicEmail", event.target.value)} placeholder="name@example.com" className={inputClass} />
              </Field>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5 md:col-span-2">
                <button type="button" onClick={saveProfile} className="aiaa-button-dark">Save changes</button>
                <Link href="/member" className="aiaa-button-light">Cancel</Link>
                {message ? <span className="text-sm leading-6 text-neutral-600">{message}</span> : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


export function PublicMemberProfile({ username }: { username: string }) {
  const [shownProfile, setShownProfile] = useState<ProfileState | null>(null);
  const [ownUsername, setOwnUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const normalized = normalizeUsername(decodeURIComponent(username || ""));

  useEffect(() => {
    let active = true;

    async function loadPublicProfile() {
      if (!isSupabaseAuthConfigured()) {
        if (active) {
          setError("Supabase is not configured.");
          setLoading(false);
        }
        return;
      }

      try {
        const record = await readPublicMemberProfile(normalized);
        const session = getStoredSession();
        const accessToken = session?.access_token;
        let currentUser = session?.user ?? null;
        if (accessToken && !currentUser?.id) {
          currentUser = await readUser(accessToken);
        }
        if (accessToken && currentUser?.id) {
          const ownRecord = await ensureMemberProfile(accessToken, currentUser);
          if (active) setOwnUsername(ownRecord.username || "");
        }

        if (active) {
          if (record) {
            setShownProfile(profileFromRecord(record));
          } else {
            setShownProfile(null);
          }
          setLoading(false);
        }
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : "Unable to load public member profile.");
          setLoading(false);
        }
      }
    }

    loadPublicProfile();
    return () => {
      active = false;
    };
  }, [normalized]);

  const initials = useMemo(() => {
    const name = shownProfile?.displayName || shownProfile?.username || "Member";
    return name.slice(0, 2).toUpperCase();
  }, [shownProfile?.displayName, shownProfile?.username]);

  if (loading) {
    return <div className="mx-auto w-[min(1280px,calc(100vw-32px))] py-10 text-sm text-neutral-600">Loading public profile.</div>;
  }

  if (error) {
    return <div className="mx-auto w-[min(1280px,calc(100vw-32px))] py-10 text-sm text-neutral-600">{error}</div>;
  }

  if (!shownProfile) {
    return (
      <div className="mx-auto w-[min(1280px,calc(100vw-32px))] py-16 text-neutral-950">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Public member</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Profile not found.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600">This username has no public AIAA member profile yet.</p>
        <Link href="/signup" className="aiaa-button-dark mt-6">Create member account</Link>
      </div>
    );
  }

  const isOwnProfile = ownUsername.toLowerCase() === shownProfile.username.toLowerCase();

  return (
    <div className="bg-[var(--aiaa-bg)] text-neutral-950">
      <div className="mx-auto w-[min(1320px,calc(100vw-32px))] py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <ProfileCard profile={shownProfile} user={null} initials={initials} />
          <main className="space-y-8">
            <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
              <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Public member</p>
                  <h1 className="mt-3 text-[clamp(2.4rem,4vw,4.4rem)] font-semibold leading-[1] tracking-[-0.06em] text-neutral-950">{shownProfile.displayName}</h1>
                  <p className="mt-3 break-all text-base leading-7 text-neutral-500">@{shownProfile.username}</p>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">{shownProfile.summary}</p>
                </div>
                {isOwnProfile ? <Link href="/member/profile" className="aiaa-button-dark">Edit profile</Link> : <SocialActions targetId={profileTargetId(shownProfile)} targetName={shownProfile.displayName} targetType="profile" />}
              </div>
              <div className="mt-6">
                <InfoRow label="Headline" value={shownProfile.headline} />
                <InfoRow label="About" value={shownProfile.bio} />
                <InfoRow label="Country" value={shownProfile.country} />
                <InfoRow label="City" value={shownProfile.city} />
                <LinkRow label="Website" value={shownProfile.website} />
                <LinkRow label="GitHub" value={shownProfile.github} />
                <LinkRow label="LinkedIn" value={shownProfile.linkedin} />
              </div>
            </section>

            <section className="border border-slate-200 bg-white p-6 shadow-[0_18px_70px_rgba(15,23,42,0.055)] lg:p-7">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">Credential signals</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">No approved certification yet.</h2>
              <div className="mt-5">
                <InfoRow label="Approved level" value="None" />
                <InfoRow label="Current application" value="Not submitted" />
                <InfoRow label="Certificate" value="Not issued" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export function MemberDashboard() {
  return <MemberProfileView />;
}
