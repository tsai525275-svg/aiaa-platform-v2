# AIAA Website Feature Expansion Plan 001

## 1. Plan identity

- Plan name: AIAA Website Feature Expansion Plan 001
- Phase: Phase 3 Candidate
- Scope: Feature planning only
- Implementation state: No production implementation

## 2. Feature overview

### Feature A

Community Discussion Forum

### Feature B

AI Automated Customer Support

## 3. Strategic purpose

These two features are important because they can:

- increase member retention and repeat engagement
- build a recognizable AIAA community around certification and AI Agent building
- make the certification system more transparent through open discussion and documented answers
- reduce manual support cost by handling common questions safely
- increase trust by giving users clearer operational visibility
- support global operations with scalable community and support channels
- help AIAA evolve from a certification platform into an AI Agent ecosystem

## 4. Community Discussion Forum scope

Planned forum capabilities:

- public discussion categories
- member-only discussion categories
- certification Q&A
- Level 1 to Level 5 study discussion
- AI Agent project showcase
- enterprise use case discussion
- announcements
- moderation queue
- report abuse
- pinned posts
- search
- user profile link
- admin moderation tools

## 5. Community Forum user roles

### Guest

- read: public categories only
- create post: no
- reply: no
- edit own post: no
- delete own post: no
- report content: limited or captcha-protected
- pin content: no
- moderate content: no
- ban user: no

### Registered user

- read: public + user-eligible categories
- create post: yes in allowed categories
- reply: yes
- edit own post: yes within policy window
- delete own post: yes within policy limits
- report content: yes
- pin content: no
- moderate content: no
- ban user: no

### Applicant

- read: public + applicant support areas
- create post: yes
- reply: yes
- edit own post: yes
- delete own post: yes within policy limits
- report content: yes
- pin content: no
- moderate content: no
- ban user: no

### Certified member

- read: public + certified member areas
- create post: yes
- reply: yes
- edit own post: yes
- delete own post: yes within policy limits
- report content: yes
- pin content: no
- moderate content: no
- ban user: no

### Moderator

- read: all moderation-visible areas
- create post: yes
- reply: yes
- edit own post: yes
- delete own post: yes
- report content: yes
- pin content: limited
- moderate content: yes
- ban user: no direct permanent ban unless policy allows

### Admin

- read: all
- create post: yes
- reply: yes
- edit own post: yes
- delete own post: yes
- report content: yes
- pin content: yes
- moderate content: yes
- ban user: yes with audit log

## 6. Community Forum data model draft

Planning only. No migration in this phase.

### `forum_categories`

- purpose: define discussion spaces and visibility rules
- important fields: `id`, `slug`, `name`, `description`, `visibility`, `sort_order`, `posting_policy`, `is_announcements`, `created_at`
- access control considerations: some categories may be public read but auth-only write; some categories may be members-only
- risk notes: incorrect visibility settings could expose private discussions

### `forum_posts`

- purpose: store top-level discussion topics
- important fields: `id`, `category_id`, `author_user_id`, `title`, `body`, `status`, `is_pinned`, `reply_count`, `view_count`, `last_activity_at`, `created_at`, `updated_at`
- access control considerations: enforce author ownership for edits; moderators/admins need override rights
- risk notes: spam, malicious links, impersonation, fake certification claims

### `forum_comments`

- purpose: store replies under posts
- important fields: `id`, `post_id`, `author_user_id`, `body`, `status`, `parent_comment_id`, `created_at`, `updated_at`
- access control considerations: ownership rules and moderation visibility rules
- risk notes: harassment, spam waves, hidden malicious code snippets

### `forum_reactions`

- purpose: lightweight engagement signals such as like or endorse
- important fields: `id`, `post_id`, `comment_id`, `user_id`, `reaction_type`, `created_at`
- access control considerations: one user per target per reaction policy
- risk notes: reaction abuse and low-quality engagement manipulation

### `forum_reports`

- purpose: user reports for abuse, spam, policy violations, or impersonation
- important fields: `id`, `reporter_user_id`, `target_type`, `target_id`, `reason`, `details`, `status`, `reviewed_by`, `reviewed_at`, `created_at`
- access control considerations: reporter privacy and moderator/admin-only review access
- risk notes: retaliatory false reports and sensitive evidence handling

### `forum_moderation_actions`

- purpose: immutable moderation audit trail
- important fields: `id`, `target_type`, `target_id`, `action_type`, `reason`, `moderator_user_id`, `metadata`, `created_at`
- access control considerations: append-only admin/moderator visibility
- risk notes: missing audit trail weakens trust and compliance posture

### `forum_user_badges`

- purpose: show community trust signals such as applicant, certified member, moderator
- important fields: `id`, `user_id`, `badge_type`, `label`, `issued_by`, `issued_at`, `expires_at`
- access control considerations: admin-controlled badge issuance only
- risk notes: false badge assignment could misrepresent certification status

## 7. Community Forum safety rules

- no spam
- no illegal content
- no hate or harassment
- no credential sharing
- no API key sharing
- no fake certification claim
- no impersonation
- no malicious code sharing
- moderation required for risky reports
- admin audit log required

## 8. AI Automated Customer Support scope

The AI support system may answer:

- what AIAA is
- Level 1 to Level 5 differences
- how to apply
- how to take the exam
- how to upload project evidence
- AI Assistance Declaration requirements
- certificate status explanation at a policy level
- payment flow explanation
- common user errors
- how to contact human support

The AI support system may not:

- approve application
- reject application
- issue certificate
- change payment status
- access private user data without auth
- reveal secrets
- change database
- send real email without approval
- provide legal or financial guarantees

## 9. AI Support user roles and permissions

### Guest support

- query scope: public FAQs and public certification/process information
- blocked: any private account, application, payment, or certificate detail

### Logged-in user support

- query scope: public FAQs plus authenticated generic member guidance
- blocked: no mutation, no privileged admin data, no other user information

### Applicant support

- query scope: application process help, exam preparation guidance, upload guidance, policy reminders
- blocked: no approval prediction, no reviewer override, no unauthorized status disclosure beyond allowed account context

### Certified member support

- query scope: certificate usage guidance, renewal policy, member process support
- blocked: no administrative actions, no private reviewer data

### Admin support assistant

- query scope: internal support summaries, policy references, routing suggestions
- blocked: no silent database mutation, no certificate issuance, no hidden unsafe admin shortcuts

## 10. AI Support architecture draft

Planning only. No implementation in this phase.

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

Recommended architecture direction:

- public-facing chat should use a constrained FAQ and policy knowledge layer first
- authenticated support lookups, if ever allowed later, should require server-side auth and scoped retrieval
- all risky prompts should be logged and escalated instead of answered with speculation

## 11. AI Support data model draft

Planning only. No migration in this phase.

### `support_conversations`

- purpose: top-level support session records
- important fields: `id`, `user_id`, `session_type`, `status`, `channel`, `started_at`, `ended_at`, `last_message_at`
- access control considerations: user sees own conversations; admins see scoped support queue
- risk notes: privacy exposure if conversation ownership is not enforced

### `support_messages`

- purpose: individual user and assistant messages
- important fields: `id`, `conversation_id`, `role`, `message_text`, `source_refs`, `safety_flags`, `created_at`
- access control considerations: strict conversation ownership and admin audit access
- risk notes: leaked secrets or hallucinated policy must be detectable

### `support_knowledge_articles`

- purpose: curated support knowledge base
- important fields: `id`, `slug`, `title`, `content`, `audience`, `status`, `version`, `updated_at`
- access control considerations: admin/editor managed publishing rights
- risk notes: stale or inaccurate policy content can mislead users

### `support_escalations`

- purpose: human handoff records
- important fields: `id`, `conversation_id`, `reason`, `priority`, `assigned_to`, `status`, `created_at`, `resolved_at`
- access control considerations: support/admin-only management
- risk notes: missed escalations can create trust issues

### `support_feedback`

- purpose: user feedback on support usefulness and accuracy
- important fields: `id`, `conversation_id`, `user_id`, `rating`, `feedback_text`, `created_at`
- access control considerations: user ownership plus admin analysis
- risk notes: abuse of feedback channels and signal manipulation

### `support_safety_events`

- purpose: risky prompt, unsafe output, or abuse incident logging
- important fields: `id`, `conversation_id`, `event_type`, `severity`, `details`, `review_status`, `created_at`
- access control considerations: admin/risk controller visibility only
- risk notes: if not reviewed, unsafe behavior may repeat

## 12. AI Support safety rules

- do not reveal secrets
- do not make unauthorized decisions
- do not mutate production data
- do not promise certification result
- do not provide fake policy
- cite internal knowledge source when possible
- escalate unclear cases to human
- log risky interactions
- rate limit abuse

## 13. Integration with Paperclip agents

Future Paperclip support should be limited to read-only summarize and recommend.

- CEO: review daily community and support summary
- CTO: review architecture and safety
- Certification Reviewer: review certification-related Q&A accuracy
- Exam Reviewer: review exam-related Q&A accuracy
- QA and Risk Controller: review abuse reports and AI support safety events
- Codex Engineering Manager: review deployment, scripts, environment, and API boundaries

Paperclip agents must not automatically:

- delete posts
- ban users
- approve applications
- reject applications
- issue certificates

## 14. Development phases

### Phase 3A

Product requirements and UI mock planning

### Phase 3B

Database schema draft and RLS plan

### Phase 3C

Community forum MVP read/write implementation in development only

### Phase 3D

Forum moderation tools

### Phase 3E

AI support knowledge base

### Phase 3F

AI support chat widget development only

### Phase 3G

Human escalation workflow

### Phase 3H

Production readiness review

## 15. MVP recommendation

Recommended first steps:

- forum read-only category page
- authenticated post creation in development
- basic moderation queue
- support FAQ knowledge base
- AI support disabled by default until API key and policy are ready

## 16. Risk register

| Risk | Severity | Mitigation | Owner agent |
| --- | --- | --- | --- |
| Spam | High | rate limits, report flow, moderation queue, first-post restrictions | QA and Risk Controller |
| Toxic content | High | moderation policy, report abuse tools, escalation workflow | QA and Risk Controller |
| Fake certification claims | High | verified badges, admin audit review, claim-report workflow | Certification Reviewer |
| Privacy exposure | High | strict auth scopes, RLS planning, minimal data retrieval | CTO |
| AI hallucination | High | curated knowledge base, source citation, escalation to human | CTO |
| Unauthorized support action | High | hard block sensitive actions, audit logging, controller gate | Codex Engineering Manager |
| API key exposure | Critical | server-only secret handling, no client exposure, audit review | Codex Engineering Manager |
| Database abuse | High | RLS, rate limits, admin audit logs, moderation tooling | CTO |
| Moderation workload | Medium | staged launch, queue tooling, clear moderation categories | CEO |
| Legal/compliance confusion | High | policy review, careful wording, human escalation on unclear matters | CEO |

## 17. Human decisions required

The human owner must decide:

- whether the forum should be public
- whether only members may create posts
- whether the first post from a user requires manual review
- whether AI support should answer FAQ only at first
- whether AI support may read the logged-in user's application status later
- whether support conversations should be stored
- whether human support escalation should be enabled from day one
- whether production write should remain disabled in the first release stages

## 18. Blocked actions confirmed

This planning round confirms:

- no UI implementation
- no database migration
- no production data mutation
- no AI API integration
- no payment change
- no email send
- no env change
- no secret requested
- no commit

## 19. Recommended next output

Recommended next planning documents:

- `docs/product/community-forum-requirements-001.md`
- `docs/product/ai-support-requirements-001.md`
- `docs/architecture/community-forum-data-model-001.md`
- `docs/architecture/ai-support-architecture-001.md`

## 20. Conclusion

This document defines the strategic direction for new AIAA website capabilities only.

Community Forum and AI Automated Customer Support can enter Phase 3 planning.

Human approval is required before any production implementation begins.
