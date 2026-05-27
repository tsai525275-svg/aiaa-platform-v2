create extension if not exists pgcrypto;

alter table public.aiaa_certification_applications
  add column if not exists target_level integer not null default 1,
  add column if not exists contact_email text not null default '',
  add column if not exists precheck_status text not null default 'pending',
  add column if not exists precheck_note text not null default '',
  add column if not exists exam_access_status text not null default 'locked',
  add column if not exists exam_status text not null default 'not_started',
  add column if not exists exam_started_at timestamptz,
  add column if not exists exam_submitted_at timestamptz,
  add column if not exists review_status text not null default 'pending',
  add column if not exists certificate_status text not null default 'not_issued',
  add column if not exists certificate_id text not null default '';

create table if not exists public.aiaa_exam_questions (
  id uuid primary key default gen_random_uuid(),
  level integer not null check (level between 1 and 5),
  position integer not null,
  category text not null default 'General',
  question text not null,
  prompt text not null default '',
  required boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (level, position)
);

create table if not exists public.aiaa_exam_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.aiaa_certification_applications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  level integer not null check (level between 1 and 5),
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, application_id, level)
);

create table if not exists public.aiaa_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  link text not null default '',
  is_read boolean not null default false,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.aiaa_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_aiaa_exam_questions_updated_at on public.aiaa_exam_questions;
create trigger set_aiaa_exam_questions_updated_at
before update on public.aiaa_exam_questions
for each row execute function public.aiaa_set_updated_at();

drop trigger if exists set_aiaa_exam_answers_updated_at on public.aiaa_exam_answers;
create trigger set_aiaa_exam_answers_updated_at
before update on public.aiaa_exam_answers
for each row execute function public.aiaa_set_updated_at();

create or replace function public.aiaa_sync_application_flow_state()
returns trigger as $$
begin
  if new.precheck_status = 'approved' and coalesce(old.precheck_status, '') is distinct from 'approved' then
    new.exam_access_status = 'unlocked';
    if new.exam_status in ('locked', 'not_started', '') then
      new.exam_status = 'not_started';
    end if;
  end if;

  if new.precheck_status in ('rejected', 'revision_required') and coalesce(old.precheck_status, '') is distinct from new.precheck_status then
    new.exam_access_status = 'locked';
  end if;

  if new.exam_status = 'submitted' and coalesce(old.exam_status, '') is distinct from 'submitted' then
    new.exam_access_status = 'submitted';
    new.review_status = 'pending';
    if new.exam_submitted_at is null then
      new.exam_submitted_at = now();
    end if;
  end if;

  if new.review_status = 'approved' and coalesce(old.review_status, '') is distinct from 'approved' then
    new.certificate_status = case when new.certificate_status = 'issued' then 'issued' else 'ready_to_issue' end;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists sync_aiaa_application_flow_state on public.aiaa_certification_applications;
create trigger sync_aiaa_application_flow_state
before update on public.aiaa_certification_applications
for each row execute function public.aiaa_sync_application_flow_state();

create or replace function public.aiaa_notify_application_events()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
    values (
      new.user_id,
      'application_received',
      'Application received',
      'Your AIAA certification application was received. It is waiting for precheck review.',
      '/member/applications',
      jsonb_build_object('application_id', new.id, 'level', new.target_level)
    );
  end if;

  if tg_op = 'UPDATE' then
    if coalesce(old.precheck_status, '') is distinct from coalesce(new.precheck_status, '') then
      if new.precheck_status = 'approved' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'exam_unlocked', 'Exam unlocked', 'Your application passed precheck. The exam is now available in your member workspace.', '/member/exam', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      elsif new.precheck_status = 'revision_required' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'revision_required', 'Revision required', coalesce(nullif(new.precheck_note, ''), 'Reviewers requested revisions before this application can continue.'), '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      elsif new.precheck_status = 'rejected' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'application_rejected', 'Application rejected', coalesce(nullif(new.precheck_note, ''), 'The application did not meet the current requirements.'), '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      end if;
    end if;

    if coalesce(old.exam_status, '') is distinct from coalesce(new.exam_status, '') and new.exam_status = 'submitted' then
      insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
      values (new.user_id, 'exam_submitted', 'Exam submitted', 'Your exam was submitted and is now waiting for reviewer assessment.', '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
    end if;

    if coalesce(old.review_status, '') is distinct from coalesce(new.review_status, '') then
      if new.review_status = 'approved' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'application_approved', 'Application approved', 'Your certification application passed review. Certificate issuance is the next step.', '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      elsif new.review_status = 'revision_required' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'review_revision_required', 'Review revision required', 'Reviewers requested changes after exam assessment.', '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      elsif new.review_status = 'rejected' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'review_rejected', 'Review rejected', 'The application did not pass final review.', '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      end if;
    end if;

    if coalesce(old.certificate_status, '') is distinct from coalesce(new.certificate_status, '') and new.certificate_status = 'issued' then
      insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
      values (new.user_id, 'certificate_issued', 'Certificate issued', 'Your AIAA certificate has been issued. Your public profile and ranking eligibility can now update.', '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level, 'certificate_id', new.certificate_id));
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists notify_aiaa_application_events on public.aiaa_certification_applications;
create trigger notify_aiaa_application_events
after insert or update on public.aiaa_certification_applications
for each row execute function public.aiaa_notify_application_events();

insert into public.aiaa_exam_questions(level, position, category, question, prompt, required)
values
(1, 1, 'Workflow', 'Describe the agent workflow.', 'Explain input handling, task analysis, tool calling, output generation, logging, and retry behavior.', true),
(1, 2, 'Tool Calling', 'Which tool or external API does the agent call?', 'Name the tool or API, explain the request payload, response format, and how the agent uses the result.', true),
(1, 3, 'Error Handling', 'How does the agent handle failure?', 'Describe error messages, retry rules, fallback behavior, and what is written to logs.', true),
(1, 4, 'README', 'How can a reviewer run the project?', 'Provide setup steps, environment variables, command line instructions, and test instructions.', true),
(1, 5, 'Security', 'What sensitive data does the agent touch?', 'Explain API keys, user data, access limits, and what information should not be logged.', true),
(1, 6, 'Evidence', 'What proof should reviewers inspect?', 'List screenshots, execution logs, demo video timestamps, repository files, and workflow examples.', true),
(2, 1, 'Production Workflow', 'Describe the production workflow architecture.', 'Explain long running tasks, queues, state persistence, and how the workflow resumes after failure.', true),
(2, 2, 'Multi Tool System', 'List the tools in the workflow.', 'Name at least three tools, describe their responsibilities, and explain how data moves across them.', true),
(2, 3, 'Reliability', 'How does the system recover from failure?', 'Describe retry architecture, fallback systems, monitoring, execution traces, and alerting.', true),
(2, 4, 'Human Override', 'Where does a human intervene?', 'Explain manual approval, pause, restart, cancellation, and reviewer control points.', true),
(2, 5, 'Deployment', 'How is this deployed?', 'Explain hosting, environment variables, database, queue, logs, and deployment steps.', true),
(2, 6, 'Cost and Latency', 'How do you control cost and latency?', 'Describe model selection, token budget, batching, caching, and timeout limits.', true),
(3, 1, 'Multi Agent Design', 'Describe the multi agent architecture.', 'Name each agent role, supervisor logic, planner behavior, worker behavior, and task routing rules.', true),
(3, 2, 'Memory and State', 'How does shared memory work?', 'Explain vector storage, long term memory, state recovery, and context persistence.', true),
(3, 3, 'Infrastructure', 'How does the system scale?', 'Explain microservices, distributed queue, monitoring stack, CI/CD, and production deployment.', true),
(3, 4, 'Security', 'How is the system secured?', 'Explain permissions, sandboxing, secrets management, audit logs, and data isolation.', true),
(3, 5, 'Benchmark', 'What benchmark proves system quality?', 'Provide success rate, latency, cost, reliability score, and failure analysis.', true),
(3, 6, 'Recovery', 'How does the system recover after partial failure?', 'Explain checkpoints, replay, idempotency, state repair, and incident response.', true),
(4, 1, 'Company Product', 'Describe the company agent product.', 'Explain product scope, customer segment, active users, and production usage.', true),
(4, 2, 'Operations', 'How does the company operate the system?', 'Explain SLA, monitoring, incident response, release process, and customer support.', true),
(4, 3, 'Security Review', 'What security evidence can reviewers inspect?', 'Provide security documents, data governance, access control, audit logs, and risk handling.', true),
(4, 4, 'Business Proof', 'What business proof exists?', 'Describe customers, revenue tier evidence, case studies, contracts, or usage metrics.', true),
(4, 5, 'Team Capability', 'Who maintains the system?', 'Explain engineering roles, operations roles, review ownership, and escalation flow.', true),
(4, 6, 'Benchmark and Uptime', 'What benchmark and uptime data prove reliability?', 'Provide uptime reports, load tests, benchmark reports, and production incident history.', true),
(5, 1, 'Global Impact', 'What global impact does the applicant have?', 'Explain open source adoption, ecosystem influence, public references, and standards contribution.', true),
(5, 2, 'Technical Originality', 'What original technical contribution was made?', 'Describe frameworks, infrastructure, research, protocols, or systems created by the applicant.', true),
(5, 3, 'Public Trust', 'Why should the public trust this applicant?', 'Explain reputation evidence, transparency, governance record, and community accountability.', true),
(5, 4, 'Standards Design', 'What standards can this applicant help define?', 'Describe governance thinking, protocol thinking, safety requirements, and review methodology.', true),
(5, 5, 'Ecosystem Contribution', 'How has the applicant contributed to the AI Agent ecosystem?', 'List projects, talks, papers, code, organizations, or communities influenced by the applicant.', true),
(5, 6, 'AIAA Contribution', 'How will the applicant contribute to AIAA?', 'Explain council work, reviewer work, benchmark work, education, or public infrastructure work.', true)
on conflict (level, position) do update set
  category = excluded.category,
  question = excluded.question,
  prompt = excluded.prompt,
  required = excluded.required,
  is_active = true,
  updated_at = now();

alter table public.aiaa_exam_questions enable row level security;
alter table public.aiaa_exam_answers enable row level security;
alter table public.aiaa_notifications enable row level security;

drop policy if exists "AIAA exam questions are readable" on public.aiaa_exam_questions;
create policy "AIAA exam questions are readable"
on public.aiaa_exam_questions for select
using (is_active = true);

drop policy if exists "Members can read own exam answers" on public.aiaa_exam_answers;
create policy "Members can read own exam answers"
on public.aiaa_exam_answers for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Members can insert own exam answers" on public.aiaa_exam_answers;
create policy "Members can insert own exam answers"
on public.aiaa_exam_answers for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Members can update own exam answers" on public.aiaa_exam_answers;
create policy "Members can update own exam answers"
on public.aiaa_exam_answers for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Members can read own notifications" on public.aiaa_notifications;
create policy "Members can read own notifications"
on public.aiaa_notifications for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Members can insert own notifications" on public.aiaa_notifications;
create policy "Members can insert own notifications"
on public.aiaa_notifications for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Members can update own notifications" on public.aiaa_notifications;
create policy "Members can update own notifications"
on public.aiaa_notifications for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
