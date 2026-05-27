AIAA Patch V70

This patch replaces the exam workspace UI for Level 1 to Level 5.

It updates:
components/aiaa-v61-exam-workspace.tsx
components/aiaa-v61-exam-center.tsx
app/member/exam/page.tsx
app/member/exam/[level]/page.tsx

Expected result:
Level 1 shows 30 multiple choice questions and 1 practical evidence task.
Level 2 shows 40 multiple choice questions and 2 production evidence tasks.
Level 3 shows 50 multiple choice questions, 3 practical tasks, and 1 architecture review.
Level 4 shows company questionnaire, document evidence, and demo review.
Level 5 shows Fellow impact review.

Run:
cd C:\src\aiaa-platform-v2
Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_official_exam_workspace_v70.zip" -DestinationPath "." -Force
node scripts\install-official-exam-workspace-v70.cjs
npm run build

git add .
git commit -m "complete official exam workspace UI"
git push origin main
