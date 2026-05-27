const fs = require("fs");
const path = require("path");

const root = process.cwd();
const file = path.join(root, "components", "oauth-hash-handler.tsx");

fs.mkdirSync(path.dirname(file), { recursive: true });

const content = `"use client";

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
          queueAuthToast("已登入", "success");
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
`;

fs.writeFileSync(file, content, "utf8");

console.log("已修正 OAuthHashHandler，不再引用 @supabase/supabase-js");
console.log("請執行 npm run build");
