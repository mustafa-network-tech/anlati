import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

const links: [string, string][] = [
  ["/hizmetler", "Hizmetler"],
  ["/#surec", "Süreç"],
  ["/#paketler", "Paketler"],
  ["/iletisim", "İletişim"],
];

export default function StudioHeader() {
  return (
    <header className="st-header">
      <div className="st-header-inner">
        <Logo />
        <nav className="st-nav" aria-label="Ana menü">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/iletisim" className="st-btn st-btn-sm st-head-cta">
          Teklif iste
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
