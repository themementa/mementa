import { requireUser } from "@/lib/auth";
import { SettingsPageClient } from "@/components/settings/settings-page-client";

export default async function SettingsPage() {
  const user = await requireUser();

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
