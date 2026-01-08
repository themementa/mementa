import { ReactNode } from "react";

export const dynamic = "force-dynamic";

/**
 * Protected Layout
 * 
 * IMPORTANT: No auth checks here.
 * Middleware handles all authentication redirects.
 * This layout only renders children.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}