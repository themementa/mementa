"use client";

import { useState, useEffect } from "react";

/**
 * Intro Page - Onboarding experience
 * 
 * This is a public page accessible to all users.
 * After clicking "繼續", sets has_seen_intro flag and navigates to /home.
 */
export default function IntroPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
  }, []);

  const handleContinue = () => {
    // Set intro completion flag before redirecting
    if (typeof window !== "undefined") {
      localStorage.setItem("has_seen_intro", "true");
    }
    // Navigate to /home
    window.location.href = "/home";
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Intro content */}
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            一刻就好。
          </p>
        </div>
        
        {/* Full empty line (paragraph spacing) */}
        <div className="h-6" />
        
        <div className="space-y-2">
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            你可以靜靜喺度
          </p>
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            你唔需要做任何事
          </p>
          <p className="text-xl md:text-2xl text-stone-700 text-heading-tone">
            你可以慢慢嚟
          </p>
        </div>

        {/* Continue button */}
        <div className="mt-12">
          <button
            onClick={handleContinue}
            className="text-sm text-stone-500 hover:text-stone-700 touch-manipulation"
          >
            繼續
          </button>
        </div>
      </div>
    </div>
  );
}

