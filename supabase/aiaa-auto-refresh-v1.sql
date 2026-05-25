create extension if not exists pgcrypto;

create table if not exists public.github_repo_daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  ranking_key text not null,
  rank text not null,
  repo_id bigint not null,
  repo_name text not null,
  repo_full_name text not null,
  repo_url text,
  owner_login text,
  owner_avatar_url text,
  scope text,
  summary text,
  why_included text,
  stars integer not null default 0,
  forks integer not null default 0,
  open_issues integer not null default 0,
  language text,
  pushed_at timestamptz,
  updated_at timestamptz,
  score integer default 0,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (snapshot_date, ranking_key, repo_full_name)
);

create table if not exists public.github_builder_daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  rank text not null,
  login text not null,
  avatar_url text,
  profile_url text,
  repo_count integer not null default 0,
  total_contributions integer not null default 0,
  repositories text[] not null default '{}',
  builder_score integer not null default 0,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (snapshot_date, login)
);

create table if not exists public.ranking_item_profiles (
  id uuid primary key default gen_random_uuid(),
  ranking_key text not null,
  item_slug text not null,
  item_type text not null,
  name text not null,
  full_name text,
  external_url text,
  avatar_url text,
  rank text,
  summary text,
  what_it_does text,
  why_ranked text,
  capabilities text[] not null default '{}',
  best_for text,
  source_url text,
  source_hash text,
  stars integer,
  forks integer,
  open_issues integer,
  language text,
  pushed_at timestamptz,
  updated_at timestamptz,
  last_refreshed_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ranking_key, item_slug)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_github_repo_daily_snapshots_updated_at on public.github_repo_daily_snapshots;
create trigger set_github_repo_daily_snapshots_updated_at
before update on public.github_repo_daily_snapshots
for each row execute function public.set_updated_at();

drop trigger if exists set_github_builder_daily_snapshots_updated_at on public.github_builder_daily_snapshots;
create trigger set_github_builder_daily_snapshots_updated_at
before update on public.github_builder_daily_snapshots
for each row execute function public.set_updated_at();

drop trigger if exists set_ranking_item_profiles_updated_at on public.ranking_item_profiles;
create trigger set_ranking_item_profiles_updated_at
before update on public.ranking_item_profiles
for each row execute function public.set_updated_at();

create index if not exists idx_github_repo_daily_snapshots_key_date on public.github_repo_daily_snapshots (ranking_key, snapshot_date desc, rank asc);
create index if not exists idx_github_builder_daily_snapshots_date on public.github_builder_daily_snapshots (snapshot_date desc, rank asc);
create index if not exists idx_ranking_item_profiles_lookup on public.ranking_item_profiles (ranking_key, item_slug);
