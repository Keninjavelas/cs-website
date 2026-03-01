-- SQL Setup Script for IEEE CS Website
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor → New Query
-- Copy all code below and execute

-- ============================================
-- 1. ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON announcements(slug);

-- ============================================
-- 2. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  event_type TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- ============================================
-- 3. TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

-- ============================================
-- 4. REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  usn TEXT,
  branch TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint: one email per event
  UNIQUE(event_id, email)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- ============================================
-- 5. ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  year TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Drop policies first so this script can be safely re-run
DROP POLICY IF EXISTS "Public can read published announcements" ON announcements;
DROP POLICY IF EXISTS "Admin full access announcements" ON announcements;

DROP POLICY IF EXISTS "Public can read published events" ON events;
DROP POLICY IF EXISTS "Admin full access events" ON events;

DROP POLICY IF EXISTS "Public can read active team members" ON team_members;
DROP POLICY IF EXISTS "Admin full access team members" ON team_members;

DROP POLICY IF EXISTS "Public can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Admin full access registrations" ON registrations;

DROP POLICY IF EXISTS "Public can read published achievements" ON achievements;
DROP POLICY IF EXISTS "Admin full access achievements" ON achievements;

-- Announcements
CREATE POLICY "Public can read published announcements"
  ON announcements FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin full access announcements"
  ON announcements FOR ALL
  USING ((auth.jwt()->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->>'role') = 'admin');

-- Events
CREATE POLICY "Public can read published events"
  ON events FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin full access events"
  ON events FOR ALL
  USING ((auth.jwt()->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->>'role') = 'admin');

-- Team members
CREATE POLICY "Public can read active team members"
  ON team_members FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin full access team members"
  ON team_members FOR ALL
  USING ((auth.jwt()->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->>'role') = 'admin');

-- Registrations
CREATE POLICY "Public can insert registrations"
  ON registrations FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin full access registrations"
  ON registrations FOR ALL
  USING ((auth.jwt()->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->>'role') = 'admin');

-- Achievements
CREATE POLICY "Public can read published achievements"
  ON achievements FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin full access achievements"
  ON achievements FOR ALL
  USING ((auth.jwt()->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->>'role') = 'admin');

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- All tables are now created with proper RLS policies
-- Your Next.js application can now connect to these tables
