# Paperclip Controlled Write Plan

## Goal

Prepare Paperclip Phase 2 controlled automation without enabling unrestricted production writes.

This document is a readiness check and test matrix.

It does not authorize production POST execution by default.

## Current Endpoint Readiness

| Endpoint | Exists | Reviewer Action | Notification | Guardrails | Controlled Write Readiness |
| --- | --- | --- | --- | --- | --- |
| `precheck-approve` | Yes | Yes | No | Partial | Not ready |
| `precheck-reject` | Yes | Yes | No | Basic | Not ready |
| `revision-required` | Yes | Yes | No | Basic | Not ready |
| `review-approve` | Yes | Yes | No | Strong | Partial |
| `review-reject` | Yes | Yes | No | Basic | Not ready |
| `issue-certificate` | Yes | Yes | No | Strong | Partial |

## Readiness Findings

### What already works

- action endpoints exist
- admin auth uses `Bearer <PAPERCLIP_ADMIN_API_KEY>`
- reviewer actions are written for all current application actions
- JSON guardrail error responses already exist for guarded failures
- `review-approve` and `issue-certificate` already enforce key hard gates

### What is still missing

- application action route does not yet create `aiaa_notifications`
- no application action route currently returns a normalized `current_state` on success
- no AI Assistance Declaration completeness validator is wired into admin review actions
- no payment gate fields or payment-status checks exist yet
- no explicit QA risk flag field or evaluator is wired into admin review actions
- no explicit precheck spam / garbage-content heuristic exists in code yet

## Controlled Write Test Policy

Testing rules for Phase 2:

- do not call production POST during planning
- do not use real applicant records for first write tests
- use designated test applications only
- every test request must preserve reviewer action evidence
- every failing path must return clear JSON

## Required Success JSON

Recommended success payload:

```json
{
  "ok": true,
  "action": "precheck_approved",
  "current_state": {},
  "application": {},
  "reviewerAction": {},
  "notification": {}
}
```

## Required Failure JSON

Required failure payload:

```json
{
  "ok": false,
  "error_code": "EXAMPLE_CODE",
  "message": "Human-readable explanation.",
  "required_fields": [],
  "current_state": {}
}
```

## Phase 2 API Test Matrix

### Test Group 1: `precheck-approve`

Expected allow case:

- `target_level = 1`
- `github_repo` exists
- `readme_url` or `evidence_summary` exists
- `agent_name` exists
- `contact_email` exists
- `status = submitted`
- `precheck_status != approved`

Expected block case:

- missing `github_repo`
- missing both `readme_url` and `evidence_summary`
- missing `agent_name`
- missing `contact_email`
- `status != submitted`
- `precheck_status = approved`

Expected readiness gap:

- current code only enforces the Level 1 evidence subset
- current route does not yet create notification

### Test Group 2: `revision-required`

Expected allow case:

- application is legitimate but incomplete
- missing README, evidence summary, demo, video, or similar evidence

Expected block or escalation case:

- content is empty or malicious and should be rejected instead

Expected readiness gap:

- current route writes reviewer action but not notification
- current route does not currently encode decision heuristics in code

### Test Group 3: `precheck-reject`

Expected allow case:

- blank, spam, malicious, or non-recognizable application

Expected block or escalation case:

- application is weak but still belongs in `revision-required`

Expected readiness gap:

- current route writes reviewer action but not notification
- no codified spam/garbage heuristic yet

### Test Group 4: `review-approve`

Expected allow case:

- `exam_auto_pass = true`
- score threshold met
- practical evidence complete
- AI Assistance Declaration complete
- review note present
- no QA risk flag

Expected block case:

- score below threshold
- `exam_auto_pass = false`
- practical evidence insufficient
- AI Assistance Declaration incomplete
- missing review note
- QA risk flag present

Expected readiness gap:

- current code does not yet validate AI Assistance Declaration completeness
- current code does not yet validate QA risk flag
- current route does not yet create notification

### Test Group 5: `review-reject`

Expected allow case:

- score below threshold
- no practical evidence
- prompt only, UI only, demo only, non-reproducible, or suspected cheating

Expected readiness gap:

- current route writes reviewer action but not notification
- no codified content-fraud heuristic yet

### Test Group 6: `issue-certificate`

Expected allow case:

- `review_status = approved`
- `certificate_status = ready`
- `exam_auto_pass = true` or `human_override = true`
- AI Assistance Declaration complete
- practical evidence complete
- `payment_status = paid` or `payment_required = false`
- `review_note` exists
- no QA risk flag
- `certificate_status != issued`

Expected block case:

- `review_status != approved`
- `certificate_status != ready`
- missing review note
- `exam_auto_pass = false` without valid override
- payment incomplete
- AI Assistance Declaration incomplete
- QA risk flag present
- already issued

Expected readiness gap:

- current code does not yet validate payment gates
- current code does not yet validate AI Assistance Declaration completeness
- current code does not yet validate QA risk flag
- current route does not yet create notification

## Payment Data Structure Proposal

Recommended fields on `aiaa_certification_applications`:

- `payment_status`
- `payment_provider`
- `payment_reference`
- `payment_amount`
- `payment_currency`
- `payment_paid_at`
- `payment_required`
- `invoice_url`

Recommended webhook events:

- `payment.session.created`
- `payment.session.completed`
- `payment.session.failed`
- `payment.refunded`

Provider direction:

- Stripe
- Lemon Squeezy

## Human Override Contract

If override is supported, request body must include:

```json
{
  "human_override": true,
  "override_reason": "string",
  "reviewer_id": "uuid"
}
```

Override rules:

- never allow silent override
- always write reviewer action
- use explicit override action type
- preserve reason in metadata

## Human Escalation Triggers

Require manual escalation when:

- Level 4 or Level 5
- QA risk flag present
- evidence and score conflict
- AI declaration is contradictory
- suspected fraud
- payment dispute or missing paid state
- certificate issuance would need override

## Rollback Strategy

If controlled write produces bad outcomes:

1. disable the specific action path
2. freeze related Paperclip automation
3. investigate reviewer actions and notifications
4. run read-only audit queries
5. classify remediation path:
   - Plan A: test pollution
   - Plan B: rewind review and certificate state
   - Plan C: preserve history but suspend certificate

## Recommendation Before Live Controlled Write

Paperclip should not enter production controlled write until these gaps are closed:

1. notifications are created by application action route
2. precheck field validation is expanded to the full Phase 2 rule set
3. AI Assistance Declaration validator is added
4. QA risk flag validator is added
5. payment fields and payment gate checks are designed and implemented
6. success payload includes normalized `current_state`
