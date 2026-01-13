"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function SignupClient() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // CRITICAL FIX: Read language from URL parameter or localStorage
  // This ensures signup page respects the language selected on login page
  const [signupLanguage, setSignupLanguage] = useState<"zh-tw" | "zh-cn" | "en">("zh-tw");
  
  useEffect(() => {
    // First, try to get language from URL parameter (from login page)
    const langParam = searchParams?.get("lang");
    if (langParam && (langParam === "zh-tw" || langParam === "zh-cn" || langParam === "en")) {
      setSignupLanguage(langParam as "zh-tw" | "zh-cn" | "en");
      if (typeof window !== "undefined") {
        localStorage.setItem("mementa_login_lang", langParam);
      }
    } else if (typeof window !== "undefined") {
      // Fallback to localStorage (from login page)
      const storedLang = localStorage.getItem("mementa_login_lang");
      if (storedLang && (storedLang === "zh-tw" || storedLang === "zh-cn" || storedLang === "en")) {
        setSignupLanguage(storedLang as "zh-tw" | "zh-cn" | "en");
      }
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "註冊失敗");
        setIsLoading(false);
        return;
      }

      // Success - immediately redirect to login
      window.location.href = `/login?lang=${signupLanguage}`;
    } catch (err) {
      console.error("Signup form error:", err);
      const errorMessages = {
        "zh-tw": "發生未知錯誤",
        "zh-cn": "发生未知错误",
        "en": "An unknown error occurred",
      };
      setError(err instanceof Error ? err.message : errorMessages[signupLanguage]);
      setIsLoading(false);
    }
  }

  // Get localized text based on signupLanguage
  const getSignupText = (key: string) => {
    const translations: Record<string, Record<"zh-tw" | "zh-cn" | "en", string>> = {
      title: {
        "zh-tw": "建立帳號",
        "zh-cn": "建立账号",
        "en": "Create Account",
      },
      subtitle: {
        "zh-tw": "用 Email + 密碼建立你的 Mementa 帳號。",
        "zh-cn": "用 Email + 密码建立你的 Mementa 账号。",
        "en": "Create your Mementa account with email and password.",
      },
      email: {
        "zh-tw": "Email",
        "zh-cn": "Email",
        "en": "Email",
      },
      password: {
        "zh-tw": "密碼（至少 6 碼）",
        "zh-cn": "密码（至少 6 码）",
        "en": "Password (at least 6 characters)",
      },
      processing: {
        "zh-tw": "處理中...",
        "zh-cn": "处理中...",
        "en": "Processing...",
      },
      createAccount: {
        "zh-tw": "建立帳號",
        "zh-cn": "建立账号",
        "en": "Create Account",
      },
      hasAccount: {
        "zh-tw": "已經有帳號？",
        "zh-cn": "已经有账号？",
        "en": "Already have an account?",
      },
      login: {
        "zh-tw": "直接登入",
        "zh-cn": "直接登录",
        "en": "Log in",
      },
    };
    return translations[key]?.[signupLanguage] || key;
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <div>
        <h1 className="text-2xl font-semibold">{getSignupText("title")}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {getSignupText("subtitle")}
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
            {getSignupText("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            {getSignupText("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={6}
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 cursor-pointer transition-colors duration-200"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="inline-block transition-opacity duration-200">
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {isLoading ? getSignupText("processing") : getSignupText("createAccount")}
        </button>
      </form>

      <p className="text-xs text-neutral-600">
        {getSignupText("hasAccount")}{" "}
        <Link 
          href={`/login?lang=${signupLanguage}`} 
          className="font-medium text-neutral-900 underline"
        >
          {getSignupText("login")}
        </Link>
      </p>
    </div>
  );
}

