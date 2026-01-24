"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      console.error("[auth/login] env presence:", {
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      });
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        console.error("[auth/login] signInWithPassword error:", signInError);
        setError(signInError.message || "系統錯誤，請稍後再試");
        return;
      }
      router.push("/home");
      router.refresh();
    });
  };

  return (
    <main className="flex min-h-[70vh] flex-col justify-center gap-6">
      <h1 className="text-2xl font-semibold">登入</h1>
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
            autoComplete="current-password"
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
          {isPending ? "登入中..." : "登入"}
        </button>
      </form>
    </main>
  );
}
