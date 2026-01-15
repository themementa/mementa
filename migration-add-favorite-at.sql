-- Migration: 新增 favorite_at 欄位到 favorites 表
-- 
-- 使用方法：
-- 1. 登入 Supabase Dashboard (https://app.supabase.com)
-- 2. 選擇你的專案
-- 3. 左側選單點擊 "SQL Editor"
-- 4. 點擊 "New query"
-- 5. 貼上此 SQL
-- 6. 點擊 "Run" 執行

-- 新增 favorite_at 欄位（如果不存在）
ALTER TABLE favorites 
ADD COLUMN IF NOT EXISTS favorite_at TIMESTAMP DEFAULT NOW();

-- 為現有的記錄設定 favorite_at（如果為 NULL，使用 created_at）
UPDATE favorites 
SET favorite_at = created_at 
WHERE favorite_at IS NULL;




