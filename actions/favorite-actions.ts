"use server";

import { getCurrentUser } from "@/lib/auth";
import { toggleFavorite } from "@/lib/favorites";

export async function toggleFavoriteAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const quoteId = String(formData.get("quote_id") || "");

  if (!quoteId) {
    return;
  }

  try {
    await toggleFavorite({
      userId: user.id,
      quoteId,
    });
  } catch (error) {
    console.error("[toggleFavoriteAction] Error toggling favorite:", error);
    // Re-throw to let the UI handle the error gracefully
    throw error;
  }
}


