"use client";

import { useEffect, useRef, useState } from "react";
import { examples } from "@/lib/studio";
import "./transform.css";

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

export default function Transformation() {
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const track = useRef<HTMLDivElement | null>(null);
  const sticky = useRef<HTMLDivElement | null>(null);
  const ex = examples[i];

  useEffect(() => {
    const el = track.current;
    const st = sticky.current;
    if (!el || !st) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(id);
    }

    const wide = window.matchMedia("(min-width: 901px)").matches;
    if (wide) {
      let raf = 0;
      const update = () => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const total = r.height - st.offsetHeight;
        setP(clamp((88 - r.top) / Math.max(1, total)));
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    }

    let played = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || played) return;
        played = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 2600);
          setP(k);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.55 },
    );
    io.observe(st);
    return () => io.disconnect();
  }, []);

  const s = clamp(p / 0.16);
  const t = ease(clamp((p - 0.18) / 0.62));
  const vars = { ["--s" as string]: s.toFixed(3), ["--t" as string]: t.toFixed(3) };

  return (
    <div className="tf">
      <div className="tf-tabs" role="tablist" aria-label="Örnek sektör">
        {examples.map((e, idx) => (
          <button key={e.key} role="tab" aria-selected={idx === i} className={idx === i ? "tf-tab on" : "tf-tab"} onClick={() => setI(idx)}>
            {e.sector}
          </button>
        ))}
      </div>

      <p className="tf-hint" aria-hidden="true" style={{ opacity: Math.max(0, 1 - p * 5) }}>kaydırın, anlatı dönüşsün</p>

      <div className="tf-track" ref={track}>
        <div className="tf-sticky" ref={sticky}>
          <div className="tf-stage" style={vars}>
            <span className="tf-fic">Kurgusal örnek</span>
            <div className="tf-before">
              <div className="tf-chrome">
                <i />
                <i />
                <i />
                <span>www.ornek-firma.com</span>
              </div>
              <div className="tf-wire">
                <div className="tf-wnav">
                  <b />
                  <u />
                  <u />
                  <u />
                </div>
                <div className="tf-wbody">
                  <div className="tf-wimg" />
                  <div className="tf-wtext">
                    <small>ÖNCE · {ex.sector}</small>
                    <h3>
                      <span className="tf-old">{ex.before}</span>
                    </h3>
                    <p>Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
                    <span className="tf-wbtn">Detaylı bilgi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tf-after" aria-hidden={t < 0.5}>
              <div className="tf-chrome">
                <i />
                <i />
                <i />
                <span>www.ornek-firma.com</span>
              </div>
              <div className="tf-abody">
                <svg className="tf-art" viewBox="0 0 160 190" aria-hidden="true">
                  <path d="M4 190V70C4 30 38 6 80 6s76 24 76 64v120Z" fill="#efe7d6" stroke="#e6b99f" strokeWidth="3" />
                  <rect x="52" y="40" width="56" height="60" fill="#d5e3e4" stroke="#173642" strokeWidth="3" />
                  <path d="M80 40V100M52 70H108" stroke="#173642" strokeWidth="3" />
                  <path d="M80 6V26" stroke="#173642" strokeWidth="3" />
                  <path d="M66 36 C 68 24, 76 20, 80 20 S 92 24, 94 36 Z" fill="#a35f3d" />
                  <rect x="4" y="150" width="152" height="40" fill="#b5804f" />
                  <g fill="#d3a06a" stroke="#7a4d30" strokeWidth="2">
                    <rect x="52" y="106" width="6" height="44" />
                    <rect x="102" y="106" width="6" height="44" />
                    <rect x="50" y="112" width="60" height="7" rx="2" />
                    <rect x="66" y="119" width="5" height="22" />
                    <rect x="78" y="119" width="5" height="22" />
                    <rect x="90" y="119" width="5" height="22" />
                    <rect x="48" y="141" width="64" height="8" rx="2" />
                  </g>
                </svg>
                <div className="tf-atext">
                  <small>SONRA · {ex.sector}</small>
                  <h3>{ex.after}</h3>
                  <ul className="tf-chips">
                    {ex.notes.map(([q, a], k) => (
                      <li key={q} style={{ ["--k" as string]: k }}>
                        <small>{q}</small>
                        <b>{a}</b>
                      </li>
                    ))}
                  </ul>
                  <span className="tf-abtn">Konuşalım</span>
                </div>
              </div>
            </div>

            <div className="tf-edge" aria-hidden="true" />
          </div>

          <label className="tf-range">
            <span>Önce</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(p * 100)}
              onChange={(e) => setP(Number(e.target.value) / 100)}
              aria-label="Önce ve sonra dönüşümü: kaydırarak anlatının değişimini görün"
            />
            <span>Sonra</span>
          </label>
          <p className="hx-disclaimer">Yöntemimizi göstermek için hazırlanmıştır; gerçek müşteri çalışması değildir.</p>
        </div>
      </div>
    </div>
  );
}
