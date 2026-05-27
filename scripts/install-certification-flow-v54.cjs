const fs = require('fs');
const path = require('path');

const root = process.cwd();
const patchRoot = __dirname.endsWith('scripts') ? path.dirname(__dirname) : root;

const files = [
  ['app/apply/page.tsx', 'app/apply/page.tsx'],
  ['app/apply/agent/page.tsx', 'app/apply/agent/page.tsx']
];

for (const [from, to] of files) {
  const source = path.join(patchRoot, from);
  const target = path.join(root, to);
  if (!fs.existsSync(source)) {
    throw new Error(`Patch file not found: ${source}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`已更新 ${to}`);
}

console.log('V54 已套用：/apply 與 /apply/agent 不再顯示寫死的建立帳戶流程。');
console.log('未登入會顯示登入入口，已登入會直接顯示提交申請表。');
