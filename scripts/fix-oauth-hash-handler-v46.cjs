const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, value) {
  fs.writeFileSync(path.join(root, file), value, "utf8");
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
}

const componentFile = "components/oauth-hash-handler.tsx";
ensureDir(componentFile);

const component = `"use client";

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
`;

write(componentFile, component);

const layoutFile = "app/layout.tsx";
if (!fs.existsSync(path.join(root, layoutFile))) {
  throw new Error("找不到 app/layout.tsx");
}

let layout = read(layoutFile);

if (!layout.includes("oauth-hash-handler")) {
  const importLine = 'import { OAuthHashHandler } from "@/components/oauth-hash-handler";\n';
  const firstNonImport = layout.search(/^(?!import\s)/m);
  if (firstNonImport > -1) {
    layout = layout.slice(0, firstNonImport) + importLine + layout.slice(firstNonImport);
  } else {
    layout = importLine + layout;
  }
}

if (!layout.includes("<OAuthHashHandler />")) {
  layout = layout.replace(/(<body[^>]*>)/, "$1\n        <OAuthHashHandler />");
}

write(layoutFile, layout);

const browserFile = "lib/supabase/browser.ts";
if (fs.existsSync(path.join(root, browserFile))) {
  let browser = read(browserFile);

  const fn = `export function getAuthRedirectUrl(path = "/auth/callback") {
  if (typeof window === "undefined") {
    return path;
  }

  const url = new URL(path, window.location.origin);

  if (path === "/auth/callback") {
    url.searchParams.set("next", "/");
  }

  return url.toString();
}
`;

  const start = browser.indexOf("export function getAuthRedirectUrl(");
  if (start >= 0) {
    const nextExport = browser.indexOf("\nexport ", start + 1);
    if (nextExport >= 0) {
      browser = browser.slice(0, start) + fn + browser.slice(nextExport + 1);
    }
  }

  write(browserFile, browser);
}

const readme = `AIAA PATCH V46

Purpose
Fix production OAuth redirects that return to /#access_token instead of completing login state.

Files updated
components/oauth-hash-handler.tsx
app/layout.tsx
lib/supabase/browser.ts

What it does
Adds a global OAuth hash handler.
If Supabase returns access_token in the URL hash on any page, the handler stores the session, cleans the URL, and returns the user to the homepage.
Forces OAuth redirect target to /auth/callback?next=/ when the helper is used.

After applying
Run npm run build.
Commit and push.
Wait for Vercel Ready.
Test Google login on https://aiaaonline.org/login.
`;

write("AIAA_PATCH_V46_README.txt", readme);

console.log("已加入 OAuth hash handler");
console.log("已更新 app/layout.tsx");
console.log("已確認 OAuth redirect helper");
console.log("現在請執行 npm run build");
