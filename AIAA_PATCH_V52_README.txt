AIAA PATCH V52

Purpose:
Fix /apply/agent showing static Create Account and Sign In buttons even after a user is already signed in.

Change:
app/apply/agent/page.tsx now renders the real CertificationApplicationForm from components/certification-application-flow.tsx.

Expected behavior:
Signed out users are routed to login.
Signed in users see the real certification application form.
The old static Create Account, Sign In, and Member Profile CTA block is removed.
