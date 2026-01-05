import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FirstOpenExperience } from "@/components/landing/first-open-experience";

export default async function RootPage() {
  const user = await getCurrentUser();

  // If user is logged in, redirect to protected home
  if (user) {
    redirect("/");
  }

  // Show first-open experience for non-logged-in users
  // The component itself will check if it's been seen before
  return (
    <div className="min-h-screen">
      <FirstOpenExperience />
    </div>
  );
}

