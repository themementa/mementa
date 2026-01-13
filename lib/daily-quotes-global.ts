import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SYSTEM_USER_ID } from "@/lib/constants";
import type { Quote } from "@/lib/quotes";

/**
 * Get today's quote ID from daily_quotes table
 * Returns quote_id if exists, null otherwise
 */
export async function getTodaysQuoteId(): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from("daily_quotes")
    .select("quote_id")
    .eq("date", today)
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
 * Get all quote IDs that have been used in daily_quotes
 */
export async function getUsedQuoteIds(): Promise<string[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("daily_quotes")
    .select("quote_id");

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => row.quote_id);
}

/**
 * Set today's quote in daily_quotes table
 * If today's quote already exists, it will be updated (upsert behavior)
 */
export async function setTodaysQuote(quoteId: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Use upsert to handle both insert and update cases
  const { error } = await supabase
    .from("daily_quotes")
    .upsert({
      date: today,
      quote_id: quoteId,
    }, {
      onConflict: "date"
    });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get today's global quote
 * Always prioritizes system quotes (SYSTEM_USER_ID)
 * Returns a system quote that hasn't been used yet, or any system quote if all have been used
 * Never returns null if system quotes exist
 */
export async function getTodaysGlobalQuote(): Promise<Quote | null> {
  const supabase = createSupabaseServerClient();

  // Check if today's quote already exists
  const existingQuoteId = await getTodaysQuoteId();
  if (existingQuoteId) {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", existingQuoteId)
      .eq("user_id", SYSTEM_USER_ID)
      .single();

    if (!error && data) {
      return data as Quote;
    }
    // If quote was deleted or not a system quote, continue to select a new one
  }

  // Get all system quotes (global quotes shared across all users)
  const { data: allQuotes, error: quotesError } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", SYSTEM_USER_ID);

  if (quotesError) {
    console.error("[getTodaysGlobalQuote] Database error:", quotesError);
    throw new Error(quotesError.message);
  }

  if (!allQuotes || allQuotes.length === 0) {
    console.warn("[getTodaysGlobalQuote] No system quotes found in database");
    return null;
  }

  console.log(`[getTodaysGlobalQuote] Found ${allQuotes.length} system quotes in database`);

  // Get used quote IDs
  const usedQuoteIds = await getUsedQuoteIds();
  const usedSet = new Set(usedQuoteIds);

  // Filter out used quotes
  const availableQuotes = allQuotes.filter(
    (quote) => !usedSet.has(quote.id)
  ) as Quote[];

  // If all quotes have been used, use all quotes (cycle back)
  const quotesToChooseFrom =
    availableQuotes.length > 0 ? availableQuotes : (allQuotes as Quote[]);

  // Random selection from system quotes
  const randomIndex = Math.floor(Math.random() * quotesToChooseFrom.length);
  const selectedQuote = quotesToChooseFrom[randomIndex];

  // Save to daily_quotes (but don't fail if this fails - quote selection is more important)
  try {
    await setTodaysQuote(selectedQuote.id);
  } catch (saveError) {
    // Log but don't fail - we can still return the quote even if saving fails
    console.warn("[getTodaysGlobalQuote] Failed to save to daily_quotes, but returning quote anyway:", saveError);
  }

  return selectedQuote;
}



