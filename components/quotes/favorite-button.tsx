"use client";

import { useTransition } from "react";
import { toggleFavoriteAction } from "@/actions/favorite-actions";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type FavoriteButtonProps = {
  quoteId: string;
  isFavorited: boolean;
};

export function FavoriteButton({ quoteId, isFavorited }: FavoriteButtonProps) {
  return null 
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
      className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-600 touch-manipulation min-h-[44px] min-w-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isPending ? getTranslation(language, "processing") : isFavorited ? getTranslation(language, "unfavorite") : getTranslation(language, "favorite")}
    </button>
  );
}

