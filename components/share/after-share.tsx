"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type AfterShareProps = {
  onClose: () => void;
  sharedContent?: string;
};

export function AfterShare({ onClose, sharedContent }: AfterShareProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [showContent, setShowContent] = useState(true);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [showAction, setShowAction] = useState(false);

  // Get random affirmation
  const getAffirmation = () => {
    const affirmations = [
      getTranslation(language, "affirmation1"),
      getTranslation(language, "affirmation2"),
      getTranslation(language, "affirmation3"),
    ];
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  };

  const affirmation = getAffirmation();

  // Fade out content after a brief moment
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setShowContent(false);
      setShowAffirmation(true);
    }, 1500);

    return () => clearTimeout(fadeTimer);
  }, []);

  // Show action after 3-5 seconds
  useEffect(() => {
    if (showAffirmation) {
      const actionTimer = setTimeout(() => {
        setShowAction(true);
      }, 3000 + Math.random() * 2000); // 3-5 seconds

      return () => clearTimeout(actionTimer);
    }
  }, [showAffirmation]);

  const handleReturn = () => {
    // Navigate to home - middleware will handle auth routing
    window.location.href = "/home";
  };

  const handleSitQuietly = () => {
    // Just close the modal, stay on page
    onClose();
  };

  // Get random action text
  const getActionText = () => {
    const actions = [
      getTranslation(language, "returnToToday"),
      getTranslation(language, "sitQuietly"),
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  };

  const actionText = getActionText();
  const isReturnAction = actionText === getTranslation(language, "returnToToday");

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Shared Content - Fades out - 樣式 B：內容主體字 */}
        {showContent && sharedContent && (
          <div
            className={`mb-6 transition-opacity duration-1000 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-lg text-stone-700 whitespace-pre-wrap text-content-tone">
              {sharedContent}
            </p>
          </div>
        )}

        {/* Affirmation - Appears after content fades - 樣式 A：情緒引導文字 */}
        {showAffirmation && (
          <div
            className={`transition-opacity duration-1000 ${
              showAffirmation ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-base text-stone-700 mb-6 text-heading-tone">
              {affirmation}
            </p>

            {/* Subtle Action - Appears after 3-5 seconds */}
            {showAction && (
              <button
                onClick={isReturnAction ? handleReturn : handleSitQuietly}
                className="text-sm text-stone-500 hover:text-stone-700 touch-manipulation px-4 py-2 border border-stone-300 rounded-lg transition-colors"
              >
                {actionText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

