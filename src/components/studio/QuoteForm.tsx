"use client";

import { useState } from "react";
import { contactEmail, whatsappDisplay, whatsappLink } from "@/lib/studio";

type Status = "idle" | "sending" | "done" | "error";
type Data = Record<string, string>;

function summary(d: Data) {
  return [
    "Merhaba, ANLATI için teklif almak istiyorum.",
    `Ad: ${d.name || "-"}`,
    `Marka: ${d.company || "-"}`,
    `E-posta: ${d.email || "-"}`,
    d.package ? `Paket: ${d.package}` : "",
    `İhtiyaç: ${d.need || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function QuoteForm({ defaultPackage = "" }: { defaultPackage?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState(false);
  const [last, setLast] = useState<Data>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Data;
    setLast(data);
    setStatus("sending");
    setMessage("");
    setFallback(false);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFallback(Boolean(json.fallback));
        throw new Error(json.error || "Gönderilemedi.");
      }
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  if (status === "done") {
    return (
      <div className="st-form-done" role="status">
        <h3>Teşekkürler, talebiniz bize ulaştı.</h3>
        <p>En kısa sürede e-posta adresinizden size dönüş yapacağız.</p>
      </div>
    );
  }

  return (
    <form className="st-form" onSubmit={submit}>
      <input type="hidden" name="package" value={defaultPackage} />
      <label>
        Adınız
        <input name="name" required maxLength={120} autoComplete="name" />
      </label>
      <label>
        E-posta
        <input name="email" type="email" required maxLength={200} autoComplete="email" />
      </label>
      <label>
        Marka / işletme
        <input name="company" required maxLength={160} autoComplete="organization" />
      </label>
      <label>
        İhtiyacınız
        <textarea name="need" required rows={5} maxLength={2000} placeholder="Kısaca anlatın: ne yapıyorsunuz, neye ihtiyacınız var?" />
      </label>
      <label>
        Telefon <span className="st-optional">(isteğe bağlı)</span>
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </label>
      <div className="st-hp" aria-hidden="true">
        <label>
          Web sitesi
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" && (
        <div className="st-form-error" role="alert">
          <p>{message}</p>
          {fallback && (
            <p>
              Talebinizi doğrudan{" "}
              <a href={whatsappLink(summary(last))} target="_blank" rel="noopener noreferrer">
                WhatsApp ({whatsappDisplay})
              </a>{" "}
              veya{" "}
              <a href={`mailto:${contactEmail}?subject=${encodeURIComponent("Teklif talebi")}&body=${encodeURIComponent(summary(last))}`}>
                {contactEmail}
              </a>{" "}
              üzerinden iletebilirsiniz.
            </p>
          )}
        </div>
      )}
      <button className="st-btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Gönderiliyor…" : "Teklif iste"}
      </button>
    </form>
  );
}
