-- Migration: 新增語言欄位到 quotes 表
-- 
-- 使用方法：
-- 1. 登入 Supabase Dashboard (https://app.supabase.com)
-- 2. 選擇你的專案
-- 3. 左側選單點擊 "SQL Editor"
-- 4. 點擊 "New query"
-- 5. 貼上此 SQL
-- 6. 點擊 "Run" 執行

-- 新增語言欄位
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS cleaned_text_zh_cn TEXT;

ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS cleaned_text_en TEXT;




