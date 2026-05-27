AIAA PATCH V67

Purpose
Improve the official exam UI after the V66 question bank.

Changes
1. Multiple choice questions render as A/B/C/D radio options instead of one textarea.
2. Level 1 Question 31 renders a structured evidence submission section.
3. The Level 1 practical task collects these fields:
   GitHub repo URL
   README URL
   Demo URL
   Demo video URL
   Screenshot URL
   Execution log URL
   Workflow summary
   Tool calling evidence
   External API evidence
   Retry and error handling
4. Answers are still stored in the existing aiaa_exam_answers.answers JSON object.
5. No Supabase SQL change is required.

Files changed
components/aiaa-v61-exam-workspace.tsx
scripts/install-exam-practical-ui-v67.cjs
AIAA_PATCH_V67_README.txt

After applying
Run npm run build.
Commit and push.
Test /member/exam/level-1.
