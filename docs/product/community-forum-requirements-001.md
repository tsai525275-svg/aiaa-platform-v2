# AIAA Community Forum Requirements 001

## 1. Document identity

- Document name: AIAA Community Forum Requirements 001
- Phase: Phase 3 Candidate
- Scope: requirements definition only
- Status: no implementation, no schema change, no migration

## 2. Product objective

The AIAA Community Discussion Forum should provide a structured place for:

- members to discuss certification and AI Agent building
- applicants to ask process and exam questions
- certified members to share project evidence and study experience
- enterprise users to discuss operational and deployment use cases
- AIAA to publish announcements and maintain trust through visible discussion

## 3. Strategic goals

- increase member engagement
- build an AIAA knowledge-sharing community
- improve transparency around certification and exams
- surface high-quality AI Agent project examples
- reduce repeated support questions by making answers discoverable
- strengthen AIAA brand credibility as an AI Agent ecosystem

## 4. Primary user groups

- guest
- registered user
- applicant
- certified member
- moderator
- admin

## 5. Core use cases

### Guest

- browse public announcements
- browse selected public discussion categories
- search public discussions
- decide whether to register

### Registered user

- create a discussion post in allowed categories
- reply to existing topics
- edit or delete own content within policy limits
- report spam, abuse, impersonation, or fake certification claims

### Applicant

- ask certification process questions
- discuss Level 1 to Level 5 preparation
- share project progress and ask for feedback
- review official announcement threads

### Certified member

- share verified project showcases
- answer community questions
- discuss exam preparation and practical evidence expectations
- contribute to enterprise and advanced practice discussions

### Moderator / Admin

- review abuse reports
- hide or lock problematic content
- pin important posts
- manage categories and moderation queue
- preserve an auditable moderation trail

## 6. Functional requirements

### 6.1 Category system

The forum should support:

- public categories
- member-only categories
- certification Q&A
- Level 1 to Level 5 study discussion
- AI Agent project showcase
- enterprise use case discussion
- announcements
- moderation queue views for authorized staff

Each category should define:

- visibility
- posting eligibility
- reply eligibility
- moderation rules
- sort order

### 6.2 Posts

Users should be able to:

- create a post with title and body
- optionally attach links to GitHub, demo, or project evidence
- edit own post within policy limits
- delete own post within policy limits
- view post status such as active, locked, hidden, or removed

System requirements:

- preserve created and updated timestamps
- preserve author identity and role badge if enabled
- support pinned posts in selected categories

### 6.3 Comments / replies

Users should be able to:

- reply to posts
- optionally reply to a specific comment
- edit own comment within policy limits
- delete own comment within policy limits

System requirements:

- comment threading may be limited to one nesting level in MVP
- moderation status must apply to replies as well as posts

### 6.4 Reactions

The forum may support lightweight reactions such as:

- like
- useful
- endorse

Requirements:

- one reaction per user per target per reaction type
- reaction totals visible on posts and comments

### 6.5 Search

Users should be able to search by:

- category
- title
- content keywords
- author
- tag or topic if tagging is later enabled

MVP recommendation:

- start with keyword search across title and body

### 6.6 Reports and moderation queue

Users should be able to:

- report abuse
- report spam
- report impersonation
- report fake certification claims
- report malicious code or suspicious links

Moderators/admins should be able to:

- review the report queue
- mark reports as open, investigating, resolved, dismissed
- record moderation actions with reasons

### 6.7 Profile linkage

Forum posts should optionally link to a limited public user profile summary, such as:

- display name
- member/applicant/certified badge
- profile link

Sensitive account details must not be exposed.

### 6.8 Admin moderation tools

Admin and moderator tools should support:

- hide content
- lock thread
- pin thread
- remove content with reason
- record moderation action
- review repeat offender history

Permanent user banning should remain admin-only and auditable.

## 7. Role and permission requirements

| Role | Read | Create post | Reply | Edit own | Delete own | Report content | Pin | Moderate | Ban user |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Guest | Public only | No | No | No | No | Limited | No | No | No |
| Registered user | Allowed categories | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Applicant | Allowed categories | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Certified member | Allowed categories | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Moderator | Moderation-visible areas | Yes | Yes | Yes | Yes | Yes | Limited | Yes | No |
| Admin | All | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

## 8. Content states

Forum content should support states such as:

- active
- hidden
- removed
- locked
- pending moderation

Reports should support states such as:

- open
- investigating
- resolved
- dismissed

## 9. Data model requirements

Planning only. No migration in this phase.

### `forum_categories`

- purpose: define discussion spaces
- important fields: `id`, `slug`, `name`, `description`, `visibility`, `posting_policy`, `sort_order`, `is_announcements`, `created_at`
- access control considerations: public read vs members-only read; category-specific posting gates
- risk notes: wrong visibility setting may leak private threads

### `forum_posts`

- purpose: top-level forum discussions
- important fields: `id`, `category_id`, `author_user_id`, `title`, `body`, `status`, `is_pinned`, `reply_count`, `view_count`, `last_activity_at`, `created_at`, `updated_at`
- access control considerations: ownership edit rules; moderator/admin override
- risk notes: spam, scams, impersonation, fake certification statements

### `forum_comments`

- purpose: replies to posts
- important fields: `id`, `post_id`, `author_user_id`, `parent_comment_id`, `body`, `status`, `created_at`, `updated_at`
- access control considerations: ownership control and moderation visibility
- risk notes: harassment and malicious code snippets

### `forum_reactions`

- purpose: simple engagement signals
- important fields: `id`, `user_id`, `post_id`, `comment_id`, `reaction_type`, `created_at`
- access control considerations: deduplicate reactions per user
- risk notes: engagement gaming and low-signal noise

### `forum_reports`

- purpose: abuse and risk report queue
- important fields: `id`, `reporter_user_id`, `target_type`, `target_id`, `reason`, `details`, `status`, `reviewed_by`, `reviewed_at`, `created_at`
- access control considerations: reporter privacy and restricted moderator/admin access
- risk notes: malicious false reporting or sensitive disclosures in reports

### `forum_moderation_actions`

- purpose: moderation audit trail
- important fields: `id`, `target_type`, `target_id`, `action_type`, `reason`, `moderator_user_id`, `metadata`, `created_at`
- access control considerations: append-only, restricted visibility
- risk notes: missing logs weaken trust and compliance

### `forum_user_badges`

- purpose: trusted role and certification display
- important fields: `id`, `user_id`, `badge_type`, `label`, `issued_by`, `issued_at`, `expires_at`
- access control considerations: admin-only badge issuance
- risk notes: false badge assignment could mislead users

## 10. Safety and policy requirements

The forum must enforce:

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

Additional safety requirements:

- suspicious external links should be reviewable
- claim of certification should be challengeable and auditable
- posts representing official AIAA policy should be restricted to trusted roles

## 11. Abuse and moderation requirements

- first-post moderation should remain a human decision
- report abuse flow must exist before wide public write access
- moderation actions must record reason
- moderator actions should be reviewable by admin
- user ban or account sanctions should remain explicit human decisions

## 12. Search and discovery requirements

- support search by keyword
- support browsing by category
- support pinned announcements
- support visible recent activity ordering
- support future tag or topic expansion without redesigning the data model

## 13. Non-functional requirements

- mobile-friendly reading experience
- clear separation between public and authenticated spaces
- auditable moderation activity
- scalable category structure
- protection against spam bursts and repeated abuse

## 14. MVP scope recommendation

Recommended MVP:

- read-only category listing
- public and member-only category separation
- authenticated post creation in development only
- basic reply support
- basic report abuse flow
- basic moderation queue
- pinned announcements

Deferred from MVP:

- advanced reputation systems
- complex threaded replies
- rich embeds beyond safe link previews
- automated moderation decisions

## 15. Out-of-scope in this document

- UI implementation
- database schema migration
- production rollout
- email notification implementation
- automatic moderation actions
- payment integration
- Paperclip write automation

## 16. Human decisions required

- whether the forum is public read or members-only read
- whether only members can create posts
- whether applicants can post in all study categories
- whether first posts require manual moderation
- whether certified badge should be shown publicly
- whether enterprise discussions should be private

## 17. Dependencies for later phases

- UI mock planning
- schema draft and RLS plan
- moderation workflow definition
- notification policy definition
- deployment readiness review

## 18. Blocked actions confirmed

- no UI implementation
- no database migration
- no production data mutation
- no email send
- no env change
- no secret request
- no commit in this task

## 19. Recommended next output

- `docs/architecture/community-forum-data-model-001.md`
- `docs/product/community-forum-ui-mock-plan-001.md`
- `docs/product/community-forum-moderation-policy-001.md`

## 20. Conclusion

This document defines the formal requirements baseline for the AIAA Community Discussion Forum.

The forum can proceed to UI mock planning and architecture planning only after human review.
