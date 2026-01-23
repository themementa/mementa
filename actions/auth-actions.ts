"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../lib/supabase/server";

export async function signOut() {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[auth/signOut] supabase error:", error);
    }
    redirect("/login");
  } catch (error) {
    console.error("[auth/signOut] server error:", error);
    throw error;
  }
}
