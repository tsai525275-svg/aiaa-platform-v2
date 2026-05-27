AIAA Patch V55

Purpose
- Change authentication toast text from Chinese to English.
- Signed in
- Signed out

Files changed by script
- app/**/*.ts, app/**/*.tsx
- components/**/*.ts, components/**/*.tsx
- lib/**/*.ts, lib/**/*.tsx

Run
cd C:\src\aiaa-platform-v2
Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_auth_toast_english_v55.zip" -DestinationPath "." -Force
node scripts\fix-auth-toast-english-v55.cjs
npm run build

Then commit and push.
