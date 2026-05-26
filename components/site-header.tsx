"use client";

import { useEffect, useState } from "react";
import { consumeAuthToast, getStoredSession, queueAuthToast, signOutCurrentUser } from "@/lib/supabase/browser";

const navItems = [
  { label: "Rankings", href: "/rankings" },
  { label: "Records", href: "/registry" },
  { label: "Certification", href: "/certification" },
  { label: "Standards", href: "/standards" },
  { label: "World", href: "/world" }
];

function useSignedInState() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    function sync() {
      const session = getStoredSession();
      setSignedIn(Boolean(session?.access_token));
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("aiaa-auth-change", sync);
    window.addEventListener("focus", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("aiaa-auth-change", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return signedIn;
}

function AuthStatusToast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    function showQueuedToast() {
      const toast = consumeAuthToast();
      if (!toast?.message) return;
      setMessage(toast.message);
      setVisible(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        setVisible(false);
      }, 2000);
    }

    showQueuedToast();
    window.addEventListener("aiaa-auth-toast", showQueuedToast);
    window.addEventListener("focus", showQueuedToast);

    return () => {
      window.removeEventListener("aiaa-auth-toast", showQueuedToast);
      window.removeEventListener("focus", showQueuedToast);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed left-1/2 top-6 z-[100] -translate-x-1/2 transition duration-300 ${visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`} aria-live="polite" aria-atomic="true">
      <div className="flex items-center gap-3 rounded-full border border-emerald-200 bg-white/95 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_6px_18px_rgba(16,185,129,0.28)]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[2.7]">
            <path d="M5 12.4 9.2 16 19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const signedIn = useSignedInState();

  async function handleSignOut() {
    await signOutCurrentUser();
    queueAuthToast("Signed out.", "success");
    window.location.href = "/";
  }

  return (
    <>
      <AuthStatusToast />
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/92 shadow-[0_8px_28px_rgba(15,23,42,0.045)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] w-[min(1520px,calc(100vw-20px))] items-center justify-between gap-6 px-2 md:px-4">
          <a href="/" aria-label="AIAA Home" className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/10">
              <img src="/aiaa-logo-icon.png" alt="AIAA" className="h-9 w-9 object-contain" />
            </span>
            <div className="leading-none">
              <div className="notranslate text-[2.05rem] font-semibold tracking-[0.12em] text-slate-950" translate="no">AIAA</div>
              <div className="mt-1 hidden text-[0.64rem] uppercase tracking-[0.36em] text-slate-500 md:block">
                AI Agent Identity Authority
              </div>
            </div>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="group relative text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-slate-600 transition hover:text-[var(--aiaa-blue)]">
                {item.label}
                <span className="absolute -bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--aiaa-blue)] opacity-0 transition group-hover:opacity-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {signedIn ? (
              <>
                <a href="/member" className="hidden min-h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[var(--aiaa-blue)] hover:text-[var(--aiaa-blue)] md:inline-flex">
                  Member
                </a>
                <button type="button" onClick={handleSignOut} className="hidden min-h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-red-500 hover:text-red-600 md:inline-flex">
                  Sign out
                </button>
              </>
            ) : (
              <a href="/login" className="hidden min-h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[var(--aiaa-blue)] hover:text-[var(--aiaa-blue)] md:inline-flex">
                Sign in
              </a>
            )}
            <a href="/apply" className="aiaa-button-dark">
              Apply
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
