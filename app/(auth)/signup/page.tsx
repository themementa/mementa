import { Suspense } from "react";
import { SignupClient } from "./signup-client";

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div>
          <h1 className="text-2xl font-semibold">建立帳號</h1>
          <p className="mt-2 text-sm text-neutral-600">
            用 Email + 密碼建立你的 Mementa 帳號。
          </p>
        </div>
      </div>
    }>
      <SignupClient />
    </Suspense>
  );
}


