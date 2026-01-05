"use client";

import { useState, useEffect } from "react";
import { isNightMode } from "@/lib/night-mode";

export function useNightMode() {
  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    // Check on mount
    setNightMode(isNightMode());

    // Check periodically (every minute)
    const interval = setInterval(() => {
      setNightMode(isNightMode());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return nightMode;
}

