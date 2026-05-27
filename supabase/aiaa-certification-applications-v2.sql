create extension if not exists pgcrypto;

create table if not exists public.aiaa_certification_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_level integer not null default 1 check (target_level between 1 and 5),
  status text not null default 'submitted' check (status in ('submitted', 'exam', 'under_review', 'approved', 'rejected')),
  stage text not null default 'Application' check (stage in ('Application', 'Exam', 'Review', 'Certificate', 'Ranking')),
  agent_name text not null default '',
  agent_category text not null default '',
  github_repo text not null default '',
  demo_url text not null default '',
  video_url text not null default '',
  readme_url text not null default '',
  evidence_summary text not null default '',
  exam_status text not null default 'not_started',
  exam_answers jsonb not null default '{}'::jsonb,
  review_notes text not null default '',
  reviewer_status text not null default 'waiting',
  certificate_id text not null default '',
  certificate_url text not null default '',
  ranking_status text not null default 'not_eligible',
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aiaa_certification_applications_user_id_idx
  on public.aiaa_certification_applications(user_id);

create index if not exists aiaa_certification_applications_user_level_idx
  on public.aiaa_certification_applications(user_id, target_level);

alter table public.aiaa_certification_applications enable row level security;

drop policy if exists "members can read own certification applications" on public.aiaa_certification_applications;
create policy "members can read own certification applications"
  on public.aiaa_certification_applications
  for select
  using (auth.uid() = user_id);

drop policy if exists "members can create own certification applications" on public.aiaa_certification_applications;
create policy "members can create own certification applications"
  on public.aiaa_certification_applications
  for insert
  with check (
    auth.uid() = user_id
    and status = 'submitted'
    and stage = 'Application'
    and certificate_id = ''
  );

drop policy if exists "members can update own active certification applications" on public.aiaa_certification_applications;
create policy "members can update own active certification applications"
  on public.aiaa_certification_applications
  for update
  using (
    auth.uid() = user_id
    and status in ('submitted', 'exam', 'under_review')
    and certificate_id = ''
  )
  with check (
    auth.uid() = user_id
    and status in ('submitted', 'exam', 'under_review')
    and stage in ('Application', 'Exam', 'Review')
    and certificate_id = ''
  );

create or replace function public.set_aiaa_certification_applications_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_aiaa_certification_applications_updated_at on public.aiaa_certification_applications;
create trigger set_aiaa_certification_applications_updated_at
before update on public.aiaa_certification_applications
for each row execute function public.set_aiaa_certification_applications_updated_at();
