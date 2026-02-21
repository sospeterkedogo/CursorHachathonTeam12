import "./globals.css";
import type { ReactNode } from "react";
import { Inter, Cormorant_Garamond, Space_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

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
  title: "Eco-Verify | Luxury Waste Auditing",
  description: "Experience the high-end of sustainability with AI-powered verification."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${luxurySerif.variable} ${luxuryMono.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

