"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Intro Guard Component
 * 
 * Checks if intro is completed via localStorage.
 * If not completed and user is on /home, redirects to /intro.
 */
export function IntroGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);

    // Only check on /home route
    if (pathname === "/home" || pathname === "/") {
      const introDone = localStorage.getItem("mementa_intro_done");
      if (introDone !== "true") {
        window.location.href = "/intro";
      }
    }
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

