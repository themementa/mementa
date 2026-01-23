"use client";

import Link from "next/link";
import { signOut } from "@/actions/auth-actions";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-soft-pink-dark/30 pb-3 pt-3">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-pink touch-manipulation min-h-[44px] min-w-[44px]"
            title={getTranslation(language, "todaysQuote")}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs text-gray-700">
              {getTranslation(language, "todaysQuote")}
            </span>
          </Link>
          <Link
            href="/quotes"
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-purple touch-manipulation min-h-[44px] min-w-[44px]"
            title={getTranslation(language, "allQuotes")}
          >
            <span className="text-xl">📚</span>
            <span className="text-xs text-gray-700">
              {getTranslation(language, "allQuotes")}
            </span>
          </Link>
          <Link
            href="/favorites"
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-pink touch-manipulation min-h-[44px] min-w-[44px]"
            title={getTranslation(language, "favorites")}
          >
            <span className="text-xl">⭐</span>
            <span className="text-xs text-gray-700">
              {getTranslation(language, "favorites")}
            </span>
          </Link>
          <Link
            href="/relationship"
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-lavender touch-manipulation min-h-[44px] min-w-[44px]"
            title={getTranslation(language, "relationship")}
          >
            <svg 
              className="w-5 h-5 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
              />
            </svg>
            <span className="text-xs text-gray-700">
              {getTranslation(language, "relationship")}
            </span>
          </Link>
          <Link
            href="/moments"
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-lavender touch-manipulation min-h-[44px] min-w-[44px]"
            title={getTranslation(language, "myMoments")}
          >
            <svg 
              className="w-5 h-5 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" 
              />
            </svg>
            <span className="text-xs text-gray-700">
              {getTranslation(language, "myMoments")}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* 語言切換器 */}
          <LanguageSwitcher 
            language={language ?? "zh-tw"} 
            onLanguageChange={setLanguage}
          />

          <form action={signOut}>
            <button
              type="submit"
              className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-lavender touch-manipulation min-h-[44px] min-w-[44px]"
              title={getTranslation(language, "logout")}
            >
              <svg 
                className="w-5 h-5 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" 
                />
              </svg>
              <span className="text-xs text-gray-700">
                {getTranslation(language, "logout")}
              </span>
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}

