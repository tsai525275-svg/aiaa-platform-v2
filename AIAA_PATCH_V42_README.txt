AIAA v42 member profile fix

Purpose:
New logged in members must not show Level 1 approved by default.
This patch removes hardcoded Level 1 public, AIAA-L1-PUBLIC, and Level 2 application stage from the member profile page.

Files changed:
components/member-dashboard.tsx

Install from PowerShell:
cd C:\src\aiaa-platform-v2
taskkill /IM node.exe /F
Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_member_new_user_not_certified_v42.zip" -DestinationPath "." -Force
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
npm run dev

After install:
Open http://localhost:3000/member
New members should show:
No approved certification yet
Level 1 application not submitted
Certificate: Not issued
Apply for Level 1
