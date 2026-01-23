"use client";

import type { Language } from "@/lib/i18n";

type LanguageSwitcherProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  const languages: Language[] = ["zh-tw", "en", "zh-cn"];
  
  const getLabel = (lang: Language): string => {
    switch (lang) {
      case "zh-tw":
        return "繁";
      case "zh-cn":
        return "簡";
      case "en":
        return "EN";
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
      {languages.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onLanguageChange(lang)}
          className={`px-3 py-1.5 text-xs font-medium rounded touch-manipulation min-h-[44px] ${
            language === lang
              ? "bg-soft-purple text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {getLabel(lang)}
        </button>
      ))}
    </div>
  );
}

