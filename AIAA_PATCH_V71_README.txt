AIAA Patch V71

Purpose:
Fix V70 TypeScript build failure in components/aiaa-v61-exam-workspace.tsx.

Issue:
The Level 4 common evidence fields array was inferred with type: string.
TypeScript rejected it because EvidenceField.type only allows url, textarea, or text.

Fix:
Annotates the array as EvidenceField[].

Run:
node scripts\\fix-v70-evidence-field-type-v71.cjs
npm run build
