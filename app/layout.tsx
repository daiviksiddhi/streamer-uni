import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streamer University Live",
  description: "A campus live directory for Streamer University staff and students.",
  openGraph: {
    title: "Streamer University Live",
    description: "A campus live directory for Streamer University staff and students.",
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
