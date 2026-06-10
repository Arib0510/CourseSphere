-- Migration: add PDF registration fields to profiles
-- Run this once in the Supabase SQL editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS registration_no  TEXT,
  ADD COLUMN IF NOT EXISTS academic_session TEXT,
  ADD COLUMN IF NOT EXISTS earned_credits   NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS backlog_count    INTEGER;
