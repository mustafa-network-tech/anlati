import Link from "next/link";

export default function NotFound() {
  return (
    <main className="st-main">
      <section className="st-final">
        <p className="st-eyebrow">404</p>
        <h1 style={{ fontSize: "clamp(32px,5vw,56px)", margin: "12px 0" }}>Bu sayfanın anlatısı yok.</h1>
        <p>Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
        <Link href="/" className="st-btn">
          Ana sayfaya dön
        </Link>
      </section>
    </main>
  );
}
