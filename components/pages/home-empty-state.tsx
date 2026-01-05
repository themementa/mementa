"use client";

import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

export function HomeEmptyState() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)' }}>
      <div className="w-full max-w-2xl">
        <div className="bg-white/50 rounded-3xl shadow-sm p-16 md:p-24 text-center">
          <p className="text-lg text-stone-600 font-light">
            {getTranslation(language, "noQuotes")}
          </p>
        </div>
      </div>
    </div>
  );
}

