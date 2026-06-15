# Phase 2B Precheck-Reject Dry Run Readiness

## 1. Objective

Phase 2B only prepares `precheck-reject` dry run readiness.

This document does not authorize a live write.

## 2. Baseline

- `revision-required` controlled write already passed
- `precheck-reject` has not been tested yet
- `precheck-approve` has not been tested yet
- full automation remains blocked

## 3. Precheck Reject Expected Contract

Endpoint:

- `POST /api/admin/applications/[id]/precheck-reject`

Required:

- `reject_reason` or `note`

Expected success:

- `ok: true`
- `action: precheck_rejected`
- `application_id`
- `reviewer_action_id`
- `notification_id`
- `current_state`
- `message`

Expected safe state:

- `exam_access_status = locked`
- `certificate_status` unchanged
- no certificate issued
- no payment
- no real email sent

## 4. Dry Run Checklist

- git clean
- deployment READY
- script inspected
- action explicitly set to `precheck-reject`
- `TEST_APPLICATION_ID` not required for dry run
- `ALLOW_PAPERCLIP_WRITE_TEST` not set
- no POST sent
- no production write

## 5. Test Application Rules for Future Controlled Write

Future controlled write may only use an application that:

- must be a test application
- must not be a real user
- must not be an issued case
- must not already be unlocked
- must not already have a certificate issued
- `status = submitted` or `pending`
- `precheck_status = pending`
- `certificate_status = not_issued`
- `exam_access_status = locked`

## 6. Stop Conditions

- missing reason
- real user data
- issued certificate
- already unlocked exam
- unknown action
- dirty git tree
- deployment not READY
- unexpected `current_state`
- API key missing
- API key printed
- script attempts POST during dry run

## 7. Future Controlled Write Command Template

Template only.

Do not execute in this phase.

Do not include a real key.

```powershell
$env:AIAA_ADMIN_BASE_URL="https://www.aiaaonline.org"
$env:PAPERCLIP_ADMIN_API_KEY="<set locally>"
$env:ALLOW_PAPERCLIP_WRITE_TEST="true"
$env:TEST_PRECHECK_ACTION="precheck-reject"
$env:TEST_APPLICATION_ID="<test application id>"
$env:TEST_REJECT_REASON="Phase 2B controlled write test. Precheck reject test application only."
$env:TEST_PRECHECK_NOTE="Phase 2B safe controlled write verification. Exam remains locked. Certificate unchanged."
node scripts/test-paperclip-precheck-actions.cjs
```

## 8. Verification Checklist for Future Live Test

- reviewer action created
- notification created
- exam remains locked
- certificate unchanged
- `review_status` not approved
- `certificate_issued_at = null`
- no payment
- no real email sent

## 9. Full Automation Gate

Full automation remains blocked until:

- `precheck-reject` controlled write passed
- `precheck-approve` Level 1 strict gate passed
- review recommendation stable
- review write human gate accepted
- payment gate accepted
- certificate gate accepted
- audit trail accepted
- rollback plan accepted

## 10. Conclusion

Phase 2B prepares `precheck-reject` dry run readiness only.

No live write is allowed in this document task.
