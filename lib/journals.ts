import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Quote } from "@/lib/quotes";

export type Journal = {
  id: string;
  user_id: string;
  quote_id: string;
  created_at: string;
  content: string;
  updated_at: string;
};

export type JournalWithQuote = Journal & {
  quote: Quote;
};

/**
 * Get journal entry for a specific quote and date (same day)
 * Uses date string (YYYY-MM-DD) to find entry on the same day
 */
export async function getJournalEntry(
  userId: string,
  quoteId: string,
  dateString: string // YYYY-MM-DD format
): Promise<Journal | null> {
  const supabase = createSupabaseServerClient();
  
  // Get start and end of the day in ISO format
  const startOfDay = `${dateString}T00:00:00.000Z`;
  const endOfDay = `${dateString}T23:59:59.999Z`;
  
  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", userId)
    .eq("quote_id", quoteId)
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // not found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Journal;
}

/**
 * Save or update journal entry
 * Same user + same quote_id + same day = only one journal entry
 * Uses date string (YYYY-MM-DD) to determine if entry exists on the same day
 */
export async function saveJournalEntry(params: {
  userId: string;
  quoteId: string;
  dateString: string; // YYYY-MM-DD format
  content: string;
}): Promise<Journal> {
  const supabase = createSupabaseServerClient();

  // Get start and end of the day in ISO format
  const startOfDay = `${params.dateString}T00:00:00.000Z`;
  const endOfDay = `${params.dateString}T23:59:59.999Z`;

  // Try to find existing entry for the same day
  const { data: existing } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", params.userId)
    .eq("quote_id", params.quoteId)
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .maybeSingle();

  if (existing) {
    // Update existing entry
    const { data, error } = await supabase
      .from("journals")
      .update({
        content: params.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Journal;
  } else {
    // Insert new entry with current timestamp
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("journals")
      .insert({
        user_id: params.userId,
        quote_id: params.quoteId,
        created_at: now,
        content: params.content,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Journal;
  }
}

/**
 * Delete journal entry by ID
 */
export async function deleteJournalEntry(
  journalId: string,
  userId: string
): Promise<void> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("journals")
    .delete()
    .eq("id", journalId)
    .eq("user_id", userId); // Ensure user owns this journal

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get all journal entries for a user with quote information
 * Only returns entries with non-empty content
 * Ordered by date DESC (newest first)
 */
export async function getAllJournalsWithQuotes(
  userId: string
): Promise<JournalWithQuote[]> {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("journals")
    .select("*, quotes(*)")
    .eq("user_id", userId)
    .neq("content", "")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Filter out entries with empty content and ensure quote exists
  return (data ?? [])
    .filter((entry: any) => entry.content?.trim() && entry.quotes)
    .map((entry: any) => {
      const { quotes, ...journal } = entry;
      return {
        ...journal,
        quote: quotes as Quote,
      };
    }) as JournalWithQuote[];
}

