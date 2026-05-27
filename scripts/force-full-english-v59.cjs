const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), 'utf8') : null;
}

function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text, 'utf8');
  changed.add(rel);
}

function replaceAll(rel, replacements) {
  let text = read(rel);
  if (text == null) return;
  const original = text;
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  if (text !== original) write(rel, text);
}

function replaceRegex(rel, replacements) {
  let text = read(rel);
  if (text == null) return;
  const original = text;
  for (const [from, to] of replacements) {
    text = text.replace(from, to);
  }
  if (text !== original) write(rel, text);
}

const changed = new Set();

replaceAll('app/apply/agent/page.tsx', [
  ['["Identity", "Agent name、Product website、Category、Country或地區"]', '["Identity", "Agent name, product website, category, and country or region"]'],
  ['["能力", "代理人處理哪些任務、服務哪些使用user、目前Status"]', '["Capability", "Tasks handled, users served, and current operating status"]'],
  ['["證據", "GitHub Repo、README、Demo、影片、執行截圖、Flow紀錄"]', '["Evidence", "GitHub repo, README, demo, video, execution screenshots, and workflow records"]'],
  ['["安全", "權限、Data處理、限制、人工Review點、錯誤處理"]', '["Safety", "Permissions, data handling, limits, human review points, and error handling"]'],
  ['<Section compact eyebrow="Review checklist" title="Review員會檢查哪些內容？" copy="Applypage只處理真實ApplyFlow。notSign inuser會first導向Sign in，Signed inuser會directly看到Submit application表。">', '<Section compact eyebrow="Review checklist" title="What reviewers check" copy="This page handles the real application flow. Signed out users are sent to sign in first. Signed in users see the submission form directly.">'],
  ['headers={["Area", "所需Data"]}', 'headers={["Area", "Required information"]}'],
]);

replaceAll('app/apply/page.tsx', [
  ['copy: "進入Applypage。notSign inuserfirstSign in，Signed inuserdirectly提交 Level 1 ApplyData。"', 'copy: "Enter the application page. Signed out users sign in first. Signed in users submit Level 1 application data directly."'],
  ['copy: "Exam送出after進入人工Review，不會自動Approved。"', 'copy: "After exam submission, the application enters manual review. It is not approved automatically."'],
  ['title: "核發Certificate"', 'title: "Issue certificate"'],
  ['copy: "ReviewApproved且有Certificate ID after，會員page才會顯示Approved級別。"', 'copy: "The member page shows an approved level only after review approval and certificate issuance."'],
  ['title: "解鎖下一級"', 'title: "Unlock next level"'],
  ['copy: "Level 1 Approvedafter才會解鎖 Level 2。以此類推。"', 'copy: "Level 2 unlocks only after Level 1 approval. The same rule applies to each next level."'],
  ['meta: "升級"', 'meta: "Upgrade"'],
  ['<Section compact eyebrow="Status rules" title="會員看到的Status。" copy="Status全部來自 application system ApplyData表，不顯示假的ApprovedStatus。">', '<Section compact eyebrow="Status rules" title="What members see" copy="All status data comes from the application record. The site does not show fake approval states.">'],
  ['<StatusPill>新會員</StatusPill>', '<StatusPill>New member</StatusPill>'],
  ['<h3 className="mt-4 text-xl font-semibold text-neutral-950">沒有Certification。</h3>', '<h3 className="mt-4 text-xl font-semibold text-neutral-950">No certification yet.</h3>'],
  ['<p className="mt-2 text-sm leading-6 text-neutral-600">註冊會員只Create account，不會自動變 Level 1。</p>', '<p className="mt-2 text-sm leading-6 text-neutral-600">Creating an account does not grant Level 1 automatically.</p>'],
  ['<StatusPill tone="warn">Apply中</StatusPill>', '<StatusPill tone="warn">Application in progress</StatusPill>'],
  ['<h3 className="mt-4 text-xl font-semibold text-neutral-950">需要Exam和Review。</h3>', '<h3 className="mt-4 text-xl font-semibold text-neutral-950">Exam and review required.</h3>'],
  ['<p className="mt-2 text-sm leading-6 text-neutral-600">Apply提交after，會員page會顯示Exam、Review和Certificate階段。</p>', '<p className="mt-2 text-sm leading-6 text-neutral-600">After submission, the member page shows exam, review, and certificate stages.</p>'],
  ['<StatusPill tone="good">已Approved</StatusPill>', '<StatusPill tone="good">Approved</StatusPill>'],
  ['<h3 className="mt-4 text-xl font-semibold text-neutral-950">Certificate才會出現。</h3>', '<h3 className="mt-4 text-xl font-semibold text-neutral-950">Certificate appears after issuance.</h3>'],
  ['<p className="mt-2 text-sm leading-6 text-neutral-600">只有ReviewApproved且有Certificate ID 的紀錄，才顯示為CertificationApproved。</p>', '<p className="mt-2 text-sm leading-6 text-neutral-600">Only review approved records with a certificate ID display as certified.</p>'],
]);

replaceAll('components/certification-application-flow.tsx', [
  ['const label = approved || index < activeIndex ? "完成" : index === activeIndex ? "目前" : "Waiting";', 'const label = approved || index < activeIndex ? "Done" : index === activeIndex ? "Current" : "Waiting";'],
  ['{value || "not設定"}', '{value || "Not set"}'],
  ['{application.evidence_summary || "尚not填寫Evidence summary。"}', '{application.evidence_summary || "No evidence summary yet."}'],
  ['<Info label="目前階段" value={stageLabel(application.stage)} />', '<Info label="Current stage" value={stageLabel(application.stage)} />'],
  ['function AuthGate({ copy = "Sign inafter才能提交和追蹤 AIAA CertificationApply。" }: { copy?: string }) {', 'function AuthGate({ copy = "Sign in to submit and track your AIAA certification application." }: { copy?: string }) {'],
  ['<Section compact eyebrow="Member gate" title="請firstSign in會員。" copy={copy}>', '<Section compact eyebrow="Member gate" title="Sign in first." copy={copy}>'],
  ['<Link href="/signup" className="aiaa-button-light">註冊會員</Link>', '<Link href="/signup" className="aiaa-button-light">Create member account</Link>'],
  ['setState({ ...emptyState, loading: false, error: "application system 尚not設定。" });', 'setState({ ...emptyState, loading: false, error: "The application system is not configured yet." });'],
  ['const message = error instanceof Error ? error.message : "無法讀取ApplyFlow。";', 'const message = error instanceof Error ? error.message : "Unable to load the application flow.";'],
  ['if (message.includes("過期") || message.includes("JWT")) {', 'if (message.includes("expired") || message.includes("JWT")) {'],
  ['setMessage(`你必須firstApproved ${levelName(nextLevel - 1)}，才能Apply ${levelName(nextLevel)}。`);', 'setMessage(`You must be approved for ${levelName(nextLevel - 1)} before applying for ${levelName(nextLevel)}.`);'],
  ['setMessage("Agent name、GitHub Repo、README URL、Evidence summary都要填。Demo 和影片可first空著。");', 'setMessage("Agent name, GitHub repo, README URL, and evidence summary are required. Demo and video can be added later.");'],
  ['setMessage(error instanceof Error ? error.message : "Submit application失敗。請重新Sign inafter再試一次。");', 'setMessage(error instanceof Error ? error.message : "Application submission failed. Sign in again and try once more.");'],
  ['if (loading) return <Section compact><p className="text-sm text-neutral-600">正在讀取會員Status。</p></Section>;', 'if (loading) return <Section compact><p className="text-sm text-neutral-600">Loading member status.</p></Section>;'],
  ['if (authRequired) return <AuthGate copy="Sign inafter，這裡會directly顯示Submit application表，不會再顯示Create accountFlow。" />;', 'if (authRequired) return <AuthGate copy="After sign in, this page shows the application form directly." />;'],
  ['<Section compact eyebrow="Active application" title="你已有一個In progress的Apply。" copy="完成目前的Apply、Exam、Review、Certificate和RankingsFlowafter，才能開下一級。">', '<Section compact eyebrow="Active application" title="You already have an application in progress." copy="Complete the current application, exam, review, certificate, and ranking eligibility flow before starting the next level.">'],
  ['<Link href="/member/applications" className="aiaa-button-dark">查看Apply進度</Link>', '<Link href="/member/applications" className="aiaa-button-dark">View application status</Link>'],
  ['<Link href="/member/exam" className="aiaa-button-light">進入Exam</Link>', '<Link href="/member/exam" className="aiaa-button-light">Open exam</Link>'],
  ['<Section compact eyebrow="Application form" title={`提交 ${levelName(nextLevel)} Apply。`} copy="This form starts application system ApplyData表。提交after只代表進入ApplyFlow，It does not approve the application and it does not issue a certificate automatically.">', '<Section compact eyebrow="Application form" title={`Submit ${levelName(nextLevel)} application.`} copy="Submitting this form starts the application process. It does not approve the application and it does not issue a certificate automatically.">'],
  ['<h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-neutral-950">目前要提交的Apply。</h3>', '<h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-neutral-950">Current application to submit.</h3>'],
  ['<p className="mt-3 text-sm leading-7 text-neutral-600">新會員從 Level 1 Start。Approved前，不會顯示已Certification，也不會解鎖下一級。</p>', '<p className="mt-3 text-sm leading-7 text-neutral-600">New members start at Level 1. Before approval, no certification is shown and the next level stays locked.</p>'],
  ['["05", "Approvedafter才進入Rankings資格"]', '["05", "Ranking eligibility after approval"]'],
  ['{submitting ? "提交中" : "Submit application"}', '{submitting ? "Submitting" : "Submit application"}'],
  ['<Link href="/member/applications" className="aiaa-button-light">查看Apply進度</Link>', '<Link href="/member/applications" className="aiaa-button-light">View application status</Link>'],
  ['if (loading) return <Section compact><p className="text-sm text-neutral-600">正在讀取Apply紀錄。</p></Section>;', 'if (loading) return <Section compact><p className="text-sm text-neutral-600">Loading application records.</p></Section>;'],
  ['if (authRequired) return <AuthGate copy="Sign inafter才能查看自己的Apply、Exam、review and certificate status。" />;', 'if (authRequired) return <AuthGate copy="Sign in to view your application, exam, review, and certificate status." />;'],
  ['<Section compact eyebrow="Application tracker" title="尚not提交 Level 1 Apply。" copy="新會員不會自動獲得 Level 1。firstSubmit application，再Complete exam，然afterAwaiting review。">', '<Section compact eyebrow="Application tracker" title="Level 1 application not submitted yet." copy="New members do not receive Level 1 automatically. Submit an application, complete the exam, then wait for review.">'],
  ['<Link href="/apply/agent" className="aiaa-button-dark">提交 Level 1 Apply</Link>', '<Link href="/apply/agent" className="aiaa-button-dark">Submit Level 1 application</Link>'],
  ['<Section compact eyebrow="Certification status" title={approvedLevel ? `${levelName(approvedLevel)} 已Approved。` : "尚not有Approved的Certification。"} copy="只有ReviewApproved且有Certificate ID 的紀錄，才會顯示為已Certification。">', '<Section compact eyebrow="Certification status" title={approvedLevel ? `${levelName(approvedLevel)} approved.` : "No approved certification yet."} copy="Only review approved records with a certificate ID display as certified.">'],
  ['<Info label="已Approved級別" value={approvedLevel ? levelName(approvedLevel) : "None"} />', '<Info label="Approved level" value={approvedLevel ? levelName(approvedLevel) : "None"} />'],
  ['<Info label="目前Apply" value={activeApplication ? levelName(activeApplication.target_level) : "沒有In progress的Apply"} />', '<Info label="Current application" value={activeApplication ? levelName(activeApplication.target_level) : "No application in progress"} />'],
  ['<Info label="下一步" value={activeApplication ? stageLabel(activeApplication.stage) : "提交下一級Apply"} />', '<Info label="Next step" value={activeApplication ? stageLabel(activeApplication.stage) : "Submit next level application"} />'],
  ['<Section compact eyebrow="Applications" title="你的Apply紀錄。" copy="這裡讀取 application system 真實Data，不顯示假的ApprovedStatus。">', '<Section compact eyebrow="Applications" title="Your application records." copy="This page reads real application data and does not show fake approval states.">'],
  ['setMessage("Exam已Start。完成所有回答after送出Review。");', 'setMessage("Exam started. Complete all answers, then submit for review.");'],
  ['setMessage(error instanceof Error ? error.message : "無法StartExam。");', 'setMessage(error instanceof Error ? error.message : "Unable to start exam.");'],
  ['setMessage("送出前要填完所有Exam回答。");', 'setMessage("Complete all exam answers before submitting.");'],
  ['setMessage("Exam已送出。現在進入Review，不會自動核發Certificate。");', 'setMessage("Exam submitted. The application is now under review. A certificate is not issued automatically.");'],
  ['setMessage(error instanceof Error ? error.message : "送出Exam失敗。");', 'setMessage(error instanceof Error ? error.message : "Exam submission failed.");'],
  ['if (loading) return <Section compact><p className="text-sm text-neutral-600">正在讀取ExamData。</p></Section>;', 'if (loading) return <Section compact><p className="text-sm text-neutral-600">Loading exam data.</p></Section>;'],
  ['if (authRequired) return <AuthGate copy="Sign inafter才能進入你的Exam工作區。" />;', 'if (authRequired) return <AuthGate copy="Sign in to enter your exam workspace." />;'],
  ['<Section compact eyebrow="Exam" title="目前沒有Exam。" copy="first提交 Level 1 Apply，Apply紀錄建立after才會出現Exam。">', '<Section compact eyebrow="Exam" title="No exam available yet." copy="Submit a Level 1 application first. The exam appears after the application record is created.">'],
  ['<Link href="/apply/agent" className="aiaa-button-dark">提交 Level 1 Apply</Link>', '<Link href="/apply/agent" className="aiaa-button-dark">Submit Level 1 application</Link>'],
  ['<Section compact eyebrow="Exam submitted" title="已送出，Awaiting review。" copy="Review員必須檢查Exam和證據after，才會核發Certificate。">', '<Section compact eyebrow="Exam submitted" title="Submitted and awaiting review." copy="Reviewers must check the exam and evidence before a certificate is issued.">'],
  ['<Section compact eyebrow="Exam workspace" title={`${levelName(activeApplication.target_level)} Exam。`} copy="Exam送出after，Apply會進入Review。這It does not approve the application and it does not issue a certificate automatically.">', '<Section compact eyebrow="Exam workspace" title={`${levelName(activeApplication.target_level)} exam.`} copy="After exam submission, the application enters review. This does not approve the application and it does not issue a certificate automatically.">'],
  ['<Field label="架構說明">', '<Field label="Architecture explanation">'],
  ['placeholder="說明 Agent 的工作流、執行環境、Status管理和輸入輸出。"', 'placeholder="Explain the agent workflow, execution environment, state management, inputs, and outputs."'],
  ['<Field label="工具呼叫證明">', '<Field label="Tool calling evidence">'],
  ['placeholder="說明呼叫哪些 API 或工具，輸入是什麼，輸出是什麼。"', 'placeholder="Explain which APIs or tools are called, the input, and the output."'],
  ['<Field label="錯誤處理和重試邏輯">', '<Field label="Error handling and retry logic">'],
  ['placeholder="說明錯誤訊息、重試、Records、回復規則和人工介入點。"', 'placeholder="Explain error messages, retries, records, recovery rules, and human intervention points."'],
  ['<Field label="Review執行說明">', '<Field label="Reviewer runbook">'],
  ['placeholder="說明Review員如何安裝、執行、測試和驗證你的 Agent。"', 'placeholder="Explain how reviewers install, run, test, and verify your agent."'],
  ['>送出Exam並進入Review</button>', '>Submit exam for review</button>'],
  ['<Link href="/member/applications" className="aiaa-button-light">查看Apply進度</Link>', '<Link href="/member/applications" className="aiaa-button-light">View application status</Link>'],
  ['>正在讀取CertificationStatus。</section>', '>Loading certification status.</section>'],
  ['>請重新Sign in以查看CertificationStatus。</section>', '>Sign in again to view certification status.</section>'],
  ['{approvedLevel ? `${levelName(approvedLevel)} 已Approved。` : "尚not有Approved的Certification。"}', '{approvedLevel ? `${levelName(approvedLevel)} approved.` : "No approved certification yet."}'],
  ['{approvedLevel ? "Approved的Certification會顯示在會員Data、註冊紀錄、Certificate和Rankings資格中。" : "新會員不會自動得到 Level 1。必須Submit application、Complete exam、ApprovedReviewafter才會顯示。"}', '{approvedLevel ? "Approved certification appears in member data, registry records, certificates, and ranking eligibility." : "New members do not receive Level 1 automatically. Submit an application, complete the exam, and pass review first."}'],
  ['<Info label="已Approved級別" value={approvedLevel ? levelName(approvedLevel) : "None"} />', '<Info label="Approved level" value={approvedLevel ? levelName(approvedLevel) : "None"} />'],
  ['<Info label="Rankings資格" value={approvedLevel ? "WaitingRankingsReview" : "not符合"} />', '<Info label="Ranking eligibility" value={approvedLevel ? "Waiting for ranking review" : "Not eligible"} />'],
  ['>{activeApplication ? "查看Apply進度" : "提交 Level 1 Apply"}</Link>', '>{activeApplication ? "View application status" : "Submit Level 1 application"}</Link>'],
  ['{activeApplication ? `${levelName(activeApplication.target_level)}，${statusLabel(activeApplication.status)}。` : "Level 1 Apply尚not提交。"}', '{activeApplication ? `${levelName(activeApplication.target_level)}, ${statusLabel(activeApplication.status)}.` : "Level 1 application not submitted."}'],
  ['{activeApplication ? "此Status來自你的 application system Apply紀錄。" : "first提交 Level 1 Apply。提交after，這裡會顯示Apply、Exam、Review、Certificate和Rankings階段。"}', '{activeApplication ? "This status comes from your application record." : "Submit a Level 1 application first. After submission, this page shows application, exam, review, certificate, and ranking stages."}'],
]);

replaceAll('components/language-switcher.tsx', [
  ['繁中', 'ZH'],
]);

replaceAll('lib/supabase/certification.ts', [
  ['return "Sign in已過期，請重新Sign inafter再提交。";', 'return "Your sign in session has expired. Sign in again before submitting.";'],
  ['exam: "Exam中",', 'exam: "Exam in progress",'],
  ['under_review: "Review中",', 'under_review: "Under review",'],
  ['approved: "已Approved",', 'approved: "Approved",'],
  ['return labels[status || ""] ?? "not提交";', 'return labels[status || ""] ?? "Not submitted";'],
  ['throw new Error(await readError(response, "無法讀取Apply紀錄。"));', 'throw new Error(await readError(response, "Unable to load application records."));'],
  ['throw new Error(await readError(response, "Submit application失敗。"));', 'throw new Error(await readError(response, "Application submission failed."));'],
  ['throw new Error(await readError(response, "更新ApplyStatus失敗。"));', 'throw new Error(await readError(response, "Unable to update application status."));'],
]);

// Broad cleanup for hybrid text produced by earlier partial replacement scripts.
const targets = ['app', 'components', 'lib'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      walk(full, out);
    } else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

const broad = [
  ['Applypage', 'application page'],
  ['ApplyFlow', 'application flow'],
  ['ApplyData', 'application data'],
  ['Apply紀錄', 'application records'],
  ['Apply進度', 'application status'],
  ['Apply中', 'Application in progress'],
  ['Apply尚not提交', 'application not submitted'],
  ['Submit application失敗', 'Application submission failed'],
  ['Submit application表', 'application form'],
  ['Submit application', 'Submit application'],
  ['Apply後', 'after application'],
  ['Apply建立後', 'after application creation'],
  ['Apply會', 'application will'],
  ['Apply。', 'application.'],
  ['Apply', 'Application'],
  ['Sign inafter', 'After signing in'],
  ['notSign inuserfirstSign in', 'signed out users sign in first'],
  ['Signed inuserdirectly', 'signed in users directly'],
  ['firstSign in', 'sign in first'],
  ['firstSubmit', 'submit first'],
  ['first提交', 'submit first'],
  ['after', ' after '],
  ['Approvedafter', 'after approval'],
  ['ApprovedReviewafter', 'after review approval'],
  ['Reviewafter', 'after review'],
  ['Examafter', 'after exam'],
  ['afterAwaiting', 'then awaiting'],
  ['not設定', 'Not set'],
  ['尚not', 'No'],
  ['not符合', 'Not eligible'],
  ['not提交', 'Not submitted'],
  ['not有', 'No'],
  ['會員', 'Member'],
  ['資料', 'Data'],
  ['狀態', 'Status'],
  ['審核', 'Review'],
  ['考試', 'Exam'],
  ['證書', 'Certificate'],
  ['級別', 'level'],
  ['提交', 'Submit'],
  ['完成', 'Completed'],
  ['目前', 'Current'],
  ['開始', 'Start'],
  ['進入', 'Enter'],
];

const files = targets.flatMap((t) => walk(path.join(root, t)));
for (const full of files) {
  let text = fs.readFileSync(full, 'utf8');
  const original = text;
  for (const [from, to] of broad) text = text.split(from).join(to);
  // Fix code identifiers that must never be translated.
  text = text
    .replace(/isapplication systemAuthConfigured/g, 'isSupabaseAuthConfigured')
    .replace(/getapplication systemUrl/g, 'getSupabaseUrl')
    .replace(/application systemUrl/g, 'supabaseUrl')
    .replace(/application system/g, 'application system')
    .replace(/createapplication system/g, 'createSupabase')
    .replace(/application systemClient/g, 'supabaseClient');
  if (text !== original) {
    fs.writeFileSync(full, text, 'utf8');
    changed.add(path.relative(root, full));
  }
}

// Generate a remaining CJK report.
const remaining = [];
const cjk = /[\u3400-\u9FFF\uF900-\uFAFF]/;
for (const full of files) {
  const rel = path.relative(root, full);
  const text = fs.readFileSync(full, 'utf8');
  text.split(/\r?\n/).forEach((line, index) => {
    if (cjk.test(line)) remaining.push(`${rel}:${index + 1}: ${line.trim()}`);
  });
}
fs.writeFileSync(path.join(root, 'AIAA_V59_REMAINING_CJK_REPORT.txt'), remaining.join('\n'), 'utf8');

console.log('V59 full English cleanup complete.');
console.log(`Changed files: ${changed.size}`);
[...changed].sort().forEach((f) => console.log(`- ${f}`));
console.log(`Remaining CJK lines: ${remaining.length}`);
console.log('Report: AIAA_V59_REMAINING_CJK_REPORT.txt');
