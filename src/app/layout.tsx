import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Eco-Verify",
  description: "Gamify sustainability with AI-powered eco action verification."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-black text-emerald-50 antialiased">
        {children}
      </body>
    </html>
  );
}

