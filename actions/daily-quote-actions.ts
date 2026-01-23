"use server";

import { requireUser } from "../lib/auth";
import { getTodaysGlobalQuote } from "../lib/daily-quotes-global";
import type { Quote } from "../lib/quotes";

/**
 * Get today's global quote (same for all users)
 * Non-repeating: avoids quotes already used until all quotes are used
 */
export async function getTodaysQuoteAction(): Promise<Quote> {
  try {
    await requireUser(); // Ensure user is authenticated

    const todaysQuote = await getTodaysGlobalQuote();

    if (!todaysQuote) {
      throw new Error("No quotes available");
    }

    return todaysQuote;
  } catch (error) {
    console.error("[daily-quote/getTodaysQuoteAction] server error:", error);
    throw error;
  }
}

