"use client";

import type { Quote } from "@/lib/quotes";
import { QuoteCard } from "@/components/quotes/quote-card";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type RelationshipPageProps = {
  quotes: Quote[];
  favoriteIds: string[];
};

export function RelationshipPage({ quotes, favoriteIds }: RelationshipPageProps) {
  const { language } = useLanguage();
  const favoriteSet = new Set(favoriteIds);

  // Static header text (no period for Chinese)
  const headerText = language === "en" 
    ? "Relationships should not make you lose yourself"
    : language === "zh-cn"
    ? "关系，不应该令你迷失自己"
    : "關係，不應該令你迷失自己";

  if (!quotes.length) {
    return (
      <div className="space-y-6 py-6" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)', minHeight: '100vh' }}>
        <div className="w-full max-w-4xl mx-auto px-4">
          {/* Header Text */}
          <div className="mb-8 text-center">
            <p className="text-lg md:text-xl text-stone-600 font-light">
              {headerText}
            </p>
          </div>

          <h1 className="text-2xl font-semibold text-stone-800 text-center mb-6">
            {getTranslation(language, "relationship")}
          </h1>
          <div className="bg-white/50 rounded-3xl shadow-sm p-16 md:p-24 text-center">
            <p className="text-lg text-stone-600 font-light">
              {getTranslation(language, "noQuotes")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)', minHeight: '100vh' }}>
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header Text */}
        <div className="mb-8 text-center">
          <p className="text-lg md:text-xl text-stone-600 font-light">
            {headerText}
          </p>
        </div>

        <h1 className="text-2xl font-semibold text-stone-800 text-center mb-6">
          {getTranslation(language, "relationship")}
        </h1>

        <ul className="space-y-4">
          {quotes.map((quote) => (
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
    </div>
  );
}

