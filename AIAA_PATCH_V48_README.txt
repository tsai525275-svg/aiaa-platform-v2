AIAA PATCH V48

Fixes the sign out toast behavior.

Changes:
1. Delays auth toast dispatch so redirects do not consume the queued toast too early.
2. Header sign out queues the localized message: 已登出.
3. Member profile sign out buttons also queue 已登出.

Run:
node scripts\fix-signout-toast-v48.cjs
npm run build
