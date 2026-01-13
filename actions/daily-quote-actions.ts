"use server";

import { getTodaysGlobalQuote } from "@/lib/daily-quotes-global";
import type { Quote } from "@/lib/quotes";

/**
 * Get today's global quote (same for all users)
 * Non-repeating: avoids quotes already used until all quotes are used
 * 
 * Note: This is a global/public quote, not user-specific.
 * Authentication is handled at the page level (protected route),
 * but the quote data itself does not depend on userId.
 * 
 * Returns null if no quote is available (no fallback to Intro).
 */
export async function getTodaysQuoteAction(): Promise<Quote | null> {
  const todaysQuote = await getTodaysGlobalQuote();

  if (!todaysQuote) {
    return null;
  }

  return todaysQuote;
}

