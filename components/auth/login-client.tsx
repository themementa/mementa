"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";
import Image from "next/image";

const FOCUS_MOMENT_KEY = "mementa_focus_moment";

/**
 * Login Client Component
 * 
 * Uses fetch() to call the Route Handler at /api/auth/login.
 * This ensures cookies are written correctly in a Route Handler context.
 * 
 * DO NOT use Server Actions for login - they can't reliably write cookies.
 */
export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusMoment = searchParams?.get("focus") === "moment";
  const { language, setLanguage } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrorCount, setPasswordErrorCount] = useState(0);

  // Login 頁臨時語言選擇（不寫入 DB）
  const [loginLanguage, setLoginLanguage] = useState<"zh-tw" | "zh-cn" | "en">(
    (typeof window !== "undefined" && localStorage.getItem("mementa_login_lang")) as "zh-tw" | "zh-cn" | "en" || "zh-tw"
  );

  useEffect(() => {
    if (focusMoment && typeof window !== "undefined") {
      localStorage.setItem(FOCUS_MOMENT_KEY, "true");
    }
  }, [focusMoment]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mementa_login_lang", loginLanguage);
    }
  }, [loginLanguage]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 檢查是否為密碼錯誤（通常 Supabase 會返回 "Invalid login credentials"）
        const isPasswordError = data.error?.toLowerCase().includes("password") || 
                                data.error?.toLowerCase().includes("credentials") ||
                                data.error?.toLowerCase().includes("invalid");
        
        if (isPasswordError) {
          setPasswordErrorCount(prev => prev + 1);
        } else {
          setError(data.error || getLoginText("loginFailed"));
        }
        setIsLoading(false);
        return;
      }

      // Login successful - reset error count and redirect
      setPasswordErrorCount(0);
      router.push("/home");
    } catch (err) {
      console.error("[LoginClient] 登入錯誤:", err);
      setError(err instanceof Error ? err.message : getLoginText("unknownError"));
      setIsLoading(false);
    }
  }

  // Login 頁翻譯（臨時）
  const getLoginText = (key: string) => {
    const translations: Record<string, Record<"zh-tw" | "zh-cn" | "en", string>> = {
      title: {
        "zh-tw": "Mementa",
        "zh-cn": "Mementa",
        "en": "Mementa",
      },
      subtitle: {
        "zh-tw": "收集，留住你的金句",
        "zh-cn": "收集，留住你的金句",
        "en": "Collect what matters. Please log in.",
      },
      email: {
        "zh-tw": "Email",
        "zh-cn": "Email",
        "en": "Email",
      },
      password: {
        "zh-tw": "密碼",
        "zh-cn": "密码",
        "en": "Password",
      },
      login: {
        "zh-tw": "登入",
        "zh-cn": "登录",
        "en": "Log in",
      },
      loggingIn: {
        "zh-tw": "登入中...",
        "zh-cn": "登录中...",
        "en": "Logging in...",
      },
      noAccount: {
        "zh-tw": "還沒有帳號？",
        "zh-cn": "还没有账号？",
        "en": "Don't have an account?",
      },
      signup: {
        "zh-tw": "註冊",
        "zh-cn": "注册",
        "en": "Sign up",
      },
      loginFailed: {
        "zh-tw": "登入失敗",
        "zh-cn": "登录失败",
        "en": "Login failed",
      },
      unknownError: {
        "zh-tw": "發生未知錯誤",
        "zh-cn": "发生未知错误",
        "en": "An unknown error occurred",
      },
      passwordErrorFirst: {
        "zh-tw": "密碼未成功，請再試一次。",
        "zh-cn": "密码未成功，请再试一次。",
        "en": "That password doesn't look right. Try again.",
      },
      passwordErrorSecond: {
        "zh-tw": "如果你唔記得密碼，可以重設。",
        "zh-cn": "如果你不记得密码，可以重置。",
        "en": "If you've forgotten your password, you can reset it.",
      },
    };
    return translations[key]?.[loginLanguage] || key;
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 relative">
      {/* 語言選擇 - 右上角 */}
      <div className="absolute top-0 right-0 flex items-center gap-2 text-xs text-stone-500">
        <button
          type="button"
          onClick={() => setLoginLanguage("zh-tw")}
          className={`touch-manipulation ${
            loginLanguage === "zh-tw" ? "font-medium text-stone-700" : ""
          }`}
        >
          繁
        </button>
        <span>｜</span>
        <button
          type="button"
          onClick={() => setLoginLanguage("en")}
          className={`touch-manipulation ${
            loginLanguage === "en" ? "font-medium text-stone-700" : ""
          }`}
        >
          EN
        </button>
        <span>｜</span>
        <button
          type="button"
          onClick={() => setLoginLanguage("zh-cn")}
          className={`touch-manipulation ${
            loginLanguage === "zh-cn" ? "font-medium text-stone-700" : ""
          }`}
        >
          简
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{getLoginText("title")}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {getLoginText("subtitle")}
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            {getLoginText("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isLoading}
            onChange={() => {
              // 當 email 變更時，重置密碼錯誤次數
              if (passwordErrorCount > 0) {
                setPasswordErrorCount(0);
              }
            }}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            {getLoginText("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={6}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 touch-manipulation"
              tabIndex={-1}
            >
              {showPassword ? (
                <Image
                  src="/icons/eye-closed.svg"
                  alt="Hide password"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              ) : (
                <Image
                  src="/icons/eye-open.svg"
                  alt="Show password"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              )}
            </button>
          </div>
          
          {/* 溫柔型錯誤提示 */}
          {passwordErrorCount >= 1 && (
            <div className="space-y-1 pt-1">
              <p className="text-sm text-stone-600">
                {getLoginText("passwordErrorFirst")}
              </p>
              {passwordErrorCount >= 2 && (
                <p className="text-xs text-stone-500">
                  {getLoginText("passwordErrorSecond")}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {isLoading ? getLoginText("loggingIn") : getLoginText("login")}
        </button>
      </form>

      <p className="text-xs text-neutral-600">
        {getLoginText("noAccount")}{" "}
        <Link href="/signup" className="font-medium text-neutral-900 underline">
          {getLoginText("signup")}
        </Link>
      </p>
    </div>
  );
}
