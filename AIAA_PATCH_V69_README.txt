AIAA Patch V69

Fixes Level 1 Question 31 UI.

This patch forces the exam workspace component to render Question 31 as Practical Evidence Submission instead of a single textarea.

Run:
cd C:\src\aiaa-platform-v2
Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_exam_q31_evidence_ui_v69.zip" -DestinationPath "." -Force
node scripts\install-exam-q31-evidence-ui-v69.cjs
npm run build

Then commit and push.
