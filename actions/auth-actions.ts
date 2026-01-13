"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * ⚠️ DEPRECATED: This Server Action cannot reliably write cookies.
 * 
 * Use the Route Handler at /api/auth/login instead:
 * - Client components should use: fetch("/api/auth/login", { method: "POST", ... })
 * - Route Handlers can write cookies, Server Actions cannot
 * 
 * This function is kept for backward compatibility but should not be used for new code.
 */
export async function signInWithEmailPassword(formData: FormData) {
  console.warn(
    "[DEPRECATED] signInWithEmailPassword Server Action is deprecated. " +
    "Use /api/auth/login Route Handler instead."
  );
  
  try {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      return { error: "請輸入 Email 與密碼" };
    }

    // ⚠️ This will fail to set cookies properly in Server Actions
    // The login will appear successful but session won't persist
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("[signInWithEmailPassword] 登入錯誤:", error.message);
      return { error: error.message };
    }

    // ⚠️ Cookies are NOT set here - this causes login loop
    return { success: true };
  } catch (error) {
    console.error("[signInWithEmailPassword] 未預期的錯誤:", error);
    return {
      error: error instanceof Error ? `系統錯誤: ${error.message}` : "系統錯誤: 未知錯誤"
    };
  }
}

export async function signUpWithEmailPassword(formData: FormData) {
  try {
    console.log("[signUpWithEmailPassword] 開始註冊流程");

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    console.log("[signUpWithEmailPassword] Email:", email ? "已提供" : "未提供");
    console.log("[signUpWithEmailPassword] Password:", password ? "已提供" : "未提供");

    if (!email || !password) {
      console.log("[signUpWithEmailPassword] 驗證失敗：Email 或密碼為空");
      return { error: "請輸入 Email 與密碼" };
    }

    // 檢查環境變數
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("[signUpWithEmailPassword] Supabase URL:", supabaseUrl ? "已設定" : "未設定");
    console.log("[signUpWithEmailPassword] Supabase Key:", supabaseKey ? "已設定" : "未設定");

    if (!supabaseUrl || !supabaseKey) {
      const missing = [];
      if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!supabaseKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
      console.error("[signUpWithEmailPassword] 環境變數缺失:", missing.join(", "));
      return { error: `環境變數設定錯誤：缺少 ${missing.join(", ")}` };
    }

    console.log("[signUpWithEmailPassword] 建立 Supabase client...");
    const supabase = createSupabaseServerClient();

    console.log("[signUpWithEmailPassword] 呼叫 supabase.auth.signUp...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      console.error("[signUpWithEmailPassword] signUp 錯誤:", signUpError);
      console.error("[signUpWithEmailPassword] 錯誤訊息:", signUpError.message);
      console.error("[signUpWithEmailPassword] 錯誤狀態:", signUpError.status);
      return { error: `註冊失敗: ${signUpError.message}` };
    }

    console.log("[signUpWithEmailPassword] signUp 成功，user:", signUpData.user?.id);

    // Initialize user data in background (don't await - non-blocking)
    if (signUpData.user) {
      // Fire and forget - runs in background without blocking response
      import("@/lib/user-init").then(({ initializeUserData }) => {
        initializeUserData(signUpData.user!.id).catch((initError) => {
          // Log but don't fail signup - initialization is best effort
          console.error("[signUpWithEmailPassword] Background initialization failed:", initError);
        });
      }).catch((importError) => {
        console.error("[signUpWithEmailPassword] Failed to import user-init:", importError);
      });
    }

    // Return success immediately - frontend will redirect to /login
    return { success: true };
  } catch (error) {
    console.error("[signUpWithEmailPassword] 未預期的錯誤:", error);
    console.error("[signUpWithEmailPassword] 錯誤堆疊:", error instanceof Error ? error.stack : "無堆疊資訊");
    return {
      error: error instanceof Error ? `系統錯誤: ${error.message}` : "系統錯誤: 未知錯誤"
    };
  }
}




