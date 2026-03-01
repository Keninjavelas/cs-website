/**
 * EVENT REGISTRATION SYSTEM - DATABASE SCHEMA & RLS
 * 
 * This file contains SQL queries needed to set up the registration system.
 * Execute these in your Supabase SQL Editor.
 */

-- ============================================
-- 1. CREATE REGISTRATIONS TABLE
-- ============================================

CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  usn TEXT,
  branch TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate registrations per event
  CONSTRAINT unique_registration_per_event UNIQUE(event_id, email)
);

-- Create index for faster lookups
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX idx_registrations_email ON public.registrations(email);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at DESC);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. RLS POLICY: Public Insert (Anyone can register)
-- ============================================

CREATE POLICY "Allow public registration"
  ON public.registrations
  FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- 4. RLS POLICY: Public Cannot Select (Privacy)
-- ============================================

CREATE POLICY "Public cannot view registrations"
  ON public.registrations
  FOR SELECT
  USING (FALSE);

-- ============================================
-- 5. RLS POLICY: Admin Can Select All
-- ============================================

CREATE POLICY "Admin can view all registrations"
  ON public.registrations
  FOR SELECT
  USING (
    -- Check if user is authenticated and has admin role
    auth.role() = 'authenticated' AND
    (
      SELECT (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    )
  );

-- ============================================
-- 6. RLS POLICY: Admin Can Update/Delete
-- ============================================

CREATE POLICY "Admin can manage all registrations"
  ON public.registrations
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    (
      SELECT (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    )
  );

CREATE POLICY "Admin can delete registrations"
  ON public.registrations
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    (
      SELECT (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    )
  );

-- ============================================
-- 7. VERIFY SETUP (Run these to test)
-- ============================================

-- Check table structure
-- SELECT * FROM information_schema.columns WHERE table_name = 'registrations';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'registrations';

-- Check column permissions
-- SELECT * FROM pg_policies WHERE tablename = 'registrations';

-- ============================================
-- NOTES
-- ============================================

/*
IMPORTANT SECURITY NOTES:

1. Anonymous Access:
   - Public users do NOT need to be authenticated to insert
   - RLS automatically allows anonymous INSERT (WITH CHECK TRUE)
   - But they cannot SELECT their own registrations (privacy by design)

2. Admin Access:
   - Must be authenticated
   - Must have role="admin" in user_metadata
   - Can SELECT, UPDATE, DELETE all registrations

3. Duplicate Prevention:
   - UNIQUE(event_id, email) constraint prevents same email registering twice
   - Supabase will return 23505 (unique violation) error
   - Handle this in application code

4. Cascading Delete:
   - If event is deleted, all its registrations are automatically deleted
   - ON DELETE CASCADE set on event_id FK

5. Performance:
   - Indexes on event_id, email, created_at for fast queries
   - Recommend pagination for large registration lists
*/
