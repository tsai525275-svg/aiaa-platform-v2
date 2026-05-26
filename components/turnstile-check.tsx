"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getTurnstileSiteKey } from "@/lib/supabase/browser";

type TurnstileApi = {
  render: (selector: string | HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onAIAATurnstileReady?: () => void;
  }
}

let turnstileScriptLoading = false;

function loadTurnstileScript(onReady: () => void) {
  if (typeof window === "undefined") return;

  if (window.turnstile) {
    onReady();
    return;
  }

  const previousReady = window.onAIAATurnstileReady;
  window.onAIAATurnstileReady = () => {
    previousReady?.();
    onReady();
  };

  if (turnstileScriptLoading || document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
    return;
  }

  turnstileScriptLoading = true;
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onAIAATurnstileReady&render=explicit";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export function TurnstileCheck({ onTokenChange }: { onTokenChange: (token: string) => void }) {
  const siteKey = getTurnstileSiteKey();
  const elementId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey) return;
    loadTurnstileScript(() => setReady(true));
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey || !ready || !window.turnstile || !containerRef.current || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onTokenChange(token),
      "expired-callback": () => onTokenChange(""),
      "error-callback": () => onTokenChange(""),
      theme: "light"
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, ready, siteKey]);

  if (!siteKey) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <div className="mb-3 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Human verification
      </div>
      <div id={`turnstile-${elementId}`} ref={containerRef} />
    </div>
  );
}
