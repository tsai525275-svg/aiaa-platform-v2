# AIAA Certification Flow Guardrail Fix

This patch adds server-side guardrails to AIAA admin certification actions.

## Scope

- `precheck-approve`
- `review-approve`
- `issue-certificate`
- explicit `human_override` validation
- clear guardrail failure JSON responses
- read-only audit guidance for inconsistent certification data

## Guardrail summary

### `precheck-approve`

- Level 1 requires `github_repo` plus either `readme_url` or `evidence_summary`
- missing evidence must not pass precheck approval

### `review-approve`

- requires `github_repo`
- requires `readme_url`
- requires `demo_url`
- requires `evidence_summary`
- practical evidence must be sufficient unless a human override is explicitly provided
- Level 1 requires `exam_score_percent >= 80`
- Level 2 requires `exam_score_percent >= 85`
- Level 3 requires `exam_score_percent >= 90`
- Level 4 requires explicit human override
- Level 5 requires explicit human override

### `issue-certificate`

- requires `review_status = approved`
- requires `certificate_status = ready`
- rejects `review_status = pending`
- rejects `review_status = rejected`
- rejects `review_status = revision_required`
- rejects duplicate issue when `certificate_status = issued`
- requires reviewer note
- requires `exam_auto_pass = true` unless explicit human override is provided

### `human_override`

When override is used, request body must include:

```json
{
  "human_override": true,
  "override_reason": "required explanation",
  "reviewer_id": "required uuid"
}
```

Override reviewer actions are stored with explicit action names such as:

- `review_approved_human_override`
- `certificate_issued_human_override`

## Error response shape

Guardrail failures return:

```json
{
  "ok": false,
  "error_code": "STRING_CODE",
  "message": "Human readable explanation",
  "required_fields": ["field_a", "field_b"],
  "current_state": {
    "application_id": "uuid",
    "target_level": 1
  }
}
```

## Important note

This patch does not modify existing polluted records.

See:

- `docs/AIAA_CERTIFICATION_GUARDRAIL_AUDIT.md`
