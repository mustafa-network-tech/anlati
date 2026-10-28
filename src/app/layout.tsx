import type { Metadata } from "next";
import { Anton, Caveat, Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import StudioHeader from "@/components/studio/StudioHeader";
import StudioFooter from "@/components/studio/StudioFooter";
import RepublicWelcome from "@/components/studio/RepublicWelcome";
import { ogImages, siteUrl } from "@/lib/studio";
import "./globals.css";
import "./studio.css";

const serif = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-serif", display: "swap", axes: ["opsz"] });
const poster = Anton({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-poster", display: "swap" });
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin", "latin-ext"], variable: "--font-mono", display: "swap" });
const hand = Caveat({ subsets: ["latin", "latin-ext"], variable: "--font-hand", display: "swap" });
const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: { type: "website", locale: "tr_TR", siteName: "ANLATI", images: ogImages },
  twitter: { card: "summary_large_image", images: ogImages },
  title: {
    default: "ANLATI — İşinizi anlatıya, anlatınızı büyümeye dönüştürün",
    template: "%s | ANLATI",
  },
  description:
    "Marka, kurucu ve kurum anlatısı hazırlayan anlatı stüdyosu. Ne yaptığınızı anlaşılır, hatırlanır ve güvenilir bir hikâyeye dönüştürüyoruz.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${serif.variable} ${sans.variable} ${poster.variable} ${mono.variable} ${hand.variable}`}>
      <body>
        <noscript>
          <style>{`.kn-armed .kw-w,.kn-armed .kl{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <StudioHeader />
        {children}
        <StudioFooter />
        <RepublicWelcome />
      </body>
    </html>
  );
}
