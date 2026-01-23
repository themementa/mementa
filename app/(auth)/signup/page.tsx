"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message || "系統錯誤，請稍後再試");
        return;
      }
      router.push("/home");
      router.refresh();
    });
  };

  return (
    <main className="flex min-h-[70vh] flex-col justify-center gap-6">
      <h1 className="text-2xl font-semibold">註冊</h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-700">Email</span>
          <input
            className="rounded-md border border-gray-300 px-3 py-2"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-700">Password</span>
          <input
            className="rounded-md border border-gray-300 px-3 py-2"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? "註冊中..." : "註冊"}
        </button>
      </form>
      <Link className="text-sm text-blue-600 underline" href="/login">
        已有帳號？回到登入
      </Link>
    </main>
  );
}
