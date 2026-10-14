import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`logo ${className}`.trim()} aria-label="ANLATI ana sayfa">
      <span className="logo-word">
        ANLATI<span>.</span>
      </span>
    </Link>
  );
}
