AIAA Patch V58

Purpose
Convert remaining public website copy back to English across app, components, and lib.

Run from project root:

cd C:\src\aiaa-platform-v2
Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_force_full_english_v58.zip" -DestinationPath "." -Force
node scripts\force-full-english-v58.cjs
npm run build

Then inspect:
AIAA_V58_REMAINING_CJK_REPORT.txt

If build passes:
git add .
git commit -m "restore full english website copy"
git push origin main
