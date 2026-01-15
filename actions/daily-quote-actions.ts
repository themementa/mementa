"use server";

import { getTodaysUserQuote } from "@/lib/daily-quotes-global";
import { getCurrentUser } from "@/lib/auth";
import { ensureQuotesSeeded } from "@/lib/seed-quotes";
import type { Quote } from "@/lib/quotes";

/**
 * Get today's quote for the current user
 * Always queries from user's own seeded quotes
 * If no quote found, automatically triggers seed then retries
 * Never returns null if user quotes exist
 * 
 * Returns null only if no user quotes exist after seeding.
 */
export async function getTodaysQuoteAction(): Promise<Quote | null> {
  // Ensure system master quotes exist (source for user seeding)
  await ensureQuotesSeeded();

  // Get current user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User must be authenticated to get today's quote");
  }

  // getTodaysUserQuote ensures user quotes are seeded and queries from user's quotes
  const todaysQuote = await getTodaysUserQuote(user.id);

  return todaysQuote;
}

