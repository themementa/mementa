"use server";

import { getTodaysUserQuote } from "@/lib/daily-quotes-global";
import { getCurrentUser } from "@/lib/auth";
import type { Quote } from "@/lib/quotes";

/**
 * Get today's quote for current user
 * - Uses user's quotes table
 * - Ensures daily_quotes row exists per user
 */
export async function getTodaysQuoteAction(): Promise<Quote> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User must be authenticated to get today's quote");
  }

  return getTodaysUserQuote(user.id);
}

