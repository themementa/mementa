import { createSupabaseServerClient } from "@/lib/supabase/server";
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
 */
export async function setTodaysQuote(quoteId: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { error } = await supabase
    .from("daily_quotes")
    .insert({
      date: today,
      quote_id: quoteId,
    });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get today's global quote
 * Returns a quote that hasn't been used yet, or any quote if all have been used
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
      .single();

    if (!error && data) {
      return data as Quote;
    }
    // If quote was deleted, continue to select a new one
  }

  // Get all quotes
  const { data: allQuotes, error: quotesError } = await supabase
    .from("quotes")
    .select("*");

  if (quotesError) {
    throw new Error(quotesError.message);
  }

  if (!allQuotes || allQuotes.length === 0) {
    return null;
  }

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

  // Random selection
  const randomIndex = Math.floor(Math.random() * quotesToChooseFrom.length);
  const selectedQuote = quotesToChooseFrom[randomIndex];

  // Save to daily_quotes
  await setTodaysQuote(selectedQuote.id);

  return selectedQuote;
}



