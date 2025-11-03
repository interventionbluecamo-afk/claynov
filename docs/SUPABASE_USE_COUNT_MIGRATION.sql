-- Add use_count column to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS use_count INTEGER DEFAULT 0;

-- Add index for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_profiles_use_count ON profiles(use_count);

-- Update existing users to have 0 use_count if NULL
UPDATE profiles 
SET use_count = 0 
WHERE use_count IS NULL;

