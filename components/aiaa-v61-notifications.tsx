"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AiaaNotification,
  fetchAiaaNotifications,
  getStoredAiaaSession,
  isAiaaV61SupabaseReady,
  markAiaaNotificationRead
} from "@/lib/supabase/aiaa-v61-client";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AiaaV61Notifications() {
  const [items, setItems] = useState<AiaaNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!isAiaaV61SupabaseReady()) {
        setMessage("Authentication is not configured yet.");
        setLoading(false);
        return;
      }
      const session = getStoredAiaaSession();
      if (!session) {
        setMessage("Sign in to view member notifications.");
        setLoading(false);
        return;
      }
      try {
        const rows = await fetchAiaaNotifications(session);
        setItems(rows || []);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const unreadCount = useMemo(() => items.filter((item) => !item.is_read).length, [items]);

  async function markRead(id: string) {
    const session = getStoredAiaaSession();
    if (!session) return;
    setItems((current) => current.map((item) => item.id === id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item));
    try {
      await markAiaaNotificationRead(session, id);
    } catch {
      // local optimistic update is enough for the MVP view
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-neutral-950">
      <section className="border-b border-slate-200 bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs font-semibold uppercase tracking-[0.38em] text-blue-700">AIAA Notifications</div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <h1 className="text-6xl font-semibold tracking-[-0.07em] md:text-8xl">AIAA Notifications</h1>
            <p className="text-lg leading-8 text-neutral-600">Application, exam, review, certificate, and ranking status updates appear here. Email delivery can be connected later from the control panel.</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-3 border border-slate-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.055)] md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Inbox</div>
              <p className="mt-2 text-sm text-neutral-600">{unreadCount} unread notification{unreadCount === 1 ? "" : "s"}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/member/applications" className="aiaa-button-light">Applications</Link>
              <Link href="/member/exam" className="aiaa-button-dark">Exams</Link>
            </div>
          </div>

          {loading ? <div className="border border-slate-200 bg-white p-6 text-sm text-neutral-600">Loading notifications.</div> : null}
          {!loading && message ? <div className="border border-slate-200 bg-white p-6 text-sm text-neutral-600">{message}</div> : null}
          {!loading && !message && !items.length ? <div className="border border-slate-200 bg-white p-6 text-sm text-neutral-600">No notifications yet.</div> : null}

          <div className="flex flex-col gap-4">
            {!loading && !message ? items.map((item) => (
              <div key={item.id} className={`border p-6 shadow-[0_18px_70px_rgba(15,23,42,0.045)] ${item.is_read ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50"}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{item.type.replace(/_/g, " ")} · {formatDate(item.created_at)}</div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">{item.title}</h2>
                    <p className="mt-2 max-w-4xl text-sm leading-7 text-neutral-600">{item.message}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    {item.link ? <Link href={item.link} className="aiaa-button-light">Open</Link> : null}
                    {!item.is_read ? <button type="button" onClick={() => markRead(item.id)} className="aiaa-button-dark">Mark read</button> : null}
                  </div>
                </div>
              </div>
            )) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
