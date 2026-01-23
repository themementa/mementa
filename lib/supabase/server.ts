import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Components can't set cookies; ignore to avoid runtime crash.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Server Components can't set cookies; ignore to avoid runtime crash.
          }
        },
      },
    }
  );
}
