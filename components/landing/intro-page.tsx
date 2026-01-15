"use client";

import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

export function IntroPage() {
  const { language } = useLanguage();

  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        background: "linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)",
        padding: "32px"
      }}
    >
      <h1 className="text-2xl md:text-3xl font-medium text-stone-800 mb-4 text-center">
        {getTranslation(language, "welcomeToMementa")}
      </h1>
      <p className="text-lg text-stone-600 text-center">
        {getTranslation(language, "takeABreathYoureHere")}
      </p>
    </main>
  );
}


