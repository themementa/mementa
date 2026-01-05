import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

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

    const { error } = await supabase.auth.signInWithPassword({
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
