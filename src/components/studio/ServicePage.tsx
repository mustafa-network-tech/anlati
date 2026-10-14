import Link from "next/link";
import JsonLd from "./JsonLd";
import Packages from "./Packages";
import Reveal from "./Reveal";
import SuccessBand from "./SuccessBand";
import { steps, siteUrl, whatsappLink } from "@/lib/studio";
import { services, type Service } from "@/lib/services";
import "./home.css";
import "./service.css";

export default function ServicePage({ s }: { s: Service }) {
  const url = `${siteUrl}/hizmetler/${s.slug}`;
  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <main className="st-main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: s.h1,
              description: s.description,
              url,
              serviceType: s.metaTitle,
              provider: { "@type": "Organization", name: "ANLATI", url: siteUrl },
              areaServed: { "@type": "Country", name: "Türkiye" },
              inLanguage: "tr-TR",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana sayfa", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${siteUrl}/hizmetler` },
                { "@type": "ListItem", position: 3, name: s.h1, item: url },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: s.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      <section className="sv-hero">
        <nav className="sv-crumbs" aria-label="Sayfa yolu">
          <Link href="/">Ana sayfa</Link> / <Link href="/hizmetler">Hizmetler</Link> / <span>{s.h1}</span>
        </nav>
        <p className="hm-eyebrow">HİZMETLER</p>
        <h1>{s.h1}</h1>
        <p className="sv-lede">{s.lede}</p>
        <div className="sv-actions">
          <Link href={`/iletisim?paket=${s.pkg}`} className="hm-bag hm-bag-dark">
            <span>Teklif iste</span>
            <i aria-hidden="true">→</i>
          </Link>
          <a href={whatsappLink()} className="hm-bag hm-bag-ghost" target="_blank" rel="noopener noreferrer">
            <span>WhatsApp’tan yazın</span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
      </section>

      <section className="hm-sec sv-cols">
        <Reveal from="left">
          <h2>Kimlere yardımcı oluyoruz?</h2>
          <ul className="sv-list">
            {s.audience.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal from="right">
          <h2>Ne teslim ediyoruz?</h2>
          <ul className="sv-list">
            {s.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="hm-sec hm-paper" aria-labelledby="sv-ornek">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">ÖNCE VE SONRA</p>
          <h2 id="sv-ornek">Aynı iş, farklı bir cümle.</h2>
        </Reveal>
        <Reveal className="sv-example">
          <span className="sv-badge">{s.example.context}</span>
          <div className="sv-ex-grid">
            <div className="sv-before">
              <b>Önce</b>
              <p>{s.example.before}</p>
            </div>
            <div className="sv-after">
              <b>Sonra</b>
              <p>{s.example.after}</p>
            </div>
          </div>
          <p className="sv-note">{s.example.note}</p>
        </Reveal>
      </section>

      <section className="hm-sec" aria-labelledby="sv-surec">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">SÜREÇ</p>
          <h2 id="sv-surec">Görüşme, yazım ve revizyon.</h2>
        </Reveal>
        <ol className="sv-steps">
          {steps.map((st) => (
            <li key={st.title}>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <SuccessBand />

      <section className="hm-sec hm-paper" aria-labelledby="sv-paket">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">KAPSAM, SÜRE, FİYAT</p>
          <h2 id="sv-paket">Paketler</h2>
        </Reveal>
        <Packages />
      </section>

      <section className="hm-sec" aria-labelledby="sv-sss">
        <Reveal className="hm-head" from="left">
          <p className="hm-eyebrow">SIK SORULANLAR</p>
          <h2 id="sv-sss">Karar vermeden önce</h2>
        </Reveal>
        <div className="hm-faq">
          {s.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="hm-final">
        <Reveal className="hm-final-inner">
          <h2>{s.ctaTitle}</h2>
          <p>Kısa bir formla başlayın; hazır metin gerekmez.</p>
          <div className="hm-final-actions">
            <Link href={`/iletisim?paket=${s.pkg}`} className="hm-bag hm-bag-light">
              <span>Teklif iste</span>
              <i aria-hidden="true">→</i>
            </Link>
            <a href={whatsappLink()} className="hm-bag hm-bag-line" target="_blank" rel="noopener noreferrer">
              <span>WhatsApp’tan yazın</span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
        </Reveal>
      </section>

      <section className="sv-more" aria-label="Diğer hizmetler">
        <h2>Diğer hizmetler</h2>
        <ul>
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/hizmetler/${o.slug}`}>{o.nav} →</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
