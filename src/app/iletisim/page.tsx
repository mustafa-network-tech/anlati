import type { Metadata } from "next";
import QuoteForm from "@/components/studio/QuoteForm";
import { contactEmail, ogImages, packages, siteUrl, whatsappDisplay, whatsappLink } from "@/lib/studio";

export const metadata: Metadata = {
  title: "İletişim ve Teklif",
  description: "Marka, kurucu veya kurum anlatısı için kısa bir form doldurun, size dönüş yapalım.",
  alternates: { canonical: "/iletisim" },
  openGraph: { title: "İletişim ve Teklif | ANLATI", type: "website", url: `${siteUrl}/iletisim`, locale: "tr_TR", siteName: "ANLATI", images: ogImages },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ paket?: string }> }) {
  const { paket } = await searchParams;
  const selected = packages.find((p) => p.id === paket);

  return (
    <main className="st-main">
      <section className="st-hero st-hero-small">
        <p className="st-eyebrow">İLETİŞİM</p>
        <h1>Anlatınızı birlikte netleştirelim</h1>
        <p className="st-lede">
          Kısa formu doldurun; ihtiyacınızı okuyup size e-posta ile dönüş yapalım.
          {selected && <> Seçtiğiniz paket: <b>{selected.name}</b>.</>}
        </p>
      </section>
      <section className="st-section st-form-wrap">
        <QuoteForm defaultPackage={selected?.id ?? ""} />
        <p className="st-more">
          Ya da doğrudan yazın:{" "}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            WhatsApp {whatsappDisplay}
          </a>{" "}
          ·{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </section>
    </main>
  );
}
