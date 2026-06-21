"use client";

import { useEffect, useState, useCallback } from "react";

interface Report {
  id: string; target_type: "story" | "comment" | "user"; target_id: string;
  reason: string; description: string | null;
  status: "pending" | "resolved" | "rejected";
  admin_note: string | null; created_at: string; resolved_at: string | null;
  reporter: { display_name: string | null } | null;
  resolver: { display_name: string | null } | null;
}

const REASON_LABELS: Record<string, string> = {
  hakaret: "Hakaret", spam: "Spam", taciz: "Taciz", siddet: "Şiddet",
  yanlis_bilgi: "Yanlış Bilgi", mustehcen: "Müstehcen",
  kisisel_bilgi: "Kişisel Bilgi", diger: "Diğer",
};
const TARGET_LABELS: Record<string, string> = { story: "Hikâye", comment: "Yorum", user: "Kullanıcı" };
const STATUS_COLORS: Record<string, string>  = { pending: "#f59e0b", resolved: "#22c55e", rejected: "#ef4444" };
const STATUS_LABELS: Record<string, string>  = { pending: "Bekliyor", resolved: "Çözüldü", rejected: "Reddedildi" };

type Toast = { id: number; msg: string; type: "ok" | "err" };

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState("pending");
  const [selected,setSelected]= useState<Report | null>(null);
  const [note,    setNote]    = useState("");
  const [toasts,  setToasts]  = useState<Toast[]>([]);

  const addToast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (status) p.set("status", status);
    const res = await fetch(`/api/admin/reports?${p}`);
    const d   = await res.json();
    setReports(d.reports ?? []);
    setTotal(d.total   ?? 0);
    setLoading(false);
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  async function doAction(id: string, action: string, extra: Record<string, unknown> = {}) {
    const res = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, note, ...extra }),
    });
    if (res.ok) { addToast("İşlem başarılı ✓"); load(); setSelected(null); setNote(""); }
    else        { const e = await res.json(); addToast(e.error ?? "Hata", "err"); }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      {/* Toast */}
      <div style={{ position: "fixed", top: "72px", right: "20px", zIndex: 100, display: "flex", flexDirection: "column", gap: "8px" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === "ok" ? "#052e16" : "#450a0a",
            border: `1px solid ${t.type === "ok" ? "#22c55e" : "#ef4444"}`,
            color: t.type === "ok" ? "#4ade80" : "#f87171",
            padding: "10px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "500",
          }}>{t.msg}</div>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb" }}>Şikâyet Yönetimi</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>
          Toplam {total.toLocaleString("tr-TR")} şikâyet
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {["pending", "resolved", "rejected"].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} style={{
            ...filterBtnStyle,
            background:  status === s ? `${STATUS_COLORS[s]}20` : "transparent",
            color:       status === s ? STATUS_COLORS[s] : "#9ca3af",
            borderColor: status === s ? STATUS_COLORS[s] : "#1f2937",
          }}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              {["Hedef", "Sebep", "Şikâyet Eden", "Tarih", "Durum", "İşlemler"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} style={tdStyle}>
                    <div style={{ height: "16px", background: "#1f2937", borderRadius: "4px", width: "60%", opacity: 0.4 }} />
                  </td></tr>
                ))
              : reports.length === 0
              ? <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "#6b7280", padding: "48px" }}>
                  Şikâyet bulunamadı.
                </td></tr>
              : reports.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #111827", transition: "background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                        background: "rgba(239,68,68,0.15)", color: "#f87171",
                      }}>{TARGET_LABELS[r.target_type]}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#e5e7eb" }}>
                      {REASON_LABELS[r.reason] ?? r.reason}
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#9ca3af" }}>
                      {r.reporter?.display_name ?? "—"}
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {new Date(r.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: "11px", fontWeight: "600",
                        color: STATUS_COLORS[r.status],
                        background: `${STATUS_COLORS[r.status]}20`,
                        padding: "2px 8px", borderRadius: "20px",
                      }}>{STATUS_LABELS[r.status]}</span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => { setSelected(r); setNote(""); }} style={{
                        fontSize: "11px", padding: "4px 10px", borderRadius: "6px",
                        background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                        border: "1px solid rgba(59,130,246,0.3)", cursor: "pointer",
                      }}>
                        İncele
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
          <button disabled={page <= 1}         onClick={() => setPage(p => p - 1)} style={pageBtnStyle}>← Önceki</button>
          <span style={{ color: "#9ca3af", fontSize: "13px", alignSelf: "center" }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={pageBtnStyle}>Sonraki →</button>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div style={overlayStyle} onClick={() => { setSelected(null); setNote(""); }}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#f9fafb" }}>Şikâyet Detayı</h2>
              <button onClick={() => { setSelected(null); setNote(""); }} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{
              background: "#1a2235", borderRadius: "10px", padding: "16px",
              marginBottom: "16px", fontSize: "13px",
            }}>
              <Row label="Hedef Tür"    value={TARGET_LABELS[selected.target_type]} />
              <Row label="Sebep"        value={REASON_LABELS[selected.reason] ?? selected.reason} />
              <Row label="Şikâyet Eden" value={selected.reporter?.display_name ?? "—"} />
              <Row label="Açıklama"     value={selected.description ?? "—"} />
              <Row label="Tarih"        value={new Date(selected.created_at).toLocaleString("tr-TR")} />
            </div>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Admin notu (opsiyonel)"
              style={{ ...inputStyle, width: "100%", minHeight: "72px", resize: "vertical", marginBottom: "16px", boxSizing: "border-box" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button onClick={() => doAction(selected.id, "resolve")} style={{ ...modalBtnStyle, background: "#052e16", color: "#4ade80", border: "1px solid #22c55e50" }}>
                ✓ Çözüldü
              </button>
              <button onClick={() => doAction(selected.id, "reject")} style={{ ...modalBtnStyle, background: "#1f2937", color: "#9ca3af", border: "1px solid #37415150" }}>
                ✕ Reddet
              </button>
              <button onClick={() => doAction(selected.id, "hide_content", { targetId: selected.target_id, targetType: selected.target_type })}
                style={{ ...modalBtnStyle, background: "#451a03", color: "#fb923c", border: "1px solid #f59e0b50" }}>
                🙈 İçeriği Gizle
              </button>
              <button onClick={() => doAction(selected.id, "delete_content", { targetId: selected.target_id, targetType: selected.target_type })}
                style={{ ...modalBtnStyle, background: "#450a0a", color: "#f87171", border: "1px solid #ef444450" }}>
                🗑 İçeriği Sil
              </button>
              <button onClick={() => doAction(selected.id, "ban_user", { targetId: selected.target_id })}
                style={{ ...modalBtnStyle, gridColumn: "1/-1", background: "#450a0a", color: "#f87171", border: "1px solid #ef444450" }}>
                🚫 Kullanıcıyı Yasakla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ color: "#e5e7eb" }}>{value}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#1f2937", border: "1px solid #374151", borderRadius: "8px",
  padding: "8px 12px", color: "#f3f4f6", fontSize: "13px", outline: "none",
};
const filterBtnStyle: React.CSSProperties = {
  padding: "8px 14px", borderRadius: "8px", border: "1px solid",
  fontSize: "13px", cursor: "pointer", transition: "all 0.15s",
};
const thStyle: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left", fontSize: "11px",
  fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em",
};
const tdStyle: React.CSSProperties = { padding: "12px 16px", fontSize: "13px", color: "#d1d5db" };
const pageBtnStyle: React.CSSProperties = {
  padding: "6px 14px", borderRadius: "8px", border: "1px solid #1f2937",
  background: "#111827", color: "#9ca3af", cursor: "pointer", fontSize: "13px",
};
const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
  zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
};
const modalStyle: React.CSSProperties = {
  background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
  padding: "28px", width: "100%", maxWidth: "520px",
};
const closeBtnStyle: React.CSSProperties = {
  background: "#1f2937", border: "none", borderRadius: "8px",
  color: "#9ca3af", cursor: "pointer", padding: "4px 8px", fontSize: "14px",
};
const modalBtnStyle: React.CSSProperties = {
  padding: "10px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500",
};
