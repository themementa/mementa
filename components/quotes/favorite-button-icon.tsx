"use client";

import { useTransition } from "react";
import { toggleFavoriteAction } from "@/actions/favorite-actions";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type FavoriteButtonIconProps = {
  quoteId: string;
  isFavorited: boolean;
};

export function FavoriteButtonIcon({ quoteId, isFavorited }: FavoriteButtonIconProps) {
  const { language } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("quote_id", quoteId);
      
      // 使用 toggle action，自動判斷 insert 或 delete
      await toggleFavoriteAction(formData);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center justify-center w-14 h-14 rounded-full touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      title={isFavorited ? getTranslation(language, "unfavorite") : getTranslation(language, "favorite")}
      style={{
        backgroundColor: isFavorited ? "#FEE2E2" : "#FFFFFF",
        border: isFavorited ? "2px solid #EF4444" : "2px solid #E5E7EB"
      }}
    >
      <span className="text-3xl">
        {isFavorited ? "❤️" : "🤍"}
      </span>
    </button>
  );
}

