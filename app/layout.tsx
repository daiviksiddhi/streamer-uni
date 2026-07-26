/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streamer University Live",
  description: "A campus live directory for Streamer University staff, alumni, and students.",
  icons: {
    icon: "/su-crest-2026-transparent.png",
    shortcut: "/su-crest-2026-transparent.png",
    apple: "/su-crest-2026-transparent.png"
  },
  openGraph: {
    title: "Streamer University Live",
    description: "A campus live directory for Streamer University staff, alumni, and students.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
