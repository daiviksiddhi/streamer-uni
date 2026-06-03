import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streamer University Loading Scenes",
  description: "Premium Streamer University admissions loading screen concepts.",
  openGraph: {
    title: "Streamer University Loading Scenes",
    description: "Premium Streamer University admissions loading screen concepts.",
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
      <body>{children}</body>
    </html>
  );
}
