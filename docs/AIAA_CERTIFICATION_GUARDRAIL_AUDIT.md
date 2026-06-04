# AIAA Certification Guardrail Audit

This document is read-only only.

Do not use the queries below to modify production data.

## Purpose

Use these checks to identify certification flow records that violate AIAA review and certificate guardrails.

## Score thresholds

- Level 1: `80`
- Level 2: `85`
- Level 3: `90`
- Level 4: manual review only
- Level 5: council review only

## Audit 1: `auto_pass = false` but `review_status = approved`

```sql
select
  id,
  target_level,
  exam_auto_pass,
  exam_score_percent,
  review_status,
  certificate_status,
  reviewer_id,
  reviewed_at,
  updated_at
from aiaa_certification_applications
where coalesce(exam_auto_pass, false) = false
  and review_status = 'approved'
order by updated_at desc;
```

## Audit 2: `auto_pass = false` but `certificate_status = issued`

```sql
select
  id,
  target_level,
  exam_auto_pass,
  exam_score_percent,
  review_status,
  certificate_status,
  certificate_id,
  certificate_issued_at,
  updated_at
from aiaa_certification_applications
where coalesce(exam_auto_pass, false) = false
  and certificate_status = 'issued'
order by certificate_issued_at desc nulls last, updated_at desc;
```

## Audit 3: score below threshold but `certificate_status = issued`

```sql
select
  id,
  target_level,
  exam_score_percent,
  exam_auto_pass,
  review_status,
  certificate_status,
  certificate_id,
  updated_at
from aiaa_certification_applications
where certificate_status = 'issued'
  and (
    (target_level = 1 and coalesce(exam_score_percent, 0) < 80)
    or (target_level = 2 and coalesce(exam_score_percent, 0) < 85)
    or (target_level = 3 and coalesce(exam_score_percent, 0) < 90)
  )
order by updated_at desc;
```

## Audit 4: `certificate_status = issued` but reviewer action is incomplete

```sql
select
  app.id,
  app.target_level,
  app.review_status,
  app.certificate_status,
  app.certificate_id,
  app.reviewer_id,
  actions.action,
  actions.note,
  actions.metadata,
  actions.created_at
from aiaa_certification_applications app
left join lateral (
  select
    action,
    note,
    metadata,
    created_at
  from aiaa_reviewer_actions ra
  where ra.application_id = app.id
  order by ra.created_at desc
  limit 1
) actions on true
where app.certificate_status = 'issued'
  and (
    actions.action is null
    or coalesce(actions.note, '') = ''
  )
order by app.updated_at desc;
```

## Audit 5: missing evidence but `review_status = approved`

```sql
select
  id,
  target_level,
  github_repo,
  readme_url,
  demo_url,
  evidence_summary,
  review_status,
  certificate_status,
  updated_at
from aiaa_certification_applications
where review_status = 'approved'
  and (
    coalesce(github_repo, '') = ''
    or coalesce(readme_url, '') = ''
    or coalesce(demo_url, '') = ''
    or coalesce(evidence_summary, '') = ''
  )
order by updated_at desc;
```

## Read-only investigation checklist

1. Confirm whether the application ever had a legitimate human override.
2. Confirm whether the reviewer action log contains an explicit override reason.
3. Confirm whether the exam answer package contains sufficient practical evidence.
4. Confirm whether the record came from test pollution, manual backfill, or a flow bug.
5. Confirm whether member profile and registry exposure also became inconsistent.

## Pollution remediation options

### Plan A: Mark as test pollution

Use when the record is clearly non-production, seeded, or manually polluted test data.

Benefits:
- Preserves the full audit trail.
- Lowest operational disruption.

Risks:
- Leaves the inconsistent record in-place unless all downstream views exclude it.
- May confuse future reviewers if the pollution marker is not consistently visible.

### Plan B: Rewind to `certificate_status = not_issued` and `review_status = pending` or `revision_required`

Use when the business decision was invalid and the record must re-enter review safely.

Benefits:
- Restores the review flow to a logically consistent state.
- Makes follow-up review explicit.

Risks:
- Changes production state.
- Requires careful downstream cleanup for profile, registry, ranking, and notification traces.

### Plan C: Preserve the record but mark `certificate_status = suspended`

Use when you need to preserve the historical issuance event but clearly mark it as inactive pending investigation.

Benefits:
- Preserves history while signaling that the certificate cannot be trusted operationally.
- Safer than hard deletion or silent rewinds.

Risks:
- Requires new product semantics for `suspended`.
- Downstream systems must be updated to respect the suspended status.
