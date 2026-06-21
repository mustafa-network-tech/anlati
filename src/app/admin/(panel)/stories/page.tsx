"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface Story {
  id: string; title: string; summary: string; category: string;
  is_anonymous: boolean; is_published: boolean;
  admin_status: "pending" | "approved" | "rejected";
  is_featured: boolean; is_pinned: boolean; is_story_of_day: boolean;
  like_count: number; comment_count: number; read_count: number;
  created_at: string;
  author: { display_name: string | null } | null;
}

const STATUS_LABELS: Record<string, string>  = { pending: "Bekliyor", approved: "Onaylı", rejected: "Reddedildi" };
const STATUS_COLORS: Record<string, string>  = { pending: "#f59e0b", approved: "#22c55e", rejected: "#ef4444" };
const CATEGORY_LABELS: Record<string, string>= {
  iliskiler: "İlişkiler", annelik: "Annelik", is_hayati: "İş Hayatı",
  yalnizlik: "Yalnızlık", aile: "Aile", yeniden_baslamak: "Yeniden Başlamak",
};

type Toast = { id: number; msg: string; type: "ok" | "err" };

export default function StoriesPage() {
  const searchParams = useSearchParams();
  const [stories, setStories]     = useState<Story[]>([]);
  const [total,   setTotal]       = useState(0);
  const [page,    setPage]        = useState(1);
  const [loading, setLoading]     = useState(true);
  const [search,  setSearch]      = useState("");
  const [status,  setStatus]      = useState(searchParams.get("status") ?? "");
  const [toasts,  setToasts]      = useState<Toast[]>([]);
  const [selected,setSelected]    = useState<Story | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const addToast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    if (status) p.set("status", status);
    const res = await fetch(`/api/admin/stories?${p}`);
    const d   = await res.json();
    setStories(d.stories ?? []);
    setTotal(d.total   ?? 0);
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  async function doAction(id: string, action: string, extra: Record<string, unknown> = {}) {
    setActionLoading(true);
    const res = await fetch("/api/admin/stories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, ...extra }),
    });
    setActionLoading(false);
    if (res.ok) { addToast("İşlem başarılı ✓"); load(); setSelected(null); }
    else        { const e = await res.json(); addToast(e.error ?? "Hata", "err"); }
  }

  async function doDelete(id: string) {
    if (!confirm("Hikâyeyi silmek istiyor musunuz?")) return;
    const res = await fetch("/api/admin/stories", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { addToast("Hikâye silindi"); load(); }
    else        { addToast("Silinemedi", "err"); }
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb" }}>Hikâye Yönetimi</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>
            Toplam {total.toLocaleString("tr-TR")} hikâye
          </p>
        </div>
      </div>

      {/* Filtreler */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Hikâye ara…"
          style={inputStyle}
        />
        {["", "pending", "approved", "rejected"].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            style={{
              ...filterBtnStyle,
              background: status === s ? "rgba(124,58,237,0.2)" : "transparent",
              color:      status === s ? "#c4b5fd" : "#9ca3af",
              borderColor:status === s ? "#7c3aed"  : "#1f2937",
            }}>
            {s === "" ? "Tümü" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              {["Başlık", "Kategori", "Yazar", "Durum", "Okunma", "Tarih", "İşlemler"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(6).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} style={tdStyle}>
                    <div style={{ height: "16px", background: "#1f2937", borderRadius: "4px", width: "80%", opacity: 0.5 }} />
                  </td></tr>
                ))
              : stories.length === 0
              ? <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "#6b7280", padding: "48px" }}>
                  Hikâye bulunamadı.
                </td></tr>
              : stories.map(s => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #111827", transition: "background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ ...tdStyle, maxWidth: "260px" }}>
                      <div style={{ fontWeight: "500", fontSize: "13px", color: "#f3f4f6",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.is_story_of_day && <span title="Günün Hikâyesi">⭐ </span>}
                        {s.is_pinned       && <span title="Sabitli">📌 </span>}
                        {s.is_featured     && <span title="Öne Çıkan">✨ </span>}
                        {s.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                        {s.is_anonymous ? "Anonim" : s.author?.display_name ?? "—"}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                        background: "rgba(124,58,237,0.15)", color: "#c4b5fd",
                      }}>{CATEGORY_LABELS[s.category] ?? s.category}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#9ca3af" }}>
                      {s.is_anonymous ? "—" : (s.author?.display_name ?? "—")}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: "11px", fontWeight: "600",
                        color: STATUS_COLORS[s.admin_status],
                        background: `${STATUS_COLORS[s.admin_status]}20`,
                        padding: "2px 8px", borderRadius: "20px",
                      }}>{STATUS_LABELS[s.admin_status]}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#9ca3af" }}>
                      {s.read_count.toLocaleString("tr-TR")}
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {new Date(s.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <ActionBtn label="İncele" color="#3b82f6"
                          onClick={() => setSelected(s)} />
                        {s.admin_status !== "approved" &&
                          <ActionBtn label="Onayla" color="#22c55e"
                            onClick={() => doAction(s.id, "approve")} loading={actionLoading} />}
                        {s.admin_status !== "rejected" &&
                          <ActionBtn label="Reddet" color="#ef4444"
                            onClick={() => doAction(s.id, "reject")} loading={actionLoading} />}
                        <ActionBtn label="Sil" color="#ef4444"
                          onClick={() => doDelete(s.id)} loading={actionLoading} />
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
          <button disabled={page <= 1}         onClick={() => setPage(p => p - 1)} style={pageBtnStyle}>← Önceki</button>
          <span style={{ color: "#9ca3af", fontSize: "13px", alignSelf: "center" }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={pageBtnStyle}>Sonraki →</button>
        </div>
      )}

      {/* Detay Modal */}
      {selected && (
        <div style={overlayStyle} onClick={() => setSelected(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#f9fafb", flex: 1, paddingRight: "16px" }}>
                {selected.title}
              </h2>
              <button onClick={() => setSelected(null)} style={closeBtnStyle}>✕</button>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px", lineHeight: "1.6" }}>
              {selected.summary}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selected.admin_status !== "approved" &&
                <ModalBtn label="✓ Onayla" color="#22c55e" onClick={() => doAction(selected.id, "approve")} />}
              {selected.admin_status !== "rejected" &&
                <ModalBtn label="✕ Reddet" color="#ef4444" onClick={() => doAction(selected.id, "reject")} />}
              <ModalBtn label={selected.is_featured ? "✨ Öne Çıkar (kaldır)" : "✨ Öne Çıkar"}
                color="#f59e0b" onClick={() => doAction(selected.id, "feature", { currentValue: selected.is_featured })} />
              <ModalBtn label={selected.is_pinned ? "📌 Sabitle (kaldır)" : "📌 Sabitle"}
                color="#3b82f6" onClick={() => doAction(selected.id, "pin", { currentValue: selected.is_pinned })} />
              <ModalBtn label="⭐ Günün Hikâyesi" color="#a855f7"
                onClick={() => doAction(selected.id, "story_of_day")} />
              <ModalBtn label="🗑 Sil" color="#ef4444" onClick={() => doDelete(selected.id)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Yardımcı bileşenler ───────────────────────────────────────
function ActionBtn({ label, color, onClick, loading }:
  { label: string; color: string; onClick: () => void; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      fontSize: "11px", padding: "4px 8px", borderRadius: "6px",
      background: `${color}15`, color, border: `1px solid ${color}30`,
      cursor: "pointer", transition: "all 0.15s", fontWeight: "500",
    }}>
      {label}
    </button>
  );
}
function ModalBtn({ label, color, onClick }:
  { label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: "8px",
      background: `${color}20`, color, border: `1px solid ${color}40`,
      cursor: "pointer", fontSize: "13px", fontWeight: "600",
    }}>
      {label}
    </button>
  );
}

// ── Stil sabitleri ────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: "#1f2937", border: "1px solid #374151",
  borderRadius: "8px", padding: "8px 12px",
  color: "#f3f4f6", fontSize: "13px", outline: "none", minWidth: "200px",
};
const filterBtnStyle: React.CSSProperties = {
  padding: "8px 14px", borderRadius: "8px", border: "1px solid",
  fontSize: "13px", cursor: "pointer", transition: "all 0.15s",
};
const thStyle: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left", fontSize: "11px",
  fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em",
};
const tdStyle: React.CSSProperties = {
  padding: "12px 16px", fontSize: "13px", color: "#d1d5db",
};
const pageBtnStyle: React.CSSProperties = {
  padding: "6px 14px", borderRadius: "8px", border: "1px solid #1f2937",
  background: "#111827", color: "#9ca3af", cursor: "pointer", fontSize: "13px",
};
const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)", zIndex: 200,
  display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
};
const modalStyle: React.CSSProperties = {
  background: "#111827", border: "1px solid #1f2937",
  borderRadius: "16px", padding: "28px",
  width: "100%", maxWidth: "560px", maxHeight: "80vh", overflowY: "auto",
};
const closeBtnStyle: React.CSSProperties = {
  background: "#1f2937", border: "none", borderRadius: "8px",
  color: "#9ca3af", cursor: "pointer", padding: "4px 8px", fontSize: "14px",
};
