# Phase 2B Precheck Controlled Write Expansion Plan

## 1. Phase 2B Objective

Phase 2B focuses on planning the expansion of precheck controlled write behavior.

This phase is planning only.

This phase does not execute live writes.

## 2. Current Accepted Baseline

Phase 2A is already accepted with the following baseline:

- read only API acceptance completed
- dry run acceptance completed
- `revision-required` controlled write acceptance completed
- reviewer action verification completed
- notification verification completed
- `exam_access_status` remained `locked`
- `certificate_status` remained `not_issued`
- no payment
- no real email sent

Reference acceptance commit:

- `317476e document Phase 2A revision-required controlled write acceptance`

## 3. Allowed Phase 2B Planning Scope

Phase 2B planning may include:

- `precheck-reject` test plan
- `precheck-approve` test conditions
- Level 1 precheck rule matrix
- Level 2 plus evidence insufficient rule
- failure case matrix
- notification verification checklist
- reviewer action verification checklist
- human approval gate
- rollback plan
- promotion criteria to Phase 2C

## 4. Forbidden Scope

Phase 2B must not include:

- payment
- certificate issuing
- `review-approve` automation
- rankings
- news
- real user unrestricted writes
- heartbeat writes
- production SQL updates
- pollution data mutation

## 5. Precheck Action Risk Table

| Action | Risk | Status | Note |
| --- | --- | --- | --- |
| `revision-required` | Low | Accepted from Phase 2A | Controlled write acceptance completed |
| `precheck-reject` | Medium | Needs separate test application | Must validate reject reason, reviewer action, notification, and locked exam behavior |
| `precheck-approve` | Higher | Not yet approved for live test | Only after reject test passes and only for strict Level 1 requirements |

## 6. Level 1 Precheck Approval Rule Matrix

### Required Fields

- `target_level`
- `status = submitted` or `pending`
- `agent_name`
- `contact_email`
- `github_repo`
- `readme_url` or `evidence_summary`
- `exam_access_status` must not already be `unlocked`
- `precheck_status` must not already be `approved`
- `certificate_status` must not be `issued`

### Approve Allowed Only If

- Level 1
- clear test or valid applicant
- basic evidence complete
- no issued certificate
- no exam unlocked
- no guardrail failure

### Approve Blocked If

- Level 2 or higher evidence insufficient
- missing `github_repo`
- missing `contact_email`
- missing `agent_name`
- missing both `readme_url` and `evidence_summary`
- already unlocked
- already approved
- certificate issued

## 7. Precheck Reject Test Plan

Use only a test application.

Reject reason is required.

Expected result:

- reviewer action created
- notification created
- exam remains locked
- certificate unchanged
- no payment
- no real email sent

## 8. Precheck Approve Test Plan

Do not execute in Phase 2B.

Only define readiness criteria.

Expected future result:

- `precheck_status = approved`
- `exam_access_status = unlocked`
- reviewer action created
- notification created
- certificate remains `not_issued`
- no payment
- no certificate issued

## 9. Failure Case Matrix

Phase 2B planning must account for:

- missing reason
- missing `TEST_APPLICATION_ID`
- invalid API key
- wrong action
- real user application
- issued certificate application
- already unlocked application
- Level 2 plus insufficient evidence
- network failure
- duplicate action attempt

## 10. Verification Checklist

### Before Write

- git clean
- deployment READY
- test application confirmed
- not issued case
- not real user
- action explicitly selected
- reason provided

### After Write

- `reviewer_action_id` exists
- `notification_id` exists
- `current_state` returned
- exam access expected state
- certificate status unchanged
- no payment
- no real email sent
- no certificate issued

## 11. Human Approval Gate

All Phase 2B writes require manual approval.

Codex may not execute live write without explicit user confirmation.

Paperclip may not run autonomous POST.

No scheduled write.

No heartbeat write.

## 12. Rollback Plan

No delete.

No direct production update without approval.

If test pollution occurs, document first.

Open read only audit.

Choose Plan A, B, or C later.

Do not mutate data in Phase 2B planning.

## 13. Promotion Criteria to Phase 2C

- Phase 2B document reviewed
- `precheck-reject` dry run passes
- `precheck-reject` controlled write passes on test application
- `precheck-approve` readiness reviewed
- Level 1 rule matrix accepted
- human gate accepted
- rollback plan accepted
