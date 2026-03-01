-- DATABASE SETUP VERIFICATION CHECKLIST
-- Run this in Supabase SQL Editor after running DATABASE_SETUP.sql

-- ============================================
-- 1) VERIFY REQUIRED TABLES EXIST IN public
-- ============================================
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('announcements', 'events', 'team_members', 'registrations', 'achievements')
ORDER BY tablename;

-- Expect: exactly 5 rows

-- ============================================
-- 2) VERIFY RLS ENABLED ON ALL TABLES
-- ============================================
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('announcements', 'events', 'team_members', 'registrations', 'achievements')
ORDER BY c.relname;

-- Expect: rls_enabled = true for all rows

-- ============================================
-- 3) VERIFY POLICY DEFINITIONS
-- ============================================
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('announcements', 'events', 'team_members', 'registrations', 'achievements')
ORDER BY tablename, policyname;

-- Expected policy names:
-- announcements: "Public can read published announcements", "Admin full access announcements"
-- events:        "Public can read published events", "Admin full access events"
-- team_members:  "Public can read active team members", "Admin full access team members"
-- registrations: "Public can insert registrations", "Admin full access registrations"
-- achievements:  "Public can read published achievements", "Admin full access achievements"

-- ============================================
-- 4) VERIFY UNIQUE CONSTRAINT FOR REGISTRATIONS
-- ============================================
SELECT
  conname,
  pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
JOIN pg_class t ON t.oid = c.conrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
  AND t.relname = 'registrations'
  AND c.contype = 'u';

-- Expect: unique constraint on (event_id, email)

-- ============================================
-- 5) QUICK POLICY COMPLIANCE SUMMARY
-- ============================================
WITH required_policies AS (
  SELECT * FROM (VALUES
    ('announcements', 'Public can read published announcements'),
    ('announcements', 'Admin full access announcements'),
    ('events', 'Public can read published events'),
    ('events', 'Admin full access events'),
    ('team_members', 'Public can read active team members'),
    ('team_members', 'Admin full access team members'),
    ('registrations', 'Public can insert registrations'),
    ('registrations', 'Admin full access registrations'),
    ('achievements', 'Public can read published achievements'),
    ('achievements', 'Admin full access achievements')
  ) AS t(tablename, policyname)
)
SELECT
  r.tablename,
  r.policyname,
  CASE WHEN p.policyname IS NOT NULL THEN 'PASS' ELSE 'FAIL' END AS status
FROM required_policies r
LEFT JOIN pg_policies p
  ON p.schemaname = 'public'
 AND p.tablename = r.tablename
 AND p.policyname = r.policyname
ORDER BY r.tablename, r.policyname;
