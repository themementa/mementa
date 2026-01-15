import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";
import { initializeUserData } from "@/lib/user-init";

/**
 * Login Route Handler
 * 
 * This is the ONLY place where signInWithPassword should be called.
 * Route Handlers can write cookies, which is required for Supabase auth.
 * 
 * DO NOT call signInWithPassword in:
 * - Server Actions (can't reliably write cookies)
 * - Server Components (can't write cookies)
 * - Client Components (security risk, exposes keys)
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "請輸入 Email 與密碼" },
        { status: 400 }
      );
    }

    // Create client that CAN write cookies (Route Handler context)
    const supabase = createSupabaseRouteHandlerClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[POST /api/auth/login] 登入錯誤:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Initialize user data on login (idempotent - safe for existing users)
    // This ensures:
    // - User has quotes seeded (backfill for existing users)
    // - Today's quote exists in daily_quotes
    if (authData.user) {
      try {
        await initializeUserData(authData.user.id);
        console.log("[POST /api/auth/login] User data initialization completed for:", authData.user.id);
      } catch (initError) {
        // Log but don't fail login - initialization is best effort
        console.error("[POST /api/auth/login] Failed to initialize user data:", initError);
      }
    }

    // Success - cookies are automatically set by Supabase client
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/login] 未預期的錯誤:", error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? `系統錯誤: ${error.message}`
          : "系統錯誤: 未知錯誤",
      },
      { status: 500 }
    );
  }
}
