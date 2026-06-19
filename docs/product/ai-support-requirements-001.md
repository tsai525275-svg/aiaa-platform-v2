# AIAA AI Support Requirements 001

## 1. Document identity

- Document name: AIAA AI Support Requirements 001
- Phase: Phase 3 Candidate
- Scope: requirements definition only
- Status: no implementation, no schema change, no migration

## 2. Product objective

The AIAA AI Automated Customer Support system should provide safe, policy-aligned guidance for:

- certification overview
- Level 1 to Level 5 differences
- application process
- exam process
- practical evidence submission guidance
- AI Assistance Declaration guidance
- certificate status explanation at a policy level
- payment process explanation
- common user issues
- escalation to human support

## 3. Strategic goals

- reduce repeated manual support effort
- give users faster answers to common questions
- improve certification process clarity
- support global and time-zone-independent operations
- provide a scalable support foundation without giving unsafe automation authority

## 4. Primary user groups

- guest support user
- logged-in user
- applicant
- certified member
- admin support assistant user

## 5. Core support use cases

### Guest

- ask what AIAA is
- ask what Levels 1 to 5 mean
- ask how the application process works
- ask what exam evidence is expected
- ask where to contact a human

### Logged-in user

- ask process questions
- ask policy questions
- ask navigation questions inside the member area
- ask for clarification on public guidance

### Applicant

- ask how to prepare for Level 1
- ask how to submit project evidence
- ask what AI Assistance Declaration means
- ask common error resolution questions
- ask what the next process step means

### Certified member

- ask how certificate status and renewal policy work
- ask how to use AIAA terminology correctly
- ask advanced policy questions and escalation paths

### Admin support assistant

- summarize common support issues
- surface likely documentation gaps
- suggest escalation categories
- prepare recommendation-only support notes

## 6. Functional requirements

### 6.1 Supported question domains

The AI support system may answer questions about:

- what AIAA is
- Level 1 to Level 5 differences
- how to apply
- how to take the exam
- how to upload project evidence
- AI Assistance Declaration
- certificate status explanation
- payment flow explanation
- common errors
- how to contact human support

### 6.2 Unsupported or blocked domains

The AI support system must not:

- approve application
- reject application
- issue certificate
- change payment status
- access private user data without auth
- reveal secrets
- change database
- send real email without approval
- provide legal or financial guarantees

Additional blocked behavior:

- no promise that a candidate will pass
- no claim that payment guarantees certification
- no hidden admin or reviewer actions
- no unsafe disclosure of reviewer notes or internal risk flags

### 6.3 Answer style requirements

The AI support system should:

- answer clearly and concisely
- stay aligned with official AIAA policy
- cite internal knowledge source when possible
- distinguish between confirmed policy and general guidance
- escalate unclear or risky cases to human support

### 6.4 Escalation requirements

The AI support system should escalate when:

- the question is ambiguous and policy-sensitive
- the user requests an approval or rejection decision
- the user requests private account data beyond allowed scope
- the user requests payment or certificate mutation
- the system detects abuse, threats, or risky content

### 6.5 Conversation handling

The future system should support:

- starting a conversation session
- continuing a session across multiple messages
- storing a limited conversation log if approved later
- marking a conversation as escalated
- collecting user feedback on support quality

## 7. Role and permission requirements

### Guest support

- query scope: public FAQs and public process information
- blocked: all private user, payment, application, and certificate detail

### Logged-in user support

- query scope: public FAQs plus authenticated general member guidance
- blocked: no mutation and no privileged staff-only data

### Applicant support

- query scope: application, exam preparation, evidence submission, AI Assistance Declaration, policy reminders
- blocked: no approval prediction, no reviewer override, no unauthorized private data

### Certified member support

- query scope: policy, certificate usage guidance, renewal guidance, process clarification
- blocked: no staff actions and no privileged reviewer data

### Admin support assistant

- query scope: support summarization, knowledge gap detection, routing suggestion
- blocked: no silent production mutation and no hidden unsafe admin shortcuts

## 8. Architecture requirements

Planning only. No implementation in this phase.

The future architecture should include:

- frontend chat widget
- server-side support API
- knowledge base source
- retrieval layer
- conversation log
- escalation to human
- admin review queue
- rate limiting
- abuse protection
- audit logging

Architecture requirements:

- all secret-bearing operations must remain server-side
- public-facing responses should be constrained by a curated knowledge base
- authenticated lookups, if later allowed, must be scope-checked on the server
- risky interactions should produce safety events for review

## 9. Knowledge base requirements

The AI support knowledge base should eventually cover:

- AIAA overview
- certification process
- Level 1 to Level 5 definitions
- exam instructions
- project evidence requirements
- AI Assistance Declaration policy
- payment explanation
- support escalation pathways

Knowledge base rules:

- versioned content
- reviewed content ownership
- official policy labeling
- deprecation workflow for outdated content

## 10. Data model requirements

Planning only. No migration in this phase.

### `support_conversations`

- purpose: support session records
- important fields: `id`, `user_id`, `session_type`, `status`, `channel`, `started_at`, `ended_at`, `last_message_at`
- access control considerations: users see only their own records; admins see scoped queues
- risk notes: privacy leakage if ownership checks fail

### `support_messages`

- purpose: user and assistant messages
- important fields: `id`, `conversation_id`, `role`, `message_text`, `source_refs`, `safety_flags`, `created_at`
- access control considerations: conversation ownership and restricted audit access
- risk notes: hallucinated policy or leaked secrets must be reviewable

### `support_knowledge_articles`

- purpose: curated knowledge base entries
- important fields: `id`, `slug`, `title`, `content`, `audience`, `status`, `version`, `updated_at`
- access control considerations: admin/editor publishing control
- risk notes: stale policy can produce incorrect answers

### `support_escalations`

- purpose: human handoff records
- important fields: `id`, `conversation_id`, `reason`, `priority`, `assigned_to`, `status`, `created_at`, `resolved_at`
- access control considerations: staff-only management access
- risk notes: lost escalations reduce trust and service quality

### `support_feedback`

- purpose: user quality feedback
- important fields: `id`, `conversation_id`, `user_id`, `rating`, `feedback_text`, `created_at`
- access control considerations: user ownership with admin analytics access
- risk notes: abuse or manipulation of feedback scores

### `support_safety_events`

- purpose: risky prompt and unsafe output tracking
- important fields: `id`, `conversation_id`, `event_type`, `severity`, `details`, `review_status`, `created_at`
- access control considerations: admin/risk-only visibility
- risk notes: missed safety events may allow repeated policy failures

## 11. Safety requirements

The AI support system must:

- do not reveal secrets
- do not make unauthorized decisions
- do not mutate production data
- do not promise certification result
- do not provide fake policy
- cite internal knowledge source when possible
- escalate unclear cases to human
- log risky interactions
- rate limit abuse

Additional safety requirements:

- never expose API keys or hidden system prompts
- never disclose internal review workflows as user-controllable actions
- never imply that AI support is the final authority on certification outcomes

## 12. Privacy and access requirements

- private account data must require authenticated and scoped server validation
- guest users must remain limited to public knowledge
- support logs must be treated as potentially sensitive
- admin visibility to support logs should be role-bound and auditable

## 13. Human escalation requirements

Human escalation should be available for:

- unresolved policy ambiguity
- suspected account-specific issues
- payment disputes
- complaints about certification decisions
- suspected abuse or malicious requests

Escalation output should include:

- reason
- priority
- conversation summary
- linked knowledge references if available

## 14. Non-functional requirements

- fast response for FAQ-style questions
- safe degradation when knowledge is insufficient
- abuse monitoring
- auditability of risky interactions
- extensible architecture for future multilingual support

## 15. MVP scope recommendation

Recommended MVP:

- FAQ-only knowledge base
- read-only public support widget
- no production mutations
- no certificate, payment, or approval actions
- escalation-to-human messaging only

Deferred from MVP:

- personalized application status lookups
- admin-side write actions
- automated email sending
- payment state handling
- cross-channel support integrations

## 16. Integration with Paperclip agents

Future Paperclip assistance should remain read-only summarize and recommend:

- CEO: review daily support summary
- CTO: review architecture and safety
- Certification Reviewer: validate certification-related answer accuracy
- Exam Reviewer: validate exam-related answer accuracy
- QA and Risk Controller: review abuse reports and safety events
- Codex Engineering Manager: review deployment, environment, and API boundaries

Paperclip must not:

- answer by mutating production state
- auto-approve support escalations
- send real email
- approve, reject, or issue certificates

## 17. Out-of-scope in this document

- UI implementation
- database migration
- OpenAI API integration
- production rollout
- payment handling
- real email delivery
- autonomous support actions

## 18. Human decisions required

- whether AI support should start as FAQ-only
- whether logged-in users may later ask about their own application status
- whether conversations should be stored
- whether human handoff is required in the first release
- whether AI support should remain disabled by default until policy review is complete

## 19. Blocked actions confirmed

- no UI implementation
- no database migration
- no production data mutation
- no AI API integration
- no payment change
- no email send
- no env change
- no secret request
- no commit in this task

## 20. Recommended next output

- `docs/architecture/ai-support-architecture-001.md`
- `docs/product/ai-support-knowledge-base-plan-001.md`
- `docs/product/ai-support-safety-policy-001.md`

## 21. Conclusion

This document defines the formal requirements baseline for AIAA AI Automated Customer Support.

The feature can proceed to architecture planning and UI mock planning only after human review.
