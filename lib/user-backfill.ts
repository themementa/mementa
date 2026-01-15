import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserQuotesSeeded } from "@/lib/user-quotes-seed";
import { getTodaysUserQuote, getTodaysQuoteId } from "@/lib/daily-quotes-global";
import { countUserQuotes } from "@/lib/user-quotes-seed";

/**
 * Minimum threshold for user quotes count
 * If user has fewer quotes than this, trigger backfill seeding
 */
const MIN_USER_QUOTES_THRESHOLD = 100;

/**
 * Backfill user data for existing users
 * - Ensures user has enough quotes (seeds if < threshold)
 * - Ensures today's quote exists in daily_quotes
 * 
 * This function is idempotent and safe to call multiple times.
 * It's designed to fix inconsistent data for existing users.
 */
export async function backfillUserData(userId: string): Promise<void> {
  try {
    console.log(`[backfillUserData] Starting backfill for user ${userId}...`);
    
    // Check user quote count
    const quoteCount = await countUserQuotes(userId);
    
    if (quoteCount < MIN_USER_QUOTES_THRESHOLD) {
      console.log(`[backfillUserData] User ${userId} has ${quoteCount} quotes, seeding missing ones...`);
      await ensureUserQuotesSeeded(userId);
    } else {
      console.log(`[backfillUserData] User ${userId} already has ${quoteCount} quotes, skipping quote seeding`);
    }
    
    // Check if today's quote exists
    const todaysQuoteId = await getTodaysQuoteId(userId);
    if (!todaysQuoteId) {
      console.log(`[backfillUserData] User ${userId} has no today's quote, creating one...`);
      const todaysQuote = await getTodaysUserQuote(userId);
      if (todaysQuote) {
        console.log(`[backfillUserData] Today's quote created for user ${userId}`);
      } else {
        console.warn(`[backfillUserData] Could not create today's quote for user ${userId} - no quotes available`);
      }
    } else {
      console.log(`[backfillUserData] User ${userId} already has today's quote`);
    }
    
    console.log(`[backfillUserData] Backfill complete for user ${userId}`);
  } catch (error) {
    console.error("[backfillUserData] Error during backfill:", error);
    // Don't throw - allow the app to continue even if backfill fails
  }
}

