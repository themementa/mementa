import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTodaysUserQuote } from "@/lib/daily-quotes-global";
import { seedSystemQuotes } from "@/lib/seed-system-quotes";

const MIN_QUOTES_REQUIRED = 300;
const SEED_BATCH_SIZE = 200;

type InitializeUserDataOptions = {
  source?: "login" | "signup";
};

export async function initializeUserData(
  userId: string,
  options: InitializeUserDataOptions = {}
): Promise<void> {
  try {
    console.log("INIT START", userId);
    if (options.source === "login") {
      console.log("LOGIN INIT START", userId);
    }
    if (options.source === "signup") {
      console.log("SIGNUP INIT START", userId);
    }

    await seedSystemQuotes();
    await seedUserQuotes(userId);
    console.log("SEED QUOTES DONE", userId);
    if (options.source === "login") {
      console.log("LOGIN SEED QUOTES DONE", userId);
    }
    if (options.source === "signup") {
      console.log("SIGNUP SEED QUOTES DONE", userId);
    }

    const finalCount = await getUserQuoteCount(userId);
    if (finalCount === 0) {
      console.warn("[initializeUserData] Seed resulted in 0 quotes, retrying once...");
      await seedUserQuotes(userId);
    }

    const verifiedCount = await getUserQuoteCount(userId);
    if (verifiedCount === 0) {
      console.error("[initializeUserData] Seed failed after retry, still 0 quotes.");
      throw new Error("User quote seeding failed: 0 quotes after retry");
    }

    await getTodaysUserQuote(userId);
    console.log("TODAY QUOTE DONE", userId);
    if (options.source === "login") {
      console.log("LOGIN TODAY QUOTE DONE", userId);
    }
    if (options.source === "signup") {
      console.log("SIGNUP TODAY QUOTE DONE", userId);
    }

    console.log(`[initializeUserData] Seed complete: ${verifiedCount} quotes for user ${userId}`);
  } catch (e) {
    console.error("INIT FAILED", userId, e);
    if (options.source === "login") {
      console.error("LOGIN INIT FAILED", userId, e);
    }
    if (options.source === "signup") {
      console.error("SIGNUP INIT FAILED", userId, e);
    }
    throw e;
  }
}

export async function seedUserQuotes(userId: string): Promise<void> {
  const supabase = createSupabaseServerClient();

  const existingCount = await getUserQuoteCount(userId);
  if (existingCount >= MIN_QUOTES_REQUIRED) {
    console.log(`[seedUserQuotes] Skip: user already has ${existingCount} quotes`);
    return;
  }

  console.log(`[seedUserQuotes] Seeding quotes for user ${userId}...`);

  const { data: systemQuotes, error: fetchError } = await supabase
    .from("system_quotes")
    .select("original_text, cleaned_text_en, cleaned_text_zh_tw, cleaned_text_zh_cn, cleaned_text_zh_hans");

  if (fetchError) {
    console.error("[seedUserQuotes] Failed to fetch system quotes:", fetchError);
    throw new Error(fetchError.message);
  }

  const systemCount = systemQuotes?.length ?? 0;
  console.log("SYSTEM QUOTES COUNT", systemCount);

  if (!systemQuotes || systemQuotes.length === 0) {
    console.error("[seedUserQuotes] No system quotes available to seed");
    throw new Error("No system quotes available to seed");
  }

  const { data: existingQuotes, error: existingError } = await supabase
    .from("quotes")
    .select("original_text")
    .eq("user_id", userId);

  if (existingError) {
    console.error("[seedUserQuotes] Failed to fetch existing user quotes:", existingError);
    throw new Error(existingError.message);
  }

  const existingTextSet = new Set((existingQuotes ?? []).map((q) => q.original_text));
  const missingQuotes = systemQuotes.filter((quote) => !existingTextSet.has(quote.original_text));

  if (missingQuotes.length === 0) {
    console.log("USER SEED COPIED", userId, 0);
    return;
  }

  for (let i = 0; i < missingQuotes.length; i += SEED_BATCH_SIZE) {
    const batch = missingQuotes.slice(i, i + SEED_BATCH_SIZE);
    const { error: insertError } = await supabase
      .from("quotes")
      .insert(
        batch.map((quote) => ({
          user_id: userId,
          original_text: quote.original_text,
          cleaned_text_en: quote.cleaned_text_en,
          cleaned_text_zh_tw: quote.cleaned_text_zh_tw,
          cleaned_text_zh_cn: quote.cleaned_text_zh_cn,
          cleaned_text_zh_hans: quote.cleaned_text_zh_hans,
        }))
      );

    if (insertError) {
      console.error("[seedUserQuotes] Insert failed:", insertError);
      throw new Error(insertError.message);
    }
  }

  console.log("USER SEED COPIED", userId, missingQuotes.length);
  console.log(`[seedUserQuotes] Seed success for user ${userId}`);
}

export async function getUserQuoteCount(userId: string): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from("quotes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("[getUserQuoteCount] Count failed:", error);
    throw new Error(error.message);
  }

  return count ?? 0;
}

