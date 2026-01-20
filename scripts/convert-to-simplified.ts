/**
 * 繁簡轉換腳本
 * 將所有 system_quotes 的 cleaned_text_zh_tw（繁體）轉換為簡體並填入 cleaned_text_zh_cn
 * 
 * 使用方法：
 * 1. 安裝依賴：npm install opencc
 * 2. 執行：npx tsx scripts/convert-to-simplified.ts
 */

import 'dotenv/config'
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { Converter } from "opencc-js";

// 初始化 OpenCC 轉換器（繁體轉簡體）
const converter = Converter({ from: "hk", to: "cn" });

// 從環境變數讀取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("錯誤：請設置環境變數 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// 使用 service role key 來繞過 RLS（Row Level Security）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function convertQuotesToSimplified() {
  console.log("開始轉換 system_quotes 為簡體中文...\n");

  try {
    // 1. 獲取所有需要轉換的 system_quotes（cleaned_text_zh_tw 不為空，且 cleaned_text_zh_cn 為空）
    const { data: quotes, error: fetchError } = await supabase
      .from("system_quotes")
      .select("id, cleaned_text_zh_tw, cleaned_text_zh_cn")
      .not("cleaned_text_zh_tw", "is", null)
      .or("cleaned_text_zh_cn.is.null,cleaned_text_zh_cn.eq.");

    if (fetchError) {
      throw new Error(`獲取 quotes 失敗: ${fetchError.message}`);
    }

    if (!quotes || quotes.length === 0) {
      console.log("沒有找到需要轉換的 quotes");
      return;
    }

    // 過濾出需要轉換的 quotes（cleaned_text_zh_cn 為空或 null）
    const quotesToConvert = quotes.filter(
      (q) => q.cleaned_text_zh_tw && (!q.cleaned_text_zh_cn || q.cleaned_text_zh_cn.trim() === "")
    );

    console.log(`找到 ${quotesToConvert.length} 條 quotes 需要處理（總共 ${quotes.length} 條）\n`);

    // 2. 轉換並更新每條 quote
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const quote of quotesToConvert) {
      try {
        if (!quote.cleaned_text_zh_tw) {
          console.log(`[跳過] Quote ${quote.id}: cleaned_text_zh_tw 為空`);
          skipCount++;
          continue;
        }

        // 轉換繁體為簡體
        const simplifiedText = converter(quote.cleaned_text_zh_tw);

        // 更新資料庫
        const { error: updateError } = await supabase
          .from("system_quotes")
          .update({ cleaned_text_zh_cn: simplifiedText })
          .eq("id", quote.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        const preview = quote.cleaned_text_zh_tw.length > 30 ? quote.cleaned_text_zh_tw.substring(0, 30) + "..." : quote.cleaned_text_zh_tw;
        const simplifiedPreview = simplifiedText.length > 30 ? simplifiedText.substring(0, 30) + "..." : simplifiedText;
        console.log(`[成功] Quote ${quote.id}: ${preview} → ${simplifiedPreview}`);
        successCount++;
      } catch (error) {
        console.error(`[錯誤] Quote ${quote.id}:`, error instanceof Error ? error.message : error);
        errorCount++;
      }
    }

    // 3. 輸出結果
    console.log("\n=== 轉換完成 ===");
    console.log(`成功: ${successCount} 條`);
    console.log(`跳過: ${skipCount} 條`);
    console.log(`錯誤: ${errorCount} 條`);
    console.log(`總計處理: ${quotesToConvert.length} 條`);
  } catch (error) {
    console.error("轉換過程發生錯誤:", error);
    process.exit(1);
  }
}

// 執行轉換
convertQuotesToSimplified()
  .then(() => {
    console.log("\n腳本執行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("腳本執行失敗:", error);
    process.exit(1);
  });

