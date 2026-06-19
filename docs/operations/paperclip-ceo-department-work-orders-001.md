# AIAA Paperclip CEO Department Work Orders 001

## 1. Work Order Identity

- name: `AIAA Paperclip CEO Department Work Orders 001`
- phase: `Phase 2B`
- mode: `Read only`
- authority level: `Recommendation only`
- production commit: `7c3b75e`

## 2. Operating Context

Current Run 001 operating context:

- application queue:
  - total applications: `3`
  - submitted: `1`
  - pending precheck: `2`
  - under_review: `1`
  - revision_required: `1`
- exam queue:
  - not_started: `2`
  - submitted: `1`
  - exam_review_required: `3`
- notification queue:
  - total notifications: `13`
  - unread notifications: `9`
  - unread `revision_required` notifications: `2`
  - pending email queue: `7`
- certificate status:
  - issued count: `1`
  - issued application id: `34a57a22-dccc-4a77-8260-5ce4a8564f5a`
- known risk flags:
  - known issued pollution case remains present
  - pending email backlog exists
  - reviewer action history includes `revision_required`, `review_approved`, and `certificate_issued`
  - one submitted application still pending precheck
  - one test application remains `revision_required`
  - no unexpected unlocked exams detected

## 3. CEO Command

Paperclip CEO receives instruction from Codex:

```text
Coordinate AIAA operations.
Assign read only tasks to departments.
Collect recommendations.
Do not execute production writes.
```

## 4. Certification Reviewer Work Order

### Scope

- submitted applications
- pending precheck applications
- revision_required applications

### Tasks

- review evidence sufficiency
- classify each pending application as:
  - precheck approve recommendation
  - revision required recommendation
  - precheck reject recommendation
- identify missing evidence
- identify reason required for future action
- return recommendation only

### Blocked

- no precheck approve
- no precheck reject
- no revision required write
- no production mutation

## 5. Exam Reviewer Work Order

### Scope

- exam submitted case
- exam_review_required cases
- not_started exams

### Tasks

- check score status
- check AI Assistance Declaration
- check practical evidence
- check whether human review is required
- prepare review recommendation only

### Blocked

- no review approve
- no review reject
- no certificate issue

## 6. QA and Risk Controller Work Order

### Scope

- known issued pollution case
- notification backlog
- reviewer action history
- unexpected unlocked exams
- certificate mutation risk

### Tasks

- confirm known issued pollution case remains blocked
- confirm no unexpected unlocked exams
- monitor pending email queue backlog
- check risk of accidental certificate mutation
- check blocked action compliance
- return risk brief only

### Blocked

- no data mutation
- no certificate correction
- no email send
- no action on pollution case

## 7. Codex Engineering Manager Work Order

### Scope

- deployment readiness
- git status
- dry run script safety
- Paperclip permission boundary

### Tasks

- confirm production deployment READY
- confirm git clean
- confirm scripts are dry run safe by default
- confirm Paperclip workflow remains read only
- confirm no environment secrets are printed

### Blocked

- no live write
- no env changes
- no scheduled POST
- no heartbeat write

## 8. CEO Collection Format

Each department must return:

- observations
- recommendations
- risk flags
- required human decision
- blocked actions confirmed

## 9. Decision Gate

No action can move forward unless:

- human approves exact action
- target application id is confirmed
- expected `current_state` is defined
- rollback plan is documented
- verification checklist is prepared
- current phase allows the action

## 10. Recommended Output From Next Run

- Certification Reviewer recommendation brief
- Exam Reviewer recommendation brief
- QA risk brief
- Engineering safety brief
- CEO consolidated department report

## 11. Conclusion

Paperclip CEO can coordinate AIAA departments in read only mode.

Codex remains the final operations controller.

Production write automation remains blocked.
