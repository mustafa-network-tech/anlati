"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./republic.css";

const CAMPAIGN_ID = "2026-10-29";
// Yayın anından (28 Ekim) 29 Ekim 23:59:59'a kadar, Türkiye saati (UTC+3, DST yok).
const START_MS = Date.parse("2026-10-28T00:00:00+03:00");
const END_MS = Date.parse("2026-10-30T00:00:00+03:00");
const DISPLAY_SECONDS = 10;
const CLOSE_ANIM_MS = 500;

const isCampaignActive = () => {
  const now = Date.now();
  return now >= START_MS && now < END_MS;
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function RepublicWelcome() {
  const [flagAllowed, setFlagAllowed] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [remaining, setRemaining] = useState(DISPLAY_SECONDS);
  const overrideRef = useRef(false); // ?preview=1 / ?test=1 → kampanya bitse de çalışır
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeAnimRef = useRef(0);

  const openWelcome = useCallback(() => {
    window.clearTimeout(closeAnimRef.current);
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setClosing(false);
    setRemaining(DISPLAY_SECONDS);
    setOpen(true);
  }, []);

  const closeWelcome = useCallback(() => {
    if (prefersReducedMotion()) {
      setOpen(false);
      return;
    }
    setClosing(true);
    closeAnimRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_ANIM_MS);
  }, []);

  // İlk açılış kararı ve kampanya bitişinin otomatik izlenmesi (yalnızca tarayıcıda).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview") === "1";
    const test = params.get("test") === "1";
    overrideRef.current = preview || test;

    const storageKey = `republic-welcome:${CAMPAIGN_ID}:${window.location.hostname}`;
    const active = isCampaignActive();
    let seen = false;
    try {
      seen = localStorage.getItem(storageKey) === "seen";
    } catch {
      /* localStorage kapalıysa deneyim yine çalışır */
    }

    setFlagAllowed(active || overrideRef.current);
    if (preview || test || (active && !seen)) {
      if (!preview && !test) {
        try {
          localStorage.setItem(storageKey, "seen");
        } catch {
          /* yoksay */
        }
      }
      openWelcome();
    }

    // Sayfa açık kalsa bile 30 Ekim 00:00'da bayrak ve ekran kendiliğinden kalkar.
    const watch = window.setInterval(() => {
      if (!overrideRef.current && !isCampaignActive()) {
        setFlagAllowed(false);
        setOpen(false);
      }
    }, 30_000);
    return () => {
      window.clearInterval(watch);
      window.clearTimeout(closeAnimRef.current);
    };
  }, [openWelcome]);

  // Geri sayım, otomatik kapanma, Escape, kaydırma kilidi, odak yönetimi.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtnRef.current?.focus({ preventScroll: true });

    const tick = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    const auto = window.setTimeout(closeWelcome, DISPLAY_SECONDS * 1000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWelcome();
      else if (e.key === "Tab") {
        e.preventDefault();
        closeBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(auto);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      lastFocusedRef.current?.focus?.({ preventScroll: true });
    };
  }, [open, closeWelcome]);

  return (
    <>
      {open && (
        <section className={`republic-welcome${closing ? " is-closing" : ""}`}>
          <div className="republic-welcome__backdrop" aria-hidden="true" />
          <div className="republic-welcome__dialog" role="dialog" aria-modal="true" aria-label="29 Ekim Cumhuriyet Bayramı kutlaması">
            <picture className="republic-welcome__picture">
              <source media="(max-width: 720px), (orientation: portrait)" srcSet="/29-ekim/29-ekim-dikey.png" />
              <img
                src="/29-ekim/29-ekim-kare.png"
                alt="Türkiye Büyük Millet Meclisi kürsüsünde Mustafa Kemal Atatürk; Türk bayraklarıyla 29 Ekim Cumhuriyet Bayramı kutlama afişi."
              />
            </picture>
            <div className="republic-welcome__controls">
              <div className="republic-welcome__timer" role="timer" aria-label="Otomatik kapanma süresi">
                <span>{remaining}</span>
                <span className="republic-sr">saniye</span>
              </div>
              <button ref={closeBtnRef} className="republic-welcome__skip" type="button" onClick={closeWelcome}>
                Geç
              </button>
            </div>
            <div className="republic-welcome__progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>
      )}
      {flagAllowed && !open && (
        <button className="republic-flag" type="button" onClick={openWelcome} aria-label="29 Ekim kutlamasını yeniden aç">
          <span className="republic-flag__pole" aria-hidden="true" />
          <span className="republic-flag__cloth" aria-hidden="true">
            <span className="republic-flag__moon">☾</span>
            <span className="republic-flag__star">★</span>
          </span>
        </button>
      )}
    </>
  );
}
