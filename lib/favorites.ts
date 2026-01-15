import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserQuotesSeeded } from "@/lib/user-quotes-seed";
import type { Quote } from "@/lib/quotes";

export type Favorite = {
  id: string;
  user_id: string;
  quote_id: string;
  created_at: string;
  favorite_at: string;
};

export async function addFavorite(params: {
  userId: string;
  quoteId: string;
}): Promise<Favorite> {
  const supabase = createSupabaseServerClient();
  
  // Ensure user quotes are seeded before favoriting
  await ensureUserQuotesSeeded(params.userId);
  
  // Verify quote exists and belongs to user
  const { data: quoteData, error: quoteError } = await supabase
    .from("quotes")
    .select("id")
    .eq("id", params.quoteId)
    .eq("user_id", params.userId)
    .maybeSingle();
  
  if (quoteError || !quoteData) {
    throw new Error(`Quote not found or does not belong to user: ${params.quoteId}`);
  }
  
  // Insert favorite - only references user's own quotes
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: params.userId,
      quote_id: params.quoteId
    })
    .select()
    .single();

  if (error) {
    console.error("[addFavorite] Error adding favorite:", error);
    throw new Error(error.message);
  }

  return data as Favorite;
}

export async function removeFavorite(params: {
  userId: string;
  quoteId: string;
}): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", params.userId)
    .eq("quote_id", params.quoteId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function checkFavoriteExists(params: {
  userId: string;
  quoteId: string;
}): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", params.userId)
    .eq("quote_id", params.quoteId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data !== null;
}

export async function toggleFavorite(params: {
  userId: string;
  quoteId: string;
}): Promise<{ isFavorited: boolean }> {
  const exists = await checkFavoriteExists(params);
  
  if (exists) {
    // 已收藏，執行刪除
    await removeFavorite(params);
    return { isFavorited: false };
  } else {
    // 未收藏，執行插入
    await addFavorite(params);
    return { isFavorited: true };
  }
}

export async function getFavoriteQuoteIdsForUser(
  userId: string
): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("quote_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.quote_id);
}

export type FavoriteWithQuote = Quote & {
  favorite_at: string;
};

export async function getFavoriteQuotesForUser(
  userId: string
): Promise<FavoriteWithQuote[]> {
  const supabase = createSupabaseServerClient();

  // Join favorites with quotes (system quotes OR user's personal quotes)
  const { data, error } = await supabase
    .from("favorites")
    .select("favorite_at, quotes(*)")
    .eq("user_id", userId)
    .order("favorite_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const favoritesWithQuotes = (data ?? [])
    .map((row: any) => {
      if (!row.quotes) return null;
      return {
        ...row.quotes,
        favorite_at: row.favorite_at
      };
    })
    .filter(Boolean) as FavoriteWithQuote[];

  return favoritesWithQuotes;
}


