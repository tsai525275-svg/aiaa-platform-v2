AIAA Patch V43

Changes
1. OAuth callback now redirects signed in users to the home page.
2. Email OTP verification now redirects signed in users to the home page.
3. Login and logout create a top center capsule toast with a green check mark. It closes after two seconds.
4. Sign out buttons queue the same capsule toast after redirecting home.
5. Added optional Cloudflare Turnstile frontend wiring for email code requests.

Files
app/auth/callback/page.tsx
components/member-auth-panel.tsx
components/member-dashboard.tsx
components/site-header.tsx
components/turnstile-check.tsx
lib/supabase/browser.ts
.env.example

Captcha setup
Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env.local only after you create a Cloudflare Turnstile site key.
Supabase also needs CAPTCHA protection enabled and the provider secret key saved in Authentication Bot and Abuse Protection.
