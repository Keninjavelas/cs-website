-- ============================================================
-- SCHEMA SETUP FOR CS WEBSITE
-- ============================================================
-- This file contains the complete schema setup for:
-- 1. team_members (with clean recreation)
-- 2. announcements (Markdown-based)
-- ============================================================

-- ---------- TEAM MEMBERS TABLE ----------
-- Drop and recreate to fix schema cache errors
DROP TABLE IF EXISTS public.team_members CASCADE;

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text NOT NULL,
  linkedin_url text,
  github_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public can view active members
CREATE POLICY "Public can view active members"
ON public.team_members
FOR SELECT
USING (is_active = true);

-- Admin full access
CREATE POLICY "Admin full access team_members"
ON public.team_members
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ---------- ANNOUNCEMENTS TABLE ----------
DROP TABLE IF EXISTS public.announcements CASCADE;

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Public can view published announcements
CREATE POLICY "Public view published announcements"
ON public.announcements
FOR SELECT
USING (is_published = true);

-- Admin full control
CREATE POLICY "Admin full control announcements"
ON public.announcements
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- SETUP COMPLETE
-- After running this script:
-- 1. Refresh Supabase Table Editor
-- 2. Restart Next.js dev server
-- 3. Tables should now be accessible
-- ============================================================
