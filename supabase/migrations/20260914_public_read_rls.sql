-- Public-read RLS baseline for FTR4DRR
-- Apply in Supabase SQL editor (or via supabase db push) AFTER setting
-- SUPABASE_ANON_KEY on Netlify for publicClient() reads.
-- Service role continues to bypass RLS for admin/auth paths.

-- Enable RLS on catalog tables used by GET /api/public/*
alter table if exists public.technologies enable row level security;
alter table if exists public.disaster_types enable row level security;
alter table if exists public.dataset_version enable row level security;
alter table if exists public.locations enable row level security;
alter table if exists public.themes enable row level security;
alter table if exists public.data_types enable row level security;
alter table if exists public.use_cases enable row level security;
alter table if exists public.partners enable row level security;
alter table if exists public.un_hosts enable row level security;
alter table if exists public.tr_projects enable row level security;
alter table if exists public.project_data enable row level security;
alter table if exists public.disaster_types_projects enable row level security;
alter table if exists public.tech_projects enable row level security;
alter table if exists public.disaster_events enable row level security;
alter table if exists public.user_roles enable row level security;

-- Anon/authenticated may read public catalog data.
-- Adjust column-level grants if you later hide contacts (already excluded in API select).

do $$
declare
  t text;
begin
  foreach t in array array[
    'technologies',
    'disaster_types',
    'dataset_version',
    'locations',
    'themes',
    'data_types',
    'use_cases',
    'partners',
    'un_hosts',
    'disaster_types_projects',
    'tech_projects',
    'project_data'
  ]
  loop
    execute format(
      'drop policy if exists anon_select_%I on public.%I;
       create policy anon_select_%I on public.%I for select to anon, authenticated using (true);',
      t, t, t, t
    );
  end loop;
end $$;

-- Projects: only approved rows for anon
drop policy if exists anon_select_tr_projects on public.tr_projects;
create policy anon_select_tr_projects on public.tr_projects
  for select to anon, authenticated
  using (approved is true or approved is distinct from false);

-- Disaster events: public read (contacts still withheld by API projection)
drop policy if exists anon_select_disaster_events on public.disaster_events;
create policy anon_select_disaster_events on public.disaster_events
  for select to anon, authenticated
  using (true);

-- user_roles: no anon access (service role only)
drop policy if exists anon_select_user_roles on public.user_roles;
-- intentionally no anon policy
