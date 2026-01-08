import { requireUser } from "@/lib/auth";
import { SettingsPageClient } from "@/components/settings/settings-page-client";

export default async function SettingsPage() {
  // Middleware handles auth redirects, but we need user data
  const user = await requireUser();
  if (!user) {
    // This should never happen due to middleware, but TypeScript requires the check
    throw new Error("Unauthorized");
  }

  return (
    <SettingsPageClient
      user={{
        id: user.id,
        email: user.email || "",
        displayName: (user.user_metadata?.display_name as string) || "",
        settings: {
          dailyQuoteReminder: user.user_metadata?.settings?.dailyQuoteReminder ?? false,
          gentleCheckIn: user.user_metadata?.settings?.gentleCheckIn ?? false,
          notificationTime: user.user_metadata?.settings?.notificationTime || "09:00",
          editAllowedAfterSave: user.user_metadata?.settings?.editAllowedAfterSave ?? true,
        },
      }}
    />
  );
}
