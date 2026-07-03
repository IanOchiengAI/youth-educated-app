-- ============================================================
-- Migration: ElevenLabs TTS Daily Quota Limit
-- Date: 2026-07-03
-- Author: Evelyn "Evie" Vance
-- ============================================================

-- 1. Add TTS quota tracking columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tts_characters_today INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_tts_date DATE DEFAULT CURRENT_DATE;

-- 2. Create the quota validation and increment function
CREATE OR REPLACE FUNCTION public.increment_tts_usage(char_count INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_id uuid;
  current_used integer;
  current_date_val date;
BEGIN
  caller_id := auth.uid();
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Session missing';
  END IF;

  -- Select current details
  SELECT tts_characters_today, last_tts_date
  INTO current_used, current_date_val
  FROM public.profiles
  WHERE id = caller_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Reset count if new day
  IF current_date_val IS DISTINCT FROM CURRENT_DATE THEN
    UPDATE public.profiles
    SET
      tts_characters_today = char_count,
      last_tts_date = CURRENT_DATE
    WHERE id = caller_id;
  ELSE
    -- Check if it exceeds the 5,000 character daily limit
    IF (COALESCE(current_used, 0) + char_count) > 5000 THEN
      RAISE EXCEPTION 'TTS daily character quota exceeded (Limit: 5,000 characters)';
    END IF;

    UPDATE public.profiles
    SET
      tts_characters_today = COALESCE(current_used, 0) + char_count
    WHERE id = caller_id;
  END IF;
END;
$$;

-- Grant permissions to authenticated users to execute
REVOKE EXECUTE ON FUNCTION public.increment_tts_usage(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_tts_usage(integer) TO authenticated;
