"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";
// signOut is handled via Route Handler
import { updateProfile, changePassword, updateUserSettings } from "@/actions/settings-actions";
import { SettingsSection } from "./settings-section";
import { SettingsItem } from "./settings-item";
import { ProfileRow } from "./profile-row";
import { ToggleRow } from "./toggle-row";
import { InfoRow } from "./info-row";
import { TimePicker } from "./time-picker";
import { LanguageSwitcher } from "@/components/language-switcher";

type UserSettings = {
  dailyQuoteReminder: boolean;
  gentleCheckIn: boolean;
  notificationTime: string;
  editAllowedAfterSave: boolean;
};

type User = {
  id: string;
  email: string;
  displayName: string;
  settings: UserSettings;
};

type SettingsPageClientProps = {
  user: User;
};

export function SettingsPageClient({ user: initialUser }: SettingsPageClientProps) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateProfile = async (displayName: string) => {
    const formData = new FormData();
    formData.append("displayName", displayName);
    const result = await updateProfile(formData);
    if (result.success) {
      setUser({ ...user, displayName });
      router.refresh();
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    const formData = new FormData();
    formData.append("currentPassword", passwordData.currentPassword);
    formData.append("newPassword", passwordData.newPassword);
    formData.append("confirmPassword", passwordData.confirmPassword);

    const result = await changePassword(formData);
    if (result.error) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const handleToggleSetting = async (
    key: keyof UserSettings,
    value: boolean
  ) => {
    const result = await updateUserSettings({ [key]: value });
    if (result.success) {
      setUser({
        ...user,
        settings: { ...user.settings, [key]: value },
      });
      router.refresh();
    }
  };

  const handleNotificationTimeChange = async (time: string) => {
    const result = await updateUserSettings({ notificationTime: time });
    if (result.success) {
      setUser({
        ...user,
        settings: { ...user.settings, notificationTime: time },
      });
      router.refresh();
    }
  };

  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{
        background: "linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-stone-800 text-center mb-8">
          {getTranslation(language, "settings")}
        </h1>

        {/* Account Section */}
        <SettingsSection title={getTranslation(language, "account")}>
          <SettingsItem>
            <ProfileRow
              label={getTranslation(language, "displayName")}
              value={user.displayName}
              editable={true}
              onSave={handleUpdateProfile}
            />
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <ProfileRow
              label={getTranslation(language, "email")}
              value={user.email}
              editable={false}
              type="email"
            />
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-base text-stone-700 font-medium">
                  {getTranslation(language, "changePassword")}
                </p>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="text-xs text-stone-500 hover:text-stone-700 px-2 py-1 rounded touch-manipulation"
                >
                  {showChangePassword
                    ? getTranslation(language, "cancel")
                    : getTranslation(language, "edit")}
                </button>
              </div>
              {showChangePassword && (
                <div className="space-y-3 pt-2">
                  {/* 目前密碼 */}
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder={getTranslation(language, "currentPassword")}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 text-sm text-stone-700 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 touch-manipulation"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <Image
                          src="/icons/eye-closed.svg"
                          alt="Hide password"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      ) : (
                        <Image
                          src="/icons/eye-open.svg"
                          alt="Show password"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      )}
                    </button>
                  </div>
                  
                  {/* 新密碼 */}
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder={getTranslation(language, "newPassword")}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 text-sm text-stone-700 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 touch-manipulation"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <Image
                          src="/icons/eye-closed.svg"
                          alt="Hide password"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      ) : (
                        <Image
                          src="/icons/eye-open.svg"
                          alt="Show password"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      )}
                    </button>
                  </div>
                  
                  {/* 確認新密碼 */}
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={getTranslation(language, "confirmPassword")}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 text-sm text-stone-700 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 touch-manipulation"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <Image
                          src="/icons/eye-closed.svg"
                          alt="Hide password"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      ) : (
                        <Image
                          src="/icons/eye-open.svg"
                          alt="Show password"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-sm text-green-600">
                      {getTranslation(language, "passwordChanged")}
                    </p>
                  )}
                  <button
                    onClick={handleChangePassword}
                    className="w-full text-sm text-white hover:bg-stone-600 px-4 py-2 bg-stone-500 rounded touch-manipulation"
                  >
                    {getTranslation(language, "confirm")}
                  </button>
                </div>
              )}
            </div>
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch("/api/auth/logout", { method: "POST" });
                  if (res.ok) {
                    window.location.href = "/login";
                  }
                } catch (error) {
                  console.error("Logout error:", error);
                }
              }}
              className="w-full text-sm text-red-600 hover:text-red-700 px-4 py-2 text-left touch-manipulation"
            >
              {getTranslation(language, "logout")}
            </button>
          </SettingsItem>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title={getTranslation(language, "notifications")}>
          <SettingsItem>
            <ToggleRow
              label={getTranslation(language, "dailyQuoteReminder")}
              checked={user.settings.dailyQuoteReminder}
              onChange={(checked) =>
                handleToggleSetting("dailyQuoteReminder", checked)
              }
            />
          </SettingsItem>
          {user.settings.dailyQuoteReminder && (
            <SettingsItem className="border-t border-stone-200">
              <div className="flex items-center justify-between">
                <p className="text-base text-stone-700 font-medium">
                  {getTranslation(language, "notificationTime")}
                </p>
                <TimePicker
                  value={user.settings.notificationTime}
                  onChange={handleNotificationTimeChange}
                />
              </div>
            </SettingsItem>
          )}
          <SettingsItem className="border-t border-stone-200">
            <ToggleRow
              label={getTranslation(language, "gentleCheckIn")}
              checked={user.settings.gentleCheckIn}
              onChange={(checked) =>
                handleToggleSetting("gentleCheckIn", checked)
              }
            />
          </SettingsItem>
        </SettingsSection>

        {/* Moments Section */}
        <SettingsSection title={getTranslation(language, "moments")}>
          <SettingsItem>
            <InfoRow
              label={getTranslation(language, "autoSaveEnabled")}
              value=""
            />
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <InfoRow
              label={getTranslation(language, "oneMomentPerDay")}
              value=""
            />
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <ToggleRow
              label={getTranslation(language, "editAllowedAfterSave")}
              checked={user.settings.editAllowedAfterSave}
              onChange={(checked) =>
                handleToggleSetting("editAllowedAfterSave", checked)
              }
            />
          </SettingsItem>
        </SettingsSection>

        {/* Language Section */}
        <SettingsSection title={getTranslation(language, "language")}>
          <SettingsItem>
            <div className="flex items-center justify-between">
              <p className="text-base text-stone-700 font-medium">
                {getTranslation(language, "language")}
              </p>
              <LanguageSwitcher
                language={language ?? "zh-tw"}
                onLanguageChange={setLanguage}
              />
            </div>
          </SettingsItem>
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title={getTranslation(language, "about")}>
          <SettingsItem>
            <button className="w-full text-left text-sm text-stone-600 hover:text-stone-800 py-2 touch-manipulation">
              {getTranslation(language, "termsOfService")}
            </button>
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <button className="w-full text-left text-sm text-stone-600 hover:text-stone-800 py-2 touch-manipulation">
              {getTranslation(language, "privacyPolicy")}
            </button>
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <button className="w-full text-left text-sm text-stone-600 hover:text-stone-800 py-2 touch-manipulation">
              {getTranslation(language, "contact")}
            </button>
          </SettingsItem>
          <SettingsItem className="border-t border-stone-200">
            <button className="w-full text-left text-sm text-stone-600 hover:text-stone-800 py-2 touch-manipulation">
              {getTranslation(language, "feedback")}
            </button>
          </SettingsItem>
        </SettingsSection>
      </div>
    </div>
  );
}

