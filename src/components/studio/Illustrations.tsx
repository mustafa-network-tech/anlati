const N = "#173642";
const C = "#a35f3d";
const P = "#fbfaf6";
const S = "#e9dcc3";

export function BrandArt() {
  return (
    <svg viewBox="0 0 160 112" aria-hidden="true">
      <rect x="24" y="46" width="112" height="58" fill={P} stroke={N} strokeWidth="2.5" />
      <path d="M14 46 L28 16 H132 L146 46 Z" fill={C} stroke={N} strokeWidth="2.5" />
      {[44, 62, 80, 98, 116].map((x) => (
        <line key={x} x1={x} y1="17" x2={x - 4} y2="46" stroke={P} strokeWidth="5" opacity=".75" />
      ))}
      <rect x="66" y="64" width="28" height="40" fill={N} />
      <circle cx="88" cy="85" r="2.2" fill={S} />
      <rect x="34" y="60" width="24" height="24" fill="#d5e3e4" stroke={N} strokeWidth="2" />
      <rect x="102" y="60" width="24" height="24" fill="#d5e3e4" stroke={N} strokeWidth="2" />
      <rect x="54" y="2" width="52" height="14" rx="2" fill={N} />
      <path d="M62 9 H98" stroke={S} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FounderArt() {
  return (
    <svg viewBox="0 0 160 112" aria-hidden="true">
      <circle cx="70" cy="42" r="19" fill={S} stroke={N} strokeWidth="2.5" />
      <path d="M26 110 C 30 72, 110 72, 114 110 Z" fill={N} />
      <path d="M58 40 q6 -6 12 0 M74 40 q6 -6 12 0" stroke={N} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M62 52 q8 6 16 0" stroke={N} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M100 8 h48 a6 6 0 0 1 6 6 v22 a6 6 0 0 1 -6 6 h-30 l-10 10 v-10 h-8 a6 6 0 0 1 -6 -6 v-22 a6 6 0 0 1 6 -6 z" fill={C} />
      <text x="126" y="38" textAnchor="middle" fontSize="30" fill={P} fontFamily="var(--font-serif), Georgia, serif">
        “
      </text>
    </svg>
  );
}

export function InstitutionArt() {
  return (
    <svg viewBox="0 0 160 112" aria-hidden="true">
      <path d="M18 38 L80 8 L142 38 Z" fill={N} />
      <rect x="26" y="38" width="108" height="8" fill={S} stroke={N} strokeWidth="2" />
      {[36, 62, 88, 114].map((x) => (
        <rect key={x} x={x} y="48" width="12" height="50" fill={P} stroke={N} strokeWidth="2" />
      ))}
      <rect x="20" y="98" width="120" height="8" fill={N} />
      <rect x="14" y="106" width="132" height="5" fill={C} />
      <circle cx="80" cy="28" r="5" fill={C} />
    </svg>
  );
}

export function BrowserMock() {
  return (
    <svg viewBox="0 0 520 360" role="img" aria-label="Anlatının web sitesine dönüşümünü gösteren örnek tarayıcı penceresi" className="bm">
      <rect x="10" y="10" width="500" height="340" rx="14" fill={P} stroke="#e6b99f" strokeWidth="2.5" />
      <path d="M10 24 a14 14 0 0 1 14 -14 H496 a14 14 0 0 1 14 14 V50 H10 Z" fill={S} />
      <circle cx="32" cy="30" r="5" fill={C} />
      <circle cx="50" cy="30" r="5" fill="#c9b48a" />
      <circle cx="68" cy="30" r="5" fill="#9fb4ba" />
      <rect x="92" y="21" width="230" height="18" rx="9" fill={P} />
      <text x="106" y="34" fontSize="10.5" fill="#5c6460" fontFamily="var(--font-sans), sans-serif">
        ornek-atolye · örnek site
      </text>
      <rect x="10" y="50" width="500" height="64" fill={N} />
      <text x="34" y="88" fontSize="17" fill={P} fontFamily="var(--font-serif), Georgia, serif">
        Tek bir elden çıkar.
      </text>
      <rect x="400" y="68" width="88" height="28" rx="6" fill="#e6b99f" />
      <text x="444" y="86" fontSize="11" textAnchor="middle" fill={N} fontWeight="700" fontFamily="var(--font-sans), sans-serif">
        Konuşalım
      </text>
      <text x="34" y="164" fontSize="26" fill={N} fontFamily="var(--font-serif), Georgia, serif">
        Bir sandalye,
      </text>
      <text x="34" y="196" fontSize="26" fill={N} fontStyle="italic" fontFamily="var(--font-serif), Georgia, serif">
        tek bir elden.
      </text>
      <path d="M34 204 C 84 196, 130 210, 176 202 S 232 200, 240 204" stroke={C} strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="34" y="226" width="220" height="8" rx="4" fill="#d8d5cd" />
      <rect x="34" y="244" width="180" height="8" rx="4" fill="#d8d5cd" />
      <rect x="34" y="272" width="128" height="32" rx="7" fill={N} />
      <text x="98" y="293" fontSize="12" textAnchor="middle" fill={P} fontWeight="700" fontFamily="var(--font-sans), sans-serif">
        Siparişi konuşalım
      </text>
      <g transform="translate(332 134)">
        <path d="M0 150V60C0 24 36 0 78 0s78 24 78 60v90Z" fill={S} stroke={N} strokeWidth="3" />
        <rect x="52" y="30" width="48" height="52" fill="#d5e3e4" stroke={N} strokeWidth="3" />
        <path d="M76 30V82M52 56H100" stroke={N} strokeWidth="2.5" />
        <g fill="#d3a06a" stroke="#7a4d30" strokeWidth="2">
          <rect x="42" y="82" width="6" height="52" />
          <rect x="94" y="82" width="6" height="52" />
          <rect x="40" y="86" width="62" height="7" rx="2" />
          <rect x="56" y="93" width="5" height="26" />
          <rect x="68" y="93" width="5" height="26" />
          <rect x="80" y="93" width="5" height="26" />
          <rect x="38" y="119" width="68" height="8" rx="2" />
        </g>
        <rect x="0" y="136" width="156" height="14" fill="#b5804f" />
      </g>
    </svg>
  );
}
