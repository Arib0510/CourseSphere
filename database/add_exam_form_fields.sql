-- Migration: add exam form fields to profiles
-- Run this once in the Supabase SQL editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS name_bangla      TEXT,
  ADD COLUMN IF NOT EXISTS father_name      TEXT,
  ADD COLUMN IF NOT EXISTS father_name_bangla TEXT,
  ADD COLUMN IF NOT EXISTS address_current  TEXT;
