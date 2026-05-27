AIAA Patch V49

Adds the real certification application flow.

Files changed:
components/certification-application-flow.tsx
components/member-dashboard.tsx
lib/supabase/browser.ts
app/apply/page.tsx
app/apply/agent/page.tsx
app/member/applications/page.tsx
app/member/exam/page.tsx
supabase/aiaa-certification-applications-v1.sql

Run the SQL file in Supabase SQL Editor before testing the submit flow.

Flow:
1. Member signs in.
2. Member submits Level 1 application.
3. Application appears in /member/applications.
4. Member starts exam in /member/exam.
5. Member submits exam.
6. Status becomes Under review.
7. No certificate appears until a reviewer or admin approves the record later.
