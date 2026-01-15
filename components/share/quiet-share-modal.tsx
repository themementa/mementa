"use client";

import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type QuietShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onShareQuote: () => void;
  onShareMoment: () => void;
  hasMoment: boolean;
};

export function QuietShareModal({
  isOpen,
  onClose,
  onShareQuote,
  onShareMoment,
  hasMoment,
}: QuietShareModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-medium text-stone-800 mb-4 text-center">
          {getTranslation(language, "quietShareAMoment")}
        </h2>
        
        <p className="text-sm text-stone-500 mb-6 text-center">
          {getTranslation(language, "shareHint")}
        </p>

        <div className="space-y-3">
          <button
            onClick={onShareQuote}
            className="w-full text-base text-stone-700 hover:text-stone-900 px-4 py-3 bg-stone-50 rounded-lg touch-manipulation text-left"
          >
            {getTranslation(language, "shareQuote")}
          </button>
          
          {hasMoment && (
            <button
              onClick={onShareMoment}
              className="w-full text-base text-stone-700 hover:text-stone-900 px-4 py-3 bg-stone-50 rounded-lg touch-manipulation text-left"
            >
              {getTranslation(language, "shareMoment")}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm text-stone-500 hover:text-stone-700 py-2 touch-manipulation"
        >
          {getTranslation(language, "cancel")}
        </button>
      </div>
    </div>
  );
}


