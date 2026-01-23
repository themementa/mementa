export type Language = "zh-tw" | "zh-cn" | "en";

export const DEFAULT_LANGUAGE: Language = "zh-tw";

export const translations = {
  "zh-tw": {
    today: "今日",
    todaysQuote: "今日金句",
    all: "全部",
    allQuotes: "金句庫",
    favorites: "收藏",
    myFavorites: "我的收藏",
    logout: "登出",
    favorite: "收藏",
    unfavorite: "取消收藏",
    next: "換一句",
    dailyUpdate: "每日更新",
    languageSwitch: "語言切換",
    viewDetails: "查看完整內容",
    originalText: "查看原始文字",
    update: "更新",
    save: "儲存金句",
    clean: "清理",
    processing: "處理中...",
    noQuotes: "目前還沒有金句",
    noFavorites: "目前還沒有收藏的金句",
    addQuote: "新增一個",
    goToFavorites: "前往金句庫",
    quoteContent: "金句內容",
    originalTextLabel: "原始文字",
    cleanedTextLabel: "清理後文字",
    relationship: "關係",
    thisMomentIsYours: "這一刻，只屬於你",
    journalPlaceholder: "這句話，令我想起……",
    journalSaved: "已為你悄悄保存",
    myMoments: "我的片刻",
    noMoments: "目前還沒有片刻"
  },
  "zh-cn": {
    today: "今日",
    todaysQuote: "今日金句",
    all: "全部",
    allQuotes: "金句库",
    favorites: "收藏",
    myFavorites: "我的收藏",
    logout: "登出",
    favorite: "收藏",
    unfavorite: "取消收藏",
    next: "换一句",
    dailyUpdate: "每日更新",
    languageSwitch: "语言切换",
    viewDetails: "查看完整内容",
    originalText: "查看原始文字",
    update: "更新",
    save: "保存金句",
    clean: "清理",
    processing: "处理中...",
    noQuotes: "目前还没有金句",
    noFavorites: "目前还没有收藏的金句",
    addQuote: "新增一个",
    goToFavorites: "前往金句库",
    quoteContent: "金句内容",
    originalTextLabel: "原始文字",
    cleanedTextLabel: "清理后文字",
    relationship: "关系",
    thisMomentIsYours: "这一刻，只属于你",
    journalPlaceholder: "这句话，令我想起……",
    journalSaved: "已为你悄悄保存",
    myMoments: "我的片刻",
    noMoments: "目前还没有片刻"
  },
  en: {
    today: "Today",
    todaysQuote: "Today's Quote",
    all: "All",
    allQuotes: "All Quotes",
    favorites: "Favorites",
    myFavorites: "My Favorites",
    logout: "Logout",
    favorite: "Favorite",
    unfavorite: "Unfavorite",
    next: "Next",
    dailyUpdate: "Daily Update",
    languageSwitch: "Language",
    viewDetails: "View Details",
    originalText: "View Original",
    update: "Update",
    save: "Save Quote",
    clean: "Clean",
    processing: "Processing...",
    noQuotes: "No quotes yet",
    noFavorites: "No favorites yet",
    addQuote: "Add One",
    goToFavorites: "Browse Quotes",
    quoteContent: "Quote Content",
    originalTextLabel: "Original Text",
    cleanedTextLabel: "Cleaned Text",
    relationship: "Relationships",
    thisMomentIsYours: "This moment, only yours",
    journalPlaceholder: "This quote reminds me of...",
    journalSaved: "Quietly saved",
    myMoments: "My Moments",
    noMoments: "No moments yet"
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations["zh-tw"]): string {
  return translations[lang]?.[key] || translations[DEFAULT_LANGUAGE][key];
}

export function filterQuotesByLanguage(quotes: Array<{ cleaned_text_zh_tw: string | null; cleaned_text_zh_cn: string | null; cleaned_text_en: string | null }>, language: Language): Array<{ cleaned_text_zh_tw: string | null; cleaned_text_zh_cn: string | null; cleaned_text_en: string | null }> {
  return quotes.filter(quote => {
    switch (language) {
      case "zh-tw":
        // zh-tw: cleaned_text_zh_tw only (no fallback)
        return (quote.cleaned_text_zh_tw?.trim() || "") !== "";
      case "zh-cn":
        // zh-cn: cleaned_text_zh_cn only (no fallback)
        return (quote.cleaned_text_zh_cn?.trim() || "") !== "";
      case "en":
        // en: cleaned_text_en only (no fallback)
        return (quote.cleaned_text_en?.trim() || "") !== "";
      default:
        // Default to zh-tw
        return (quote.cleaned_text_zh_tw?.trim() || "") !== "";
    }
  });
}

/**
 * Get display text for a quote based on language (cleaned text only, no fallback)
 * Strict language matching: zh-tw → cleaned_text_zh_tw, zh-cn → cleaned_text_zh_cn, en → cleaned_text_en
 */
export function getQuoteDisplayText(
  quote: { cleaned_text_zh_tw: string | null; cleaned_text_zh_cn: string | null; cleaned_text_en: string | null; [key: string]: any },
  language: Language
): string {
  switch (language) {
    case "zh-tw":
      // zh-tw: cleaned_text_zh_tw only (no fallback)
      return quote.cleaned_text_zh_tw?.trim() ?? "";
    case "zh-cn":
      // zh-cn: cleaned_text_zh_cn only (no fallback)
      return quote.cleaned_text_zh_cn?.trim() ?? "";
    case "en":
      // en: cleaned_text_en only (no fallback)
      return quote.cleaned_text_en?.trim() ?? "";
    default:
      // Default to zh-tw
      return quote.cleaned_text_zh_tw?.trim() ?? "";
  }
}

/**
 * Get the editable cleaned text field name based on language
 */
export function getCleanedTextFieldName(language: Language): "cleaned_text_zh_tw" | "cleaned_text_zh_cn" | "cleaned_text_en" {
  switch (language) {
    case "zh-cn":
      return "cleaned_text_zh_cn";
    case "en":
      return "cleaned_text_en";
    case "zh-tw":
    default:
      return "cleaned_text_zh_tw";
  }
}

/**
 * Get the current language's cleaned text value
 */
export function getCurrentLanguageCleanedText(
  quote: { cleaned_text_zh_tw: string | null; cleaned_text_zh_cn: string | null; cleaned_text_en: string | null },
  language: Language
): string {
  switch (language) {
    case "zh-cn":
      return quote.cleaned_text_zh_cn?.trim() ?? "";
    case "en":
      return quote.cleaned_text_en?.trim() ?? "";
    case "zh-tw":
    default:
      return quote.cleaned_text_zh_tw?.trim() ?? "";
  }
}

