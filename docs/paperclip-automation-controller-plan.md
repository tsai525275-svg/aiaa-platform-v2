# Paperclip Automation Controller Plan

## 1. Objective

Codex manages Paperclip through a controlled command layer.

Paperclip cannot perform unrestricted writes.

All write actions require explicit gate conditions.

## 2. Architecture

The automation controller model includes:

- Codex
- Paperclip Agents
- AIAA Admin API
- Supabase
- Vercel Environment Variables
- Audit Logs
- Human Approval Gate

## 3. Operating Modes

### Read Only Mode

- read applications
- read application detail
- read exam package
- no POST

### Dry Run Mode

- prepare command
- validate prerequisites
- print intended write action
- no POST

### Controlled Write Mode

- only for explicitly allowed actions
- only after user approval
- only with controller gates satisfied

### Recommendation Mode

- Paperclip produces reviewer recommendations
- Paperclip produces risk summaries
- Codex prepares possible next steps
- no write authority implied

### Blocked Mode

- missing prerequisites
- risk tier not allowed
- unknown action
- dirty state or missing approval
- no write allowed

## 4. Action Risk Tiers

### Tier 0 Read Only

- read applications
- read application detail
- read exam package

### Tier 1 Low Risk

- `revision-required` on test application only

### Tier 2 Medium Risk

- `precheck-reject` on test application only

### Tier 3 High Risk

- `precheck-approve` Level 1 only after rule matrix accepted

### Tier 4 Blocked

- `review-approve`
- `review-reject`
- `issue-certificate`
- payment
- real email send
- rankings mutation
- news mutation
- heartbeat write
- unrestricted scheduled POST

## 5. Required Gates for Every Write

Every write must require:

- explicit user approval
- ALLOW flag
- application id
- action name
- reason or note
- test application confirmation
- deployment READY
- git clean
- `current_state` returned
- reviewer action verification
- notification verification
- no certificate mutation unless the action explicitly allows it

## 6. Codex Responsibilities

Codex is responsible for:

- generating plans
- inspecting scripts
- running dry runs
- preparing commands
- validating git status
- producing verification checklists
- never exposing secrets
- never running writes without explicit user confirmation

## 7. Paperclip Responsibilities

Paperclip is responsible for:

- reading application data
- generating reviewer recommendations
- generating risk summaries
- generating evidence sufficiency notes
- never POST unless the controller gate allows it

## 8. Human Approval Gate

The user must confirm each live write.

There is no blanket approval.

There is no background automation.

There is no heartbeat write.

There is no scheduled POST.

There are no production writes against real users until a later phase is explicitly approved.

## 9. Secret Handling

`PAPERCLIP_ADMIN_API_KEY` may exist only in:

- local shell
- Vercel environment variables

It must never appear in:

- chat
- docs
- repo
- logs

## 10. Allowed Near-Term Roadmap

- Phase 2A accepted `revision-required`
- Phase 2B document planning
- Phase 2B future `precheck-reject` test
- Phase 2C `precheck-approve` readiness
- Phase 3 review recommendation
- Phase 4 controlled review write
- Phase 5 payment gate
- Phase 6 certificate gate
- Phase 7 limited automation

No full automation before Phase 7.

## 11. Stop Conditions

Automation must stop when any of the following occurs:

- missing key
- missing application id
- not a test application
- issued certificate
- already unlocked exam
- real user data
- unexpected `current_state`
- duplicate write
- non-READY deployment
- dirty git tree
- unknown action
- guardrail mismatch

## 12. Audit Requirements

Every allowed write must return:

- `ok`
- `action`
- `application_id`
- `reviewer_action_id`
- `notification_id`
- `current_state`
- `message`

Every test must have a document record.

## 13. Conclusion

Codex may manage Paperclip only through controlled command planning.

Paperclip must not receive unrestricted automation authority.

Full automation remains blocked.
