import { ReactNode } from "react";

/**
 * Auth Layout
 * 
 * IMPORTANT: Temporarily disabled redirect logic to prevent redirect loops.
 * Middleware handles all authentication routing.
 * 
 * This layout renders children unconditionally.
 */
export default async function AuthLayout({
  children
}: {
  children: ReactNode;
}) {
  // Auth redirect logic is handled by middleware.ts
  // No redirects here to prevent loops
  return <>{children}</>;
}



