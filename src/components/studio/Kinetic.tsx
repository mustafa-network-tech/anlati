"use client";

import { useEffect, useRef } from "react";
import "./kinetic.css";

type Kind = "plain" | "em" | "poster" | "glow" | "ul" | "hand";

function parse(text: string): { kind: Kind; t: string }[] {
  return text
    .split(/(\*[^*]+\*|\^[^^]+\^|~[^~]+~|_[^_]+_|=[^=]+=)/)
    .filter(Boolean)
    .map((p) => {
      const inner = p.slice(1, -1);
      if (p.length > 2 && p.startsWith("*") && p.endsWith("*")) return { kind: "em", t: inner };
      if (p.length > 2 && p.startsWith("^") && p.endsWith("^")) return { kind: "poster", t: inner };
      if (p.length > 2 && p.startsWith("~") && p.endsWith("~")) return { kind: "glow", t: inner };
      if (p.length > 2 && p.startsWith("_") && p.endsWith("_")) return { kind: "ul", t: inner };
      if (p.length > 2 && p.startsWith("=") && p.endsWith("=")) return { kind: "hand", t: inner };
      return { kind: "plain", t: p };
    });
}

export default function Kinetic({
  text,
  as = "span",
  className = "",
  id,
  from = "alt",
  by = "word",
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  id?: string;
  from?: "right" | "left" | "alt";
  by?: "word" | "letter";
}) {
  const Tag = as;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("kn-in");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const parts = parse(text);
  const plain = parts.map((p) => p.t).join("");
  let wi = 0;

  const word = (w: string, kind: Kind) => {
    const i = wi++;
    const dir = from === "left" ? -1 : from === "right" ? 1 : i % 2 ? -1 : 1;
    const style = { ["--i" as string]: i, ["--dx" as string]: `${dir * 80}px` };
    if (by === "letter" && kind !== "glow") {
      return (
        <span key={`${i}-${w}`} className={`kw kw-${kind}`} style={style}>
          {Array.from(w).map((ch, j) => (
            <span key={j} className="kl" style={{ ["--j" as string]: j }}>
              {ch}
            </span>
          ))}
        </span>
      );
    }
    return (
      <span key={`${i}-${w}`} className={`kw kw-w kw-${kind}`} style={style}>
        {w}
      </span>
    );
  };

  const nodes = parts.map((p, pi) => {
    const items = p.t.split(/(\s+)/).map((s) => (/^\s+$/.test(s) ? s : s ? word(s, p.kind) : null));
    if (p.kind === "ul") {
      return (
        <span key={pi} className="dl dl-copper kw-ul">
          {items}
          <svg viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
            <path d="M3 9 C 60 2, 110 14, 160 7 S 262 3, 297 8" pathLength="1" />
          </svg>
        </span>
      );
    }
    return <span key={pi}>{items}</span>;
  });

  return (
    <Tag ref={ref} id={id} className={`kn kn-armed ${className}`.trim()}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">{nodes}</span>
    </Tag>
  );
}
