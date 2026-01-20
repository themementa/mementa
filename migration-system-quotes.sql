-- Migration: Create system_quotes table
--
-- Usage:
-- 1. Open Supabase SQL Editor
-- 2. Paste and run this file

CREATE TABLE IF NOT EXISTS public.system_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text TEXT NOT NULL,
  cleaned_text_zh_tw TEXT,
  cleaned_text_zh_cn TEXT,
  cleaned_text_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.system_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "system_quotes_read_all"
  ON public.system_quotes
  FOR SELECT
  USING (true);

