"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FIRST_OPEN_KEY = "mementa_first_open_seen";

/**
 * Intro 頁（啟動頁）
 * - 固定使用繁體中文
 * - 完成後直接導向 Login 頁
 * - 永遠為第一入口，不應被跳過
 */
export function FirstOpenExperience() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
  }, []);

  const proceedToLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FIRST_OPEN_KEY, "true");
    }
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* 新文案 - 固定繁體中文 */}
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            一刻就好。
          </p>
        </div>
        
        {/* 完整空行（paragraph spacing） */}
        <div className="h-6" />
        
        <div className="space-y-2">
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            你可以靜靜喺度
          </p>
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            你唔需要做任何事
          </p>
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            你可以慢慢嚟
          </p>
        </div>

        {/* 繼續按鈕 */}
        <div className="mt-12">
          <button
            onClick={proceedToLogin}
            className="text-sm text-stone-500 hover:text-stone-700 touch-manipulation"
          >
            繼續
          </button>
        </div>
      </div>
    </div>
  );
}
