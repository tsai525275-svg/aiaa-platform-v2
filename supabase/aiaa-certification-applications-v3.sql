alter table public.aiaa_certification_applications
  add column if not exists contact_email text not null default '';

update public.aiaa_certification_applications a
set contact_email = coalesce(nullif(a.contact_email, ''), u.email, '')
from auth.users u
where a.user_id = u.id
  and coalesce(a.contact_email, '') = '';
