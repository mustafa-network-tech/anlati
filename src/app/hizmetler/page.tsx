import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/studio/JsonLd";
import Reveal from "@/components/studio/Reveal";
import { services } from "@/lib/services";
import { ogImages, siteUrl } from "@/lib/studio";
import "@/components/studio/home.css";
import "@/components/studio/service.css";

const description =
  "Marka hikâyesi yazımı, Hakkımızda ve kurumsal tanıtım metinleri ile web sitesi metin yazarlığı: işletmeler, kurucular ve kurumlar için net kapsamlı hizmetler.";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Marka Hikâyesi ve Kurumsal Metin Hizmetleri",
  description,
  alternates: { canonical: "/hizmetler" },
  openGraph: { title: "Hizmetler | ANLATI", description, type: "website", url: `${siteUrl}/hizmetler`, locale: "tr_TR", siteName: "ANLATI", images: ogImages },
};

export default function ServicesIndex() {
  return (
    <main className="st-main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana sayfa", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${siteUrl}/hizmetler` },
          ],
        }}
      />
      <section className="sv-hero">
        <p className="hm-eyebrow">HİZMETLER</p>
        <h1>Marka hikâyesi ve kurumsal metin hizmetleri</h1>
        <p className="sv-lede">
          İşletmeler, kurucular ve kurumlar için marka hikâyeleri ve web sitesi metinleri hazırlıyoruz. İhtiyacınıza en yakın
          hizmetle başlayın.
        </p>
      </section>

      <section className="hm-sec">
        <div className="sv-index">
          {services.map((s, i) => (
            <Reveal key={s.slug} className="sv-card" from={i % 2 ? "right" : "left"}>
              <h2>
                <Link href={`/hizmetler/${s.slug}`}>{s.h1}</Link>
              </h2>
              <p>{s.lede}</p>
              <Link href={`/hizmetler/${s.slug}`} className="sv-link">
                Hizmeti incele →
              </Link>
            </Reveal>
          ))}
          <Reveal className="sv-card sv-card-dark" from="left">
            <h2>Anlatı + Dijital Deneyim</h2>
            <p>Anlatıyı MK Digital Systems ile çalışan bir web sitesine veya dijital ürüne dönüştürüyoruz.</p>
            <Link href="/iletisim?paket=dijital" className="sv-link">
              Görüşelim →
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
