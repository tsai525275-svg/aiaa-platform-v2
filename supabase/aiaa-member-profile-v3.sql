alter table if exists public.aiaa_member_profiles
  add column if not exists username text;
