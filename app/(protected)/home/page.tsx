// ⚠️ IMPORTANT
// This is a public intro page.
// Do NOT add auth checks or redirects here.
// "/" must never be used as a functional entry point.
// Middleware handles all authentication routing.

import { FirstOpenExperience } from "@/components/landing/first-open-experience";

export default function Page() {
  return (
    <div className="min-h-screen">
      <FirstOpenExperience />
    </div>
  );
}
