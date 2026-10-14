import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/studio/Hero";
import { BrowserMock } from "@/components/studio/Illustrations";
import Kinetic from "@/components/studio/Kinetic";
import KindsShowcase from "@/components/studio/KindsShowcase";
import JsonLd from "@/components/studio/JsonLd";
import Packages from "@/components/studio/Packages";
import Reveal from "@/components/studio/Reveal";
import Team from "@/components/studio/Team";
import Transformation from "@/components/studio/Transformation";
import StoryPage from "@/components/studio/StoryPage";
import SuccessBand from "@/components/studio/SuccessBand";
import { contactEmail, getFaqs, isLaunchActive, launchNote, ogImages, posters, siteUrl, steps, whatsappLink, whatsappNumber } from "@/lib/studio";
import "@/components/studio/home.css";

const title = "Marka Hikâyesi ve Kurumsal Metin Yazarlığı | ANLATI";
const description =
  "İşletmeler, kurucular ve kurumlar için marka hikâyeleri, Hakkımızda ve kurumsal tanıtım metinleri ile web sitesi metinleri hazırlıyoruz. Açık kapsam, süre ve revizyonlarla.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", url: siteUrl, locale: "tr_TR", siteName: "ANLATI", images: ogImages },
  twitter: { card: "summary_large_image", title, description, images: ogImages },
};

export const revalidate = 3600;

export default function Home() {
  const faqs = getFaqs();
  const priceNote = isLaunchActive() ? launchNote : "Güncel fiyatlar için teklif alın.";
  return (
    <main className="st-main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "ANLATI", inLanguage: "tr-TR" },
            {
              "@type": "Organization",
              "@id": `${siteUrl}/#org`,
              name: "ANLATI",
              url: siteUrl,
              logo: `${siteUrl}/og/anlati-logo.png`,
              parentOrganization: { "@type": "Organization", name: "MK Digital Systems" },
              email: contactEmail,
              telephone: `+${whatsappNumber}`,
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      <Hero />
      <StoryPage />

      <section className="hm-sec" aria-labelledby="cozumler">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">ÜÇ TÜR ANLATI</p>
          <Kinetic as="h2" id="cozumler" text="Her anlatının ^kendi sahnesi^ var." from="right" by="word" />
        </Reveal>
        <Reveal>
          <KindsShowcase />
        </Reveal>
        <p className="hm-more">
          <Link href="/hizmetler/marka-anlatisi">Marka hikâyesi yazımı →</Link>
          {"  ·  "}
          <Link href="/hizmetler/hakkimizda-ve-kurumsal-tanitim-metinleri">Hakkımızda ve kurumsal tanıtım metinleri →</Link>
          {"  ·  "}
          <Link href="/hizmetler/web-sitesi-metinleri">Web sitesi metinleri →</Link>
        </p>
      </section>

      <section className="hm-sec hm-paper" id="ornekler" aria-labelledby="ornek-baslik">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">ÖNCE VE SONRA</p>
          <Kinetic as="h2" id="ornek-baslik" text="Aynı iş. *Farklı bir cümle.*" from="alt" by="word" />
          <Kinetic as="p" className="hm-sub" text="Aşağı kaydırın ve aynı işin ~iki farklı anlatılışını~ görün." from="right" />
        </Reveal>
        <Transformation />
      </section>

      <section className="hm-sec" id="surec" aria-labelledby="surec-baslik">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">SÜREÇ</p>
          <Kinetic as="h2" id="surec-baslik" text="Dört adımda, =sizinle= birlikte." from="right" by="letter" />
        </Reveal>
        <div className="pr">
          {steps.map((st, i) => (
            <Reveal key={st.title} className={`pr-row pr-${i % 2 ? "even" : "odd"}`} from={i % 2 ? "right" : "left"}>
              <span className={`pr-word pr-w${i}`}>{posters[i]}</span>
              <p>
                <b>{st.title}</b>
                {st.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <Team />

      <SuccessBand />

      <section className="hm-sec hm-paper" id="paketler" aria-labelledby="paket-baslik">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">PAKETLER</p>
          <Kinetic as="h2" id="paket-baslik" text="^Net kapsam,^ _açık fiyat._" from="alt" by="word" />
          <Kinetic as="p" className="hm-sub" text={`Süre, revizyon ve ~kapsam dışı işler~ baştan yazılıdır. ${priceNote}`} from="right" />
        </Reveal>
        <Reveal>
          <Packages />
        </Reveal>
      </section>

      <section className="hm-dark" aria-labelledby="mkds">
        <div className="hm-dark-inner">
          <Reveal className="hm-dark-copy">
            <p className="hm-eyebrow hm-eyebrow-light">ANLATIDAN EKRANA</p>
            <Kinetic as="h2" id="mkds" text="Yazılan anlatı, *çalışan bir siteye* dönüşsün." from="right" by="word" />
            <Kinetic as="p" text="Anlatıyı yazdıktan sonra aynı ekiple web sitenizi veya dijital ürününüzü MK Digital Systems olarak tasarlayıp geliştiriyoruz. Mesaj ile ekran arasında ~kayıp olmaz.~" from="right" />
            <Link href="/iletisim?paket=dijital" className="st-btn hm-btn-light">
              Dijital deneyim için görüşelim
            </Link>
          </Reveal>
          <Reveal className="hm-dark-art" delay={0.15}>
            <BrowserMock />
          </Reveal>
        </div>
      </section>

      <section className="hm-sec" aria-labelledby="sss">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">SIK SORULANLAR</p>
          <Kinetic as="h2" id="sss" text="Aklınıza takılanlar, =açık cevaplarla.=" from="alt" by="word" />
        </Reveal>
        <Reveal className="hm-faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </Reveal>
      </section>

      <section className="hm-final">
        <Reveal className="hm-final-inner">
          <Kinetic as="h2" text="İşinizi _tek cümlede_ anlatabiliyor musunuz?" from="right" />
          <Kinetic as="p" text="Net bir anlatı, ~başarının ilk adımı.~ Kısa bir formla başlayın." from="right" />
          <div className="hm-final-actions">
            <Link href="/iletisim" className="hm-bag hm-bag-light">
              <span>Teklif iste</span>
              <i aria-hidden="true">→</i>
            </Link>
            <a href={whatsappLink()} className="hm-bag hm-bag-line" target="_blank" rel="noopener noreferrer">
              <span>WhatsApp’tan yazın</span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
          <p className="hm-hand">hazır metin gerekmez, bir görüşmeyle başlarız</p>
        </Reveal>
      </section>
    </main>
  );
}
