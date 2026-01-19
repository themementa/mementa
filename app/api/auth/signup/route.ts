import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";
import { initializeUserData } from "@/lib/user-init";

/**
 * Signup Route Handler
 * 
 * This handles user registration and creates a profile row.
 * Route Handlers can write cookies, which is required for Supabase auth.
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

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("[POST /api/auth/signup] 註冊錯誤:", signUpError.message);
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    if (!signUpData.user) {
      return NextResponse.json(
        { error: "註冊失敗：未創建用戶" },
        { status: 500 }
      );
    }

    // Create profile row for new user
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: signUpData.user.id,
      });

    if (profileError) {
      // Log but don't fail signup - profile creation is best effort
      // Some setups may use triggers or handle this automatically
      console.warn("[POST /api/auth/signup] Failed to create profile (may be handled by trigger):", profileError.message);
    } else {
      console.log("[POST /api/auth/signup] Profile created for user:", signUpData.user.id);
    }

    // Initialize user data - await to ensure seeding completes before redirect
    try {
      await initializeUserData(signUpData.user.id, { source: "signup" });
      console.log("SIGNUP INIT FINISHED", signUpData.user.id);
    } catch (error) {
      console.error("SIGNUP INIT FAILED", signUpData.user.id, error);
      throw error;
    }

    // Return success - frontend will redirect to /login
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/signup] 未預期的錯誤:", error);
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


