"use client";

import { useEffect, useState } from "react";

interface Settings {
  site_name: string; site_description: string; contact_email: string;
  social_twitter: string; social_instagram: string;
  kvkk_url: string; terms_url: string; cookie_policy_url: string;
  ga_tracking_id: string; search_console_id: string;
}

type Toast = { id: number; msg: string; type: "ok" | "err" };

export default function SettingsPage() {
  const [form,    setForm]    = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toasts,  setToasts]  = useState<Toast[]>([]);

  const addToast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => setForm(d.settings ?? {}))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) addToast("Ayarlar kaydedildi ✓");
    else        addToast("Kaydedilemedi", "err");
  }

  const set = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  if (loading) return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb", marginBottom: "24px" }}>Ayarlar</h1>
      {Array(3).fill(0).map((_, i) => (
        <div key={i} style={{ height: "160px", background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", marginBottom: "16px" }} />
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ position: "fixed", top: "72px", right: "20px", zIndex: 100, display: "flex", flexDirection: "column", gap: "8px" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === "ok" ? "#052e16" : "#450a0a",
            border: `1px solid ${t.type === "ok" ? "#22c55e" : "#ef4444"}`,
            color: t.type === "ok" ? "#4ade80" : "#f87171",
            padding: "10px 16px", borderRadius: "10px", fontSize: "13px",
          }}>{t.msg}</div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb" }}>Ayarlar</h1>
        <button onClick={handleSave} disabled={saving} style={{
          padding: "10px 20px", borderRadius: "10px",
          background: saving ? "#374151" : "linear-gradient(135deg,#7c3aed,#a855f7)",
          color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer",
          fontSize: "13px", fontWeight: "600",
        }}>
          {saving ? "Kaydediliyor…" : "💾 Kaydet"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Section title="🌐 Site Bilgileri">
          <Field label="Site Adı">
            <input value={form.site_name ?? ""} onChange={set("site_name")} style={inputStyle} />
          </Field>
          <Field label="Açıklama">
            <textarea value={form.site_description ?? ""} onChange={set("site_description")}
              style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }} />
          </Field>
          <Field label="İletişim E-posta">
            <input value={form.contact_email ?? ""} onChange={set("contact_email")} type="email" style={inputStyle} />
          </Field>
        </Section>

        <Section title="📱 Sosyal Medya">
          <Field label="Twitter (X)">
            <input value={form.social_twitter ?? ""} onChange={set("social_twitter")}
              placeholder="@kullaniciadi" style={inputStyle} />
          </Field>
          <Field label="Instagram">
            <input value={form.social_instagram ?? ""} onChange={set("social_instagram")}
              placeholder="@kullaniciadi" style={inputStyle} />
          </Field>
        </Section>

        <Section title="📊 Analitik">
          <Field label="Google Analytics Takip ID">
            <input value={form.ga_tracking_id ?? ""} onChange={set("ga_tracking_id")}
              placeholder="G-XXXXXXXXXX" style={inputStyle} />
          </Field>
          <Field label="Search Console Doğrulama Kodu">
            <input value={form.search_console_id ?? ""} onChange={set("search_console_id")}
              placeholder="google..." style={inputStyle} />
          </Field>
        </Section>

        <Section title="⚖️ Hukuki Sayfalar">
          <Field label="KVKK URL">
            <input value={form.kvkk_url ?? ""} onChange={set("kvkk_url")}
              placeholder="https://..." style={inputStyle} />
          </Field>
          <Field label="Kullanım Şartları URL">
            <input value={form.terms_url ?? ""} onChange={set("terms_url")}
              placeholder="https://..." style={inputStyle} />
          </Field>
          <Field label="Çerez Politikası URL">
            <input value={form.cookie_policy_url ?? ""} onChange={set("cookie_policy_url")}
              placeholder="https://..." style={inputStyle} />
          </Field>
        </Section>

        <div style={{
          background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "14px", padding: "20px",
        }}>
          <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#f87171", marginBottom: "8px" }}>
            ⚠️ Önemli Not
          </h3>
          <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>
            Bu ayarlar demo amaçlı gösterilmektedir. Üretim ortamında ayarları bir
            <code style={{ background: "#1f2937", padding: "1px 4px", borderRadius: "3px" }}> settings </code>
            veritabanı tablosunda saklamanız önerilir.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "24px" }}>
      <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#f3f4f6", marginBottom: "20px" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#1f2937", border: "1px solid #374151", borderRadius: "8px",
  padding: "8px 12px", color: "#f3f4f6", fontSize: "13px", outline: "none",
  width: "100%", boxSizing: "border-box",
};
