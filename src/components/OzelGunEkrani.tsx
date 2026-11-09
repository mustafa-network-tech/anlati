"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { OZEL_GUNLER } from "@/lib/ozel-gunler";
import { aralikta, gordumAnahtari, saatliGosterimBitisi, type OzelGun } from "@/lib/ozel-gunler/schedule";
import "./ozel-gun-ekrani.css";

type Gosterim = {
  gun: OzelGun;
  /** "ilk": siteye ilk giriş (kapatılabilir). "saatli": belirli saatte herkese, kapatılamaz. */
  tur: "ilk" | "saatli";
  /** Bitiş anı (ms, epoch). */
  bitis: number;
  /** Toplam süre (ms) ve gösterim başladığında ne kadarının geçmiş olduğu (geç girenler için). */
  toplam: number;
  gecen: number;
};

const KAPANIS_MS = 600;

function goruldu(anahtar: string): boolean {
  try {
    return window.localStorage.getItem(anahtar) === "1";
  } catch {
    return false;
  }
}

function gorulduYaz(anahtar: string) {
  try {
    window.localStorage.setItem(anahtar, "1");
  } catch {
    /* localStorage kapalı olabilir; ekran yine çalışır. */
  }
}

export default function OzelGunEkrani() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  const [gosterim, setGosterim] = useState<Gosterim | null>(null);
  const [kapaniyor, setKapaniyor] = useState(false);
  const [kalan, setKalan] = useState(0);
  const gosterimRef = useRef<Gosterim | null>(null);
  const ilkKontrolRef = useRef(false);
  const kapaniyorRef = useRef(false);
  const kapatTimerRef = useRef<number | null>(null);
  const kapatBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gosterimRef.current = gosterim;
  }, [gosterim]);

  useEffect(() => {
    if (isAdmin) return;

    const params = new URLSearchParams(window.location.search);
    // Önizleme: ?ozel-gun=10-kasim&tur=ilk|saatli (localStorage'a yazmaz).
    const onizlemeId = params.get("ozel-gun");
    const onizlemeTur = params.get("tur") === "saatli" ? "saatli" : "ilk";
    const onizlemeGun = onizlemeId ? OZEL_GUNLER.find((g) => g.id === onizlemeId) : undefined;
    let onizlemeBasladi = false;

    const bitir = () => {
      const mevcut = gosterimRef.current;
      if (!mevcut || kapaniyorRef.current) return;
      const azaltilmis = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (azaltilmis) {
        setGosterim(null);
        return;
      }
      kapaniyorRef.current = true;
      setKapaniyor(true);
      kapatTimerRef.current = window.setTimeout(() => {
        kapaniyorRef.current = false;
        setKapaniyor(false);
        setGosterim(null);
      }, KAPANIS_MS);
    };

    const kontrol = () => {
      const now = Date.now();
      const mevcut = gosterimRef.current;

      if (onizlemeGun && !onizlemeBasladi) {
        onizlemeBasladi = true;
        const sure = onizlemeTur === "saatli" ? (onizlemeGun.saatliGosterim?.sureMs ?? 60_000) : onizlemeGun.ilkGirisMs;
        setKapaniyor(false);
        setGosterim({ gun: onizlemeGun, tur: onizlemeTur, bitis: now + sure, toplam: sure, gecen: 0 });
        return;
      }

      // Saatli gösterim her zaman önceliklidir; hangi sayfada olursa olsun başlar.
      for (const gun of OZEL_GUNLER) {
        const bitis = saatliGosterimBitisi(gun, now);
        if (bitis !== null) {
          if (kapatTimerRef.current) {
            window.clearTimeout(kapatTimerRef.current);
            kapatTimerRef.current = null;
            kapaniyorRef.current = false;
          }
          if (!mevcut || mevcut.tur !== "saatli" || mevcut.gun.id !== gun.id) {
            setKapaniyor(false);
            const toplam = gun.saatliGosterim?.sureMs ?? 60_000;
            setGosterim({ gun, tur: "saatli", bitis, toplam, gecen: toplam - (bitis - now) });
          }
          return;
        }
      }

      if (mevcut && now >= mevcut.bitis) {
        bitir();
        return;
      }

      // İlk giriş: aralıktaki özel gün için, bu yıl henüz görülmediyse.
      if (!ilkKontrolRef.current && !onizlemeGun) {
        ilkKontrolRef.current = true;
        if (mevcut) return;
        for (const gun of OZEL_GUNLER) {
          if (!aralikta(gun, now)) continue;
          const anahtar = gordumAnahtari(gun, now);
          if (goruldu(anahtar)) break;
          gorulduYaz(anahtar);
          setKapaniyor(false);
          setGosterim({ gun, tur: "ilk", bitis: now + gun.ilkGirisMs, toplam: gun.ilkGirisMs, gecen: 0 });
          break;
        }
      }
    };

    kontrol();
    const id = window.setInterval(kontrol, 500);
    return () => {
      window.clearInterval(id);
      if (kapatTimerRef.current) window.clearTimeout(kapatTimerRef.current);
    };
  }, [isAdmin]);

  // Açıkken: kalan süre, kaydırma kilidi, klavye.
  useEffect(() => {
    if (!gosterim) return;
    const { bitis, tur } = gosterim;

    const html = document.documentElement;
    const oncekiOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    kapatBtnRef.current?.focus({ preventScroll: true });

    const guncelle = () => setKalan(Math.max(0, Math.ceil((bitis - Date.now()) / 1000)));
    guncelle();
    const id = window.setInterval(guncelle, 250);

    const onKeyDown = (e: KeyboardEvent) => {
      if (tur === "ilk" && e.key === "Escape") {
        e.preventDefault();
        setGosterim(null);
        return;
      }
      // Odak ekranın dışına kaçmasın.
      if (e.key === "Tab") {
        e.preventDefault();
        kapatBtnRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = oncekiOverflow;
    };
  }, [gosterim]);

  if (isAdmin || !gosterim) return null;

  const { gun, tur, toplam, gecen } = gosterim;

  return (
    <section
      className={`ozel-gun${kapaniyor ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={gun.ad}
      style={{ ...(gun.arkaplan ? { background: gun.arkaplan } : {}), ["--ozel-gun-sure" as string]: `${toplam}ms`, ["--ozel-gun-gecen" as string]: `-${gecen}ms` }}
    >
      <picture className="ozel-gun__picture">
        <source media="(max-width: 720px), (orientation: portrait)" srcSet={gun.gorsel.mobil} />
        <img src={gun.gorsel.masaustu} alt={gun.gorsel.alt} />
      </picture>

      {tur === "ilk" && (
        <button ref={kapatBtnRef} className="ozel-gun__kapat" type="button" onClick={() => setGosterim(null)}>
          Geç
        </button>
      )}
      {tur === "saatli" && <button ref={kapatBtnRef} className="ozel-gun__odak" type="button" tabIndex={-1} aria-hidden />}

      <div className="ozel-gun__ilerleme" aria-hidden="true">
        <span />
      </div>
      <span className="ozel-gun__sr">{kalan} saniye kaldı</span>
    </section>
  );
}
