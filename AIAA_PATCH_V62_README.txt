AIAA PATCH V62

Purpose
Fix V61 exam and notification pages showing Sign in while the member is already signed in.

Cause
V61 only scanned Supabase default localStorage keys. The AIAA site stores the active login session in aiaa-member-session. The header could see the member session, but V61 exam and notification pages could not.

Updated file
lib/supabase/aiaa-v61-client.ts

After applying
Run npm run build.
Commit and push.
Test https://aiaaonline.org/member/exam and https://aiaaonline.org/member/exam/level-1.
