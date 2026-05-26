-- AIAA member profile editable fields.
-- Run this after aiaa-member-auth-v1.sql if your project already created the first profile table.

alter table public.aiaa_member_profiles
  add column if not exists headline text,
  add column if not exists summary text,
  add column if not exists city text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text,
  add column if not exists public_email text;

create or replace function public.handle_new_aiaa_member()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.aiaa_member_profiles (
    id,
    display_name,
    avatar_url,
    headline,
    summary,
    public_bio,
    public_email
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'headline',
    new.raw_user_meta_data ->> 'summary',
    coalesce(new.raw_user_meta_data ->> 'bio', new.raw_user_meta_data ->> 'public_bio'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
