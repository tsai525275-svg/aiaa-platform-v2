const fs = require('fs');
const path = require('path');

const root = process.cwd();
const searchRoots = ['app', 'components', 'lib'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs']);

const replacements = [
  ['已登入', 'Signed in'],
  ['已登出', 'Signed out'],
  ['登入成功', 'Signed in'],
  ['登出成功', 'Signed out'],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

let changed = [];
for (const folder of searchRoots) {
  const dir = path.join(root, folder);
  for (const file of walk(dir)) {
    let input = fs.readFileSync(file, 'utf8');
    let output = input;
    for (const [from, to] of replacements) {
      output = output.split(from).join(to);
    }
    if (output !== input) {
      fs.writeFileSync(file, output, 'utf8');
      changed.push(path.relative(root, file));
    }
  }
}

const targetFiles = [
  'components/site-header.tsx',
  'lib/supabase/browser.ts',
  'components/member-auth-panel.tsx',
  'components/member-dashboard.tsx',
];

for (const rel of targetFiles) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  let input = fs.readFileSync(file, 'utf8');
  let output = input;
  for (const [from, to] of replacements) {
    output = output.split(from).join(to);
  }
  if (output !== input) {
    fs.writeFileSync(file, output, 'utf8');
    if (!changed.includes(rel)) changed.push(rel);
  }
}

console.log('已將登入提示改成英文');
if (changed.length) {
  console.log('已更新檔案：');
  for (const file of changed) console.log(' - ' + file);
} else {
  console.log('沒有找到中文登入提示，可能已經是英文。');
}
console.log('接著執行 npm run build');
