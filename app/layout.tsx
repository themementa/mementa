import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./providers/language-provider";

export const metadata: Metadata = {
  title: "Mementa",
  description: "Collect and refine quotes."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-neutral-900">
        <LanguageProvider>
          <div className="mx-auto min-h-screen max-w-md px-4 py-4 md:py-6">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
