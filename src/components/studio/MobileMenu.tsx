"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links: [string, string][] = [
  ["/hizmetler", "Hizmetler"],
  ["/#surec", "Süreç"],
  ["/#paketler", "Paketler"],
  ["/iletisim", "İletişim"],
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="st-menu">
      <button
        ref={btn}
        type="button"
        className="st-menu-btn"
        aria-expanded={open}
        aria-controls="st-menu-panel"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className={open ? "bars open" : "bars"}>
          <i />
          <i />
          <i />
        </span>
      </button>
      {open && (
        <nav id="st-menu-panel" className="st-menu-panel" aria-label="Mobil menü">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/iletisim" className="st-btn" onClick={() => setOpen(false)}>
            Teklif iste
          </Link>
        </nav>
      )}
    </div>
  );
}
