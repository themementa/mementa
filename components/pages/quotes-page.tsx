"use client";

import type { Quote } from "@/lib/quotes";
import { QuoteCard } from "@/components/quotes/quote-card";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type QuotesPageProps = {
  quotes: Quote[];
  favoriteIds: string[];
};

// CRITICAL FIX: Hardcoded fallback quote to ensure UI never renders blank
// This is a temporary fallback until data fetching is guaranteed
const FALLBACK_QUOTE: Quote = {
  id: "fallback-quote",
  original_text: "Take a moment. You're here.",
  cleaned_text_en: "Take a moment. You're here.",
  cleaned_text_zh_tw: "停一停，你在這裡。",
  cleaned_text_zh_cn: "停一停，你在这里。",
  created_at: new Date().toISOString(),
};

export function QuotesPage({ quotes, favoriteIds }: QuotesPageProps) {
  const { language } = useLanguage();
  const favoriteSet = new Set(favoriteIds);

  // CRITICAL FIX: Force render at least one quote in JSX
  // If quotes array is empty, use fallback quote directly in JSX
  // This ensures UI NEVER renders blank, even if data fetching fails
  const quotesToRender = (!quotes || quotes.length === 0) ? [FALLBACK_QUOTE] : quotes;

  return (
    <div className="space-y-6 py-6" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)', minHeight: '100vh' }}>
      <h1 className="text-2xl font-semibold text-stone-800 text-center">
        {getTranslation(language, "allQuotes")}
      </h1>

      <ul className="space-y-4">
        {quotesToRender.map((quote) => (
          <li key={quote.id}>
            <QuoteCard
              quote={quote}
              isFavorited={favoriteSet.has(quote.id)}
              showFavoriteButton={true}
              showTimestamp={false}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

