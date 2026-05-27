AIAA Patch V65

Purpose:
Fixes the V64 official exam blueprint SQL column order error.

What changed:
- Uses an explicit column order for exam questions.
- Places required before points to match the existing table structure safely.
- Adds expected_answer_format to the insert and update flow.
- Keeps the official exam blueprint counts:
  Level 1: 31 items
  Level 2: 42 items
  Level 3: 54 items
  Level 4: 29 items
  Level 5: 10 items

Run:
1. Expand this zip into the project root.
2. Run node scripts\install-official-exam-blueprint-v65.cjs
3. Copy supabase\aiaa-official-exam-blueprint-v65.sql into Supabase SQL Editor.
4. Press Run.
