import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getFavoriteQuotesForUser } from "@/lib/favorites";
import { getAllQuotes } from "@/lib/quotes";
import type { Quote } from "@/lib/quotes";

export const dynamic = "force-dynamic";

type Language = "zh-tw" | "zh-cn" | "en";

function getQuoteForDate(quotes: Quote[], dateString: string): Quote {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % quotes.length;
  return quotes[index];
}

function getDisplayText(quote: Quote, language: Language): string {
  switch (language) {
    case "zh-cn":
      // zh-cn: cleaned_text_zh_cn only (no fallback)
      return quote.cleaned_text_zh_cn?.trim() ?? "";
    case "en":
      // en: cleaned_text_en only (no fallback)
      return quote.cleaned_text_en?.trim() ?? "";
    case "zh-tw":
    default:
      // zh-tw: cleaned_text_zh_tw only (no fallback)
      return quote.cleaned_text_zh_tw?.trim() ?? "";
  }
}

// 預設金句（如果用戶沒有收藏）
const DEFAULT_QUOTE: Quote = {
  id: "default",
  user_id: "",
  original_text: "「成功不是終點，失敗也不是致命的，繼續前進的勇氣才是最重要的。」",
  cleaned_text_zh_tw: "成功不是終點，失敗也不是致命的，繼續前進的勇氣才是最重要的。",
  cleaned_text_zh_cn: "",
  cleaned_text_zh_hans: "",
  cleaned_text_en: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export async function GET(request: NextRequest) {
  try {
    // 獲取語言參數（預設為 zh-tw）
    const searchParams = request.nextUrl.searchParams;
    const languageParam = searchParams.get("language") || "zh-tw";
    const language: Language = 
      languageParam === "zh-cn" || languageParam === "en" || languageParam === "zh-tw"
        ? (languageParam as Language)
        : "zh-tw";

    // 獲取當前用戶
    const user = await getCurrentUser();
    
    if (!user) {
      // 如果沒有用戶，返回預設金句
      const text = getDisplayText(DEFAULT_QUOTE, language);
      const today = new Date().toISOString().split("T")[0];
      
      return NextResponse.json({
        text,
        language,
        date: today
      });
    }

    // 獲取用戶的收藏
    const favorites = await getFavoriteQuotesForUser(user.id);
    
    // 如果沒有收藏，使用全部 quotes
    let quotes: Quote[] = [];
    if (favorites.length > 0) {
      quotes = favorites;
    } else {
      const allQuotes = await getAllQuotes();
      if (allQuotes.length > 0) {
        quotes = allQuotes;
      }
    }

    // 如果還是沒有 quotes，返回預設金句
    if (quotes.length === 0) {
      const text = getDisplayText(DEFAULT_QUOTE, language);
      const today = new Date().toISOString().split("T")[0];
      
      return NextResponse.json({
        text,
        language,
        date: today
      });
    }

    // 根據今天的日期選擇金句
    const today = new Date().toISOString().split("T")[0];
    const selectedQuote = getQuoteForDate(quotes, today);
    
    // 根據語言獲取文字
    const text = getDisplayText(selectedQuote, language);

    return NextResponse.json({
      text,
      language,
      date: today
    });
  } catch (error) {
    console.error("[API /api/widget/today] 錯誤:", error);
    
    // 發生錯誤時返回預設金句
    const languageParam = request.nextUrl.searchParams.get("language") || "zh-tw";
    const language: Language = 
      languageParam === "zh-cn" || languageParam === "en" || languageParam === "zh-tw"
        ? (languageParam as Language)
        : "zh-tw";
    
    const text = getDisplayText(DEFAULT_QUOTE, language);
    const today = new Date().toISOString().split("T")[0];
    
    return NextResponse.json({
      text,
      language,
      date: today
    }, { status: 200 }); // 即使錯誤也返回 200，確保 widget 能顯示內容
  }
}

