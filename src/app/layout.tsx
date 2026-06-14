import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANLATI — Kadınlar İçin",
  description:
    "Kadınların hikayelerini, itiraflarını ve iç seslerini anonim ya da isimleriyle paylaşabildiği duygusal bir topluluk platformu.",
  keywords: ["kadın", "hikaye", "itiraf", "topluluk", "anlati"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950">{children}</body>
    </html>
  );
}
