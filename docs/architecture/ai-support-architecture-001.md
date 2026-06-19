# AIAA AI Support Architecture 001

## Scope

This document defines the architecture draft for the AIAA AI Automated Customer Support MVP and its future server-side evolution.

This is a design document only.

- no migration executed
- no production database change
- no live AI API integration

## Frontend architecture

The MVP frontend currently consists of:

- support page
- FAQ / knowledge base view
- rules-based chat widget UI
- suggested questions
- escalation to human support UI
- feedback UI
- safety notice panels

Future frontend checklist:

- persist conversation history only after approved data model exists
- separate guest and authenticated support experiences
- add safe loading, empty, and error states for real API mode

## Server-side support API draft

Future server-side API responsibilities:

- receive support question
- identify authenticated scope if applicable
- query allowed knowledge source
- apply safety filter
- produce answer or escalation response
- write optional conversation and safety event logs if approved later

Future API checklist:

- keep all secret-bearing operations server-side
- no direct client-side model access
- rate limiting required
- abuse protection required
- audit logging required

## Retrieval layer draft

Recommended retrieval sources:

- curated support knowledge articles
- official AIAA process and policy pages
- controlled internal support notes if approved later

Retrieval rules:

- public users: public knowledge only
- authenticated users: still policy-limited unless explicit scoped private lookup is approved later
- do not retrieve hidden reviewer notes, secrets, or internal decision records

## Safety filter draft

The safety filter should detect and block or escalate:

- approval or rejection requests
- certificate issuance requests
- payment mutation requests
- private data requests without authorization
- secret extraction attempts
- legal or financial guarantee requests
- attempts to force unsupported decisions

Safety outcomes:

- safe answer
- refusal with explanation
- escalation required
- safety event log candidate

## Core tables

### `support_conversations`

Purpose:

- top-level support session record

Important fields:

- `id`
- `user_id`
- `session_type`
- `status`
- `channel`
- `started_at`
- `ended_at`
- `last_message_at`

RLS considerations:

- user may read only their own conversation
- admin/support roles may read scoped queues

Risk notes:

- privacy exposure
- accidental cross-user access

### `support_messages`

Purpose:

- store user and assistant messages

Important fields:

- `id`
- `conversation_id`
- `role`
- `message_text`
- `source_refs`
- `safety_flags`
- `created_at`

RLS considerations:

- tied to conversation ownership
- restricted admin access for audit

Risk notes:

- hallucinated policy
- leaked sensitive text

### `support_knowledge_articles`

Purpose:

- store curated support content for retrieval

Important fields:

- `id`
- `slug`
- `title`
- `content`
- `audience`
- `status`
- `version`
- `updated_at`

RLS considerations:

- editor/admin-only write
- public read only for published public knowledge

Risk notes:

- stale policy
- undocumented edits

### `support_escalations`

Purpose:

- record support cases that must be handled by a human

Important fields:

- `id`
- `conversation_id`
- `reason`
- `priority`
- `assigned_to`
- `status`
- `created_at`
- `resolved_at`

RLS considerations:

- staff-only access
- no public visibility

Risk notes:

- dropped escalations
- missing ownership

### `support_feedback`

Purpose:

- capture user rating and quality notes

Important fields:

- `id`
- `conversation_id`
- `user_id`
- `rating`
- `feedback_text`
- `created_at`

RLS considerations:

- user sees own feedback only if exposed
- admin analytics access only

Risk notes:

- abuse
- low-signal noise

### `support_safety_events`

Purpose:

- log risky prompts, blocked requests, or unsafe output candidates

Important fields:

- `id`
- `conversation_id`
- `event_type`
- `severity`
- `details`
- `review_status`
- `created_at`

RLS considerations:

- admin/risk-only access
- append-only preferred

Risk notes:

- ignored safety events
- loss of traceability

## Escalation flow draft

1. User asks a question
2. Support system checks knowledge scope and safety pattern
3. If safe, return constrained answer with source references where possible
4. If unsafe or ambiguous, return escalation guidance
5. Future production path may create `support_escalations`
6. Human owner or support role handles final decision

## Rate limiting draft

Recommended controls:

- per-IP guest limit
- per-session limit
- repeated risky prompt throttling
- escalation submission limit
- burst protection for abuse attempts

## Audit logging draft

Recommended audit coverage:

- support answer mode
- safety filter decision
- escalation trigger
- admin review action
- knowledge article version used

## Future API integration checklist

- choose model/provider only after secret handling is approved
- implement server-only model calls
- add structured safety layer before model output reaches user
- add observability for support error paths
- add human review queue for escalated cases

## Risk summary

- hallucination
- unauthorized support action
- private data exposure
- secret leakage
- abuse escalation spam
- support answers mistaken for final AIAA decisions

## Conclusion

The AI support architecture is ready for deeper API planning, retrieval design, and RLS/schema draft work.

No production mutation or real AI API integration was performed in this sprint.
