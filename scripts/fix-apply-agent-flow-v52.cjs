const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pagePath = path.join(root, 'app', 'apply', 'agent', 'page.tsx');
const flowPath = path.join(root, 'components', 'certification-application-flow.tsx');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) {
  fail('找不到 app/apply/agent/page.tsx');
}

if (!fs.existsSync(flowPath)) {
  fail('找不到 components/certification-application-flow.tsx。請先套用 V49 certification submit flow。');
}

const pageSource = `import { AIAAFrame, PageHero } from "@/components/aiaa-page-kit";
import { CertificationApplicationForm } from "@/components/certification-application-flow";

export default function ApplyAgentPage() {
  return (
    <AIAAFrame>
      <PageHero
        eyebrow="Apply"
        title="Submit a certification application."
        copy="Members submit evidence first. The system then tracks application, exam, review, certificate, and ranking eligibility under the same account."
        stats={[["Step 1", "application"], ["Step 2", "exam"], ["Step 3", "review"], ["Step 4", "certificate"], ["Step 5", "ranking"]]}
      />
      <CertificationApplicationForm />
    </AIAAFrame>
  );
}
`;

const previous = fs.readFileSync(pagePath, 'utf8');
fs.writeFileSync(pagePath, pageSource, 'utf8');

const hasOldSignupCopy = /建立帳戶|Create Account|Create account|Sign In|登入/.test(previous);
console.log('已更新 app\\apply\\agent\\page.tsx');
console.log('已移除申請頁中的固定建立帳戶和登入按鈕');
console.log('現在 /apply/agent 會交給 CertificationApplicationForm 判斷登入狀態');
if (hasOldSignupCopy) {
  console.log('偵測到舊版會員門文案，已用真實提交流程取代');
}
console.log('下一步請執行 npm run build');
