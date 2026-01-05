"use client";

import { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-stone-800 mb-4">{title}</h2>
      <div className="bg-white/60 rounded-2xl shadow-sm p-4 space-y-1">
        {children}
      </div>
    </div>
  );
}

