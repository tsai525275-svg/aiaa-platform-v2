create extension if not exists pgcrypto;

alter table public.aiaa_certification_applications
  add column if not exists exam_multiple_choice_score integer not null default 0,
  add column if not exists exam_multiple_choice_total integer not null default 0,
  add column if not exists exam_score_percent numeric(6,2),
  add column if not exists exam_auto_pass boolean,
  add column if not exists exam_scoring_status text not null default 'not_scored',
  add column if not exists exam_review_required boolean not null default true,
  add column if not exists exam_locked_at timestamptz,
  add column if not exists review_note text not null default '',
  add column if not exists review_decision text not null default '',
  add column if not exists reviewer_id uuid,
  add column if not exists reviewed_at timestamptz,
  add column if not exists certificate_issued_at timestamptz,
  add column if not exists certificate_expires_at timestamptz,
  add column if not exists ranking_eligibility_status text not null default 'not_eligible',
  add column if not exists next_level_unlocked boolean not null default false;

alter table public.aiaa_exam_answers
  add column if not exists locked_at timestamptz,
  add column if not exists multiple_choice_score integer not null default 0,
  add column if not exists multiple_choice_total integer not null default 0,
  add column if not exists score_percent numeric(6,2),
  add column if not exists auto_pass boolean,
  add column if not exists scoring_status text not null default 'not_scored',
  add column if not exists scoring_summary jsonb not null default '{}'::jsonb;

alter table public.aiaa_member_profiles
  add column if not exists approved_level integer not null default 0,
  add column if not exists certification_status text not null default 'none',
  add column if not exists current_certificate_id text not null default '',
  add column if not exists certification_expires_at timestamptz,
  add column if not exists ranking_eligibility_status text not null default 'not_eligible';

create table if not exists public.aiaa_reviewer_actions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.aiaa_certification_applications(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  actor_id uuid,
  action text not null,
  note text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aiaa_reviewer_actions_application_idx on public.aiaa_reviewer_actions(application_id, created_at desc);
create index if not exists aiaa_reviewer_actions_user_idx on public.aiaa_reviewer_actions(user_id, created_at desc);
create index if not exists aiaa_certification_applications_review_idx on public.aiaa_certification_applications(review_status, certificate_status, created_at desc);
create index if not exists aiaa_exam_answers_scoring_idx on public.aiaa_exam_answers(application_id, status, scoring_status);

alter table public.aiaa_reviewer_actions enable row level security;

drop policy if exists "members can read own reviewer action history" on public.aiaa_reviewer_actions;
create policy "members can read own reviewer action history"
  on public.aiaa_reviewer_actions
  for select
  using (auth.uid() = user_id);

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
    new.status = 'under_review';
    new.stage = 'Review';
    if new.exam_submitted_at is null then
      new.exam_submitted_at = now();
    end if;
    if new.exam_locked_at is null then
      new.exam_locked_at = now();
    end if;
  end if;

  if new.review_status = 'approved' and coalesce(old.review_status, '') is distinct from 'approved' then
    new.review_decision = 'approved';
    new.reviewed_at = coalesce(new.reviewed_at, now());
    new.certificate_status = case when new.certificate_status = 'issued' then 'issued' else 'ready_to_issue' end;
  end if;

  if new.review_status in ('rejected', 'revision_required') and coalesce(old.review_status, '') is distinct from new.review_status then
    new.review_decision = new.review_status;
    new.reviewed_at = coalesce(new.reviewed_at, now());
    new.certificate_status = 'not_issued';
    new.ranking_eligibility_status = 'not_eligible';
  end if;

  if new.certificate_status = 'issued' and coalesce(old.certificate_status, '') is distinct from 'issued' then
    new.certificate_issued_at = coalesce(new.certificate_issued_at, now());
    if new.certificate_expires_at is null then
      new.certificate_expires_at = case
        when new.target_level = 3 then now() + interval '6 months'
        when new.target_level = 4 then now() + interval '3 months'
        else now() + interval '12 months'
      end;
    end if;
    new.ranking_eligibility_status = 'eligible';
    new.next_level_unlocked = case when new.target_level < 5 then true else false end;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists sync_aiaa_application_flow_state on public.aiaa_certification_applications;
create trigger sync_aiaa_application_flow_state
before update on public.aiaa_certification_applications
for each row execute function public.aiaa_sync_application_flow_state();

create or replace function public.aiaa_apply_certificate_to_member_profile()
returns trigger as $$
begin
  if new.certificate_status = 'issued' and coalesce(old.certificate_status, '') is distinct from 'issued' then
    update public.aiaa_member_profiles
    set approved_level = greatest(coalesce(approved_level, 0), coalesce(new.target_level, 0)),
        certification_status = 'certified',
        current_certificate_id = coalesce(nullif(new.certificate_id, ''), current_certificate_id),
        certification_expires_at = new.certificate_expires_at,
        ranking_eligibility_status = 'eligible',
        updated_at = now()
    where user_id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists apply_aiaa_certificate_to_member_profile on public.aiaa_certification_applications;
create trigger apply_aiaa_certificate_to_member_profile
after update on public.aiaa_certification_applications
for each row execute function public.aiaa_apply_certificate_to_member_profile();

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
      values (
        new.user_id,
        'exam_submitted',
        'Exam submitted',
        concat('Your exam was submitted and locked. Knowledge score: ', coalesce(new.exam_score_percent::text, 'manual review only'), case when new.exam_score_percent is null then '' else '%' end, '. The application is now waiting for reviewer assessment.'),
        '/member/applications',
        jsonb_build_object('application_id', new.id, 'level', new.target_level, 'score_percent', new.exam_score_percent, 'scoring_status', new.exam_scoring_status)
      );
    end if;

    if coalesce(old.review_status, '') is distinct from coalesce(new.review_status, '') then
      if new.review_status = 'approved' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'application_approved', 'Application approved', coalesce(nullif(new.review_note, ''), 'Your certification application passed review. Certificate issuance is the next step.'), '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      elsif new.review_status = 'revision_required' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'review_revision_required', 'Review revision required', coalesce(nullif(new.review_note, ''), 'Reviewers requested changes after exam assessment.'), '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
      elsif new.review_status = 'rejected' then
        insert into public.aiaa_notifications(user_id, type, title, message, link, metadata)
        values (new.user_id, 'review_rejected', 'Review rejected', coalesce(nullif(new.review_note, ''), 'The application did not pass final review.'), '/member/applications', jsonb_build_object('application_id', new.id, 'level', new.target_level));
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

-- Manual SQL templates for the future HTML control panel.
-- Precheck approve and unlock exam:
-- update public.aiaa_certification_applications
-- set precheck_status = 'approved', precheck_note = 'Application evidence passed precheck.', exam_access_status = 'unlocked'
-- where id = 'APPLICATION_ID';
--
-- Precheck reject:
-- update public.aiaa_certification_applications
-- set precheck_status = 'rejected', precheck_note = 'Explain why the application did not pass precheck.', exam_access_status = 'locked'
-- where id = 'APPLICATION_ID';
--
-- Final review approve:
-- update public.aiaa_certification_applications
-- set review_status = 'approved', review_note = 'Application and exam evidence passed review.'
-- where id = 'APPLICATION_ID';
--
-- Issue certificate after approval:
-- update public.aiaa_certification_applications
-- set certificate_status = 'issued', certificate_id = concat('AIAA-', target_level, '-', upper(substr(id::text, 1, 8)))
-- where id = 'APPLICATION_ID';
