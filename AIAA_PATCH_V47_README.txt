AIAA PATCH V47

Purpose
Fix build failure caused by importing @supabase/supabase-js, which is not installed in this project.

Files updated
components/oauth-hash-handler.tsx
scripts/fix-oauth-hash-handler-v47.cjs
AIAA_PATCH_V47_README.txt

Commands
cd C:\src\aiaa-platform-v2
Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_oauth_hash_handler_build_fix_v47.zip" -DestinationPath "." -Force
node scripts\fix-oauth-hash-handler-v47.cjs
npm run build
git add components\oauth-hash-handler.tsx scripts\fix-oauth-hash-handler-v47.cjs AIAA_PATCH_V47_README.txt
git commit -m "fix oauth hash handler build"
git push origin main
