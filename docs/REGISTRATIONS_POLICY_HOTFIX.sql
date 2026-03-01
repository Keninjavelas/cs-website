-- Fix registrations policy so public users cannot read registrations
-- Run in Supabase SQL Editor

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Remove any legacy/incorrect policies
DROP POLICY IF EXISTS "Admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Anyone can register for events" ON public.registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public can insert registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admin full access registrations" ON public.registrations;

-- Public can only INSERT registration rows
CREATE POLICY "Public can insert registrations"
  ON public.registrations
  FOR INSERT
  WITH CHECK (TRUE);

-- Admin has full CRUD
CREATE POLICY "Admin full access registrations"
  ON public.registrations
  FOR ALL
  USING ((auth.jwt()->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->>'role') = 'admin');
