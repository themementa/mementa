"use server";

import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const displayName = String(formData.get("displayName") || "").trim();

  if (!displayName) {
    return { error: "Display name is required" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function changePassword(formData: FormData) {
  const user = await requireUser();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const supabase = createSupabaseServerClient();

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: "Current password is incorrect" };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}

export async function updateUserSettings(settings: {
  dailyQuoteReminder?: boolean;
  gentleCheckIn?: boolean;
  notificationTime?: string;
  editAllowedAfterSave?: boolean;
}) {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      settings: {
        ...(user.user_metadata?.settings || {}),
        ...settings,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

