const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dashboardPath = path.join(root, 'components', 'member-dashboard.tsx');

function patchMemberDashboard() {
  if (!fs.existsSync(dashboardPath)) {
    console.log('找不到 components/member-dashboard.tsx，略過會員首頁狀態接入。');
    return;
  }

  let source = fs.readFileSync(dashboardPath, 'utf8');
  const markerA = 'Certification status';
  const markerB = 'Current application';
  const a = source.indexOf(markerA);
  const b = a >= 0 ? source.indexOf(markerB, a) : -1;

  if (a < 0 || b < 0) {
    if (!source.includes('MemberApplicationSnapshot')) {
      console.log('會員首頁沒有找到舊的靜態 Certification status 區塊，請手動確認 /member。');
    } else {
      console.log('會員首頁已接入 MemberApplicationSnapshot。');
    }
    return;
  }

  const start = source.lastIndexOf('            <section', a);
  const endMarker = '            </section>';
  const end = source.indexOf(endMarker, b);

  if (start < 0 || end < 0) {
    console.log('找到舊狀態文字，但無法安全替換區塊，請手動確認 /member。');
    return;
  }

  const endIndex = end + endMarker.length;
  source = `${source.slice(0, start)}            <MemberApplicationSnapshot />\n${source.slice(endIndex)}`;

  if (!source.includes('import { MemberApplicationSnapshot } from "@/components/certification-application-flow";')) {
    const anchor = 'import { StatusPill } from "@/components/aiaa-page-kit";\n';
    if (source.includes(anchor)) {
      source = source.replace(anchor, `${anchor}import { MemberApplicationSnapshot } from "@/components/certification-application-flow";\n`);
    } else {
      source = `import { MemberApplicationSnapshot } from "@/components/certification-application-flow";\n${source}`;
    }
  }

  fs.writeFileSync(dashboardPath, source, 'utf8');
  console.log('已把會員首頁的假認證狀態改成真實 Supabase 申請狀態。');
}

patchMemberDashboard();
console.log('V53 已套用。請執行 npm run build。');
