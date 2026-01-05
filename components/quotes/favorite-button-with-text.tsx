"use client";

import { useTransition } from "react";
import { toggleFavoriteAction } from "@/actions/favorite-actions";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type FavoriteButtonWithTextProps = {
  quoteId: string;
  isFavorited: boolean;
};

export function FavoriteButtonWithText({ quoteId, isFavorited }: FavoriteButtonWithTextProps) {
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

  const favoriteText = isFavorited 
    ? getTranslation(language, "unfavorite") 
    : getTranslation(language, "favorite");

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md touch-manipulation min-h-[36px] disabled:opacity-60 disabled:cursor-not-allowed bg-transparent text-stone-400 hover:text-stone-600 ${
        isFavorited
          ? "hover:text-red-400"
          : ""
      }`}
    >
      <span className="text-sm">
        {isFavorited ? "❤️" : "🤍"}
      </span>
      <span className="text-[11px] font-normal">
        {isPending ? getTranslation(language, "processing") : favoriteText}
      </span>
    </button>
  );
}

