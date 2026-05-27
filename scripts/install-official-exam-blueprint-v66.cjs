const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sql = path.join(root, 'supabase', 'aiaa-official-exam-blueprint-v66.sql');
if (!fs.existsSync(sql)) {
  console.error('Missing supabase\\aiaa-official-exam-blueprint-v66.sql');
  process.exit(1);
}
console.log('V66 official exam blueprint SQL is ready.');
console.log('Next step: copy supabase\\aiaa-official-exam-blueprint-v66.sql into Supabase SQL Editor and run it.');
