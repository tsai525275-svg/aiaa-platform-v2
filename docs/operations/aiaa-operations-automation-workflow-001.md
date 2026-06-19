# AIAA Operations Automation Workflow 001

## Workflow Identity

- name: `AIAA Operations Automation Workflow 001`
- phase: `Phase 2B`
- mode: `Daily read only operations automation`
- authority level: `Recommendation only`
- production write policy: `Human gated production write`

## Automation Purpose

This workflow exists to:

- start the daily AIAA operations check
- confirm website status
- confirm deployment status
- confirm application queue
- confirm exam queue
- confirm notification queue
- confirm certificate risk
- activate the Paperclip 6-agent read-only recommendation workflow

This workflow does not:

- execute production write
- approve
- reject
- issue certificates
- send real email
- process payment

## Operating Authority

- Codex is AIAA Operations Controller
- Codex controls workflow execution
- Codex gives instructions to Paperclip CEO
- Paperclip CEO coordinates agents
- CTO manages workflow architecture
- Certification Reviewer reviews application readiness
- Exam Reviewer reviews exam readiness
- QA and Risk Controller blocks unsafe operations
- Codex Engineering Manager verifies deployment and script safety
- human owner is the only authority for production write approval

## Daily Automation Trigger

- trigger type: `weekday morning operations reminder`
- recommended schedule: `workdays 07:00 local time`

Daily automation should instruct Codex to:

- check production readiness
- check git state
- check website routes
- check operational queues
- run read only reports
- ask Paperclip CEO to coordinate agents
- collect department recommendations
- produce CEO consolidated memo
- prepare human decision checklist

## Daily Automation Execution Steps

### Step 1

Confirm current production deployment is `READY`.

### Step 2

Confirm current commit and branch.

### Step 3

Confirm git working tree is clean.

### Step 4

Check website routes:

- `/`
- `/apply`
- `/login`

### Step 5

Read operating state:

- applications
- precheck status
- exam status
- notifications
- email queue
- certificates
- reviewer actions

### Step 6

CEO assigns tasks to 6 agents.

### Step 7

Agents return:

- observations
- recommendations
- risk flags
- required human decision
- blocked actions confirmed

### Step 8

CEO consolidates daily decision memo.

### Step 9

Codex prepares human approval checklist only if action is required.

### Step 10

Stop.

No production write.

## Paperclip 6-Agent Workflow

### CEO

- coordinates the operation
- collects briefs
- creates consolidated memo
- cannot approve or write

### CTO

- checks workflow design
- checks automation boundary
- checks monitoring architecture
- cannot enable autonomous production writes

### Certification Reviewer

- reviews submitted and pending applications
- recommends approve, revision, reject, or insufficient data
- cannot execute action

### Exam Reviewer

- reviews exam submitted cases and exam review required cases
- checks score, declaration, evidence
- cannot approve or reject

### QA and Risk Controller

- checks pollution case, unlocked exams, notification backlog, certificate risk
- can block unsafe workflow
- cannot mutate data

### Codex Engineering Manager

- checks deployment, git, scripts, secrets, dry run defaults
- cannot run live write

## Required Daily Output

Each daily automation run should create or update a read only operations report with:

- date
- production deployment status
- current commit
- website status
- application queue summary
- exam queue summary
- notification queue summary
- certificate status
- risk flags
- agent recommendations
- CEO memo
- required human decisions
- blocked actions confirmed

## Hard Blocked Actions

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
- production data mutation
- scheduled POST
- heartbeat write
- autonomous write loop
- secret exposure
- `.env` modification
- `.env.local` modification
- action on `34a57a22-dccc-4a77-8260-5ce4a8564f5a`

## Human Decision Gate

Before any future controlled write, Codex must prepare:

- target application id
- real user or test user classification
- selected action
- reason
- expected `current_state`
- rollback plan
- verification checklist
- phase authorization
- explicit human approval request

No write can happen unless the human owner explicitly approves the exact action.

## Recommended ChatGPT Automation Instruction

Daily automation should say:

```text
Run AIAA daily operations check in read only mode.
Act as AIAA Operations Controller.
Check production deployment, website routes, git status, application queue, exam queue, notifications, certificate risk, and Paperclip 6-agent workflow status.
Ask Paperclip CEO to coordinate CEO, CTO, Certification Reviewer, Codex Engineering Manager, Exam Reviewer, and QA and Risk Controller.
Return observations, recommendations, risk flags, required human decisions, and blocked actions.
Do not execute POST.
Do not approve, reject, issue certificate, send email, process payment, modify production data, or request secrets.
```

## Current Phase Rule

Phase 2B allows:

- read only monitoring
- recommendation briefs
- CEO decision memos
- human approval preparation
- training documents
- workflow rule documents

Phase 2B does not allow:

- production write automation
- approval automation
- certificate automation
- payment automation
- email send automation
- scheduled production mutation

## Conclusion

AIAA Operations Automation Workflow 001 formalizes Codex-managed daily operations.

Paperclip 6 agents can participate in coordinated read only workflow.

Production writes remain blocked until explicit human approval.
