const fs = require('fs');
const path = require('path');

const root = process.cwd();
const target = path.join(root, 'components', 'aiaa-v61-exam-workspace.tsx');

if (!fs.existsSync(target)) {
  console.error('Cannot find components\\aiaa-v61-exam-workspace.tsx');
  process.exit(1);
}

let source = fs.readFileSync(target, 'utf8');
const before = source;

source = source.replace(/(\n\s*)const common = \[/, '$1const common: EvidenceField[] = [');

if (source === before) {
  if (source.includes('const common: EvidenceField[] = [')) {
    console.log('V71 fix already applied.');
  } else {
    console.error('V71 could not find the Level 4 common evidence field array to patch.');
    process.exit(1);
  }
} else {
  fs.writeFileSync(target, source, 'utf8');
  console.log('V71 fixed EvidenceField type inference in components\\aiaa-v61-exam-workspace.tsx');
}
