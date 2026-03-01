-- ====================================================
-- MULTI-MEDIA GALLERY SYSTEM SCHEMA
-- ====================================================
-- Execute this in Supabase SQL Editor
-- Supports multiple images/videos per Event and Achievement

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure one and only one parent relationship
  CONSTRAINT media_parent_check CHECK (
    (event_id IS NOT NULL AND achievement_id IS NULL) OR
    (event_id IS NULL AND achievement_id IS NOT NULL)
  )
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_media_event_id ON public.media(event_id);
CREATE INDEX IF NOT EXISTS idx_media_achievement_id ON public.media(achievement_id);
CREATE INDEX IF NOT EXISTS idx_media_display_order ON public.media(display_order);

-- Enable Row Level Security
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view all media
CREATE POLICY "Public read access to media"
ON public.media
FOR SELECT
USING (true);

-- RLS Policy: Only admins can insert media
CREATE POLICY "Admins can insert media"
ON public.media
FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- RLS Policy: Only admins can update media
CREATE POLICY "Admins can update media"
ON public.media
FOR UPDATE
USING (
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- RLS Policy: Only admins can delete media
CREATE POLICY "Admins can delete media"
ON public.media
FOR DELETE
USING (
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- ====================================================
-- STORAGE BUCKET RLS POLICIES (if not already configured)
-- ====================================================

-- Public read access to media bucket
CREATE POLICY "Public read media bucket" ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

-- Admins can upload to media bucket
CREATE POLICY "Admins upload media bucket" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Admins can delete from media bucket
CREATE POLICY "Admins delete media bucket" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'media' AND
  auth.uid() IN (SELECT user_id FROM public.admins)
);

-- ====================================================
-- VERIFICATION QUERIES
-- ====================================================

-- Check media table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'media'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'media';
