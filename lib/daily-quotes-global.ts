import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserQuotesSeeded } from "@/lib/user-quotes-seed";
import type { Quote } from "@/lib/quotes";

/**
 * Get today's quote ID from daily_quotes table for a specific user
 * Returns quote_id if exists, null otherwise
 */
export async function getTodaysQuoteId(userId: string): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from("daily_quotes")
    .select("quote_id")
    .eq("date", today)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found - no quote set for today
      return null;
    }
    throw new Error(error.message);
  }

  return data?.quote_id || null;
}

/**
 * Get all quote IDs that have been used in daily_quotes for a specific user
 */
export async function getUsedQuoteIds(userId: string): Promise<string[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("daily_quotes")
    .select("quote_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => row.quote_id);
}

/**
 * Set today's quote in daily_quotes table for a specific user
 * If today's quote already exists, it will be updated (upsert behavior)
 */
export async function setTodaysQuote(userId: string, quoteId: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Use upsert to handle both insert and update cases
  const { error } = await supabase
    .from("daily_quotes")
    .upsert({
      user_id: userId,
      date: today,
      quote_id: quoteId,
    }, {
      onConflict: "user_id,date"
    });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get today's quote for a specific user
 * Always queries from user's own seeded quotes
 * Returns a user quote that hasn't been used yet, or any user quote if all have been used
 * Must never return null - throws error if quotes are unavailable
 * 
 * Safe resolver: If daily_quotes for today exists → load it
 * Else: Pick a random quote from user's quotes → Insert into daily_quotes → Return it
 * 
 * This function ensures:
 * - User quotes are seeded before fetching
 * - Today's quote is always created in daily_quotes if missing
 * - Never returns null (throws error if system quotes are missing)
 */
export async function getTodaysUserQuote(userId: string): Promise<Quote> {
  const supabase = createSupabaseServerClient();

  // Ensure user quotes are seeded before fetching
  await ensureUserQuotesSeeded(userId);

  // Check if today's quote already exists for this user
  const existingQuoteId = await getTodaysQuoteId(userId);
  if (existingQuoteId) {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", existingQuoteId)
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      return data as Quote;
    }
    // If quote was deleted, continue to select a new one
  }

  // Get all user's personal quotes
  const { data: allQuotes, error: quotesError } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userId);

  if (quotesError) {
    console.error("[getTodaysUserQuote] Database error:", quotesError);
    throw new Error(quotesError.message);
  }

  if (!allQuotes || allQuotes.length === 0) {
    console.warn("[getTodaysUserQuote] No quotes found for user after seeding, retrying...");
    // Try one more time to seed, in case seeding failed
    await ensureUserQuotesSeeded(userId);
    
    // Retry fetching quotes
    const { data: retryQuotes, error: retryError } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", userId);
    
    if (retryError) {
      console.error("[getTodaysUserQuote] Database error on retry:", retryError);
      throw new Error(`Failed to fetch quotes after seeding: ${retryError.message}`);
    }
    
    if (!retryQuotes || retryQuotes.length === 0) {
      // This should never happen if system master quotes exist
      console.error("[getTodaysUserQuote] CRITICAL: Still no quotes after retry seeding");
      throw new Error(`No quotes available for user ${userId} after seeding - system master quotes may be missing`);
    }
    
    // Use a random quote from the retried quotes
    const randomIndex = Math.floor(Math.random() * retryQuotes.length);
    const selectedQuote = retryQuotes[randomIndex] as Quote;
    
    // Save to daily_quotes - this is critical
    try {
      await setTodaysQuote(userId, selectedQuote.id);
      console.log(`[getTodaysUserQuote] Saved today's quote for user ${userId} after retry`);
    } catch (saveError) {
      console.error("[getTodaysUserQuote] Failed to save to daily_quotes after retry:", saveError);
      // Still return the quote even if save fails
    }
    
    return selectedQuote;
  }

  console.log(`[getTodaysUserQuote] Found ${allQuotes.length} quotes for user`);

  // Get used quote IDs for this user
  const usedQuoteIds = await getUsedQuoteIds(userId);
  const usedSet = new Set(usedQuoteIds);

  // Filter out used quotes
  const availableQuotes = allQuotes.filter(
    (quote) => !usedSet.has(quote.id)
  ) as Quote[];

  // If all quotes have been used, use all quotes (cycle back)
  const quotesToChooseFrom =
    availableQuotes.length > 0 ? availableQuotes : (allQuotes as Quote[]);

  // Random selection from user quotes
  const randomIndex = Math.floor(Math.random() * quotesToChooseFrom.length);
  const selectedQuote = quotesToChooseFrom[randomIndex];

  // Save to daily_quotes - this is critical, retry if it fails
  try {
    await setTodaysQuote(userId, selectedQuote.id);
    console.log(`[getTodaysUserQuote] Saved today's quote for user ${userId}`);
  } catch (saveError) {
    // Log but don't fail - we can still return the quote even if saving fails
    console.warn("[getTodaysUserQuote] Failed to save to daily_quotes, but returning quote anyway:", saveError);
    // Try one more time
    try {
      await setTodaysQuote(userId, selectedQuote.id);
    } catch (retryError) {
      console.error("[getTodaysUserQuote] Retry save also failed:", retryError);
    }
  }

  return selectedQuote;
}



