-- AIAA social layer for member follow, profile likes, and ranking record follows.
-- Run this after the member profile SQL files.

create table if not exists public.aiaa_member_follows (
  id uuid primary key default gen_random_uuid(),
  follower_user_id uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_user_id, target_user_id),
  check (follower_user_id <> target_user_id)
);

create table if not exists public.aiaa_member_likes (
  id uuid primary key default gen_random_uuid(),
  liker_user_id uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (liker_user_id, target_user_id),
  check (liker_user_id <> target_user_id)
);

create table if not exists public.aiaa_ranking_record_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_type text not null check (record_type in ('ranking', 'repository', 'builder')),
  record_key text not null,
  record_name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, record_type, record_key)
);

create table if not exists public.aiaa_ranking_record_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_type text not null check (record_type in ('ranking', 'repository', 'builder')),
  record_key text not null,
  record_name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, record_type, record_key)
);

alter table public.aiaa_member_follows enable row level security;
alter table public.aiaa_member_likes enable row level security;
alter table public.aiaa_ranking_record_follows enable row level security;
alter table public.aiaa_ranking_record_likes enable row level security;

drop policy if exists "member follows are publicly readable" on public.aiaa_member_follows;
create policy "member follows are publicly readable" on public.aiaa_member_follows
  for select using (true);

drop policy if exists "members manage own follows" on public.aiaa_member_follows;
create policy "members manage own follows" on public.aiaa_member_follows
  for all using (auth.uid() = follower_user_id)
  with check (auth.uid() = follower_user_id);

drop policy if exists "member likes are publicly readable" on public.aiaa_member_likes;
create policy "member likes are publicly readable" on public.aiaa_member_likes
  for select using (true);

drop policy if exists "members manage own profile likes" on public.aiaa_member_likes;
create policy "members manage own profile likes" on public.aiaa_member_likes
  for all using (auth.uid() = liker_user_id)
  with check (auth.uid() = liker_user_id);

drop policy if exists "ranking follows are publicly readable" on public.aiaa_ranking_record_follows;
create policy "ranking follows are publicly readable" on public.aiaa_ranking_record_follows
  for select using (true);

drop policy if exists "members manage own ranking follows" on public.aiaa_ranking_record_follows;
create policy "members manage own ranking follows" on public.aiaa_ranking_record_follows
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "ranking likes are publicly readable" on public.aiaa_ranking_record_likes;
create policy "ranking likes are publicly readable" on public.aiaa_ranking_record_likes
  for select using (true);

drop policy if exists "members manage own ranking likes" on public.aiaa_ranking_record_likes;
create policy "members manage own ranking likes" on public.aiaa_ranking_record_likes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace view public.aiaa_member_social_counts as
select
  u.id as user_id,
  coalesce(f.followers, 0)::bigint as followers,
  coalesce(l.likes, 0)::bigint as likes
from auth.users u
left join (
  select target_user_id, count(*) as followers
  from public.aiaa_member_follows
  group by target_user_id
) f on f.target_user_id = u.id
left join (
  select target_user_id, count(*) as likes
  from public.aiaa_member_likes
  group by target_user_id
) l on l.target_user_id = u.id;

create or replace view public.aiaa_ranking_record_social_counts as
select
  record_type,
  record_key,
  max(record_name) as record_name,
  count(*) filter (where source = 'follow')::bigint as followers,
  count(*) filter (where source = 'like')::bigint as likes
from (
  select record_type, record_key, record_name, 'follow'::text as source from public.aiaa_ranking_record_follows
  union all
  select record_type, record_key, record_name, 'like'::text as source from public.aiaa_ranking_record_likes
) records
group by record_type, record_key;
