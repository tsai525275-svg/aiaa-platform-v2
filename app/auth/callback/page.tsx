"use client";

import { useEffect, useState } from "react";
import { isSupabaseAuthConfigured, parseAuthCallbackFromUrl, queueAuthToast } from "@/lib/supabase/browser";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Completing sign in.");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    async function finish() {
      if (!isSupabaseAuthConfigured()) {
        setMessage("Authentication is not configured.");
        return;
      }

      try {
        const session = await parseAuthCallbackFromUrl();
        if (session?.access_token) {
          queueAuthToast("Signed in.", "success");
          setMessage("Signed in. Opening home page.");
          timer = setTimeout(() => {
            window.location.replace("/");
          }, 150);
          return;
        }

        setMessage("No active session was found. Return to sign in and try again.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to finish sign in.");
      }
    }

    finish();
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-neutral-950">
      <div className="mx-auto max-w-xl border-y border-neutral-300 py-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">AIAA Auth</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">{message}</h1>
        <a href="/login" className="mt-6 inline-flex rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold">Back to sign in</a>
      </div>
    </main>
  );
}
