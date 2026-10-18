import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Tunease — Your music, your mood",
  description: "Listen and discover music on Tunease.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-dvh overflow-hidden bg-bg text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
