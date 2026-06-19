# AIAA Operations Command Center Phase 2B

## 1. Objective

Codex manages AIAA operations by coordinating Paperclip agents.

All actions are read only or recommendation only.

No autonomous production writes are allowed in this phase.

## 2. Command Structure

- Codex = Operations Controller
- Paperclip AIAA AI CEO = executive coordinator
- Certification Reviewer = application review recommendations
- Exam Reviewer = exam package review recommendations
- QA and Risk Controller = risk, guardrails, pollution checks
- Codex Engineering Manager = script and deployment readiness

Inactive roles in this phase:

- No Certificate Officer active
- No Notification Officer active

## 3. Operating Loop

Step 1: Codex checks Vercel deployment state

Step 2: Codex checks git status

Step 3: Codex reads applications

Step 4: Codex identifies new submitted applications

Step 5: Codex asks Paperclip CEO for daily operating brief

Step 6: CEO assigns review tasks to departments

Step 7: departments return recommendations

Step 8: Codex compiles report

Step 9: user manually approves any controlled write

Step 10: Codex prepares the exact command only after approval

## 4. Website Monitoring Scope

- homepage availability
- apply page availability
- login flow status
- application submission count
- submitted applications
- pending precheck applications
- under review applications
- revision required applications
- exam not started
- exam submitted
- exam review required
- certificate issued count
- notification queue pending
- reviewer action count
- known pollution case status
- Vercel deployment state

## 5. Paperclip CEO Instruction Template

Reusable CEO command:

```text
Read current AIAA operating state.
Do not write.
Do not approve.
Do not reject.
Do not issue certificates.
Prepare an operating brief.
Assign read only review tasks to Certification Reviewer, Exam Reviewer, QA and Risk Controller.
Return recommendations only.
```

## 6. Department Task Templates

### Certification Reviewer

- review pending applications
- check evidence sufficiency
- recommend precheck approve, revision required, or reject
- no POST

### Exam Reviewer

- review exam package
- check score
- check AI Assistance Declaration
- check practical evidence
- recommend review action only
- no POST

### QA and Risk Controller

- check guardrails
- check issued pollution case
- check unexpected unlocked exams
- check certificate mutation risk
- check notification risk
- no mutation

### Codex Engineering Manager

- check deployment READY
- check git clean
- check scripts
- check dry run readiness
- no live write

## 7. Report Format

- daily summary
- new applications
- pending precheck
- exam queue
- risk flags
- recommended actions
- blocked actions
- required human decisions
- next safe command

## 8. Write Gate

No write unless:

- user explicitly approves one action
- target application id is confirmed
- action is explicitly selected
- reason is provided
- deployment is READY
- git tree is clean
- action is allowed in current phase
- test application status confirmed
- expected `current_state` is defined
- verification checklist is prepared

## 9. Current Phase Permissions

Allowed:

- read only monitoring
- Paperclip recommendation
- CEO briefing
- department task assignment
- dry run readiness

Blocked:

- full automation
- autonomous POST
- review approve
- issue certificate
- payment
- real email send
- scheduled write
- heartbeat write

## 10. Future Roadmap

- Phase 2B: operations command center read only
- Phase 2C: precheck reject controlled write on test application
- Phase 2D: precheck approve Level 1 strict gate
- Phase 3: review recommendation automation
- Phase 4: controlled review write with human gate
- Phase 5: payment gate
- Phase 6: certificate gate
- Phase 7: limited automation
- Phase 8: scoped autonomous operations

## 11. Stop Conditions

- deployment not READY
- git dirty
- API key missing
- API key printed
- unknown action
- real user write attempt
- issued certificate case
- already unlocked exam
- unexpected state
- Paperclip attempts unrestricted write

## 12. Conclusion

AIAA can start operations automation now only as a read only command center.

Codex can manage Paperclip as a workflow coordinator.

Paperclip CEO can assign work to agents.

No full production write automation is allowed yet.
