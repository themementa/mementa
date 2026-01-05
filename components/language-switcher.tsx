"use client";

import { useState } from "react";
import type { Language } from "@/lib/i18n";
import { getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/app/providers/language-provider";

type LanguageSwitcherProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  const { language: currentLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: "zh-tw", label: getTranslation(currentLang, "traditionalChinese") },
    { code: "zh-cn", label: getTranslation(currentLang, "simplifiedChinese") },
    { code: "en", label: getTranslation(currentLang, "english") },
  ];

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-lavender touch-manipulation min-h-[44px] min-w-[44px]"
        title={getTranslation(currentLang, "languageOption")}
      >
        <span className="text-xl">🌐</span>
        <span className="text-xs text-gray-700">
          {getTranslation(currentLang, "languageOption")}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 z-50">
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm touch-manipulation ${
                    language === lang.code
                      ? "bg-stone-100 text-stone-900 font-medium"
                      : "text-gray-700 hover:bg-stone-50"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
