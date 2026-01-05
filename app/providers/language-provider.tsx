"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Language } from "@/lib/i18n";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

const LANGUAGE_STORAGE_KEY = "mementa_language";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && (storedLanguage === "zh-tw" || storedLanguage === "zh-cn" || storedLanguage === "en")) {
        setLanguageState(storedLanguage as Language);
      } else {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("languageChange"));
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

