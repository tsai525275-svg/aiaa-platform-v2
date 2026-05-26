-- AIAA social actions with real database persistence.
-- Follow and Like buttons read counts from Supabase and save one action per user per target.

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

grant select on public.aiaa_social_follows to anon, authenticated;
grant select on public.aiaa_social_likes to anon, authenticated;
grant insert, delete on public.aiaa_social_follows to authenticated;
grant insert, delete on public.aiaa_social_likes to authenticated;

drop policy if exists "social follows are publicly readable" on public.aiaa_social_follows;
create policy "social follows are publicly readable" on public.aiaa_social_follows
  for select using (true);

drop policy if exists "members insert own social follows" on public.aiaa_social_follows;
create policy "members insert own social follows" on public.aiaa_social_follows
  for insert with check (auth.uid() = user_id);

drop policy if exists "members delete own social follows" on public.aiaa_social_follows;
create policy "members delete own social follows" on public.aiaa_social_follows
  for delete using (auth.uid() = user_id);

drop policy if exists "members manage own social follows" on public.aiaa_social_follows;

drop policy if exists "social likes are publicly readable" on public.aiaa_social_likes;
create policy "social likes are publicly readable" on public.aiaa_social_likes
  for select using (true);

drop policy if exists "members insert own social likes" on public.aiaa_social_likes;
create policy "members insert own social likes" on public.aiaa_social_likes
  for insert with check (auth.uid() = user_id);

drop policy if exists "members delete own social likes" on public.aiaa_social_likes;
create policy "members delete own social likes" on public.aiaa_social_likes
  for delete using (auth.uid() = user_id);

drop policy if exists "members manage own social likes" on public.aiaa_social_likes;

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

grant select on public.aiaa_social_counts to anon, authenticated;
