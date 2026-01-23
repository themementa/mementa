import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Quote[];
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // not found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Quote;
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



