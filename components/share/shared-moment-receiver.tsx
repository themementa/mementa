"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type SharedMomentReceiverProps = {
  type: "quote" | "moment";
  content: string;
};

export function SharedMomentReceiver({ type, content }: SharedMomentReceiverProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [hasReceived, setHasReceived] = useState(false);

  if (!content) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{
          background: "linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)",
        }}
      >
        <p className="text-base text-stone-500">無法載入內容</p>
      </div>
    );
  }

  const handleReceive = () => {
    setHasReceived(true);
    // Optionally navigate away after a moment, or just stay
    setTimeout(() => {
      // Navigate to home - middleware will handle auth routing
      window.location.href = "/home";
    }, 2000);
  };

  // Get button text - randomly choose between two options
  const getButtonText = () => {
    const options = [
      getTranslation(language, "received"),
      getTranslation(language, "thankYouForThisMoment"),
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        background: "linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)",
      }}
    >
      {/* Intro Text - 樣式 A：情緒引導文字 */}
      <p className="text-sm text-stone-500 mb-8 text-center text-heading-tone">
        {getTranslation(language, "someoneQuietlyLeftThisMoment")}
      </p>

      {/* Center Card - Quote or Moment - 樣式 B：內容主體字 */}
      <div className="w-full max-w-2xl mb-16">
        <div className="bg-white/60 rounded-2xl shadow-sm p-12 md:p-16">
          <p className="text-xl md:text-2xl text-stone-700 text-center whitespace-pre-wrap text-content-tone">
            {content}
          </p>
        </div>
      </div>

      {/* Silence Space */}
      <div className="h-12" />

      {/* Gentle Message - 樣式 A：情緒引導文字 */}
      <div className="mb-12 text-center">
        <p className="text-base text-stone-600 mb-2 text-heading-tone">
          {getTranslation(language, "noNeedToRespond")}
        </p>
        <p className="text-base text-stone-600 text-heading-tone">
          {getTranslation(language, "justBreathe")}
        </p>
      </div>

      {/* Optional Action Button - Very subtle */}
      {!hasReceived && (
        <button
          onClick={handleReceive}
          className="px-6 py-3 text-sm text-stone-500 hover:text-stone-700 bg-transparent border border-stone-300 rounded-lg touch-manipulation transition-colors mb-16"
        >
          {getButtonText()}
        </button>
      )}

      {/* Footer - Very low contrast */}
      <div className="mt-auto pt-8">
        <p className="text-xs text-stone-300 text-center leading-relaxed whitespace-pre-line">
          {getTranslation(language, "mementaFooter")}
        </p>
      </div>
    </div>
  );
}

