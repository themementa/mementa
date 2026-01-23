import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Quote } from "@/lib/quotes";

export type Journal = {
  id: string;
  user_id: string;
  quote_id: string;
  created_at: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type JournalWithQuote = Journal & {
  quote: Quote;
};

/**
 * Get journal entry for a specific quote and date
 */
export async function getJournalEntry(
  userId: string,
  quoteId: string,
  created_at: string
): Promise<Journal | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", userId)
    .eq("quote_id", quoteId)
    .eq("created_at", created_at)
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
 */
export async function saveJournalEntry(params: {
  userId: string;
  quoteId: string;
  created_at: string;
  content: string;
}): Promise<Journal> {
  const supabase = createSupabaseServerClient();

  // Try to update existing entry first
  const { data: existing } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", params.userId)
    .eq("quote_id", params.quoteId)
    .eq("created_at", params.created_at)
    .single();

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
    // Insert new entry
    const { data, error } = await supabase
      .from("journals")
      .insert({
        user_id: params.userId,
        quote_id: params.quoteId,
        created_at: params.created_at,
        content: params.content,
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

