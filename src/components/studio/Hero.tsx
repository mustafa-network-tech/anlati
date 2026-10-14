import Link from "next/link";
import "./hero.css";
import Kinetic from "./Kinetic";

export default function Hero() {
  return (
    <section className="hx" aria-labelledby="hx-title">
      <div className="hx-giant" aria-hidden="true">
        ANLATI.
      </div>

      <div className="hx-inner">
        <div className="hx-copy">
          <p className="hx-eyebrow">ANLATI STÜDYOSU</p>
          <h1 id="hx-title">
            <span>Her işin</span>
            <span>anlatılmaya değer</span>
            <span className="hx-mark">
              bir tarafı var.
              <svg viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 11 C 60 2, 110 16, 160 8 S 262 4, 297 10" pathLength="1" />
              </svg>
            </span>
          </h1>
          <Kinetic as="p" className="hx-lede" text="İşletmeler, kurucular ve kurumlar için marka hikâyeleri ve web sitesi metinleri hazırlıyoruz. Amacımız tek: işinizin ~anlaşılır, hatırlanır ve tercih edilir~ olması." from="right" />
          <div className="hx-actions">
            <Link href="/iletisim" className="st-btn">
              Hikâyenizi konuşalım ↗
            </Link>
            <Link href="#anlatinin-olusumu" className="st-btn st-btn-ghost">
              Bir anlatının oluşumunu görün ↓
            </Link>
          </div>
        </div>

        <div className="hx-stage" role="group" aria-label="Örnek anlatı: bir ahşap atölyesinin üç röportaj notu">
          <span className="hx-tag">Örnek anlatı · Ahşap atölyesi</span>

          <svg className="hx-art" viewBox="0 0 400 480" aria-hidden="true">
            <defs>
              <clipPath id="hx-arch">
                <path d="M0 480V170C0 80 90 10 200 10s200 70 200 160V480Z" />
              </clipPath>
              <radialGradient id="hx-glow" cx="72%" cy="24%" r="75%">
                <stop offset="0" stopColor="#fff6dc" />
                <stop offset="1" stopColor="#e4d2ae" />
              </radialGradient>
              <radialGradient id="hx-lamp" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fff1c9" stopOpacity=".9" />
                <stop offset="1" stopColor="#fff1c9" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g clipPath="url(#hx-arch)">
              <rect width="400" height="480" fill="url(#hx-glow)" />
              <g stroke="#173642" strokeOpacity=".09" strokeWidth="2">
                {[50, 100, 150, 200, 250, 300, 350].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="480" />
                ))}
              </g>
              <rect x="248" y="78" width="104" height="112" fill="#d5e3e4" stroke="#173642" strokeWidth="5" />
              <path d="M300 78V190M248 134H352" stroke="#173642" strokeWidth="4" />
              <path d="M262 176 C 290 150, 320 132, 342 96" stroke="#fff" strokeOpacity=".55" strokeWidth="6" fill="none" />
              <circle cx="200" cy="112" r="84" fill="url(#hx-lamp)" />
              <path d="M200 0V58" stroke="#173642" strokeWidth="3" />
              <path d="M168 92 C 172 66, 190 56, 200 56 S 228 66, 232 92 Z" fill="#a35f3d" />
              <rect x="30" y="226" width="150" height="9" fill="#7a4d30" />
              <rect x="42" y="192" width="28" height="34" rx="5" fill="#173642" />
              <rect x="78" y="200" width="24" height="26" rx="4" fill="#a35f3d" />
              <rect x="110" y="186" width="34" height="40" rx="5" fill="#c9b48a" stroke="#7a4d30" strokeWidth="2" />
              <path d="M152 226V204h16v22Z" fill="#8a4a2c" />
              <path d="M34 118 L170 106 L172 134 L36 138 Z" fill="#cfd6d9" stroke="#173642" strokeWidth="2.5" />
              <path d="M40 138 l6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10" stroke="#173642" strokeWidth="2" fill="none" />
              <rect x="12" y="112" width="26" height="30" rx="6" fill="#7a4d30" />
              <rect x="290" y="206" width="60" height="9" fill="#173642" rx="2" />
              <rect x="316" y="214" width="8" height="46" fill="#7a4d30" />
              <rect x="-10" y="372" width="420" height="22" fill="#b5804f" />
              <rect x="-10" y="394" width="420" height="100" fill="#7a4d30" />
              <rect x="30" y="410" width="150" height="56" rx="3" fill="#8a5a3a" stroke="#5e3a22" strokeWidth="2" />
              <rect x="212" y="410" width="150" height="56" rx="3" fill="#8a5a3a" stroke="#5e3a22" strokeWidth="2" />
              <rect x="94" y="432" width="22" height="7" rx="3" fill="#e6c79a" />
              <rect x="276" y="432" width="22" height="7" rx="3" fill="#e6c79a" />
              <g fill="#d3a06a" stroke="#7a4d30" strokeWidth="2">
                <rect x="112" y="190" width="12" height="124" />
                <rect x="206" y="190" width="12" height="124" />
                <rect x="110" y="196" width="110" height="14" rx="2" />
                <rect x="138" y="210" width="8" height="90" />
                <rect x="158" y="210" width="8" height="90" />
                <rect x="178" y="210" width="8" height="90" />
                <rect x="104" y="300" width="124" height="14" rx="3" />
                <rect x="112" y="314" width="12" height="58" />
                <rect x="206" y="314" width="12" height="58" />
              </g>
              <path d="M110 352 H222" stroke="#a35f3d" strokeWidth="3" strokeDasharray="4 6" />
              <rect x="262" y="350" width="78" height="22" rx="4" fill="#173642" />
              <rect x="276" y="344" width="22" height="8" rx="3" fill="#a35f3d" />
              <circle cx="330" cy="344" r="8" fill="#a35f3d" />
              <g fill="none" stroke="#f1dcb2" strokeWidth="3.4" strokeLinecap="round">
                <path d="M254 370 q-14 -16 4 -24 q16 -6 10 10" />
                <path d="M240 374 q-12 -12 2 -18" />
                <path d="M350 370 q10 -14 -2 -20 q-12 -4 -8 8" />
              </g>
            </g>
            <path d="M2 480V170C2 82 92 12 200 12s198 70 198 158V480" fill="none" stroke="#173642" strokeWidth="4" />
          </svg>
          <svg className="hx-line" viewBox="0 0 100 110" aria-hidden="true">
            <path className="hx-p" d="M8 33.6 C -1 41, -1 51, 9 57.4" />
            <circle className="hx-dot" cx="8" cy="33.6" r="1.1" />
            <circle className="hx-dot" cx="9" cy="57.6" r="1.1" />
          </svg>

          <article className="hx-card hx-a" style={{ ["--r" as string]: "-4deg", ["--d" as string]: "0s" }}>
            <span className="hx-pg">Kuruluş</span>
            <p>“1987’de babamın tezgâhından kalan üç aletle başladık.”</p>
            <small>Kurucu, röportaj notu</small>
            <i className="hx-tape" aria-hidden="true" />
          </article>

          <article className="hx-card hx-b" style={{ ["--r" as string]: "3deg", ["--d" as string]: ".18s" }}>
            <span className="hx-pg">Üretim</span>
            <p>
              “Bir sandalye tek bir elden çıkar. <em>İmzamız bu.</em>”
            </p>
            <small>Usta, röportaj notu</small>
          </article>

          <article className="hx-card hx-c" style={{ ["--r" as string]: "-2.5deg", ["--d" as string]: ".36s" }}>
            <span className="hx-pg">Bugün</span>
            <p>“Her siparişi, onu yapan ustanın adıyla teslim ediyoruz.”</p>
            <small>Kurucu, röportaj notu</small>
            <i className="hx-tape hx-tape-r" aria-hidden="true" />
          </article>

          <p className="hx-note" aria-hidden="true">
            asıl fark burada <b>→</b>
          </p>

          <svg className="hx-ruler" viewBox="0 0 260 44" aria-hidden="true">
            <rect x="1" y="1" width="258" height="42" rx="3" />
            {Array.from({ length: 26 }).map((_, i) => (
              <line key={i} x1={10 + i * 9.6} y1="1" x2={10 + i * 9.6} y2={i % 5 === 0 ? 22 : 13} />
            ))}
          </svg>

          <svg className="hx-stamp" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="hx-circle" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
            </defs>
            <circle cx="60" cy="60" r="56" />
            <circle cx="60" cy="60" r="34" />
            <text>
              <textPath href="#hx-circle" startOffset="0">
                ÖRNEK ANLATI · AHŞAP ATÖLYESİ ·
              </textPath>
            </text>
            <text x="60" y="66" textAnchor="middle" className="hx-stamp-n">
              A.
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
