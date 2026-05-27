"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStoredSession, getSupabaseAnonKey, getSupabaseUrl, isSupabaseAuthConfigured } from "@/lib/supabase/browser";

type SocialTargetType = "profile" | "ranking" | "repository" | "builder";

type SocialRecord = {
  following: boolean;
  liked: boolean;
  followers: number;
  likes: number;
};

const FOLLOW_TABLE = "aiaa_social_follows";
const LIKE_TABLE = "aiaa_social_likes";

function emptyRecord(): SocialRecord {
  return {
    following: false,
    liked: false,
    followers: 0,
    likes: 0
  };
}

function filterValue(value: string) {
  return encodeURIComponent(value);
}

function parseCount(response: Response, rows: unknown) {
  const contentRange = response.headers.get("content-range") ?? "";
  const match = contentRange.match(/\/(\d+)$/);
  if (match) return Number(match[1]);
  if (Array.isArray(rows)) return rows.length;
  return 0;
}

function formatCompact(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

function getCurrentPath() {
  if (typeof window === "undefined") return "/member";
  return `${window.location.pathname}${window.location.search}`;
}

function sendToLogin() {
  if (typeof window === "undefined") return;
  const next = encodeURIComponent(getCurrentPath());
  window.location.href = `/login?next=${next}`;
}

function getAuthState() {
  const session = getStoredSession();
  const accessToken = session?.access_token;
  const userId = session?.user?.id;
  return { session, accessToken, userId };
}

async function readCount(table: string, targetType: SocialTargetType, targetKey: string) {
  if (!isapplication systemAuthConfigured()) return 0;

  const response = await fetch(
    `${getapplication systemUrl()}/rest/v1/${table}?select=id&target_type=eq.${filterValue(targetType)}&target_key=eq.${filterValue(targetKey)}`,
    {
      headers: {
        apikey: getapplication systemAnonKey(),
        Authorization: `Bearer ${getapplication systemAnonKey()}`,
        Prefer: "count=exact"
      },
      cache: "no-store"
    }
  );

  if (!response.ok) return 0;
  const rows = await response.json().catch(() => []);
  return parseCount(response, rows);
}

async function readMine(table: string, targetType: SocialTargetType, targetKey: string, userId?: string) {
  if (!isapplication systemAuthConfigured() || !userId) return false;

  const response = await fetch(
    `${getapplication systemUrl()}/rest/v1/${table}?select=id&user_id=eq.${filterValue(userId)}&target_type=eq.${filterValue(targetType)}&target_key=eq.${filterValue(targetKey)}&limit=1`,
    {
      headers: {
        apikey: getapplication systemAnonKey(),
        Authorization: `Bearer ${getapplication systemAnonKey()}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) return false;
  const rows = await response.json().catch(() => []);
  return Array.isArray(rows) && rows.length > 0;
}

async function createAction(table: string, targetType: SocialTargetType, targetKey: string, targetName: string) {
  const { accessToken, userId } = getAuthState();

  if (!isapplication systemAuthConfigured() || !accessToken || !userId) {
    throw new Error("SIGN_IN_REQUIRED");
  }

  const response = await fetch(
    `${getapplication systemUrl()}/rest/v1/${table}?on_conflict=user_id,target_type,target_key`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: getapplication systemAnonKey(),
        Authorization: `Bearer ${accessToken}`,
        Prefer: "resolution=ignore-duplicates,return=minimal"
      },
      body: JSON.stringify({
        user_id: userId,
        target_type: targetType,
        target_key: targetKey,
        target_name: targetName
      })
    }
  );

  if (!response.ok && response.status !== 409) {
    const text = await response.text();
    throw new Error(text || "Unable to save action.");
  }
}

async function removeAction(table: string, targetType: SocialTargetType, targetKey: string) {
  const { accessToken, userId } = getAuthState();

  if (!isapplication systemAuthConfigured() || !accessToken || !userId) {
    throw new Error("SIGN_IN_REQUIRED");
  }

  const response = await fetch(
    `${getapplication systemUrl()}/rest/v1/${table}?user_id=eq.${filterValue(userId)}&target_type=eq.${filterValue(targetType)}&target_key=eq.${filterValue(targetKey)}`,
    {
      method: "DELETE",
      headers: {
        apikey: getapplication systemAnonKey(),
        Authorization: `Bearer ${accessToken}`,
        Prefer: "return=minimal"
      }
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to remove action.");
  }
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={filled ? "h-4 w-4 fill-current" : "h-4 w-4 fill-none stroke-current stroke-[2]"}>
      <path d="M12 20.5 4.8 13.9C1.2 10.6 3.4 4.5 8.2 4.5c1.6 0 3 .8 3.8 2 .8-1.2 2.2-2 3.8-2 4.8 0 7 6.1 3.4 9.4L12 20.5Z" />
    </svg>
  );
}

function UserPlusIcon({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M15 20a6 6 0 0 0-12 0" />
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      {active ? <path d="m16 11 2 2 4-5" /> : <><path d="M18 8v6" /><path d="M15 11h6" /></>}
    </svg>
  );
}

export function SocialActions({
  targetId,
  targetName,
  targetType = "profile",
  compact = false
}: {
  targetId: string;
  targetName: string;
  targetType?: SocialTargetType;
  initialFollowers?: number;
  initialLikes?: number;
  compact?: boolean;
}) {
  const [record, setRecord] = useState<SocialRecord>(() => emptyRecord());
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const label = useMemo(() => {
    if (targetType === "repository") return "repository";
    if (targetType === "builder") return "builder";
    if (targetType === "ranking") return "record";
    return "member";
  }, [targetType]);

  const refresh = useCallback(async () => {
    const { userId } = getAuthState();
    const [followers, likes, following, liked] = await Promise.all([
      readCount(FOLLOW_TABLE, targetType, targetId),
      readCount(LIKE_TABLE, targetType, targetId),
      readMine(FOLLOW_TABLE, targetType, targetId, userId),
      readMine(LIKE_TABLE, targetType, targetId, userId)
    ]);
    setRecord({ followers, likes, following, liked });
  }, [targetId, targetType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function toggleFollow() {
    setMessage("");
    const { accessToken, userId } = getAuthState();

    if (!isapplication systemAuthConfigured() || !accessToken || !userId) {
      setMessage("Sign in to follow.");
      sendToLogin();
      return;
    }

    const previous = record;
    const nextFollowing = !record.following;
    setRecord({
      ...record,
      following: nextFollowing,
      followers: Math.max(0, record.followers + (nextFollowing ? 1 : -1))
    });
    setBusy(true);

    try {
      if (previous.following) {
        await removeAction(FOLLOW_TABLE, targetType, targetId);
      } else {
        await createAction(FOLLOW_TABLE, targetType, targetId, targetName);
      }
      await refresh();
    } catch (error) {
      setRecord(previous);
      setMessage(error instanceof Error && error.message !== "SIGN_IN_REQUIRED" ? error.message : "Sign in to follow.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleLike() {
    setMessage("");
    const { accessToken, userId } = getAuthState();

    if (!isapplication systemAuthConfigured() || !accessToken || !userId) {
      setMessage("Sign in to like.");
      sendToLogin();
      return;
    }

    const previous = record;
    const nextLiked = !record.liked;
    setRecord({
      ...record,
      liked: nextLiked,
      likes: Math.max(0, record.likes + (nextLiked ? 1 : -1))
    });
    setBusy(true);

    try {
      if (previous.liked) {
        await removeAction(LIKE_TABLE, targetType, targetId);
      } else {
        await createAction(LIKE_TABLE, targetType, targetId, targetName);
      }
      await refresh();
    } catch (error) {
      setRecord(previous);
      setMessage(error instanceof Error && error.message !== "SIGN_IN_REQUIRED" ? error.message : "Sign in to like.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "flex flex-wrap items-center gap-3"} aria-label={`Social actions for ${targetName}`}>
      <button
        type="button"
        onClick={toggleFollow}
        aria-pressed={record.following}
        disabled={busy}
        className={record.following ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-950 bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-80" : "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-wait disabled:opacity-80"}
      >
        <UserPlusIcon active={record.following} />
        <span>{record.following ? "Following" : `Follow ${label}`}</span>
      </button>
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={record.liked}
        disabled={busy}
        className={record.liked ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition hover:border-rose-500 disabled:cursor-wait disabled:opacity-80" : "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-wait disabled:opacity-80"}
      >
        <HeartIcon filled={record.liked} />
        <span>{record.liked ? "Liked" : "Like"}</span>
      </button>
      <div className="flex min-h-11 items-center gap-4 rounded-full border border-neutral-200 bg-white px-5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
        <span>{formatCompact(record.followers)} followers</span>
        <span>{formatCompact(record.likes)} likes</span>
      </div>
      {message ? <p className="basis-full text-sm text-neutral-500">{message}</p> : null}
    </div>
  );
}

export function SocialStats({
  targetId,
  targetType = "profile"
}: {
  targetId: string;
  targetType?: SocialTargetType;
  initialFollowers?: number;
  initialLikes?: number;
}) {
  const [record, setRecord] = useState<SocialRecord>(() => emptyRecord());

  useEffect(() => {
    let active = true;
    async function load() {
      const [followers, likes] = await Promise.all([
        readCount(FOLLOW_TABLE, targetType, targetId),
        readCount(LIKE_TABLE, targetType, targetId)
      ]);
      if (active) setRecord({ followers, likes, following: false, liked: false });
    }
    load();
    return () => {
      active = false;
    };
  }, [targetId, targetType]);

  return (
    <div className="flex flex-wrap gap-5 text-sm text-neutral-600">
      <span><strong className="font-semibold text-neutral-950">{formatCompact(record.followers)}</strong> followers</span>
      <span><strong className="font-semibold text-neutral-950">{formatCompact(record.likes)}</strong> likes</span>
    </div>
  );
}
