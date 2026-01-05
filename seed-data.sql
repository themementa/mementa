-- Mementa 測試資料
-- 
-- 使用方法：
-- 1. 登入 Supabase Dashboard (https://app.supabase.com)
-- 2. 選擇你的專案
-- 3. 左側選單點擊 "SQL Editor"
-- 4. 點擊 "New query"
-- 5. 貼上此 SQL（先執行步驟 A 獲取你的用戶 ID）
-- 6. 將 YOUR_USER_ID_HERE 替換為步驟 A 查到的用戶 ID
-- 7. 點擊 "Run" 執行
--
-- 步驟 A：先查詢你的用戶 ID
-- SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
--
-- 步驟 B：將查到的用戶 ID 替換到下面的 YOUR_USER_ID_HERE，然後執行

-- 插入測試金句
INSERT INTO quotes (user_id, original_text, cleaned_text)
VALUES
  ('YOUR_USER_ID_HERE', '「成功不是終點，失敗也不是致命的，繼續前進的勇氣才是最重要的。」', '成功不是終點，失敗也不是致命的，繼續前進的勇氣才是最重要的。'),
  ('YOUR_USER_ID_HERE', '「The only way to do great work is to love what you do.」', 'The only way to do great work is to love what you do.'),
  ('YOUR_USER_ID_HERE', '「生活就像騎單車，要保持平衡，就必須不斷前進。」', '生活就像騎單車，要保持平衡，就必須不斷前進。'),
  ('YOUR_USER_ID_HERE', '「Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.」', 'Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.'),
  ('YOUR_USER_ID_HERE', '「不要等待機會，而要創造機會。」', '不要等待機會，而要創造機會。'),
  ('YOUR_USER_ID_HERE', '「The future belongs to those who believe in the beauty of their dreams.」', 'The future belongs to those who believe in the beauty of their dreams.'),
  ('YOUR_USER_ID_HERE', '「做你自己，因為其他人都已經有人做了。」', '做你自己，因為其他人都已經有人做了。'),
  ('YOUR_USER_ID_HERE', '「It does not matter how slowly you go as long as you do not stop.」', 'It does not matter how slowly you go as long as you do not stop.');

