# 繁簡轉換腳本

## 功能說明

此腳本會自動將所有 quotes 的 `cleaned_text`（繁體中文）轉換為簡體中文，並填入 `cleaned_text_zh_cn` 欄位。

## 使用方法

### 1. 設置環境變數

確保 `.env.local` 或環境變數中包含：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 或使用 NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**注意**：建議使用 `SUPABASE_SERVICE_ROLE_KEY` 以繞過 Row Level Security (RLS)。

### 2. 執行腳本

```bash
npm run convert:zh-cn
```

或直接使用：

```bash
npx tsx scripts/convert-to-simplified.ts
```

## 腳本行為

- ✅ 只轉換 `cleaned_text` 不為空且 `cleaned_text_zh_cn` 為空的 quotes
- ✅ 自動跳過已有簡體版本的 quotes
- ✅ 使用 OpenCC 進行繁簡轉換（香港繁體 → 簡體中文）
- ✅ 顯示轉換進度和結果統計

## 轉換規則

- **來源**：`cleaned_text`（繁體中文）
- **目標**：`cleaned_text_zh_cn`（簡體中文）
- **轉換工具**：OpenCC (hk → cn)
- **不影響**：`cleaned_text`、`cleaned_text_en`、`original_text`

## 注意事項

1. 執行前建議先備份資料庫
2. 腳本會跳過已有 `cleaned_text_zh_cn` 的 quotes，不會覆蓋現有資料
3. 如果轉換失敗，會顯示錯誤訊息但不會中斷整個流程



