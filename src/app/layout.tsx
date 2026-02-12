import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata = {
  title: "Eco-Verify",
  description: "Gamify sustainability with AI-powered eco action verification."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

