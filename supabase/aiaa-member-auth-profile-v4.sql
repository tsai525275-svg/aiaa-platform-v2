create extension if not exists pgcrypto;

create table if not exists public.aiaa_member_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null default 'AIAA Member',
  avatar_url text not null default '',
  headline text not null default 'AI Agent Operator',
  summary text not null default '',
  bio text not null default '',
  country text not null default '',
  city text not null default '',
  website text not null default '',
  github text not null default '',
  linkedin text not null default '',
  public_email text not null default '',
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint aiaa_member_profiles_user_id_key unique (user_id),
  constraint aiaa_member_profiles_username_key unique (username),
  constraint aiaa_member_profiles_username_format check (username ~ '^[a-z0-9][a-z0-9_-]{2,31}$')
);

alter table public.aiaa_member_profiles enable row level security;

drop policy if exists "public can read public member profiles" on public.aiaa_member_profiles;
create policy "public can read public member profiles"
  on public.aiaa_member_profiles
  for select
  using (is_public = true or auth.uid() = user_id);

drop policy if exists "members can insert own profile" on public.aiaa_member_profiles;
create policy "members can insert own profile"
  on public.aiaa_member_profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "members can update own profile" on public.aiaa_member_profiles;
create policy "members can update own profile"
  on public.aiaa_member_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "members can delete own profile" on public.aiaa_member_profiles;
create policy "members can delete own profile"
  on public.aiaa_member_profiles
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_aiaa_member_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_aiaa_member_profiles_updated_at on public.aiaa_member_profiles;
create trigger set_aiaa_member_profiles_updated_at
before update on public.aiaa_member_profiles
for each row execute function public.set_aiaa_member_profiles_updated_at();
