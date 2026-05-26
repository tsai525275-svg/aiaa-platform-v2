-- AIAA real social actions.
-- This replaces local preview counters with database backed follows and likes.

create table if not exists public.aiaa_social_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('profile', 'ranking', 'repository', 'builder')),
  target_key text not null,
  target_name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_key)
);

create table if not exists public.aiaa_social_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('profile', 'ranking', 'repository', 'builder')),
  target_key text not null,
  target_name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_key)
);

alter table public.aiaa_social_follows enable row level security;
alter table public.aiaa_social_likes enable row level security;

drop policy if exists "social follows are publicly readable" on public.aiaa_social_follows;
create policy "social follows are publicly readable" on public.aiaa_social_follows
  for select using (true);

drop policy if exists "members manage own social follows" on public.aiaa_social_follows;
create policy "members manage own social follows" on public.aiaa_social_follows
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "social likes are publicly readable" on public.aiaa_social_likes;
create policy "social likes are publicly readable" on public.aiaa_social_likes
  for select using (true);

drop policy if exists "members manage own social likes" on public.aiaa_social_likes;
create policy "members manage own social likes" on public.aiaa_social_likes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists aiaa_social_follows_target_idx
  on public.aiaa_social_follows (target_type, target_key);

create index if not exists aiaa_social_likes_target_idx
  on public.aiaa_social_likes (target_type, target_key);

create or replace view public.aiaa_social_counts as
select
  target_type,
  target_key,
  max(target_name) as target_name,
  count(*) filter (where source = 'follow')::bigint as followers,
  count(*) filter (where source = 'like')::bigint as likes
from (
  select target_type, target_key, target_name, 'follow'::text as source
  from public.aiaa_social_follows
  union all
  select target_type, target_key, target_name, 'like'::text as source
  from public.aiaa_social_likes
) records
group by target_type, target_key;
