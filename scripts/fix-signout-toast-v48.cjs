const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, "utf8");
}

function ensureImportName(source, modulePath, name) {
  const importRegex = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*["']${modulePath.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}["'];`);
  const match = source.match(importRegex);
  if (!match) return source;
  const names = match[1].split(",").map((item) => item.trim()).filter(Boolean);
  if (!names.includes(name)) names.push(name);
  const replacement = `import { ${names.join(", ")} } from "${modulePath}";`;
  return source.replace(importRegex, replacement);
}

function replaceAll(source, from, to) {
  return source.split(from).join(to);
}

// 1. Delay toast dispatch so a redirect does not consume the queued toast before the next page renders.
const browserFile = "lib/supabase/browser.ts";
let browser = read(browserFile);
const oldQueue = `export function queueAuthToast(message: string, tone: AIAAAuthToast["tone"] = "success") {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(authToastKey, JSON.stringify({ message, tone }));
  window.dispatchEvent(new CustomEvent("aiaa-auth-toast"));
}`;
const newQueue = `export function queueAuthToast(message: string, tone: AIAAAuthToast["tone"] = "success") {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(authToastKey, JSON.stringify({ message, tone }));

  // Defer the event. If the caller redirects immediately after queuing the toast,
  // this timer is cancelled by navigation and the next page consumes the queued toast.
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent("aiaa-auth-toast"));
  }, 80);
}`;
if (browser.includes(oldQueue)) {
  browser = browser.replace(oldQueue, newQueue);
} else if (browser.includes('window.dispatchEvent(new CustomEvent("aiaa-auth-toast"));')) {
  browser = browser.replace(
    'window.dispatchEvent(new CustomEvent("aiaa-auth-toast"));',
    'window.setTimeout(() => {\n    window.dispatchEvent(new CustomEvent("aiaa-auth-toast"));\n  }, 80);'
  );
}
write(browserFile, browser);

// 2. Header sign out should queue a localized sign out toast.
const headerFile = "components/site-header.tsx";
let header = read(headerFile);
header = ensureImportName(header, "@/lib/supabase/browser", "queueAuthToast");
header = replaceAll(header, 'queueAuthToast("Signed out.", "success");', 'queueAuthToast("已登出", "success");');
header = replaceAll(header, 'queueAuthToast("Signed out", "success");', 'queueAuthToast("已登出", "success");');
header = header.replace(
  /async function handleSignOut\(\) \{\s*await signOutCurrentUser\(\);\s*window\.location\.href = "\/";\s*\}/,
  `async function handleSignOut() {
    await signOutCurrentUser();
    queueAuthToast("已登出", "success");
    window.location.href = "/";
  }`
);
write(headerFile, header);

// 3. Member dashboard sign out buttons should show the same toast.
const dashboardFile = "components/member-dashboard.tsx";
if (fs.existsSync(path.join(root, dashboardFile))) {
  let dashboard = read(dashboardFile);
  dashboard = ensureImportName(dashboard, "@/lib/supabase/browser", "queueAuthToast");
  dashboard = dashboard.replace(
    /await signOutCurrentUser\(\);\s*window\.location\.href = "\/";/g,
    `await signOutCurrentUser();
    queueAuthToast("已登出", "success");
    window.location.href = "/";`
  );
  dashboard = dashboard.replace(
    /await signOutCurrentUser\(\);\s*setUser\(null\);\s*router\.push\("\/"\);/g,
    `await signOutCurrentUser();
    queueAuthToast("已登出", "success");
    setUser(null);
    router.push("/");`
  );
  write(dashboardFile, dashboard);
}

console.log("已修正登出提示。登出後會顯示『已登出』膠囊提示。");
console.log("請執行 npm run build");
