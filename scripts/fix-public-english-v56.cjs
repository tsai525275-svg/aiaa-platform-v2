const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targets = ['app', 'components', 'lib'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);

const replacements = [
  ['已登入', 'Signed in'],
  ['已登出', 'Signed out'],
  ['登入成功', 'Signed in'],
  ['登出成功', 'Signed out'],
  ['AI 代理身份權威', 'AI Agent Identity Authority'],
  ['AI代理身份權威', 'AI Agent Identity Authority'],
  ['排名', 'Rankings'],
  ['記錄', 'Records'],
  ['認證', 'Certification'],
  ['標準', 'Standards'],
  ['世界', 'World'],
  ['成員', 'Member'],
  ['登出', 'Sign out'],
  ['申請', 'Apply'],
  ['代理應用程式', 'Agent Application'],
  ['目前要提交的申請。', 'Current application to submit.'],
  ['新會員從 Level 1 開始。通過前，不會顯示已認證，也不會解鎖下一級。', 'New members start at Level 1. Before approval, no certification is shown and the next level stays locked.'],
  ['步驟', 'Step'],
  ['狀態', 'Status'],
  ['提交申請', 'Submit application'],
  ['完成考試', 'Complete exam'],
  ['等待審核', 'Awaiting review'],
  ['通過後核發證書', 'Certificate issued after approval'],
  ['通過後才進入排名資格', 'Ranking eligibility after approval'],
  ['代理人名稱', 'Agent name'],
  ['代理人姓名', 'Agent name'],
  ['類別', 'Category'],
  ['證據摘要', 'Evidence summary'],
  ['必填。可填公開 Repo 或審核用連結。', 'Required. Use a public repository or a reviewer access link.'],
  ['必填。說明安裝、流程、測試方式。', 'Required. Explain setup, workflow, and testing.'],
  ['必填。寫清楚代理人會做什麼，怎麼運作，有哪些 API、工具、錯誤處理和人工審核點。', 'Required. Describe what the agent does, how it works, APIs, tools, error handling, and human review points.'],
  ['查看申請進度', 'View application status'],
  ['此表單會寫入 Supabase 申請資料表。提交後只代表進入申請流程，不會自動通過，也不會自動核發證書。', 'Submitting this form starts the application process. It does not approve the application and it does not issue a certificate automatically.'],
  ['此表單會寫入 Supabase 申請資料表。', 'Submitting this form starts the application process.'],
  ['不會自動通過，也不會自動核發證書。', 'It does not approve the application and it does not issue a certificate automatically.'],
  ['提交一個人工智慧', 'Submit an AI'],
  ['代理 AIAA審查。', 'Agent for AIAA review.'],
  ['提交一個人工智慧代理 AIAA審查。', 'Submit an AI Agent for AIAA review.'],
  ['請輸入代理人和業主資訊。', 'Enter the agent and owner information.'],
  ['申請表', 'Application form'],
  ['會員門', 'Member gate'],
  ['申請提交需要填寫會員資料。', 'Application submission requires a member profile.'],
  ['建立或登入AIAA首先是會員帳戶。個人資料中會儲存您的姓名、個人資料、已核准的等級、目前考試階段、審核狀態、憑證記錄和排名資格。', 'Create or sign in to an AIAA member account first. The profile stores your name, profile data, approved levels, current exam stage, review status, certificate record, and ranking eligibility.'],
  ['建立帳戶', 'Create account'],
  ['建立會員帳戶', 'Create member account'],
  ['登入', 'Sign in'],
  ['會員簡介', 'Member profile'],
  ['地位', 'Status'],
  ['代理身份', 'Agent identity'],
  ['產品網站', 'Product website'],
  ['國家', 'Country'],
  ['業主', 'Owner'],
  ['業主名稱', 'Owner name'],
  ['擁有者', 'Owner'],
  ['負責人', 'Responsible owner'],
  ['公司', 'Company'],
  ['聯絡信箱', 'Contact email'],
  ['證據鏈接', 'Evidence links'],
  ['證據連結', 'Evidence links'],
  ['說明文件 URL', 'Documentation URL'],
  ['影片 URL', 'Video URL'],
  ['審核清單', 'Review checklist'],
  ['評論員會檢查哪些內容？', 'What will reviewers check?'],
  ['審查應將公開聲明與私人證據區分開來。公共登記冊應僅顯示經批准的身份和認證資訊。', 'Review separates public claims from private evidence. Public records should only show approved identity and certification information.'],
  ['區域', 'Area'],
  ['所需資訊', 'Required information'],
  ['身份', 'Identity'],
  ['擁有者', 'Owner'],
  ['代理商名稱、產品網站、類別、國家/地區', 'Agent name, product website, category, country or region'],
  ['負責人、公司、聯絡信箱', 'Responsible owner, company, contact email'],
  ['一級入門', 'Level 1 entry'],
  ['草稿', 'Draft'],
  ['批准後登記', 'Registry after approval'],
  ['預設啟動', 'Default start'],
  ['必需的', 'Required'],
  ['受到推薦的', 'Recommended'],
  ['經審查', 'After review'],
  ['經批准後', 'After approval'],
  ['評論員', 'Reviewers'],
  ['審查', 'Review'],
  ['通過', 'Approved'],
  ['沒通過', 'Rejected'],
  ['補件', 'Revision required'],
  ['考試', 'Exam'],
  ['證書', 'Certificate'],
  ['核發證書', 'Issue certificate'],
  ['等待', 'Waiting'],
  ['已提交', 'Submitted'],
  ['未開始', 'Not started'],
  ['進行中', 'In progress'],
  ['已完成', 'Completed'],
  ['已核發', 'Issued'],
  ['未核發', 'Not issued'],
  ['申請進度', 'Application status'],
  ['查看等級', 'View levels'],
  ['打開會員資料', 'Open member profile'],
  ['建立帳戶以提交', 'Create account to submit'],
  ['申請提交需要填寫會員資料', 'Application submission requires a member profile'],
  ['提交表格前必須先註冊會員帳號。同一帳號將用於追蹤申請、考試、審核、證書頒發和排名資格狀態。', 'A member account is required before the form is submitted. The same profile tracks application, exam, review, certificate, and ranking eligibility states.'],
  ['首次提交時務必重點突出。審閱者需要清晰的產品定位、責任人、功能聲明以及相關證據連結。', 'Keep the first submission focused. Reviewers need clear product positioning, accountable ownership, capability claims, and evidence links.'],
  ['此表單會寫入', 'This form starts'],
  ['申請資料表', 'the application process'],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      walk(full, files);
    } else if (exts.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const files = targets.flatMap((t) => walk(path.join(root, t)));
let changed = [];

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  // Remove public technology disclosure in user-facing copy without touching code identifiers.
  text = text.replace(/Supabase 申請資料表/g, 'application workflow');
  text = text.replace(/Supabase/g, (m, offset, str) => {
    const before = str.slice(Math.max(0, offset - 80), offset);
    const after = str.slice(offset, offset + 120);
    if (/NEXT_PUBLIC_|createSupabase|supabase|SUPABASE|env|process\.env|from\(|\.rpc|\.auth/.test(before + after)) return m;
    return 'application system';
  });
  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8');
    changed.push(path.relative(root, file));
  }
}

const remaining = [];
const cjk = /[\u3400-\u9FFF\uF900-\uFAFF]/;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (!cjk.test(text)) continue;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (cjk.test(line)) {
      remaining.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
    }
  });
}

fs.writeFileSync(path.join(root, 'AIAA_V56_REMAINING_CJK_REPORT.txt'), remaining.join('\n'), 'utf8');

console.log('V56 English public copy cleanup complete.');
console.log(`Changed files: ${changed.length}`);
changed.forEach((f) => console.log(`- ${f}`));
if (remaining.length) {
  console.log(`Remaining Chinese/Japanese/Korean text lines: ${remaining.length}`);
  console.log('See AIAA_V56_REMAINING_CJK_REPORT.txt');
} else {
  console.log('No remaining CJK text detected in app, components, lib.');
}
