import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for Server Components and Server Actions.
 * 
 * IMPORTANT: This client CANNOT write cookies.
 * Server Components and Server Actions cannot modify cookies.
 * 
 * Use this in Server Components and Server Actions only.
 * For Route Handlers, use createSupabaseRouteHandlerClient instead.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Server Components/Actions cannot write cookies
        // This prevents "Cookies can only be modified..." errors
        set() {
          // No-op: Server Components cannot set cookies
        },
        remove() {
          // No-op: Server Components cannot remove cookies
        },
      },
    }
  );
}
