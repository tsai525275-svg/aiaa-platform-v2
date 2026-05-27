const fs = require("fs");
const path = require("path");

const target = path.join(process.cwd(), "lib", "supabase", "browser.ts");

if (!fs.existsSync(target)) {
  console.error("找不到檔案: lib\\supabase\\browser.ts");
  process.exit(1);
}

const source = fs.readFileSync(target, "utf8");
const marker = 'export function getAuthRedirectUrl(path = "/auth/callback")';

const start = source.indexOf(marker);
if (start === -1) {
  console.error("找不到 getAuthRedirectUrl function。");
  process.exit(1);
}

const openBrace = source.indexOf("{", start);
if (openBrace === -1) {
  console.error("找不到 function 開始大括號。");
  process.exit(1);
}

let depth = 0;
let end = -1;

for (let i = openBrace; i < source.length; i += 1) {
  const ch = source[i];

  if (ch === "{") {
    depth += 1;
  }

  if (ch === "}") {
    depth -= 1;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}

if (end === -1) {
  console.error("找不到 function 結束大括號。");
  process.exit(1);
}

const replacement = `export function getAuthRedirectUrl(path = "/auth/callback") {
  if (typeof window === "undefined") {
    return path;
  }

  const url = new URL(path, window.location.origin);

  if (path === "/auth/callback") {
    url.searchParams.set("next", "/");
  }

  return url.toString();
}`;

const updated = source.slice(0, start) + replacement + source.slice(end);

if (updated === source) {
  console.log("沒有變更。");
  process.exit(0);
}

fs.writeFileSync(target, updated, "utf8");
console.log("已更新 lib\\supabase\\browser.ts");
console.log("OAuth 會導回 /auth/callback?next=/");
