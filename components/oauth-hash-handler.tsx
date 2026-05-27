"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const authError = params.get("error_description") || params.get("error");

    if (authError) {
      window.history.replaceState(null, "", window.location.pathname || "/");
      return;
    }

    if (!accessToken || !refreshToken) {
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const nextPath = getSafeNext();

    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then(({ error }) => {
        if (error) {
          window.history.replaceState(null, "", window.location.pathname || "/");
          return;
        }

        try {
          window.localStorage.setItem("aiaa-auth-toast", "signed-in");
        } catch {}

        window.history.replaceState(null, "", nextPath);
        window.dispatchEvent(new Event("aiaa-auth-changed"));
        window.location.replace(nextPath);
      });
  }, []);

  return null;
}
