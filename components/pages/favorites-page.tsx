"use client";

import type { FavoriteWithQuote } from "@/lib/favorites";
import { QuoteCard } from "@/components/quotes/quote-card";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

type FavoritesPageProps = {
  quotes: FavoriteWithQuote[];
};

export function FavoritesPage({ quotes }: FavoritesPageProps) {
  const { language } = useLanguage();

  // Sort by favorite_at DESC (most recent first) - backend already does this, but ensure client-side consistency
  const sortedQuotes = [...quotes].sort((a, b) => {
    return new Date(b.favorite_at).getTime() - new Date(a.favorite_at).getTime();
  });

  if (!quotes.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)' }}>
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold text-stone-800 mb-8 text-center">
            {getTranslation(language, "myFavorites")}
          </h1>
          <div className="bg-white/50 rounded-3xl shadow-sm p-16 md:p-24 text-center">
            <p className="text-lg text-stone-600 mb-8 font-light">
              {getTranslation(language, "noFavorites")}
            </p>
            <Link
              href="/quotes"
              className="inline-block px-6 py-3 text-sm font-normal rounded-lg bg-stone-100 text-stone-600 touch-manipulation min-h-[44px]"
            >
              {getTranslation(language, "goToFavorites")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)', minHeight: '100vh' }}>
      <h1 className="text-2xl font-semibold text-stone-800 text-center">
        {getTranslation(language, "myFavorites")}
      </h1>

      <ul className="space-y-4">
        {sortedQuotes.map((quote) => {
          const date = new Date(quote.favorite_at);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const timestamp = `${day}-${month}-${year} ${hours}:${minutes}`;

          return (
            <li key={quote.id}>
              <QuoteCard
                quote={quote}
                isFavorited={true}
                showTimestamp={true}
                timestamp={timestamp}
                showFavoriteButton={true}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

