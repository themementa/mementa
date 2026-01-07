"use client";

import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";
import { cleanText } from "@/lib/text-cleaning";
import { Converter } from "opencc-js";

type CleanButtonProps = {
  quoteId: string;
  originalText: string;
  onCleaned: (text: string) => void;
};

export function CleanButton({ quoteId, originalText, onCleaned }: CleanButtonProps) {
  const { language } = useLanguage();

  const handleClick = () => {
    if (!originalText) {
      return;
    }

    // 生成繁體版本（基礎版本）
    const cleanedZhHant = cleanText(originalText);

    // 根據當前語言生成對應版本
    let cleanedText = cleanedZhHant;
    
    if (language === "zh-cn") {
      // 轉換為簡體
      const converter = Converter({ from: "hk", to: "cn" });
      cleanedText = converter(cleanedZhHant);
    } else if (language === "en") {
      // 英文版本：暫時使用繁體（未來可整合翻譯 API）
      cleanedText = cleanedZhHant;
    }

    // 回調更新 UI（不更新 DB，只更新 textarea）
    onCleaned(cleanedText);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-3 py-2 text-xs font-medium rounded-xl bg-soft-blue hover:bg-soft-blue-dark text-neutral-700 transition-colors touch-manipulation min-h-[44px]"
    >
      {getTranslation(language, "clean")}
    </button>
  );
}

