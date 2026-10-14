"use client";

import { useEffect, useRef } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  from = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
  from?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      el.classList.add("rv-in");
      return;
    }
    el.classList.add("rv-armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("rv-in");
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv rv-${from} ${className}`.trim()} style={delay ? { ["--rd" as string]: `${delay}s` } : undefined}>
      {children}
    </Tag>
  );
}
