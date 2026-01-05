"use client";

import { useState } from "react";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type ShareCardProps = {
  content: string;
  type: "quote" | "moment";
  onShare: () => Promise<void>;
  onCancel: () => void;
};

export function ShareCard({ content, type, onShare, onCancel }: ShareCardProps) {
  const { language } = useLanguage();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare();
    } catch (error) {
      console.error("Failed to share:", error);
      setIsSharing(false);
    }
  };

  // Get button text based on language
  const getButtonText = () => {
    if (language === "zh-tw" || language === "zh-cn") {
      // Rotate between three options randomly
      const options = [
        getTranslation(language, "shareButton"),
        getTranslation(language, "shareButtonAlt"),
        getTranslation(language, "shareButtonAlt2"),
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    // English: use one of the options
    const options = [
      getTranslation(language, "shareButton"),
      getTranslation(language, "shareButtonAlt"),
      getTranslation(language, "shareButtonAlt2"),
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full">
        {/* Share Card Content - 樣式 B：內容主體字 */}
        <div className="bg-stone-50 rounded-xl p-8 mb-6 min-h-[200px] flex items-center justify-center">
          <p className="text-lg md:text-xl text-stone-700 text-center whitespace-pre-wrap text-content-tone">
            {content}
          </p>
        </div>

        {/* Quiet attribution */}
        <p className="text-xs text-stone-400 text-right mb-6">via mementa</p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSharing}
            className="flex-1 text-sm text-stone-600 hover:text-stone-800 px-4 py-2 bg-stone-100 rounded touch-manipulation disabled:opacity-50"
          >
            {getTranslation(language, "cancel")}
          </button>
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 text-sm text-white hover:bg-stone-600 px-4 py-2 bg-stone-500 rounded touch-manipulation disabled:opacity-50"
          >
            {isSharing ? getTranslation(language, "processing") : getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}

