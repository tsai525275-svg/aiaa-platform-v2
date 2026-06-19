# AIAA Community Forum Data Model 001

## Scope

This document defines the architecture draft for the AIAA Community Discussion Forum MVP and its future production-safe evolution.

This is a design document only.

- no migration executed
- no production database change
- no production write enabled

## Core tables

### `forum_categories`

Purpose:

- define top-level discussion spaces
- separate public and member-only visibility
- store posting policy and moderation owner

Important fields:

- `id`
- `slug`
- `name`
- `description`
- `visibility`
- `posting_policy`
- `sort_order`
- `is_announcements`
- `moderation_owner`
- `created_at`
- `updated_at`

RLS considerations:

- public categories may be readable by guests
- member-only categories require authenticated access
- category creation/update should be admin-only

Access control:

- guest: read allowed public categories only
- member/applicant/certified member: read allowed categories
- moderator/admin: read all moderation-visible categories

Risk notes:

- wrong visibility can leak private discussions
- unclear posting policy may cause moderation confusion

### `forum_posts`

Purpose:

- store top-level discussion topics
- support pinned announcements, ordinary posts, and review-only states

Important fields:

- `id`
- `category_id`
- `author_user_id`
- `title`
- `body`
- `status`
- `is_pinned`
- `reply_count`
- `view_count`
- `last_activity_at`
- `created_at`
- `updated_at`

RLS considerations:

- public posts in public categories may be readable by guests
- write access must be scoped to the authenticated author only
- moderator/admin overrides should remain explicit and auditable

Access control:

- create: authenticated roles allowed by category policy
- edit/delete own post: owner only within rule window
- pin/hide/remove: moderator or admin only

Risk notes:

- spam
- malicious links
- fake certification claims
- impersonation

### `forum_comments`

Purpose:

- store replies and follow-up discussion under posts

Important fields:

- `id`
- `post_id`
- `author_user_id`
- `parent_comment_id`
- `body`
- `status`
- `created_at`
- `updated_at`

RLS considerations:

- comment visibility should inherit post visibility
- write access should be owner-scoped
- moderation actions need separate audit trail

Access control:

- create: authenticated roles allowed by post/category policy
- edit/delete own comment: owner only
- hide/remove: moderator or admin only

Risk notes:

- harassment
- spam replies
- malicious code snippets

### `forum_reactions`

Purpose:

- support lightweight engagement signals such as like, useful, or endorse

Important fields:

- `id`
- `user_id`
- `post_id`
- `comment_id`
- `reaction_type`
- `created_at`

RLS considerations:

- user can create/delete only their own reaction
- read access can follow post/comment visibility

Access control:

- create/delete own reaction: authenticated user only
- aggregated totals: public if the parent content is public

Risk notes:

- reaction gaming
- noisy, low-signal behavior

### `forum_reports`

Purpose:

- collect user reports for spam, abuse, impersonation, fake certification claims, and unsafe links

Important fields:

- `id`
- `reporter_user_id`
- `target_type`
- `target_id`
- `reason`
- `details`
- `status`
- `reviewed_by`
- `reviewed_at`
- `created_at`

RLS considerations:

- reporters should only access their own submitted report records if that view is allowed
- moderators/admins should access moderation queue data
- ordinary users should not see full report contents from others

Access control:

- create: authenticated user
- read/update moderation state: moderator/admin only

Risk notes:

- false reports
- retaliatory reports
- sensitive data leakage in report text

### `forum_moderation_actions`

Purpose:

- keep an immutable moderation audit log

Important fields:

- `id`
- `target_type`
- `target_id`
- `action_type`
- `reason`
- `moderator_user_id`
- `metadata`
- `created_at`

RLS considerations:

- append-only model recommended
- moderator/admin-only access
- no user write access

Access control:

- insert: moderator/admin only
- read: moderator/admin, possibly admin-only for some metadata

Risk notes:

- missing audit trail weakens trust and safety review

### `forum_user_badges`

Purpose:

- store visible trust labels such as applicant, certified member, moderator

Important fields:

- `id`
- `user_id`
- `badge_type`
- `label`
- `issued_by`
- `issued_at`
- `expires_at`

RLS considerations:

- admin-only badge issuance or update
- public read can be allowed for selected badge types

Access control:

- create/update/delete: admin only
- read: depends on badge visibility policy

Risk notes:

- false badge assignment can misrepresent certification status

## Access control summary

- guests: public read only
- registered user / applicant / certified member: scoped write to own posts/comments/reports only
- moderator: moderation queue and action visibility
- admin: full moderation visibility and category/badge governance

## Moderation flow draft

1. User reports a post or comment
2. Record enters `forum_reports`
3. Moderator reviews target and reason
4. Moderator may hide, lock, or remove content later in a future production flow
5. Every action writes a record into `forum_moderation_actions`
6. Any user sanction remains a separate human-governed action

## RLS checklist for future migration

- categories visibility rule by audience
- posts readable only when parent category is readable
- comments readable only when parent post is readable
- owner-only post/comment mutation
- report queue restricted to moderation roles
- moderation log append-only
- badge issuance restricted to admin

## Future migration checklist

- define enum strategy for content state and report state
- decide whether nested comments stay one-level or become arbitrary depth
- define moderation role mapping source
- define first-post moderation gating
- define search/indexing strategy
- define notification triggers without enabling autonomous moderation

## Risk summary

- spam and abusive content
- fake certification claims
- impersonation
- category visibility mistakes
- moderation overload
- audit trail gaps

## Conclusion

The community forum architecture is ready for schema draft and RLS planning.

No database mutation was performed in this sprint.
