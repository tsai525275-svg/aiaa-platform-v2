const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targets = ['app', 'components', 'lib'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

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

const files = targets.flatMap((target) => walk(path.join(root, target)));
const exactFixes = [
  ['isapplication systemAuthConfigured', 'isSupabaseAuthConfigured'],
  ['getapplication systemUrl', 'getSupabaseUrl'],
  ['createapplication systemClient', 'createSupabaseClient'],
  ['createapplication systemBrowserClient', 'createSupabaseBrowserClient'],
  ['application systemAuthConfigured', 'SupabaseAuthConfigured'],
  ['application systemUrl', 'SupabaseUrl'],
  ['application systemClient', 'SupabaseClient'],
];

const changed = [];

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;

  for (const [from, to] of exactFixes) {
    text = text.split(from).join(to);
  }

  text = text.replace(/([A-Za-z_$][A-Za-z0-9_$]*)application system([A-Za-z_$][A-Za-z0-9_$]*)/g, '$1Supabase$2');
  text = text.replace(/\bapplication system([A-Za-z_$][A-Za-z0-9_$]*)/g, 'Supabase$1');

  if (text !== before) {
    fs.writeFileSync(file, text, 'utf8');
    changed.push(path.relative(root, file));
  }
}

const suspicious = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/application system/.test(line) && /\b(if|const|let|function|return|await|import|export|from|new)\b|\(|\)|`|\$\{/.test(line)) {
      suspicious.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
    }
  });
}

fs.writeFileSync(path.join(root, 'AIAA_V57_APPLICATION_SYSTEM_CODE_REPORT.txt'), suspicious.join('\n'), 'utf8');

console.log('V57 build repair complete.');
console.log(`Changed files: ${changed.length}`);
changed.forEach((file) => console.log(`- ${file}`));
if (suspicious.length) {
  console.log(`Remaining suspicious application system lines: ${suspicious.length}`);
  console.log('See AIAA_V57_APPLICATION_SYSTEM_CODE_REPORT.txt');
} else {
  console.log('No suspicious application system code lines detected.');
}
