'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  );
}
