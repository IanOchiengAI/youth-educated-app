-- Migration 005: Align database schema with application data models
-- Fixes mismatches between supabase_schema.sql tables and seed.ts / app data

-- ============================================================
-- 1. MODULES TABLE — add missing columns
-- ============================================================
ALTER TABLE modules ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS min_age INTEGER DEFAULT 10;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_sensitive BOOLEAN DEFAULT FALSE;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS brothers_keepers_variant BOOLEAN DEFAULT FALSE;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS lessons INTEGER DEFAULT 0;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS competency TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS difficulty TEXT;

-- ============================================================
-- 2. LESSONS TABLE — add sections JSONB column
--    The app stores rich lesson content as a JSONB array of sections
--    (text, pullquote, insight_prompt, quiz) rather than plain text.
-- ============================================================
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS sections JSONB;
-- Make 'type' column optional since sections contain the structure
ALTER TABLE lessons ALTER COLUMN type DROP NOT NULL;

-- ============================================================
-- 3. LIFEKIT_ARTICLES TABLE — add missing columns for i18n and metadata
-- ============================================================
ALTER TABLE lifekit_articles ADD COLUMN IF NOT EXISTS title_sw TEXT;
ALTER TABLE lifekit_articles ADD COLUMN IF NOT EXISTS emoji TEXT;
ALTER TABLE lifekit_articles ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE lifekit_articles ADD COLUMN IF NOT EXISTS body_sw TEXT;
ALTER TABLE lifekit_articles ADD COLUMN IF NOT EXISTS month TEXT;

-- ============================================================
-- 4. OPPORTUNITY_TYPE ENUM — add missing values
--    The app data uses lowercase values and additional types.
--    PostgreSQL enums are case-sensitive, so we add lowercase variants
--    plus new types: 'grant', 'TVET', 'scholarship', 'internship', 'mentorship'
-- ============================================================
DO $$
BEGIN
  -- Add lowercase variants
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'scholarship' AND enumtypid = 'opportunity_type'::regtype) THEN
    ALTER TYPE opportunity_type ADD VALUE 'scholarship';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'internship' AND enumtypid = 'opportunity_type'::regtype) THEN
    ALTER TYPE opportunity_type ADD VALUE 'internship';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'mentorship' AND enumtypid = 'opportunity_type'::regtype) THEN
    ALTER TYPE opportunity_type ADD VALUE 'mentorship';
  END IF;
  -- Add new types
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'grant' AND enumtypid = 'opportunity_type'::regtype) THEN
    ALTER TYPE opportunity_type ADD VALUE 'grant';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'TVET' AND enumtypid = 'opportunity_type'::regtype) THEN
    ALTER TYPE opportunity_type ADD VALUE 'TVET';
  END IF;
END$$;
