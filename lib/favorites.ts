import { createSupabaseServerClient } from "./supabase/server";
import type { Quote } from "./quotes";

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
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: params.userId,
        quote_id: params.quoteId
      })
      .select()
      .single();

    if (error) {
      console.error("[favorites/addFavorite] supabase error:", error);
      throw new Error(error.message);
    }

    return data as Favorite;
  } catch (error) {
    console.error("[favorites/addFavorite] server error:", error);
    throw error;
  }
}

export async function removeFavorite(params: {
  userId: string;
  quoteId: string;
}): Promise<void> {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", params.userId)
      .eq("quote_id", params.quoteId);

    if (error) {
      console.error("[favorites/removeFavorite] supabase error:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("[favorites/removeFavorite] server error:", error);
    throw error;
  }
}

export async function checkFavoriteExists(params: {
  userId: string;
  quoteId: string;
}): Promise<boolean> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", params.userId)
      .eq("quote_id", params.quoteId)
      .maybeSingle();

    if (error) {
      console.error("[favorites/checkFavoriteExists] supabase error:", error);
      throw new Error(error.message);
    }

    return data !== null;
  } catch (error) {
    console.error("[favorites/checkFavoriteExists] server error:", error);
    throw error;
  }
}

export async function toggleFavorite(params: {
  userId: string;
  quoteId: string;
}): Promise<{ isFavorited: boolean }> {
  try {
    const exists = await checkFavoriteExists(params);
    if (exists) {
      // 已收藏，執行刪除
      await removeFavorite(params);
      return { isFavorited: false };
    }
    // 未收藏，執行插入
    await addFavorite(params);
    return { isFavorited: true };
  } catch (error) {
    console.error("[favorites/toggleFavorite] server error:", error);
    throw error;
  }
}

export async function getFavoriteQuoteIdsForUser(
  userId: string
): Promise<string[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("quote_id")
      .eq("user_id", userId);

    if (error) {
      console.error("[favorites/getFavoriteQuoteIdsForUser] supabase error:", error);
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => row.quote_id);
  } catch (error) {
    console.error("[favorites/getFavoriteQuoteIdsForUser] server error:", error);
    throw error;
  }
}

export type FavoriteWithQuote = Quote & {
  favorite_at: string;
};

export async function getFavoriteQuotesForUser(
  userId: string
): Promise<FavoriteWithQuote[]> {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("favorites")
      .select("favorite_at, quotes(*)")
      .eq("user_id", userId)
      .order("favorite_at", { ascending: false });

    if (error) {
      console.error("[favorites/getFavoriteQuotesForUser] supabase error:", error);
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
  } catch (error) {
    console.error("[favorites/getFavoriteQuotesForUser] server error:", error);
    throw error;
  }
}


