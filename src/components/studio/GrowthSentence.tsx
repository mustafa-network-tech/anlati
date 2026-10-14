"use client";

import { useEffect, useRef } from "react";
import "./transform.css";

const words = [
  { t: "İşinizi", k: "plain", dx: -140, dy: -90, r: -14 },
  { t: "anlatıya,", k: "em", dx: 110, dy: 70, r: 10 },
  { t: "anlatınızı", k: "em", dx: -70, dy: 120, r: -8 },
  { t: "büyümeye", k: "grow", dx: 150, dy: -80, r: 16 },
  { t: "dönüştürün.", k: "plain", dx: -110, dy: 90, r: -12 },
];

export default function GrowthSentence() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("gs-in");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="gs gs-armed">
      <p className="gs-text">
        {words.map((w, i) => (
          <span key={w.t}>
            <span
              className={`gs-w gs-${w.k}`}
              style={{ ["--dx" as string]: `${w.dx}px`, ["--dy" as string]: `${w.dy}px`, ["--r" as string]: `${w.r}deg`, ["--i" as string]: i }}
            >
              {w.t}
            </span>{" "}
          </span>
        ))}
      </p>
      <svg className="gs-line" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true">
        <path className="gs-path" pathLength="1" d="M2 78 C 140 74, 240 82, 380 64 S 640 46, 760 38 S 930 18, 988 8" />
        <path className="gs-tip" pathLength="1" d="M960 1 L988 8 L974 30" />
      </svg>
      <span className="gs-hand" aria-hidden="true">büyüme burada</span>
    </div>
  );
}
