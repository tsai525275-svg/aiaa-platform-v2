AIAA PATCH V73
Complete certification flow bridge before the external HTML control panel.

This patch does not build the HTML reviewer control panel. It prepares the website and database so that the control panel can connect later.

What V73 does:
1. Removes the patch folder that was breaking Next.js production builds.
2. Keeps the official Level 1 to Level 5 exam workspace UI.
3. Adds automatic multiple choice scoring.
4. Locks submitted exam answers.
5. Writes score data into aiaa_exam_answers.
6. Writes score and review state into aiaa_certification_applications.
7. Moves submitted exams into Review stage.
8. Keeps practical tasks, document reviews, company reviews, and Fellow reviews as manual reviewer work.
9. Adds notification events for application, exam, review, and certificate stages.
10. Adds profile fields for approved level, certificate id, expiry, and ranking eligibility.
11. Adds reviewer action table for the future HTML control panel.

Required SQL:
Run supabase/aiaa-complete-certification-flow-v73.sql in Supabase SQL Editor before production testing.

Important flow:
Application submitted -> precheck approved -> exam unlocked -> exam submitted and locked -> knowledge score stored -> manual review -> certificate issued -> profile and ranking eligibility updated.

Build check:
npm run build

Production push:
git add .
git commit -m "complete certification scoring and review flow"
git push origin main
