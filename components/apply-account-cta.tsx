"use client";

import { useEffect, useState } from "react";

function hasActiveSupabaseSession() {
  if (typeof window === "undefined") return false;

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;

      const rawValue = window.localStorage.getItem(key);
      if (!rawValue) continue;

      const parsed = JSON.parse(rawValue);
      const session = parsed?.currentSession ?? parsed;
      const accessToken = session?.access_token;
      const expiresAt = Number(session?.expires_at ?? 0);

      if (accessToken && (!expiresAt || expiresAt * 1000 > Date.now())) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

export default function ApplyAccountCta() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(hasActiveSupabaseSession());

    function onStorage() {
      setSignedIn(hasActiveSupabaseSession());
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  return (
    <a
      href={signedIn ? "/apply/agent" : "/login"}
      className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-slate-950 to-blue-700 px-8 text-base font-semibold text-white shadow-[0_20px_60px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_72px_rgba(37,99,235,0.30)]"
    >
      {signedIn ? "提交申請" : "登入後申請"}
    </a>
  );
}
