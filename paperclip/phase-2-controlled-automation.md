# Paperclip Phase 2 Controlled Automation

## Purpose

Phase 2 moves Paperclip from read-only analysis into controlled automation with strict guardrails.

This phase does not enable unrestricted auto-approval, unrestricted auto-issuance, or direct payment processing.

Paperclip may prepare, recommend, and in limited cases trigger controlled write actions only when:

- endpoint guardrails are satisfied
- reviewer actions are written
- notification behavior is defined
- JSON error responses are clear
- audit logs are preserved
- human escalation rules are enforced

## Automation Scope

Phase 2 scope:

- auto precheck classification
- auto exam review recommendation
- controlled write readiness for:
  - `precheck-approve`
  - `revision-required`
  - `precheck-reject`
  - `review-approve`
  - `review-reject`
- payment gate design only
- certificate issuing gate design only

Out of scope in this phase:

- unrestricted production automation
- uncontrolled direct certificate issuance
- custom credit-card handling
- Rankings Hub
- News Hub

## Allowed POST Endpoints

These are the only application action endpoints that may enter controlled write testing after the listed gaps are closed:

- `POST /api/admin/applications/[id]/precheck-approve`
- `POST /api/admin/applications/[id]/revision-required`
- `POST /api/admin/applications/[id]/precheck-reject`
- `POST /api/admin/applications/[id]/review-approve`
- `POST /api/admin/applications/[id]/review-reject`
- `POST /api/admin/applications/[id]/issue-certificate`

Current implementation notes:

- All six action endpoints already exist.
- All six action endpoints already create `aiaa_reviewer_actions`.
- Current application action route does not yet create `aiaa_notifications`.
- `review-approve` and `issue-certificate` already enforce core guardrails from commit `b5a2e09`.

## Forbidden High Risk Actions

The following remain forbidden for Paperclip auto-execution in Phase 2:

- direct production auto-issuance without gate checks
- any write path that bypasses reviewer action logging
- direct payment collection or storage of credit card data
- direct manipulation of Supabase schema from Paperclip
- revoking or deleting production records automatically
- silent override without `human_override`, `override_reason`, and `reviewer_id`

## Precheck Automation Rules

### Auto `precheck-approve`

Paperclip may recommend or trigger `precheck-approve` only when all conditions are true:

- `target_level = 1`
- `github_repo` exists
- `readme_url` or `evidence_summary` exists
- `agent_name` exists
- `contact_email` exists
- `status = submitted`
- `precheck_status != approved`

Expected controlled write result:

- reviewer action is created
- applicant notification is created
- response returns:
  - `ok: true` or `ok: false`
  - `current_state`

### Auto `revision-required`

Paperclip should prefer `revision-required` when the application appears legitimate but incomplete.

Common triggers:

- missing `github_repo`
- missing `readme_url`
- missing `evidence_summary`
- missing `demo_url` or `video_url`
- incomplete or weak evidence package

Expected controlled write result:

- reviewer action is created
- applicant notification is created
- response returns:
  - `ok: true` or `ok: false`
  - `current_state`

### Auto `precheck-reject`

Paperclip should reserve `precheck-reject` for clearly invalid submissions:

- blank application
- obvious spam
- malicious content
- non-recognizable submission

Expected controlled write result:

- reviewer action is created
- applicant notification is created
- response returns:
  - `ok: true` or `ok: false`
  - `current_state`

## Exam Review Automation Rules

### Score Thresholds

- Level 1: `80`
- Level 2: `85`
- Level 3: `90`
- Level 4: manual review required
- Level 5: council review required

### Practical Evidence Checklist

Paperclip Exam Reviewer should check:

- GitHub repo
- README
- Demo
- Video
- execution log
- tool calling evidence
- external API evidence
- retry logic
- error handling
- AI Assistance Declaration

### Auto `review-approve`

Paperclip may recommend or trigger `review-approve` only when all conditions are true:

- `exam_auto_pass = true`
- `score_percent` meets the level threshold
- AI Assistance Declaration is complete
- practical evidence is complete
- review note exists
- no QA risk flag exists

### Auto `revision-required`

Paperclip should prefer `revision-required` when:

- score passed but evidence is incomplete
- AI Assistance Declaration is incomplete
- README is incomplete
- demo is incomplete
- execution log is incomplete

### Auto `review-reject`

Paperclip should recommend or trigger `review-reject` when:

- score below threshold
- no practical evidence
- prompt only
- UI only
- demo only
- non-reproducible submission
- cheating or fabricated evidence is suspected

## Payment Gate Rules

Phase 2 does not implement payment collection.

Phase 2 only defines the data model and gating contract.

Recommended application fields:

- `payment_status`
- `payment_provider`
- `payment_reference`
- `payment_amount`
- `payment_currency`
- `payment_paid_at`
- `payment_required`
- `invoice_url`

Payment policy direction:

- Level 1 may remain free or low-fee during the launch phase
- Level 2 and Level 3 may require certification review fees
- Level 4 company certification must require payment
- Level 5 does not use the standard payment path and should route to Council Review

Approved provider direction:

- Stripe
- Lemon Squeezy

Explicit exclusions:

- do not store card data directly
- do not build custom payment capture logic
- use provider checkout plus webhook confirmation

## Certificate Issuing Gate Rules

`issue-certificate` may only be automated when all conditions are true:

- `review_status = approved`
- `certificate_status = ready`
- `exam_auto_pass = true` or `human_override = true`
- AI Assistance Declaration is complete
- practical evidence is complete
- `payment_status = paid` or `payment_required = false`
- `review_note` exists
- no QA risk flag exists
- `certificate_status != issued`

If any condition fails:

- do not issue the certificate
- return `ok: false`
- return `error_code`
- return `missing_requirements`

## Audit Log Requirements

Every controlled write action must preserve:

- reviewer action record
- action timestamp
- actor or reviewer identity
- current application state snapshot
- human override fields when used
- notification creation status
- response payload with `ok`, state, and error details

Recommended reviewer action metadata:

- `paperclip_agent`
- `paperclip_company`
- `automation_phase`
- `decision_rule`
- `human_override`
- `override_reason`
- `qa_risk_flag`

## Human Escalation Rules

Paperclip must escalate to a human when:

- target level is `4` or `5`
- a QA risk flag exists
- there is any evidence of cheating or fabricated work
- AI Assistance Declaration is missing or contradictory
- score and evidence conflict
- payment state is missing or inconsistent
- certificate issuance would require override

## Rollback Plan

If controlled automation produces invalid outcomes:

1. disable the specific action from Paperclip
2. preserve all reviewer actions and notification traces
3. move the application back to human review
4. run the guardrail audit queries from `docs/AIAA_CERTIFICATION_GUARDRAIL_AUDIT.md`
5. classify the incident as:
   - test pollution
   - invalid business approval
   - flow bug

## Current Readiness Summary

### Ready for documentation-level controlled write planning

- `precheck-approve`
- `precheck-reject`
- `revision-required`
- `review-approve`
- `review-reject`
- `issue-certificate`

### Not ready for unrestricted automation

Reasons:

- application action route does not yet create notifications
- `precheck-approve` logic does not yet enforce all Phase 2 precheck fields
- `review-approve` does not yet enforce AI Assistance Declaration completeness
- `review-approve` does not yet enforce explicit QA risk flag checks
- `issue-certificate` does not yet enforce payment gates
- `issue-certificate` does not yet enforce AI Assistance Declaration completeness
- `issue-certificate` does not yet enforce explicit practical evidence completeness beyond current score and review guards

## Recommendation

Before enabling Phase 2 controlled write in production:

1. add notification creation into the application action route
2. add AI Assistance Declaration validation helpers
3. add QA risk flag validation
4. add payment field design and gate checks
5. run controlled write tests on safe non-production or designated test applications only
