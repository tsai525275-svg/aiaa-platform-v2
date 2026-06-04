# Paperclip Integration README

## 1. Current operating mode

Paperclip is phase 1 read-only only.

- Read applications is allowed.
- Read application detail is allowed.
- Read exam package is allowed.
- Any write action remains blocked for now.

## 2. Required environment variables

Set these locally on the operator machine only. Do not commit them into the repo.

```bash
AIAA_ADMIN_BASE_URL=https://www.aiaaonline.org
PAPERCLIP_ADMIN_API_KEY=<set locally by operator>
```

## 3. How to test GET applications

Run:

```bash
node scripts/test-paperclip-admin-api.cjs
```

Expected success output:

- `status`
- `application count`
- `first application id`
- `first application target level`
- `first application status`
- `first application review status`
- `first application certificate status`

## 4. How to read application detail

Use the server-side client in:

`lib/paperclip/aiaa-admin-client.ts`

Call:

- `readApplicationDetail(applicationId)`

Route used:

- `GET /api/admin/applications/[id]`

## 5. How to read exam package

Use the same server-side client.

Call:

- `readApplicationExam(applicationId)`

Route used:

- `GET /api/admin/applications/[id]/exam`

## 6. POST endpoints to keep disconnected in phase 1

Do not connect these operations yet:

- revision required
- review approve
- review reject
- notification send
- certificate issue
- any reviewer action write
- any status update write

## 7. Certificate issuance must remain manual

All certificate issuance decisions require explicit human confirmation before any future write integration is enabled.

## 8. Next phase scope

Only after phase 1 is stable:

1. Connect `revision required`
2. Connect `review approve`
3. Connect `notification send`

## 9. Final phase scope

Only after the earlier phases are manually validated:

1. Connect `issue certificate`

## 10. Paperclip local context

- Local Paperclip service: `http://127.0.0.1:3100/AIA/org`
- Company name: `AIAA AI Operations`
- Current company state: clean company, CEO only before importing the setup package
