# AIAA AI Operations Company Setup

This repository does not contain a verified Paperclip company export or import schema.

Use this file as the canonical manual setup package for the local Paperclip company at `http://127.0.0.1:3100/AIA/org`.

## Company profile

Company name:
`AIAA AI Operations`

Company mission:
`Operate and complete the AIAA platform as an AI Agent certification, identity, registry, ranking, and trust system.`

## Company rules

Keep these rules exactly:

1. Do not rewrite the website from scratch.
2. Do not change the AIAA brand direction.
3. Do not expose secrets.
4. Do not touch `.env` or `.env.local`.
5. Do not auto issue certificates.
6. Do not auto approve applications.
7. Keep public website fully English.
8. Keep AIAA untranslated.

## Environment variables for local operator machine

These values must be set locally by the operator and must not be stored in the repo:

```bash
AIAA_ADMIN_BASE_URL=https://www.aiaaonline.org
PAPERCLIP_ADMIN_API_KEY=<set locally by operator>
```

## Initial company notes

- Paperclip role: `AIAA AI Operations Console`
- Phase 1 scope: read-only access to AIAA Admin API
- Allowed data domains: certification applications, exam answers, review suggestions, certificate issuing suggestions, notification suggestions
- Manual control requirement: all approval, certificate issuance, and production notification actions remain human confirmed
- Production safety rule: do not perform high-risk writes against production data

## Import fallback guidance

If Paperclip later provides a documented company import/export JSON schema, convert this file into a machine-readable import package at:

`paperclip/aiaa-ai-operations-company.json`

Until that schema is available, use this markdown file as the source of truth.
