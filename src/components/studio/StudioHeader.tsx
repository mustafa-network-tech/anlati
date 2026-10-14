import Link from "next/link";

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
        <Link href="/" className="wordmark">
          ANLATI<span>.</span>
        </Link>
        <nav className="st-nav" aria-label="Ana menü">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/iletisim" className="st-btn st-btn-sm">
          Teklif iste
        </Link>
      </div>
    </header>
  );
}
