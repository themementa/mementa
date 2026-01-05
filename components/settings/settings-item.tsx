"use client";

import { ReactNode } from "react";

type SettingsItemProps = {
  children: ReactNode;
  className?: string;
};

export function SettingsItem({ children, className = "" }: SettingsItemProps) {
  return (
    <div className={`py-3 ${className}`}>
      {children}
    </div>
  );
}

