import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SYSTEM_USER_ID } from "@/lib/constants";
import type { Quote } from "@/lib/quotes";

/**
 * Minimum threshold for user quotes count
 * If user has fewer quotes than this, trigger seeding
 */
const MIN_USER_QUOTES_THRESHOLD = 100;

/**
 * Count how many quotes exist for a specific user
 */
export async function countUserQuotes(userId: string): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from("quotes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("[countUserQuotes] Database error:", error);
    throw new Error(error.message);
  }

  return count ?? 0;
}

/**
 * Get all system master quotes (source for user seeding)
 */
async function getSystemMasterQuotes(): Promise<Quote[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", SYSTEM_USER_ID)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getSystemMasterQuotes] Database error:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as Quote[];
}

/**
 * Get existing quote IDs for a user (to avoid duplicates)
 */
async function getUserQuoteIds(userId: string): Promise<Set<string>> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("original_text")
    .eq("user_id", userId);

  if (error) {
    console.error("[getUserQuoteIds] Database error:", error);
    throw new Error(error.message);
  }

  // Use original_text as unique identifier (since we're copying from system quotes)
  return new Set((data ?? []).map((q) => q.original_text));
}

/**
 * Ensure user has all quotes seeded from system master quotes
 * This function is idempotent - safe to call multiple times
 * 
 * Strategy:
 * 1. Count user quotes
 * 2. If below threshold, fetch system master quotes
 * 3. Insert missing ones (using original_text as unique identifier)
 * 4. Use conflict handling to prevent duplicates
 */
export async function ensureUserQuotesSeeded(userId: string): Promise<void> {
  try {
    // Count existing user quotes
    const userQuoteCount = await countUserQuotes(userId);
    
    if (userQuoteCount >= MIN_USER_QUOTES_THRESHOLD) {
      console.log(`[ensureUserQuotesSeeded] User ${userId} already has ${userQuoteCount} quotes, skipping seed`);
      return;
    }

    console.log(`[ensureUserQuotesSeeded] User ${userId} has ${userQuoteCount} quotes, seeding from system master...`);

    // Get system master quotes
    const systemQuotes = await getSystemMasterQuotes();
    
    if (systemQuotes.length === 0) {
      console.warn("[ensureUserQuotesSeeded] No system master quotes found, cannot seed user quotes");
      return;
    }

    // Get existing user quote texts to avoid duplicates
    const existingUserQuoteTexts = await getUserQuoteIds(userId);

    // Filter out quotes that user already has
    const quotesToInsert = systemQuotes.filter(
      (quote) => !existingUserQuoteTexts.has(quote.original_text)
    );

    if (quotesToInsert.length === 0) {
      console.log(`[ensureUserQuotesSeeded] User ${userId} already has all system quotes`);
      return;
    }

    console.log(`[ensureUserQuotesSeeded] Inserting ${quotesToInsert.length} quotes for user ${userId}...`);

    // Insert quotes in batches to avoid timeout
    const BATCH_SIZE = 100;
    for (let i = 0; i < quotesToInsert.length; i += BATCH_SIZE) {
      const batch = quotesToInsert.slice(i, i + BATCH_SIZE);
      const supabase = createSupabaseServerClient();
      
      const { error } = await supabase
        .from("quotes")
        .insert(
          batch.map((quote) => ({
            user_id: userId,
            original_text: quote.original_text,
            cleaned_text_en: quote.cleaned_text_en,
            cleaned_text_zh_tw: quote.cleaned_text_zh_tw,
            cleaned_text_zh_cn: quote.cleaned_text_zh_cn,
          }))
        );

      if (error) {
        // If duplicate key error, continue (idempotent behavior)
        if (error.code === "23505") {
          console.warn(`[ensureUserQuotesSeeded] Duplicate detected in batch ${i / BATCH_SIZE + 1}, continuing...`);
          continue;
        }
        console.error(`[ensureUserQuotesSeeded] Failed to insert batch ${i / BATCH_SIZE + 1}:`, error);
        throw new Error(`Failed to seed user quotes: ${error.message}`);
      }

      console.log(`[ensureUserQuotesSeeded] Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} quotes)`);
    }

    const finalCount = await countUserQuotes(userId);
    console.log(`[ensureUserQuotesSeeded] Successfully seeded quotes for user ${userId}. Total: ${finalCount}`);
  } catch (error) {
    console.error("[ensureUserQuotesSeeded] Error seeding user quotes:", error);
    // Don't throw - allow the app to continue even if seeding fails
    // The user can still use the app, they just won't have all quotes
  }
}


