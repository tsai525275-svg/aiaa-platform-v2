const fs = require("fs");
const path = require("path");

const root = process.cwd();
const target = path.join(root, "lib", "supabase", "aiaa-v61-client.ts");

if (!fs.existsSync(target)) {
  console.error("Missing file: lib/supabase/aiaa-v61-client.ts");
  process.exit(1);
}

let source = fs.readFileSync(target, "utf8");
const marker = "export function getStoredAiaaSession()";
const start = source.indexOf(marker);

if (start === -1) {
  console.error("Missing getStoredAiaaSession in lib/supabase/aiaa-v61-client.ts");
  process.exit(1);
}

const openBrace = source.indexOf("{", start);
let depth = 0;
let end = -1;
for (let i = openBrace; i < source.length; i += 1) {
  const ch = source[i];
  if (ch === "{") depth += 1;
  if (ch === "}") {
    depth -= 1;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}

if (end === -1) {
  console.error("Unable to locate getStoredAiaaSession function boundary.");
  process.exit(1);
}

const replacement = `export function getStoredAiaaSession(): AiaaSession | null {
  if (typeof window === "undefined") return null;

  function fromCandidate(candidate: any): AiaaSession | null {
    if (!candidate || typeof candidate !== "object") return null;

    const session = candidate.currentSession || candidate.session || candidate;
    const accessToken = session.access_token || session.accessToken;
    if (!accessToken || typeof accessToken !== "string") return null;

    const payload = decodeJwtPayload(accessToken);
    const user = session.user || candidate.user || {};
    const userId = user.id || payload?.sub || "";
    const email = user.email || payload?.email || "";
    const expiresAt = Number(session.expires_at || session.expiresAt || payload?.exp || 0) || undefined;

    if (!userId) return null;
    if (expiresAt && expiresAt * 1000 < Date.now()) return null;

    return { accessToken, userId, email, expiresAt };
  }

  const directKeys = ["aiaa-member-session"];
  for (const key of directKeys) {
    try {
      const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
      if (!raw) continue;
      const session = fromCandidate(JSON.parse(raw));
      if (session) return session;
    } catch {
      // Continue scanning other stored sessions.
    }
  }

  const storages = [window.localStorage, window.sessionStorage];
  for (const storage of storages) {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key) continue;
      const searchable = key.toLowerCase();
      if (!searchable.includes("auth") && !searchable.includes("session") && !searchable.includes("token") && !searchable.includes("aiaa") && !searchable.startsWith("sb-")) continue;

      try {
        const raw = storage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const session = fromCandidate(parsed);
        if (session) return session;
      } catch {
        continue;
      }
    }
  }

  return null;
}`;

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(target, source, "utf8");

console.log("V62 fixed V61 exam and notification auth session detection.");
console.log("The V61 pages now read the existing AIAA member session used by the header.");
console.log("Run npm run build next.");
