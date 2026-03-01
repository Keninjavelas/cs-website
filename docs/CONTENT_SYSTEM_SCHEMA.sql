-- =====================================================
-- IEEE CS Website - Content Management Schema
-- Systems: Achievements, Team Members, Announcements
-- =====================================================

-- ---------- ACHIEVEMENTS ----------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  year text,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.achievements enable row level security;

drop policy if exists "achievements_public_read_published" on public.achievements;
create policy "achievements_public_read_published"
  on public.achievements
  for select
  to public
  using (is_published = true);

drop policy if exists "achievements_admin_select" on public.achievements;
create policy "achievements_admin_select"
  on public.achievements
  for select
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "achievements_admin_insert" on public.achievements;
create policy "achievements_admin_insert"
  on public.achievements
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "achievements_admin_update" on public.achievements;
create policy "achievements_admin_update"
  on public.achievements
  for update
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "achievements_admin_delete" on public.achievements;
create policy "achievements_admin_delete"
  on public.achievements
  for delete
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');


-- ---------- TEAM MEMBERS ----------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image_url text not null,
  linkedin_url text,
  github_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

drop policy if exists "team_public_read_active" on public.team_members;
create policy "team_public_read_active"
  on public.team_members
  for select
  to public
  using (is_active = true);

drop policy if exists "team_admin_select" on public.team_members;
create policy "team_admin_select"
  on public.team_members
  for select
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "team_admin_insert" on public.team_members;
create policy "team_admin_insert"
  on public.team_members
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "team_admin_update" on public.team_members;
create policy "team_admin_update"
  on public.team_members
  for update
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "team_admin_delete" on public.team_members;
create policy "team_admin_delete"
  on public.team_members
  for delete
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');


-- ---------- ANNOUNCEMENTS ----------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

drop policy if exists "announcements_public_read_published" on public.announcements;
create policy "announcements_public_read_published"
  on public.announcements
  for select
  to public
  using (is_published = true);

drop policy if exists "announcements_admin_select" on public.announcements;
create policy "announcements_admin_select"
  on public.announcements
  for select
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "announcements_admin_insert" on public.announcements;
create policy "announcements_admin_insert"
  on public.announcements
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "announcements_admin_update" on public.announcements;
create policy "announcements_admin_update"
  on public.announcements
  for update
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "announcements_admin_delete" on public.announcements;
create policy "announcements_admin_delete"
  on public.announcements
  for delete
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');
