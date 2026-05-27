"use client";

import { useEffect } from "react";
import { parseAuthCallbackFromUrl, queueAuthToast } from "@/lib/supabase/browser";

function getSafeNext() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && next.startsWith("/")) {
    return next;
  }
  return "/";
}

export function OAuthHashHandler() {
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash || !hash.includes("access_token=")) {
      return;
    }

    let cancelled = false;

    async function completeHashLogin() {
      const nextPath = getSafeNext();

      try {
        const session = await parseAuthCallbackFromUrl();

        if (cancelled) {
          return;
        }

        window.history.replaceState(null, "", nextPath);

        if (session?.access_token) {
          queueAuthToast("Signed in", "success");
          window.dispatchEvent(new CustomEvent("aiaa-auth-change"));
          window.location.replace(nextPath);
        }
      } catch {
        if (!cancelled) {
          window.history.replaceState(null, "", window.location.pathname || "/");
        }
      }
    }

    completeHashLogin();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
