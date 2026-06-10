-- Add syllabus and curriculum PDF URL columns to courses table.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zhjbqcxprqnmffefjemk/sql/new

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS syllabus_url   TEXT,
  ADD COLUMN IF NOT EXISTS curriculum_url TEXT,
  ADD COLUMN IF NOT EXISTS description    TEXT;

-- Also create the storage bucket for course PDFs if it doesn't exist.
-- Do this in the Supabase Storage dashboard (Storage > New Bucket):
--   Bucket name: course-pdfs
--   Public: true  (so PDF links work without authentication)
