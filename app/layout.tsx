/**
 * START_MODULE_root.layout
 *
 * MODULE_CONTRACT:
 * PURPOSE: Root layout для Next.js приложения Catan
 * SCOPE: Базовая структура HTML, подключение стилей, metadata
 * KEYWORDS: Next.js, layout, metadata
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catan Game",
  description: "Settlers of Catan board game - play against AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

/**
 * END_MODULE_root.layout
 */
