-- ====================================================
-- STUDENT CHAPTER MEMBERSHIP SYSTEM SCHEMA
-- ====================================================
-- Execute this in Supabase SQL Editor
-- Manages IEEE CS Student Chapter memberships

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure one membership per user
  CONSTRAINT unique_user_membership UNIQUE (user_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_members_joined_at ON public.members(joined_at DESC);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- ====================================================
-- RLS POLICIES
-- ====================================================

-- Policy: Users can view their own membership
CREATE POLICY "Users can view own membership"
ON public.members
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can view all memberships
CREATE POLICY "Admins can view all memberships"
ON public.members
FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Policy: Authenticated users can insert their own membership
CREATE POLICY "Users can insert own membership"
ON public.members
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IS NOT NULL
);

-- Policy: Admins can update memberships
CREATE POLICY "Admins can update memberships"
ON public.members
FOR UPDATE
USING (
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Policy: Admins can delete memberships
CREATE POLICY "Admins can delete memberships"
ON public.members
FOR DELETE
USING (
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- ====================================================
-- HELPER FUNCTION: Check if user is a member
-- ====================================================

CREATE OR REPLACE FUNCTION public.is_member(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.members
    WHERE user_id = user_uuid
    AND status = 'active'
  );
$$;

-- ====================================================
-- VERIFICATION QUERIES
-- ====================================================

-- Check members table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'members'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'members';

-- Check constraints
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.members'::regclass;
