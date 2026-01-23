"use server";

import { requireUser } from "@/lib/auth";
import { toggleFavorite } from "@/lib/favorites";

export async function toggleFavoriteAction(formData: FormData) {
  const user = await requireUser();
  const quoteId = String(formData.get("quote_id") || "");

  if (!quoteId) {
    return;
  }

  await toggleFavorite({ userId: user.id, quoteId });
}


