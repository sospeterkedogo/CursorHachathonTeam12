import "./globals.css";
import type { ReactNode } from "react";
import { Inter, Cormorant_Garamond, Space_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { PWAInstallPrompt } from "@/components/eco-verify/PWAInstallPrompt";
import { ScrollToTop } from "@/components/eco-verify/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const luxurySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: 'swap',
});

const luxuryMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: 'swap',
});

export const metadata = {
  title: "EcoVerify | Imperial Series",
  description: "The world's first AI-Verified ledger for personal impact."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${luxurySerif.variable} ${luxuryMono.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200`}>
        <Providers>
          {children}
          <PWAInstallPrompt />
          <ScrollToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
