import { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { Navbar } from "@/components/navbar";

export default async function ProtectedLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="flex min-h-full flex-col gap-4">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}


