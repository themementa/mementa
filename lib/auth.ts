import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export async function getCurrentUser() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("[auth/getCurrentUser] supabase error:", error);
      return null;
    }
    return data.user ?? null;
  } catch (error) {
    console.error("[auth/getCurrentUser] server error:", error);
    return null;
  }
}

export async function requireUser() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/login");
    }
    return user;
  } catch (error) {
    console.error("[auth/requireUser] server error:", error);
    throw error;
  }
}
