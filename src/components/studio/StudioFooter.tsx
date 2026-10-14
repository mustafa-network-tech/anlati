import Link from "next/link";
import { services } from "@/lib/services";
import { contactEmail, whatsappDisplay, whatsappLink } from "@/lib/studio";

export default function StudioFooter() {
  return (
    <footer className="st-footer">
      <div className="st-footer-main">
        <div>
          <Link href="/" className="wordmark">
            ANLATI<span>.</span>
          </Link>
          <p>İşinizi anlatıya, anlatınızı büyümeye dönüştürün.</p>
        </div>
        <nav aria-label="Alt menü">
          {services.map((sv) => (
            <Link key={sv.slug} href={`/hizmetler/${sv.slug}`}>
              {sv.nav}
            </Link>
          ))}
          <Link href="/#paketler">Paketler</Link>
          <Link href="/iletisim">İletişim</Link>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <a href={whatsappLink()} rel="noopener noreferrer" target="_blank">
            WhatsApp {whatsappDisplay}
          </a>
        </nav>
      </div>
      <div className="st-footer-bottom">
        <span>© {new Date().getFullYear()} ANLATI</span>
        <span>Powered by MK DIGITAL SYSTEMS</span>
      </div>
    </footer>
  );
}
