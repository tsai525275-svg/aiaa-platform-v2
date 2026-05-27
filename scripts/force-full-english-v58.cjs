const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targets = ['app', 'components', 'lib'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'public'].includes(entry.name)) continue;
      walk(full, files);
    } else if (exts.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const replacements = new Map([
  // Repair identifiers that older copy-cleanup scripts may have damaged.
  ['isapplication systemAuthConfigured', 'isSupabaseAuthConfigured'],
  ['getapplication systemUrl', 'getSupabaseUrl'],
  ['application systemAuthConfigured', 'SupabaseAuthConfigured'],
  ['application systemUrl', 'SupabaseUrl'],

  // Auth toast and header.
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
  ['登入', 'Sign in'],
  ['申請', 'Apply'],

  // Apply page hero and flow.
  ['完整Apply流程', 'Complete application flow'],
  ['完整申請流程', 'Complete application flow'],
  ['完整 Apply 流程', 'Complete application flow'],
  ['同一套流程處理未Sign in、Signed in、Apply、Exam、審核和CertificateStatus。', 'One flow handles signed out users, signed in members, applications, exams, review, and certificate status.'],
  ['同一套流程處理未 Sign in、Signed in、Apply、Exam、審核和 CertificateStatus。', 'One flow handles signed out users, signed in members, applications, exams, review, and certificate status.'],
  ['同一套流程處理未Sign in、Signed in、Apply、Exam、審核和Certificate Status。', 'One flow handles signed out users, signed in members, applications, exams, review, and certificate status.'],
  ['提交Apply', 'Submit application'],
  ['提交 Apply', 'Submit application'],
  ['進入Apply頁。未Sign in者先Sign in，Signed in者直接提交Level 1 Apply資料。', 'Open the application page. Signed out users sign in first. Signed in members submit the Level 1 application directly.'],
  ['進入 Apply 頁。未 Sign in 者先 Sign in，Signed in 者直接提交 Level 1 Apply 資料。', 'Open the application page. Signed out users sign in first. Signed in members submit the Level 1 application directly.'],
  ['Apply建立後，會員才能進入 Level 1 Exam工作區。', 'After the application is created, the member can enter the Level 1 exam workspace.'],
  ['Apply 建立後，會員才能進入 Level 1 Exam 工作區。', 'After the application is created, the member can enter the Level 1 exam workspace.'],
  ['Apply後', 'After application'],
  ['Apply 後', 'After application'],
  ['Exam後', 'After exam'],
  ['Exam 後', 'After exam'],
  ['開始', 'Start'],
  ['審核和CertificateStatus', 'review and certificate status'],
  ['審核和 CertificateStatus', 'review and certificate status'],
  ['審核和 Certificate Status', 'review and certificate status'],
  ['審核', 'Review'],

  // Apply agent page.
  ['代理應用程式', 'Agent Application'],
  ['提交一個人工智慧代理 AIAA審查。', 'Submit an AI Agent for AIAA review.'],
  ['提交一個人工智慧代理 AIAA 審查。', 'Submit an AI Agent for AIAA review.'],
  ['提交一個人工智慧', 'Submit an AI'],
  ['代理 AIAA審查。', 'Agent for AIAA review.'],
  ['代理 AIAA 審查。', 'Agent for AIAA review.'],
  ['提交表格前必須先註冊會員帳號。同一帳號將用於追蹤申請、考試、審核、證書頒發和排名資格狀態。', 'A member account is required before submitting the form. The same profile tracks application, exam, review, certificate issuance, and ranking eligibility.'],
  ['提交表格前必須先註冊會員帳號。', 'A member account is required before submitting the form.'],
  ['同一帳號將用於追蹤申請、考試、審核、證書頒發和排名資格狀態。', 'The same profile tracks application, exam, review, certificate issuance, and ranking eligibility.'],
  ['請輸入代理人和業主資訊。', 'Enter the agent and owner information.'],
  ['首次提交時務必重點突出。審閱者需要清晰的產品定位、責任人、功能聲明以及相關證據連結。', 'Keep the first submission focused. Reviewers need clear product positioning, accountable ownership, capability claims, and evidence links.'],
  ['目前要提交的申請。', 'Current application to submit.'],
  ['目前要提交的 Apply。', 'Current application to submit.'],
  ['新會員從 Level 1 開始。通過前，不會顯示已認證，也不會解鎖下一級。', 'New members start at Level 1. Before approval, no certification is shown and the next level stays locked.'],
  ['新會員從 Level 1 開始。通過前，不會顯示已 Certification，也不會解鎖下一級。', 'New members start at Level 1. Before approval, no certification is shown and the next level stays locked.'],
  ['會員門', 'Member gate'],
  ['申請表', 'Application form'],
  ['申請提交需要填寫會員資料。', 'Application submission requires a member profile.'],
  ['申請提交需要填寫會員資料', 'Application submission requires a member profile'],
  ['建立或登入AIAA首先是會員帳戶。個人資料中會儲存您的姓名、個人資料、已核准的等級、目前考試階段、審核狀態、憑證記錄和排名資格。', 'Create or sign in to an AIAA member account first. The profile stores your name, profile data, approved levels, current exam stage, review state, certificate record, and ranking eligibility.'],
  ['建立或登入 AIAA 首先是會員帳戶。個人資料中會儲存您的姓名、個人資料、已核准的等級、目前考試階段、審核狀態、憑證記錄和排名資格。', 'Create or sign in to an AIAA member account first. The profile stores your name, profile data, approved levels, current exam stage, review state, certificate record, and ranking eligibility.'],
  ['建立帳戶以提交', 'Create account to submit'],
  ['建立會員帳戶', 'Create member account'],
  ['建立帳戶', 'Create account'],
  ['會員簡介', 'Member profile'],
  ['打開會員資料', 'Open member profile'],
  ['查看等級', 'View levels'],
  ['查看申請進度', 'View application status'],
  ['查看 Apply 進度', 'View application status'],
  ['提交申請', 'Submit application'],
  ['完成考試', 'Complete exam'],
  ['等待審核', 'Awaiting review'],
  ['通過後核發證書', 'Certificate issued after approval'],
  ['通過後才進入排名資格', 'Ranking eligibility after approval'],
  ['代理人名稱', 'Agent name'],
  ['代理人姓名', 'Agent name'],
  ['類別', 'Category'],
  ['證據摘要', 'Evidence summary'],
  ['必填。可填公開 Repo 或審核用連結。', 'Required. Use a public repository or reviewer access link.'],
  ['必填。說明安裝、流程、測試方式。', 'Required. Explain setup, workflow, and testing.'],
  ['必填。寫清楚代理人會做什麼，怎麼運作，有哪些 API、工具、錯誤處理和人工審核點。', 'Required. Describe what the agent does, how it works, APIs, tools, error handling, and human review points.'],
  ['此表單會寫入 Supabase 申請資料表。提交後只代表進入申請流程，不會自動通過，也不會自動核發證書。', 'Submitting this form starts the application process. It does not approve the application and it does not issue a certificate automatically.'],
  ['此表單會寫入 Supabase 申請資料表。', 'Submitting this form starts the application process.'],
  ['不會自動通過，也不會自動核發證書。', 'It does not approve the application and it does not issue a certificate automatically.'],
  ['地位', 'Status'],
  ['狀態', 'Status'],
  ['步驟', 'Step'],
  ['代理身份', 'Agent identity'],
  ['產品網站', 'Product website'],
  ['國家/地區', 'Country or region'],
  ['國家', 'Country'],
  ['業主名稱', 'Owner name'],
  ['業主', 'Owner'],
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
  ['資料', 'Data'],
  ['流程', 'Flow'],
  ['頁', 'page'],
  ['者', 'user'],
  ['後', 'after'],
  ['未', 'not'],
  ['先', 'first'],
  ['直接', 'directly'],
]);

const files = targets.flatMap((t) => walk(path.join(root, t)));
const sorted = Array.from(replacements.entries()).sort((a, b) => b[0].length - a[0].length);
let changed = [];

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  for (const [from, to] of sorted) {
    text = text.split(from).join(to);
  }
  // Clean user-facing technology disclosures while protecting identifiers and env names.
  text = text.replace(/Supabase 申請資料表/g, 'application workflow');
  text = text.replace(/application system 申請資料表/g, 'application workflow');
  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8');
    changed.push(path.relative(root, file));
  }
}

// Search remaining CJK text. These are not auto-replaced to avoid damaging code.
const remaining = [];
const cjk = /[\u3400-\u9FFF\uF900-\uFAFF]/;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (!cjk.test(text)) continue;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!cjk.test(line)) return;
    const trimmed = line.trim();
    remaining.push(`${path.relative(root, file)}:${index + 1}: ${trimmed}`);
  });
}

const reportPath = path.join(root, 'AIAA_V58_REMAINING_CJK_REPORT.txt');
fs.writeFileSync(reportPath, remaining.join('\n'), 'utf8');

console.log('V58 full English copy sweep complete.');
console.log(`Changed files: ${changed.length}`);
changed.forEach((f) => console.log(`- ${f}`));
if (remaining.length) {
  console.log(`Remaining CJK lines: ${remaining.length}`);
  console.log('Open AIAA_V58_REMAINING_CJK_REPORT.txt and paste it back if any line is still user-facing.');
} else {
  console.log('No remaining CJK text detected in app, components, lib.');
}
