import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streamer University Radar",
  description: "A Streamer University admissions radar intro.",
  openGraph: {
    title: "Streamer University Radar",
    description: "A Streamer University admissions radar intro.",
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
