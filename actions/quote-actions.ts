"use server";

import { requireUser } from "@/lib/auth";
import { updateQuote, getQuoteById } from "@/lib/quotes";

export async function updateQuoteAction(formData: FormData) {
  const user = await requireUser();

  const id = String(formData.get("id") || "");
  const originalTextRaw = formData.get("original_text");
  const language = String(formData.get("language") || "zh-tw");
  const fieldName = String(formData.get("field_name") || "cleaned_text_zh_tw");
  
  // 根據欄位名稱獲取對應的值
  const cleanedTextRaw = formData.get(fieldName);

  if (!id) {
    return { error: "Missing quote ID" };
  }

  const originalText =
    originalTextRaw === null ? undefined : String(originalTextRaw).trim();
  const cleanedText =
    cleanedTextRaw === null ? undefined : String(cleanedTextRaw).trim();

  // 根據語言更新對應欄位
  const updateParams: {
    id: string;
    originalText?: string;
    cleanedTextZhTw?: string | null;
    cleanedTextZhCn?: string | null;
    cleanedTextEn?: string | null;
  } = { id };

  if (originalText !== undefined) {
    updateParams.originalText = originalText;
  }

  if (cleanedText !== undefined) {
    switch (fieldName) {
      case "cleaned_text_zh_cn":
        updateParams.cleanedTextZhCn = cleanedText || null;
        break;
      case "cleaned_text_en":
        updateParams.cleanedTextEn = cleanedText || null;
        break;
      case "cleaned_text_zh_tw":
      default:
        updateParams.cleanedTextZhTw = cleanedText || null;
        break;
    }
  }

  await updateQuote(updateParams);

  return { success: true, id };
}

export async function cleanQuoteAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");

  if (!id) {
    return { error: "缺少 quote id" };
  }

  const quote = await getQuoteById(id);
  if (!quote) {
    return { error: "找不到此金句" };
  }

  if (!quote.original_text) {
    return { error: "原始文字為空，無法清理" };
  }

  // 非 AI 的簡易清理邏輯：
  // - 去除頭尾空白
  // - 把多個空白壓成一個
  // - 把多個換行壓成最多兩個
  // - 如果太長，截斷到 280 字元
  const normalized = quote.original_text.trim();

  const collapsedSpaces = normalized.replace(/\s+/g, " ");

  // 恢復部分段落感：把句號後面的空白再換成換行（簡單 heuristic）
  let withLineBreaks = collapsedSpaces.replace(/([。！？!?\.\n])\s+/g, "$1\n");

  // 限制最多連續兩個換行
  withLineBreaks = withLineBreaks.replace(/\n{3,}/g, "\n\n");

  let cleanedText = withLineBreaks;
  const maxLength = 280;
  if (cleanedText.length > maxLength) {
    cleanedText = cleanedText.slice(0, maxLength).trim() + "…";
  }

  await updateQuote({
    id,
    cleanedTextZhTw: cleanedText
  });

  return { success: true, id };
}


