const fs = require('fs');
const path = require('path');

const root = process.cwd();
const patchDir = path.join(root, 'patch');
const workspaceFile = path.join(root, 'components', 'aiaa-v61-exam-workspace.tsx');

function rmDir(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`Removed ${path.relative(root, p)}`);
  } else {
    console.log(`No ${path.relative(root, p)} directory found`);
  }
}

function fixWorkspaceType(file) {
  if (!fs.existsSync(file)) {
    console.log(`Skipped missing ${path.relative(root, file)}`);
    return;
  }

  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  // Keep the real workspace typed correctly. This prevents string literal widening
  // from turning "url" | "textarea" | "text" into plain string.
  src = src.replace(/const common\s*=\s*\[/, 'const common: EvidenceField[] = [');
  src = src.replace(/const fellowFields\s*=\s*\[/, 'const fellowFields: EvidenceField[] = [');
  src = src.replace(/const levelFourFields\s*=\s*\[/, 'const levelFourFields: EvidenceField[] = [');
  src = src.replace(/const practicalFields\s*=\s*\[/, 'const practicalFields: EvidenceField[] = [');

  if (src !== before) {
    fs.writeFileSync(file, src, 'utf8');
    console.log(`Updated ${path.relative(root, file)}`);
  } else {
    console.log(`No type changes needed in ${path.relative(root, file)}`);
  }
}

rmDir(patchDir);
fixWorkspaceType(workspaceFile);

console.log('V72 build fix complete. Now run npm run build.');
