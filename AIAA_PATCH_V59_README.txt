AIAA Patch V59

Purpose:
- Clean remaining Chinese and hybrid Chinese English text from public website code.
- Keep code identifiers such as Supabase helper names intact.
- Generate AIAA_V59_REMAINING_CJK_REPORT.txt after cleanup.

Run:
node scripts/force-full-english-v59.cjs
npm run build
