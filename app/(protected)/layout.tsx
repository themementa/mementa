import { ReactNode } from "react";
import { requireUser } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireUser();
    return <>{children}</>;
  } catch (error) {
    console.error("[protected/layout] server error:", error);
    throw error;
  }
}