-- Migration: Fix user data consistency
-- This migration ensures all users have consistent data structure
-- 
-- IMPORTANT: This migration is idempotent and safe to run multiple times
-- It does NOT delete or modify existing data, only ensures consistency
--
-- Usage:
-- 1. Login to Supabase Dashboard (https://app.supabase.com)
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Click "New query"
-- 5. Paste this SQL
-- 6. Click "Run" to execute

-- Note: The application code now handles:
-- - Auto-seeding quotes for users with < 1000 quotes
-- - Auto-creating daily_quotes entries for users without today's quote
-- - Validating favorites before insertion
-- - Preventing duplicate favorites
--
-- This SQL file is for reference only.
-- The application will automatically fix data inconsistencies on user login/access.

-- Optional: Add unique constraint on favorites to prevent duplicates
-- (Only if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'favorites_user_quote_unique'
    ) THEN
        ALTER TABLE favorites 
        ADD CONSTRAINT favorites_user_quote_unique 
        UNIQUE (user_id, quote_id);
    END IF;
END $$;

-- Optional: Add index on daily_quotes for faster lookups
-- (Only if not already exists)
CREATE INDEX IF NOT EXISTS idx_daily_quotes_user_date 
ON daily_quotes(user_id, date DESC);

-- Optional: Add index on quotes for faster user lookups
-- (Only if not already exists)
CREATE INDEX IF NOT EXISTS idx_quotes_user_id 
ON quotes(user_id);

-- Note: The application code will automatically:
-- 1. Seed quotes for users with < 1000 quotes (from system master quotes)
-- 2. Create daily_quotes entries for users without today's quote
-- 3. Validate and prevent duplicate favorites
-- 4. Handle all data consistency on user login and page access

