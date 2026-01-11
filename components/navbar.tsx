"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Phase 1 Navbar - 包含 7 個核心功能
 * 順序：1. 今日一句 2. 文字收藏 3. 我收藏的 4. 我的句子 5. 語言選項 6. 我的設定 7. 登出
 * 規則：全站固定可見、當前頁面有 active 狀態、所有文字使用系統標準字
 */
export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 判斷當前頁面是否為 active
  const isActive = (path: string) => {
    if (path === "/home") {
      return pathname === "/home" || pathname === "/";
    }
    return pathname === path;
  };

  // 獲取 active 樣式
  const getActiveClass = (path: string) => {
    return isActive(path) ? "bg-stone-100" : "";
  };

  // 獲取 active 文字樣式
  const getActiveTextClass = (path: string) => {
    return isActive(path) ? "text-stone-900 font-medium" : "text-gray-700";
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Always render navbar in protected routes
  // Auth state will update via onAuthStateChange subscription
  // The navbar will appear immediately and update when auth state is confirmed
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-soft-pink-dark/30 pb-3 pt-3">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* 1. 今日一句 ☀️ */}
          <Link
            href="/home"
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-pink touch-manipulation min-h-[44px] min-w-[44px] ${getActiveClass(
              "/home"
            )}`}
            title={getTranslation(language, "todaysQuote")}
          >
            <span className="text-xl">☀️</span>
            <span className={`text-xs ${getActiveTextClass("/home")}`}>
              {getTranslation(language, "todaysQuote")}
            </span>
          </Link>

          {/* 2. 文字收藏 🔖 */}
          <Link
            href="/quotes"
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-purple touch-manipulation min-h-[44px] min-w-[44px] ${getActiveClass(
              "/quotes"
            )}`}
            title={getTranslation(language, "allQuotes")}
          >
            <span className="text-xl">🔖</span>
            <span className={`text-xs ${getActiveTextClass("/quotes")}`}>
              {getTranslation(language, "allQuotes")}
            </span>
          </Link>

          {/* 3. 我收藏的 💛 */}
          <Link
            href="/favorites"
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-pink touch-manipulation min-h-[44px] min-w-[44px] ${getActiveClass(
              "/favorites"
            )}`}
            title={getTranslation(language, "favorites")}
          >
            <span className="text-xl">💛</span>
            <span className={`text-xs ${getActiveTextClass("/favorites")}`}>
              {getTranslation(language, "favorites")}
            </span>
          </Link>

          {/* 4. 我的句子 ✍️ */}
          <Link
            href="/moments"
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-lavender touch-manipulation min-h-[44px] min-w-[44px] ${getActiveClass(
              "/moments"
            )}`}
            title={getTranslation(language, "myMoments")}
          >
            <span className="text-xl">✍️</span>
            <span className={`text-xs ${getActiveTextClass("/moments")}`}>
              {getTranslation(language, "myMoments")}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* 5. 語言選項 🌐 */}
          <LanguageSwitcher
            language={language ?? "zh-tw"}
            onLanguageChange={setLanguage}
          />

          {/* 6. 我的設定 ⚙️ */}
          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-lavender touch-manipulation min-h-[44px] min-w-[44px] ${getActiveClass(
              "/settings"
            )}`}
            title={getTranslation(language, "settings")}
          >
            <span className="text-xl">⚙️</span>
            <span className={`text-xs ${getActiveTextClass("/settings")}`}>
              {getTranslation(language, "settings")}
            </span>
          </Link>

          {/* 7. 登出 ⎋ */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-soft-lavender touch-manipulation min-h-[44px] min-w-[44px]"
            title={getTranslation(language, "logout")}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
            <span className="text-xs text-gray-700">
              {getTranslation(language, "logout")}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
