"use client";

import { useEffect, useState } from "react";
import "./kinds.css";

const kinds = [
  {
    n: "01",
    word: "Marka",
    title: "Marka anlatısı",
    text: "İşletmenizin neyi, kim için ve neden farklı yaptığını anlaşılır bir mesaja ve web sitesi metinlerine çevirir.",
    outputs: ["Ana mesaj", "Hakkımızda", "Ana sayfa metni"],
    bg: "#efe7d6",
  },
  {
    n: "02",
    word: "Kurucu",
    title: "Kurucu anlatısı",
    text: "Kurucunun yolculuğunu, güven veren ve hatırlanır bir hikâyeye dönüştürür: Hakkımızda, sunumlar ve profiller için.",
    outputs: ["Kuruluş hikâyesi", "Röportaj", "Kısa tanıtım"],
    bg: "#f0c46a",
  },
  {
    n: "03",
    word: "Kurum",
    title: "Kurum anlatısı",
    text: "Köklü şirket, dernek veya okulun geçmişini ve değerlerini ekip, müşteri ve paydaşlar için tek bir anlatıda toplar.",
    outputs: ["Tarihçe", "Değerler", "Kurum tanıtımı"],
    bg: "#173642",
  },
];

const N = "#173642";
const C = "#a35f3d";
const P = "#fbfaf6";

export default function KindsShowcase() {
  const [a, setA] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setA((x) => (x + 1) % kinds.length), 6500);
    return () => clearTimeout(t);
  }, [a, paused]);

  return (
    <div
      className="ks"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="ks-list" role="tablist" aria-label="Anlatı türleri">
        {kinds.map((k, i) => (
          <button key={k.n} role="tab" aria-selected={i === a} className="ks-item" onClick={() => setA(i)}>
            <span className="ks-word">{k.word}</span>
            <span className="ks-body">
              <span className="ks-inner">
                <span className="ks-title">{k.title}</span>
                <span className="ks-text">{k.text}</span>
                <span className="ks-chips">
                  {k.outputs.map((o) => (
                    <span key={o}>{o}</span>
                  ))}
                </span>
              </span>
            </span>
            {i === a && (
              <i key={`p${a}`} className="ks-prog" style={{ animationPlayState: paused ? "paused" : "running" }} />
            )}
          </button>
        ))}
      </div>

      <div className="ks-stage" style={{ background: kinds[a].bg }} role="tabpanel" aria-label={`${kinds[a].title} sahnesi`}>
        <div className={a === 0 ? "scene sc-brand on" : "scene sc-brand"} aria-hidden="true">
          <svg viewBox="0 0 480 350">
            <rect x="0" y="300" width="480" height="50" fill="#d8cdb4" />
            <rect x="30" y="140" width="240" height="160" fill={P} stroke={N} strokeWidth="4" />
            {Array.from({ length: 8 }).map((_, i) => (
              <polygon
                key={i}
                className="aw"
                style={{ animationDelay: `${i * 0.07}s` }}
                points={`${14 + i * 34},96 ${48 + i * 34},96 ${51 + i * 34},142 ${11 + i * 34},142`}
                fill={i % 2 ? P : C}
                stroke={N}
                strokeWidth="3"
              />
            ))}
            <rect x="70" y="30" width="160" height="50" rx="6" fill={N} />
            <path className="bar" pathLength="1" d="M88 46H210" stroke="#e6b99f" strokeWidth="5" strokeLinecap="round" />
            <path className="bar" pathLength="1" d="M88 58H180" stroke="#e6b99f" strokeWidth="5" strokeLinecap="round" style={{ animationDelay: ".9s" }} />
            <path className="bar" pathLength="1" d="M88 70H150" stroke="#e6b99f" strokeWidth="5" strokeLinecap="round" style={{ animationDelay: "1.2s" }} />
            <rect x="126" y="190" width="48" height="110" fill={N} />
            <circle cx="164" cy="246" r="3" fill="#e6b99f" />
            <rect x="46" y="170" width="60" height="56" fill="#d5e3e4" stroke={N} strokeWidth="3" />
            <rect x="194" y="170" width="60" height="56" fill="#d5e3e4" stroke={N} strokeWidth="3" />
          </svg>
          <ul className="qs">
            {["Ne yapıyoruz?", "Kimin için?", "Neden biz?"].map((t, i) => (
              <li key={t} style={{ animationDelay: `${0.8 + i * 0.5}s` }}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className={a === 1 ? "scene sc-founder on" : "scene sc-founder"} aria-hidden="true">
          <svg viewBox="0 0 480 350">
            <path d="M10 350 C 20 236, 200 236, 210 350 Z" fill={N} />
            <circle cx="110" cy="150" r="48" fill={P} stroke={N} strokeWidth="4" />
            <path d="M88 142 q8 -9 16 0 M118 142 q8 -9 16 0" stroke={N} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M92 168 q18 14 36 0" stroke={N} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </svg>
          <div className="bubble">
            <span className="cap">RÖPORTAJ NOTU · 01</span>
            <p className="q">
              <span className="type" style={{ ["--n" as string]: 20 }}>
                Bu işi neden kurdum?
              </span>
            </p>
            <p className="ans">Çünkü yarım kalan bir iş, güçlü bir fikre dönüştü.</p>
          </div>
        </div>

        <div className={a === 2 ? "scene sc-inst on" : "scene sc-inst"} aria-hidden="true">
          <svg viewBox="0 0 480 350">
            <polygon className="ped" points="90,122 240,52 390,122" fill="#f3f0e9" />
            <rect x="100" y="122" width="280" height="16" fill="#e6b99f" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                className="col"
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                x={118 + i * 52}
                y="138"
                width="26"
                height="128"
                fill="#f3f0e9"
              />
            ))}
            <rect x="90" y="266" width="300" height="14" fill="#f3f0e9" />
            <rect x="76" y="280" width="328" height="10" fill={C} />
            <path className="tl" pathLength="1" d="M40 316H440" stroke="#e6b99f" strokeWidth="3" strokeLinecap="round" />
            {(
              [
                [100, "KURULUŞ"],
                [240, "BÜYÜME"],
                [380, "BUGÜN"],
              ] as [number, string][]
            ).map(([x, t], i) => (
              <g key={t} className="dot" style={{ animationDelay: `${1.2 + i * 0.35}s` }}>
                <circle cx={x} cy="316" r="8" fill="#f0c46a" />
                <text x={x} y="342" textAnchor="middle" fontSize="12" fill="#f3f0e9" fontFamily="var(--font-mono), monospace" letterSpacing="1.5">
                  {t}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
