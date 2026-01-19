import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Quote } from "@/lib/quotes";
import { getUserQuoteCount, seedUserQuotes } from "@/lib/user-init";

/**
 * Get today's quote ID from daily_quotes table for a user
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
      return null;
    }
    throw new Error(error.message);
  }

  return data?.quote_id || null;
}

/**
 * Set today's quote in daily_quotes table for a user
 */
export async function setTodaysQuote(userId: string, quoteId: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { error } = await supabase
    .from("daily_quotes")
    .upsert(
      {
        user_id: userId,
        date: today,
        quote_id: quoteId,
      },
      {
        onConflict: "user_id,date",
      }
    );

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get today's quote for a specific user
 * - If daily_quotes exists -> return it
 * - Else -> pick random user quote, insert daily_quotes, return it
 * - Never returns null
 */
export async function getTodaysUserQuote(userId: string): Promise<Quote> {
  console.log("GET TODAY QUOTE START", userId);
  const supabase = createSupabaseServerClient();

  const existingQuoteId = await getTodaysQuoteId(userId);
  if (existingQuoteId) {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", existingQuoteId)
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      console.log("FOUND EXISTING DAILY_QUOTE", userId);
      return data as Quote;
    }
  }

  const count = await getUserQuoteCount(userId);
  if (count === 0) {
    await seedUserQuotes(userId);
  }

  const { data: userQuotes, error: quotesError } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userId);

  if (quotesError) {
    throw new Error(quotesError.message);
  }

  if (!userQuotes || userQuotes.length === 0) {
    throw new Error("No user quotes available after seeding");
  }

  console.log("CREATING NEW DAILY_QUOTE", userId);
  const randomIndex = Math.floor(Math.random() * userQuotes.length);
  const selectedQuote = userQuotes[randomIndex] as Quote;

  try {
    await setTodaysQuote(userId, selectedQuote.id);
    console.log("DAILY_QUOTE INSERT SUCCESS", userId, selectedQuote.id);
    console.log("TODAY QUOTE CREATED", userId, selectedQuote.id);
  } catch (e) {
    console.error("DAILY_QUOTE INSERT FAILED", userId, e);
    throw e;
  }

  return selectedQuote;
}



