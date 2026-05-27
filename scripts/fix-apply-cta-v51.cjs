const fs = require('fs');
const path = require('path');

const root = process.cwd();
const componentDir = path.join(root, 'components');
const componentPath = path.join(componentDir, 'apply-account-cta.tsx');
const applyPagePath = path.join(root, 'app', 'apply', 'page.tsx');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(applyPagePath)) {
  fail('找不到 app/apply/page.tsx');
}

fs.mkdirSync(componentDir, { recursive: true });

const componentSource = String.raw`"use client";

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
`;

fs.writeFileSync(componentPath, componentSource, 'utf8');

let source = fs.readFileSync(applyPagePath, 'utf8');

if (!source.includes('ApplyAccountCta')) {
  const importLine = 'import ApplyAccountCta from "@/components/apply-account-cta";\n';
  const lastImportMatch = [...source.matchAll(/^import[\s\S]*?;\s*$/gm)].pop();
  if (lastImportMatch) {
    const insertAt = lastImportMatch.index + lastImportMatch[0].length;
    source = source.slice(0, insertAt) + '\n' + importLine + source.slice(insertAt);
  } else {
    source = importLine + source;
  }
}

const patterns = [
  /<Link\b(?=[\s\S]*?href=["']\/(?:signup|login|member)["'])[^>]*>[\s\S]*?建立帳戶[\s\S]*?<\/Link>/,
  /<a\b(?=[\s\S]*?href=["']\/(?:signup|login|member)["'])[^>]*>[\s\S]*?建立帳戶[\s\S]*?<\/a>/,
  /<button\b[^>]*>[\s\S]*?建立帳戶[\s\S]*?<\/button>/,
];

let replaced = false;
for (const pattern of patterns) {
  if (pattern.test(source)) {
    source = source.replace(pattern, '<ApplyAccountCta />');
    replaced = true;
    break;
  }
}

if (!replaced) {
  const literalPatterns = [
    '建立帳戶',
    'Create account',
    'Create Account',
  ];

  for (const literal of literalPatterns) {
    const index = source.indexOf(literal);
    if (index !== -1) {
      const before = source.slice(0, index);
      const linkStart = Math.max(before.lastIndexOf('<Link'), before.lastIndexOf('<a'), before.lastIndexOf('<button'));
      const after = source.slice(index);
      const possibleEnds = [after.indexOf('</Link>'), after.indexOf('</a>'), after.indexOf('</button>')].filter((value) => value >= 0);
      const endOffset = possibleEnds.length ? Math.min(...possibleEnds) : -1;

      if (linkStart >= 0 && endOffset >= 0) {
        const endTag = after.slice(endOffset).startsWith('</Link>') ? '</Link>' : after.slice(endOffset).startsWith('</a>') ? '</a>' : '</button>';
        const end = index + endOffset + endTag.length;
        source = source.slice(0, linkStart) + '<ApplyAccountCta />' + source.slice(end);
        replaced = true;
        break;
      }
    }
  }
}

if (!replaced) {
  console.warn('沒有找到「建立帳戶」按鈕。已建立 components/apply-account-cta.tsx，但尚未自動替換 app/apply/page.tsx。');
} else {
  fs.writeFileSync(applyPagePath, source, 'utf8');
  console.log('已修正 app/apply/page.tsx 的建立帳戶按鈕。');
}

console.log('登入時會顯示「提交申請」，未登入時會顯示「登入後申請」。');
