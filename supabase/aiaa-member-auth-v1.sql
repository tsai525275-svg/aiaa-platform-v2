-- AIAA member auth and certification workflow tables.
-- Run this after Supabase Auth is enabled with GitHub and Google providers.

create table if not exists public.aiaa_member_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  country text,
  website_url text,
  public_bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aiaa_certification_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_level text not null check (target_level in ('Level 1','Level 2','Level 3','Level 4','Level 5')),
  status text not null default 'Draft' check (status in ('Draft','Submitted','Exam','Review','Approved','Rejected','Action Needed','Certificate Issued','Ranking Eligible')),
  stage text not null default 'Application' check (stage in ('Application','Exam','Review','Certificate','Ranking')),
  visibility text not null default 'Private' check (visibility in ('Private','Public')),
  previous_level text,
  certificate_id text,
  registry_record_id text,
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aiaa_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.aiaa_certification_applications(id) on delete set null,
  level text not null check (level in ('Level 1','Level 2','Level 3','Level 4','Level 5')),
  certificate_id text not null unique,
  visibility text not null default 'Public' check (visibility in ('Private','Public')),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  public_status text not null default 'Active' check (public_status in ('Active','Expired','Revoked')),
  created_at timestamptz not null default now()
);

alter table public.aiaa_member_profiles enable row level security;
alter table public.aiaa_certification_applications enable row level security;
alter table public.aiaa_certificates enable row level security;

create policy "Members can read own profile" on public.aiaa_member_profiles
  for select using (auth.uid() = id);

create policy "Members can insert own profile" on public.aiaa_member_profiles
  for insert with check (auth.uid() = id);

create policy "Members can update own profile" on public.aiaa_member_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Members can read own applications" on public.aiaa_certification_applications
  for select using (auth.uid() = user_id);

create policy "Members can create own applications" on public.aiaa_certification_applications
  for insert with check (auth.uid() = user_id);

create policy "Members can update own draft applications" on public.aiaa_certification_applications
  for update using (auth.uid() = user_id and status in ('Draft','Action Needed')) with check (auth.uid() = user_id);

create policy "Members can read own certificates" on public.aiaa_certificates
  for select using (auth.uid() = user_id);

create policy "Public can read public certificates" on public.aiaa_certificates
  for select using (visibility = 'Public' and public_status = 'Active');

create or replace function public.handle_new_aiaa_member()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.aiaa_member_profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_aiaa_member on auth.users;
create trigger on_auth_user_created_aiaa_member
  after insert on auth.users
  for each row execute function public.handle_new_aiaa_member();
