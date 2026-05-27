AIAA Patch V61

Scope:
- Adds member exam center at /member/exam.
- Adds level exam workspaces at /member/exam/level-1 through /member/exam/level-5.
- Adds member notification inbox at /member/notifications.
- Adds Supabase SQL for exam questions, exam answers, notifications, and application flow status columns.
- Keeps the HTML admin control panel outside this patch. Manual status changes can be made in Supabase until the external control panel is ready.

Flow:
1. Member submits application.
2. Reviewer prechecks the application.
3. If precheck is approved, exam unlocks.
4. Member submits exam.
5. Reviewer manually reviews application plus exam answer.
6. Reviewer approves, requests revision, or rejects.
7. Certificate is issued only after approval.

Manual precheck approval example:
update public.aiaa_certification_applications
set precheck_status = 'approved', precheck_note = 'Application evidence passed precheck.'
where id = 'APPLICATION_ID_HERE';

Manual precheck rejection example:
update public.aiaa_certification_applications
set precheck_status = 'rejected', precheck_note = 'Repository and README evidence are incomplete.'
where id = 'APPLICATION_ID_HERE';

Manual final approval example:
update public.aiaa_certification_applications
set review_status = 'approved', certificate_status = 'ready_to_issue'
where id = 'APPLICATION_ID_HERE';

Manual certificate issue example:
update public.aiaa_certification_applications
set certificate_status = 'issued', certificate_id = 'AIAA-L1-000001'
where id = 'APPLICATION_ID_HERE';
