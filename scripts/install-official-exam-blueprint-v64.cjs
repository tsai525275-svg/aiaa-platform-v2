const fs = require('fs');
const path = require('path');

const sqlPath = path.join(process.cwd(), 'supabase', 'aiaa-official-exam-blueprint-v64.sql');
if (!fs.existsSync(sqlPath)) {
  console.error('Missing SQL file:', sqlPath);
  process.exit(1);
}
console.log('V64 official exam blueprint installed.');
console.log('Next step: copy supabase\\aiaa-official-exam-blueprint-v64.sql into Supabase SQL Editor and run it.');
