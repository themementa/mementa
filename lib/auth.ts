import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export async function getCurrentUser() {
  try {
    console.error("[auth/getCurrentUser] env presence:", {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
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
    console.error("[auth/requireUser] env presence:", {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
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
