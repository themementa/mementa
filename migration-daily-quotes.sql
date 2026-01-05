-- Migration: 新增 daily_quotes 表來記錄每個用戶每天的今日金句
-- 
-- 使用方法：
-- 1. 登入 Supabase Dashboard (https://app.supabase.com)
-- 2. 選擇你的專案
-- 3. 左側選單點擊 "SQL Editor"
-- 4. 點擊 "New query"
-- 5. 貼上此 SQL
-- 6. 點擊 "Run" 執行

-- 創建 daily_quotes 表
CREATE TABLE IF NOT EXISTS daily_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 創建索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_daily_quotes_user_date ON daily_quotes(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_quote_id ON daily_quotes(quote_id);

-- 啟用 Row Level Security (RLS)
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 政策：用戶只能查看和創建自己的 daily_quotes
CREATE POLICY "Users can view their own daily quotes"
  ON daily_quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily quotes"
  ON daily_quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);



