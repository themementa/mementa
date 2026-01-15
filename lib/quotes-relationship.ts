import type { Quote } from "@/lib/quotes";

/**
 * Filter quotes related to relationships, self-worth, boundaries, and being treated well
 * Focus on: self-value, boundaries, being treated well
 * Avoid: pleasing, tolerance, waiting, male-oriented statements
 */
export function filterRelationshipQuotes(quotes: Quote[]): Quote[] {
  // Keywords related to relationships, self-worth, boundaries, being treated well
  const relationshipKeywords = [
    // Self-worth / 自我價值
    "自己", "自我", "價值", "值得", "善待", "尊重",
    // Boundaries / 邊界
    "邊界", "界線", "底線", "原則", "選擇",
    // Being treated well / 被善待
    "溫柔", "善待", "珍惜", "愛護", "呵護",
    // Relationship context / 關係語境
    "關係", "愛", "情感", "陪伴", "理解", "接納",
    // English keywords
    "self", "worth", "value", "deserve", "boundary", "boundaries",
    "treated", "gentle", "respect", "love", "relationship", "relationships"
  ];

  // Negative keywords to exclude (pleasing, tolerance, waiting, male-oriented)
  const excludeKeywords = [
    "取悅", "討好", "忍耐", "等待", "犧牲", "付出",
    "pleasing", "tolerance", "wait", "sacrifice", "give"
  ];

  return quotes.filter(quote => {
    // Check all language fields
    const textToCheck = [
      quote.cleaned_text_zh_tw,
      quote.cleaned_text_zh_cn,
      quote.cleaned_text_en,
      quote.original_text
    ].filter(Boolean).join(" ").toLowerCase();

    // Must contain at least one relationship keyword
    const hasRelationshipKeyword = relationshipKeywords.some(keyword =>
      textToCheck.includes(keyword.toLowerCase())
    );

    // Must not contain exclude keywords
    const hasExcludeKeyword = excludeKeywords.some(keyword =>
      textToCheck.includes(keyword.toLowerCase())
    );

    return hasRelationshipKeyword && !hasExcludeKeyword;
  });
}




