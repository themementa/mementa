import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current authenticated user.
 * 
 * IMPORTANT: This function does NOT redirect.
 * Middleware handles all authentication redirects.
 * 
 * Returns null if user is not authenticated.
 */
export async function requireUser() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}
