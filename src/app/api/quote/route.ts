import { NextResponse } from "next/server";
import { contactEmail } from "@/lib/studio";

export const dynamic = "force-dynamic";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const d = {
    name: text(body.name, 120),
    email: text(body.email, 200),
    company: text(body.company, 160),
    need: text(body.need, 2000),
    phone: text(body.phone, 40),
    pkg: text(body.package, 40),
  };

  if (!d.name || !d.company || !d.need || !emailRe.test(d.email)) {
    return NextResponse.json({ error: "Lütfen zorunlu alanları doğru doldurun." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Form şu an e-posta gönderemiyor.", fallback: true }, { status: 503 });
  }

  const html = `<h2>Yeni ANLATI teklif talebi</h2>
<p><b>Ad:</b> ${esc(d.name)}<br><b>E-posta:</b> ${esc(d.email)}<br><b>Marka:</b> ${esc(d.company)}<br><b>Telefon:</b> ${esc(d.phone || "-")}<br><b>Paket:</b> ${esc(d.pkg || "-")}</p>
<p><b>İhtiyaç:</b></p><p>${esc(d.need).replace(/\n/g, "<br>")}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.QUOTE_FROM_EMAIL || "ANLATI <onboarding@resend.dev>",
        to: [contactEmail],
        reply_to: d.email,
        subject: `Teklif talebi: ${d.company}`,
        html,
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Talebiniz gönderilemedi.", fallback: true }, { status: 503 });
  }
}
