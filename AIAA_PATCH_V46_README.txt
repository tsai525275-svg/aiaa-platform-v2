AIAA PATCH V46

Purpose
Fix production OAuth redirects that return to /#access_token instead of completing login state.

Files updated
components/oauth-hash-handler.tsx
app/layout.tsx
lib/supabase/browser.ts

What it does
Adds a global OAuth hash handler.
If Supabase returns access_token in the URL hash on any page, the handler stores the session, cleans the URL, and returns the user to the homepage.
Forces OAuth redirect target to /auth/callback?next=/ when the helper is used.

After applying
Run npm run build.
Commit and push.
Wait for Vercel Ready.
Test Google login on https://aiaaonline.org/login.
