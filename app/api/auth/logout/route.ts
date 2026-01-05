import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

/**
 * Logout Route Handler
 * 
 * This is the ONLY place where signOut should be called.
 * Route Handlers can write cookies, which is required for Supabase auth.
 */
export async function POST() {
  try {
    const supabase = createSupabaseRouteHandlerClient();
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/logout] 登出錯誤:", error);
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

