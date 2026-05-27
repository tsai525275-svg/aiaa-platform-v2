const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = path.join(root, 'supabase', 'aiaa-official-exam-blueprint-v65.sql');
if (!fs.existsSync(src)) {
  console.error('Missing supabase\aiaa-official-exam-blueprint-v65.sql');
  process.exit(1);
}
console.log('V65 official exam blueprint SQL is ready.');
console.log('Next step: copy supabase\aiaa-official-exam-blueprint-v65.sql into Supabase SQL Editor and run it.');
