import { getFavoriteQuotesForUser } from "@/lib/favorites";
import type { Quote } from "@/lib/quotes";

/**
 * 從使用者的收藏中，根據今天的日期選出一則金句
 * 使用日期字串作為 seed，確保同一天會選到同一則
 */
export async function getTodaysQuote(userId: string): Promise<Quote | null> {
  const favorites = await getFavoriteQuotesForUser(userId);

  if (!favorites.length) {
    return null;
  }

  // 使用今天的日期字串（YYYY-MM-DD）作為 seed
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 簡單的 hash：把日期字串轉成數字，然後用 modulo 選 index
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % favorites.length;
  return favorites[index];
}



