# AIAA Daily Operations Run Template 001

## 1. Template Identity

- name: `AIAA Daily Operations Run Template 001`
- phase: `Phase 2B`
- mode: `Read only`
- authority level: `Recommendation only`
- write policy: `Human gated`

## 2. Purpose

Provide a reusable standard template for all future AIAA daily operations runs.

Ensure every run uses consistent structure, agent roles, blocked actions, risk checks, and human decision gates.

## 3. Required Run Header

Every run must include:

- run id
- date
- timestamp
- operator
- production commit
- workflow version
- mode
- write permission status

## 4. Required Safety Declaration

Every run must declare:

- read only mode
- no POST
- no production write
- no approval
- no rejection
- no certificate issue
- no payment mutation
- no email send
- no secret exposure
- no `.env` or `.env.local` modification
- known pollution case blocked

## 5. Production Readiness Section

Include:

- deployment status
- deployment id
- current commit
- branch
- domain
- production ready conclusion

## 6. Git Readiness Section

Include:

- git status
- working tree state
- local branch
- remote sync status
- git readiness conclusion

## 7. Website Route Check Section

Check:

- `/`
- `/apply`
- `/login`

Each route must include:

- route
- HTTP status
- pass/fail
- notes

## 8. Operating Queue Section

Include:

- application queue summary
- precheck status summary
- exam queue summary
- notification queue summary
- pending email queue summary
- certificate status summary
- reviewer action summary

## 9. Paperclip 6-Agent Section

Each agent must report:

### CEO

- observations
- coordination summary
- recommendations
- risk flags
- required human decisions
- blocked actions confirmed

### CTO

- workflow architecture observations
- automation boundary observations
- monitoring recommendations
- production write risk
- required human decisions
- blocked actions confirmed

### Certification Reviewer

- application observations
- pending precheck observations
- recommendation classification
- missing evidence
- required human decisions
- blocked actions confirmed

### Exam Reviewer

- exam observations
- AI Assistance Declaration checks
- score/evidence review needs
- review recommendation only
- required human decisions
- blocked actions confirmed

### QA and Risk Controller

- pollution case status
- unexpected unlocked exams
- notification backlog
- certificate mutation risk
- risk rating
- required human decisions
- blocked actions confirmed

### Codex Engineering Manager

- deployment safety
- git safety
- script dry-run safety
- secret boundary
- scheduled write check
- heartbeat write check
- required human decisions
- blocked actions confirmed

## 10. Recommendation Section

Include:

- immediate recommendations
- deferred recommendations
- blocked recommendations
- next safe step

## 11. Risk Register Section

Include:

- risk id
- risk description
- severity
- current status
- mitigation
- owner agent

## 12. Human Decision Checklist

Include:

- decision needed
- target application id if any
- real/test user classification
- proposed action
- expected `current_state`
- rollback plan required
- verification checklist required
- explicit human approval required

## 13. Blocked Actions Confirmation

Confirm blocked:

- POST
- `ALLOW_PAPERCLIP_WRITE_TEST=true`
- precheck approve
- precheck reject
- revision required live write
- review approve
- review reject
- issue certificate
- payment mutation
- real email send
- production mutation
- scheduled POST
- heartbeat write
- autonomous write loop
- secret exposure
- `.env` modification
- `.env.local` modification
- action on `34a57a22-dccc-4a77-8260-5ce4a8564f5a`

## 14. Required Output Format

Every future daily run should create:

- `docs/operations/daily-operations-run-XXX.md`

## 15. Conclusion Format

Every run must end with:

- production status
- workflow status
- risk status
- write status
- next safe step

## 16. Recommended Automation Prompt

Use the following reusable prompt:

```text
Run AIAA Daily Operations using Daily Operations Run Template 001.
Act as Codex, the AIAA Operations Controller.
Use Paperclip as workflow execution layer.
Coordinate CEO, CTO, Certification Reviewer, Codex Engineering Manager, Exam Reviewer, and QA and Risk Controller.
Operate in read-only mode.
Check production deployment, git state, website routes, application queue, exam queue, notifications, certificates, reviewer actions, risks, and blocked actions.
Produce a daily operations report.
Do not execute POST, approve, reject, issue certificates, send email, process payment, mutate production data, expose secrets, modify .env files, or touch the known pollution case.
```

## 17. Conclusion

This template standardizes all future AIAA daily operations runs.
