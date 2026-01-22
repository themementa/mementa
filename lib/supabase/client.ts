import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  console.log("=== SUPABASE RUNTIME AUDIT ===");
  console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("ANON_KEY_PREFIX:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20));
  console.log("SERVICE_KEY_PREFIX:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("==============================");
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}