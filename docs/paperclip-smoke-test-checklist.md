# Paperclip Smoke Test Checklist

## Test 1: GET applications

- Confirm `AIAA_ADMIN_BASE_URL` and `PAPERCLIP_ADMIN_API_KEY` are set locally.
- Run `node scripts/test-paperclip-admin-api.cjs`.
- Verify the script returns HTTP 200 and prints application summary fields.

## Test 2: GET application detail

- Use `readApplicationDetail(applicationId)` from `lib/paperclip/aiaa-admin-client.ts`.
- Verify the response contains `application`.
- Verify the response can include `examAnswers` and `reviewerActions`.

## Test 3: GET exam package

- Use `readApplicationExam(applicationId)` from `lib/paperclip/aiaa-admin-client.ts`.
- Verify the response contains `application`, `examAnswers`, and `reviewerActions`.

## Test 4: Confirm Paperclip does not call POST

- Review all Paperclip instructions and local integration code.
- Confirm no POST endpoint is referenced for phase 1 workflows.

## Test 5: Confirm no certificate is issued

- Confirm no certificate issue route is called.
- Confirm no certificate write action is present in the phase 1 instructions.

## Test 6: Confirm no notification is added

- Confirm no notification send route is called.
- Confirm no notification queue write is present in the phase 1 instructions.

## Test 7: Confirm no reviewer action is added

- Confirm no reviewer action POST is called.
- Confirm reviewer actions are only read from the exam package payload.
