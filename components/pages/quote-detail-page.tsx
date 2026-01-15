"use client";

import { useState, useEffect } from "react";
import type { Quote } from "@/lib/quotes";
import { FavoriteButtonIcon } from "@/components/quotes/favorite-button-icon";
import { useLanguage } from "@/app/providers/language-provider";
import { getQuoteDisplayText } from "@/lib/i18n";

type QuoteDetailPageProps = {
  quote: Quote;
  isFavorited: boolean;
};

export function QuoteDetailPage({ quote, isFavorited }: QuoteDetailPageProps) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get display text based on current language with fallback
  // getQuoteDisplayText already handles fallback: cleaned_text_zh_tw/en/cn → cleaned_text_en → original_text
  const displayText = getQuoteDisplayText(quote, language);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Quote Display Block - 樣式 B：內容主體字 */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-soft-pink-dark/20 shadow-sm p-6 md:p-8">
          <blockquote className="text-xl md:text-2xl lg:text-3xl text-center text-neutral-800 text-content-tone">
            {mounted ? displayText : (quote.cleaned_text_zh_tw || quote.cleaned_text_en || quote.original_text || "")}
          </blockquote>
        </div>

        {/* Favorite Button */}
        <div className="flex justify-center">
          <FavoriteButtonIcon quoteId={quote.id} isFavorited={isFavorited} />
        </div>
      </div>
    </div>
  );
}

