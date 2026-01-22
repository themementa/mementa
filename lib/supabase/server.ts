import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { logSupabaseKeyUsage } from "./logging";

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  console.log("=== SUPABASE RUNTIME AUDIT ===");
  console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("ANON_KEY_PREFIX:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20));
  console.log("SERVICE_KEY_PREFIX:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("==============================");
  logSupabaseKeyUsage({
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    keyName: "anon",
    source: "lib/supabase/server.ts",
  });
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // ⚠️ 注意：呢個 function 只可以喺「Server Action / Route Handler」真正執行
        set() {
          throw new Error("Do not set cookies here");
        },
        remove() {
          throw new Error("Do not remove cookies here");
        },
      },
    }
  );
}
