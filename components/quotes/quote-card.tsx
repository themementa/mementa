"use client";

import Link from "next/link";
import type { Quote } from "@/lib/quotes";
import { useLanguage } from "@/app/providers/language-provider";
import { getQuoteDisplayText } from "@/lib/i18n";
import { FavoriteButtonWithText } from "./favorite-button-with-text";

type QuoteCardProps = {
  quote: Quote;
  isFavorited?: boolean;
  showTimestamp?: boolean;
  timestamp?: string;
  showFavoriteButton?: boolean;
};

export function QuoteCard({
  quote,
  isFavorited = false,
  showTimestamp = false,
  timestamp,
  showFavoriteButton = true
}: QuoteCardProps) {
  const { language } = useLanguage();
  const displayText = getQuoteDisplayText(quote, language);

  return (
    <div className="rounded-2xl bg-white/60 shadow-sm p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        {/* Quote Text - Left */}
        <Link
          href={`/quote/${quote.id}`}
          className="flex-1 focus:outline-none focus:ring-2 focus:ring-soft-purple rounded-xl"
        >
          <p className="text-lg md:text-xl leading-relaxed text-neutral-800">
            {displayText}
          </p>
        </Link>

        {/* Favorite Button with Text - Right */}
        {showFavoriteButton && (
          <div className="flex-shrink-0">
            <FavoriteButtonWithText quoteId={quote.id} isFavorited={isFavorited} />
          </div>
        )}
      </div>

      {/* Timestamp - Bottom */}
      {showTimestamp && timestamp && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-neutral-400">
            {timestamp}
          </p>
        </div>
      )}
    </div>
  );
}

