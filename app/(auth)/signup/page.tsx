"use client";

import { useState } from "react";
import Link from "next/link";
import { signUpWithEmailPassword } from "@/actions/auth-actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signUpWithEmailPassword(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
      // 如果成功，會自動 redirect，所以這裡不需要處理
    } catch (err) {
      console.error("Signup form error:", err);
      setError(err instanceof Error ? err.message : "發生未知錯誤");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <div>
        <h1 className="text-2xl font-semibold">建立帳號</h1>
        <p className="mt-2 text-sm text-neutral-600">
          用 Email + 密碼建立你的 Mementa 帳號。
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
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
            密碼（至少 6 碼）
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {isLoading ? "處理中..." : "建立帳號"}
        </button>
      </form>

      <p className="text-xs text-neutral-600">
        已經有帳號？{" "}
        <Link href="/login" className="font-medium text-neutral-900 underline">
          直接登入
        </Link>
      </p>
    </div>
  );
}


