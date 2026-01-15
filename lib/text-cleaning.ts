/**
 * 文字清理工具函數
 * 生成清理後的文字（不更新資料庫）
 */

export function cleanText(originalText: string): string {
  if (!originalText) {
    return "";
  }

  // 非 AI 的簡易清理邏輯：
  // - 去除頭尾空白
  // - 把多個空白壓成一個
  // - 把多個換行壓成最多兩個
  // - 如果太長，截斷到 280 字元
  const normalized = originalText.trim();

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

  return cleanedText;
}




