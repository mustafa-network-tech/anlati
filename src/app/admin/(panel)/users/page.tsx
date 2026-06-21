"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
  id: string; display_name: string | null; username: string | null;
  avatar_url: string | null; bio: string | null;
  role: "user" | "moderator" | "admin";
  status: "active" | "suspended" | "banned";
  ban_reason: string | null; banned_until: string | null;
  created_at: string; last_seen_at: string | null;
}

const ROLE_LABELS:   Record<string, string> = { user: "Kullanıcı", moderator: "Moderatör", admin: "Admin" };
const ROLE_COLORS:   Record<string, string> = { user: "#6b7280",  moderator: "#f59e0b",    admin: "#a855f7" };
const STATUS_LABELS: Record<string, string> = { active: "Aktif",  suspended: "Askıda",     banned: "Yasaklı" };
const STATUS_COLORS: Record<string, string> = { active: "#22c55e",suspended: "#f59e0b",    banned: "#ef4444" };

type Toast = { id: number; msg: string; type: "ok" | "err" };

export default function UsersPage() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("");
  const [status,  setStatus]  = useState("");
  const [toasts,  setToasts]  = useState<Toast[]>([]);
  const [selected,setSelected]= useState<User | null>(null);
  const [reason,  setReason]  = useState("");

  const addToast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    if (role)   p.set("role", role);
    if (status) p.set("status", status);
    const res = await fetch(`/api/admin/users?${p}`);
    const d   = await res.json();
    setUsers(d.users ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [page, search, role, status]);

  useEffect(() => { load(); }, [load]);

  async function doAction(id: string, action: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, reason }),
    });
    if (res.ok) { addToast("İşlem başarılı ✓"); load(); setSelected(null); setReason(""); }
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
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb" }}>Kullanıcı Yönetimi</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>
          Toplam {total.toLocaleString("tr-TR")} kullanıcı
        </p>
      </div>

      {/* Filtreler */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="İsim veya kullanıcı adı ara…" style={inputStyle} />
        {["", "user", "moderator", "admin"].map(r => (
          <button key={r} onClick={() => { setRole(r); setPage(1); }} style={{
            ...filterBtnStyle,
            background:  role === r ? "rgba(124,58,237,0.2)" : "transparent",
            color:       role === r ? "#c4b5fd" : "#9ca3af",
            borderColor: role === r ? "#7c3aed"  : "#1f2937",
          }}>
            {r === "" ? "Tüm Roller" : ROLE_LABELS[r]}
          </button>
        ))}
        {["", "active", "suspended", "banned"].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} style={{
            ...filterBtnStyle,
            background:  status === s ? "rgba(34,197,94,0.1)" : "transparent",
            color:       status === s ? "#4ade80" : "#9ca3af",
            borderColor: status === s ? "#22c55e"  : "#1f2937",
          }}>
            {s === "" ? "Tüm Durumlar" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              {["Kullanıcı", "Rol", "Durum", "Kayıt", "Son Giriş", "İşlemler"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(6).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} style={tdStyle}>
                    <div style={{ height: "16px", background: "#1f2937", borderRadius: "4px", width: "70%", opacity: 0.4 }} />
                  </td></tr>
                ))
              : users.length === 0
              ? <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "#6b7280", padding: "48px" }}>Kullanıcı bulunamadı.</td></tr>
              : users.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #111827", transition: "background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "13px", fontWeight: "700", color: "#fff", flexShrink: 0,
                        }}>{(u.display_name ?? u.username ?? "?").charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "500", color: "#f3f4f6" }}>
                            {u.display_name ?? "Anonim"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>@{u.username ?? "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: "11px", fontWeight: "600",
                        color: ROLE_COLORS[u.role],
                        background: `${ROLE_COLORS[u.role]}20`,
                        padding: "2px 8px", borderRadius: "20px",
                      }}>{ROLE_LABELS[u.role]}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: "11px", fontWeight: "600",
                        color: STATUS_COLORS[u.status],
                        background: `${STATUS_COLORS[u.status]}20`,
                        padding: "2px 8px", borderRadius: "20px",
                      }}>{STATUS_LABELS[u.status]}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {new Date(u.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#9ca3af" }}>
                      {u.last_seen_at ? new Date(u.last_seen_at).toLocaleDateString("tr-TR") : "—"}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => setSelected(u)} style={{
                        fontSize: "11px", padding: "4px 10px", borderRadius: "6px",
                        background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                        border: "1px solid rgba(59,130,246,0.3)", cursor: "pointer",
                      }}>
                        Yönet
                      </button>
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

      {/* Kullanıcı Yönet Modal */}
      {selected && (
        <div style={overlayStyle} onClick={() => { setSelected(null); setReason(""); }}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: "800", color: "#fff",
                }}>{(selected.display_name ?? "?").charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#f9fafb" }}>
                    {selected.display_name ?? "Anonim"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>@{selected.username ?? "—"}</div>
                </div>
              </div>
              <button onClick={() => { setSelected(null); setReason(""); }} style={closeBtnStyle}>✕</button>
            </div>

            <textarea
              value={reason} onChange={e => setReason(e.target.value)}
              placeholder="İşlem notu / ban sebebi (opsiyonel)"
              style={{ ...inputStyle, width: "100%", minHeight: "72px", resize: "vertical", marginBottom: "16px", boxSizing: "border-box" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { action: "make_admin",     label: "👑 Admin Yap",          color: "#a855f7" },
                { action: "make_moderator", label: "🛡 Moderatör Yap",       color: "#f59e0b" },
                { action: "make_user",      label: "👤 Kullanıcı Yap",       color: "#6b7280" },
                { action: "suspend",        label: "⏸ Geçici Askıya Al",     color: "#f59e0b" },
                { action: "ban",            label: "🚫 Kalıcı Yasakla",       color: "#ef4444" },
                { action: "unban",          label: "✅ Yasağı Kaldır",         color: "#22c55e" },
              ].map(a => (
                <button key={a.action} onClick={() => doAction(selected.id, a.action)} style={{
                  padding: "10px", borderRadius: "8px",
                  background: `${a.color}15`, color: a.color,
                  border: `1px solid ${a.color}30`,
                  cursor: "pointer", fontSize: "13px", fontWeight: "500",
                }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stil sabitleri
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
