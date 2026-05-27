AIAA OAuth Redirect Callback Fix V45

This patch updates lib/supabase/browser.ts so Google and GitHub OAuth return to /auth/callback?next=/ instead of the site root.

Run from project root:

node scripts/fix-oauth-redirect-v45.cjs
npm run build
git add lib/supabase/browser.ts scripts/fix-oauth-redirect-v45.cjs AIAA_PATCH_V45_README.txt
git commit -m "fix production oauth redirect callback"
git push origin main
