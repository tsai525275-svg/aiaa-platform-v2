const fs = require('fs');
const path = require('path');

const root = process.cwd();
const required = [
  'app/member/exam/page.tsx',
  'app/member/exam/[level]/page.tsx',
  'app/member/notifications/page.tsx',
  'components/aiaa-v61-exam-center.tsx',
  'components/aiaa-v61-exam-workspace.tsx',
  'components/aiaa-v61-notifications.tsx',
  'lib/supabase/aiaa-v61-client.ts',
  'supabase/aiaa-exams-notifications-v1.sql'
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('V61 install check failed. Missing files:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log('V61 files are installed.');
console.log('Next steps:');
console.log('1. Run npm run build');
console.log('2. Run supabase/aiaa-exams-notifications-v1.sql in Supabase SQL Editor');
console.log('3. Test /member/exam and /member/notifications');
