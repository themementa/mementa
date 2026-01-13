"use server";

import { getTodaysGlobalQuote } from "@/lib/daily-quotes-global";
import { ensureQuotesSeeded } from "@/lib/seed-quotes";
import type { Quote } from "@/lib/quotes";

/**
 * Get today's global quote (same for all users)
 * Always prioritizes system quotes (SYSTEM_USER_ID)
 * Randomly picks one system quote if available
 * Never returns null if system quotes exist
 * 
 * Note: This is a global/public quote, not user-specific.
 * Authentication is handled at the page level (protected route),
 * but the quote data itself does not depend on userId.
 * 
 * Returns null only if no system quotes exist in database.
 */
export async function getTodaysQuoteAction(): Promise<Quote | null> {
  // Ensure system quotes are seeded before fetching
  await ensureQuotesSeeded();

  // getTodaysGlobalQuote always prioritizes system quotes
  // and never returns null if system quotes exist
  const todaysQuote = await getTodaysGlobalQuote();

  return todaysQuote;
}

