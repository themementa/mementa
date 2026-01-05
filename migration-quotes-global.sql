-- Migration: 將 quotes 改為全局資料
-- 
-- 使用方法：
-- 1. 登入 Supabase Dashboard (https://app.supabase.com)
-- 2. 選擇你的專案
-- 3. 左側選單點擊 "SQL Editor"
-- 4. 點擊 "New query"
-- 5. 貼上此 SQL
-- 6. 點擊 "Run" 執行

-- 將 user_id 改為 nullable
ALTER TABLE quotes 
ALTER COLUMN user_id DROP NOT NULL;

-- 可選：將現有的 user_id 設為 NULL（如果需要完全移除所有關聯）
-- UPDATE quotes SET user_id = NULL;



