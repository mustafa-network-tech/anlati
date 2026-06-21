"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string; title: string; body: string;
  target_type: string; target_id: string | null;
  is_sent: boolean; sent_at: string | null;
  scheduled_for: string | null; created_at: string;
}

const TARGET_LABELS: Record<string, string> = {
  all: "Tüm Kullanıcılar", user: "Belirli Kullanıcı",
  mobile: "Sadece Mobil", web: "Sadece Web", category: "Kategori",
};

type Toast = { id: number; msg: string; type: "ok" | "err" };

export default function NotificationsPage() {
  const [notifs,   setNotifs]   = useState<Notification[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [toasts,   setToasts]   = useState<Toast[]>([]);
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [targetType, setTargetType] = useState("all");
  const [targetId, setTargetId]   = useState("");
  const [sending,  setSending]    = useState(false);

  const addToast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/notifications");
    const d   = await res.json();
    setNotifs(d.notifications ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  async function handleSend() {
    if (!title.trim() || !body.trim()) { addToast("Başlık ve içerik zorunlu", "err"); return; }
    setSending(true);
    const res = await fetch("/api/admin/notifications", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(), body: body.trim(),
        target_type: targetType,
        target_id: targetId.trim() || null,
      }),
    });
    setSending(false);
    if (res.ok) { addToast("Bildirim gönderildi ✓"); setTitle(""); setBody(""); load(); }
    else        { const e = await res.json(); addToast(e.error ?? "Hata", "err"); }
  }

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

      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb", marginBottom: "24px" }}>
        Bildirim Sistemi
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>

        {/* Gönderme Formu */}
        <div style={{
          background: "#111827", border: "1px solid #1f2937",
          borderRadius: "14px", padding: "24px",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#f3f4f6", marginBottom: "20px" }}>
            🔔 Yeni Bildirim Gönder
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Başlık</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Bildirim başlığı" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>İçerik</label>
              <textarea value={body} onChange={e => setBody(e.target.value)}
                placeholder="Bildirim metni"
                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
            </div>
            <div>
              <label style={labelStyle}>Hedef Kitle</label>
              <select value={targetType} onChange={e => setTargetType(e.target.value)}
                style={{ ...inputStyle, appearance: "none" }}>
                {Object.entries(TARGET_LABELS).map(([v, l]) => (
                  <option key={v} value={v} style={{ background: "#1f2937" }}>{l}</option>
                ))}
              </select>
            </div>
            {(targetType === "user" || targetType === "category") && (
              <div>
                <label style={labelStyle}>{targetType === "user" ? "Kullanıcı ID" : "Kategori Slug"}</label>
                <input value={targetId} onChange={e => setTargetId(e.target.value)}
                  placeholder={targetType === "user" ? "uuid..." : "kategori-slug"}
                  style={inputStyle} />
              </div>
            )}
            <button onClick={handleSend} disabled={sending} style={{
              padding: "12px", borderRadius: "10px",
              background: sending ? "#374151" : "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "#fff", border: "none", cursor: sending ? "not-allowed" : "pointer",
              fontSize: "14px", fontWeight: "600", marginTop: "8px",
            }}>
              {sending ? "Gönderiliyor…" : "🚀 Bildirimi Gönder"}
            </button>
          </div>
        </div>

        {/* Geçmiş Bildirimler */}
        <div style={{
          background: "#111827", border: "1px solid #1f2937",
          borderRadius: "14px", padding: "24px",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#f3f4f6", marginBottom: "16px" }}>
            📋 Geçmiş Bildirimler
          </h2>
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} style={{
                  height: "60px", background: "#1f2937", borderRadius: "8px", marginBottom: "8px", opacity: 0.4
                }} />
              ))
            : notifs.length === 0
            ? <p style={{ color: "#6b7280", fontSize: "13px" }}>Henüz bildirim gönderilmemiş.</p>
            : notifs.map(n => (
                <div key={n.id} style={{
                  padding: "12px", background: "#1a2235", borderRadius: "10px",
                  marginBottom: "8px", border: "1px solid #1f2937",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#e5e7eb" }}>{n.title}</div>
                    <span style={{
                      fontSize: "10px", fontWeight: "600",
                      color: n.is_sent ? "#22c55e" : "#f59e0b",
                      background: n.is_sent ? "#052e16" : "#451a03",
                      padding: "1px 6px", borderRadius: "20px", flexShrink: 0,
                    }}>{n.is_sent ? "Gönderildi" : "Planlandı"}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", lineHeight: "1.4" }}>
                    {n.body.length > 80 ? n.body.slice(0, 80) + "…" : n.body}
                  </div>
                  <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "6px", display: "flex", gap: "12px" }}>
                    <span>🎯 {TARGET_LABELS[n.target_type] ?? n.target_type}</span>
                    <span>📅 {new Date(n.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px",
};
const inputStyle: React.CSSProperties = {
  background: "#1f2937", border: "1px solid #374151", borderRadius: "8px",
  padding: "8px 12px", color: "#f3f4f6", fontSize: "13px", outline: "none",
  width: "100%", boxSizing: "border-box",
};
