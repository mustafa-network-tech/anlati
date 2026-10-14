import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`logo ${className}`.trim()} aria-label="ANLATI ana sayfa">
      <span className="logo-mark" aria-hidden="true">
        A<span>.</span>
      </span>
      <span className="logo-word">ANLATI</span>
    </Link>
  );
}
