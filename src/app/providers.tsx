"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { CartHydration } from "@/components/cart-hydration";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { ThemeProvider } from "@/lib/theme/theme-context";
import type { Locale } from "@/lib/i18n/config";
import type { Theme } from "@/lib/theme/config";

export function Providers({
  children,
  initialLocale,
  initialTheme,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTheme: Theme;
}) {
  return (
    <SessionProvider>
      <ThemeProvider initialTheme={initialTheme}>
      <LocaleProvider initialLocale={initialLocale}>
        <CartHydration />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1c1917",
              color: "#fff7ed",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
