AIAA Patch V44

Change
Move Cloudflare Turnstile to the first step of login.
The sign in buttons and email form stay hidden until human verification succeeds.
After verification, the normal GitHub, Google, and email sign in options appear.

Files changed
components/member-auth-panel.tsx

Install from PowerShell
cd C:\src\aiaa-platform-v2

taskkill /IM node.exe /F

Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_auth_verify_first_v44.zip" -DestinationPath "." -Force

Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue

npm run dev
