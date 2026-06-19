# Full Automation Community + AI Support Smoke Checklist 001

## Scope

Lightweight smoke checklist for the development sprint deliverables.

## Route checks

- `/` loads
- `/apply` loads
- `/login` loads
- `/operations` loads
- `/community` loads
- `/community/posts/what-counts-as-level-1-practical-evidence` loads
- `/support` loads

## Operations page

- workflow modes visible
- Paperclip 6 agents visible
- blocked production actions visible
- automation maturity ladder visible
- current level shown as Level 2
- no production write button enabled

## Community page

- category list visible
- post list visible
- create post UI visible
- empty/loading/error state patterns visible
- role-based labels visible
- community rules visible

## Community post detail

- post body visible
- comments visible
- reply UI visible
- report content UI visible
- moderation notice visible
- no live publish/reply/report mutation implied

## Support page

- FAQ / knowledge base visible
- suggested questions visible
- chat widget visible
- escalation UI visible
- feedback UI visible
- safety notice visible
- no approval / payment / certificate mutation implied

## Guardrail confirmations

- no production write button
- no payment mutation path
- no real email send path
- no secret exposure
- no production database migration

## Notes

- MVP uses local-safe data and rules-based support answers
- future backend integration requires separate human approval
