import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SYSTEM_USER_ID } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";

export type Quote = {
  id: string;
  user_id: string | null;
  original_text: string;
  cleaned_text_zh_tw: string | null;
  cleaned_text_zh_cn: string | null;
  cleaned_text_en: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAllQuotes(): Promise<Quote[]> {
  const supabase = createSupabaseServerClient();
  const user = await getCurrentUser();
  
  let query = supabase
    .from("quotes")
    .select("*");
  
  // Filter: user's personal quotes OR system quotes
  if (user) {
    query = query.in("user_id", [user.id, SYSTEM_USER_ID]);
  } else {
    // If no user, only show system quotes
    query = query.eq("user_id", SYSTEM_USER_ID);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllQuotes] Database error:", error);
    throw new Error(error.message);
  }

  // Log actual data count for debugging
  const count = data?.length ?? 0;
  if (count === 0) {
    console.warn("[getAllQuotes] No quotes found in database");
  } else {
    console.log(`[getAllQuotes] Found ${count} quotes`);
  }

  return (data ?? []) as Quote[];
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const supabase = createSupabaseServerClient();
  const user = await getCurrentUser();
  
  // Allow access to system quotes OR user's personal quotes
  let query = supabase
    .from("quotes")
    .select("*")
    .eq("id", id);
  
  // Filter: user's personal quotes OR system quotes
  if (user) {
    query = query.in("user_id", [user.id, SYSTEM_USER_ID]);
  } else {
    // If no user, only show system quotes
    query = query.eq("user_id", SYSTEM_USER_ID);
  }
  
  const { data, error } = await query.single();

  if (error) {
    if (error.code === "PGRST116") {
      // not found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Quote;
}

/**
 * Get the first available quote from the database as a fallback
 * Used when primary data fetching fails but we know data exists
 * Returns system quote or user's personal quote
 */
export async function getFirstAvailableQuote(): Promise<Quote | null> {
  const supabase = createSupabaseServerClient();
  const user = await getCurrentUser();
  
  let query = supabase
    .from("quotes")
    .select("*")
    .limit(1);
  
  // Filter: user's personal quotes OR system quotes
  if (user) {
    query = query.in("user_id", [user.id, SYSTEM_USER_ID]);
  } else {
    // If no user, only show system quotes
    query = query.eq("user_id", SYSTEM_USER_ID);
  }
  
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST116") {
      // No quotes in database
      return null;
    }
    throw new Error(error.message);
  }

  return data as Quote | null;
}

export async function updateQuote(params: {
  id: string;
  originalText?: string;
  cleanedTextZhTw?: string | null;
  cleanedTextZhCn?: string | null;
  cleanedTextEn?: string | null;
}): Promise<Quote> {
  const supabase = createSupabaseServerClient();
  const payload: Record<string, unknown> = {};

  if (params.originalText !== undefined) {
    payload.original_text = params.originalText;
  }
  if (params.cleanedTextZhTw !== undefined) {
    payload.cleaned_text_zh_tw = params.cleanedTextZhTw;
  }
  if (params.cleanedTextZhCn !== undefined) {
    payload.cleaned_text_zh_cn = params.cleanedTextZhCn;
  }
  if (params.cleanedTextEn !== undefined) {
    payload.cleaned_text_en = params.cleanedTextEn;
  }

  const { data, error } = await supabase
    .from("quotes")
    .update(payload)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Quote;
}



