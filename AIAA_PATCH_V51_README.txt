AIAA Patch V51

Purpose:
Fix /apply bottom call to action.

Problem:
The /apply page is a public landing page and the button was static. It still showed 建立帳戶 even after the user had signed in.

Change:
Adds components/apply-account-cta.tsx.
The button checks the browser Supabase session.
Signed in users see 提交申請.
Signed out users see 登入後申請.
