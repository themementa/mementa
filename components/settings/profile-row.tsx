"use client";

import { useState } from "react";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation } from "@/lib/i18n";

type ProfileRowProps = {
  label: string;
  value: string;
  editable?: boolean;
  onSave?: (value: string) => Promise<void>;
  type?: "text" | "email";
};

export function ProfileRow({
  label,
  value: initialValue,
  editable = false,
  onSave,
  type = "text",
}: ProfileRowProps) {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave || value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (!editable) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-base text-stone-700 font-medium">{label}</p>
        <p className="text-sm text-stone-500">{value}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-base text-stone-700 font-medium">{label}</p>
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 text-sm text-stone-700 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
          disabled={isSaving}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="text-sm text-stone-600 hover:text-stone-800 px-3 py-1.5 bg-stone-100 rounded touch-manipulation disabled:opacity-50"
          >
            {getTranslation(language, "cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || value === initialValue}
            className="text-sm text-white hover:bg-stone-600 px-3 py-1.5 bg-stone-500 rounded touch-manipulation disabled:opacity-50"
          >
            {isSaving ? getTranslation(language, "processing") : getTranslation(language, "save")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-base text-stone-700 font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-stone-500">{value}</p>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-stone-500 hover:text-stone-700 px-2 py-1 rounded touch-manipulation"
        >
          {getTranslation(language, "edit")}
        </button>
      </div>
    </div>
  );
}

