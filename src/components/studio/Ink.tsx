export default function Ink({ children, tone = "copper" }: { children: React.ReactNode; tone?: "copper" | "light" }) {
  return (
    <span className={`dl dl-${tone}`}>
      {children}
      <svg viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 9 C 60 2, 110 14, 160 7 S 262 3, 297 8" pathLength="1" />
      </svg>
    </span>
  );
}
