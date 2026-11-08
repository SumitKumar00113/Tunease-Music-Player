import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Big_Shoulders, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const fontDisplay = Big_Shoulders({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-big-shoulders",
  display: "swap",
  adjustFontFallback: false,
});

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tunease — Your music, your mood",
  description: "Listen and discover music on Tunease.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="h-dvh overflow-hidden bg-bg font-sans text-text selection:bg-lime selection:text-bg">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
