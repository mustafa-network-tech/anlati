"use client";

import { useEffect, useState, useCallback } from "react";

interface Log {
  id: string; action: string; entity_type: string | null; entity_id: string | null;
  description: string; ip_address: string | null; metadata: Record<string, unknown>;
  created_at: string;
  admin: { display_name: string | null } | null;
}

const ACTION_COLORS: Record<string, string> = {
  story:    "#8b5cf6",
  user:     "#3b82f6",
  comment:  "#22c55e",
  report:   "#ef4444",
  category: "#f59e0b",
  notif:    "#06b6d4",
};

function actionColor(action: string): string {
  const prefix = Object.keys(ACTION_COLORS).find(k => action.startsWith(k));
  return prefix ? ACTION_COLORS[prefix] : "#6b7280";
}

export default function LogsPage() {
  const [logs,    setLogs]    = useState<Log[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("action", search);
    const res = await fetch(`/api/admin/logs?${p}`);
    const d   = await res.json();
    setLogs(d.logs  ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 30);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb" }}>Sistem Logları</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>
          Toplam {total.toLocaleString("tr-TR")} işlem kaydı
        </p>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="İşlem türü ara (story, user, comment…)"
          style={inputStyle} />
      </div>

      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", overflow: "hidden" }}>
        {loading
          ? Array(8).fill(0).map((_, i) => (
              <div key={i} style={{
                display: "flex", gap: "12px", alignItems: "center",
                padding: "14px 20px", borderBottom: "1px solid #1f2937",
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1f2937" }} />
                <div style={{ flex: 1, height: "14px", background: "#1f2937", borderRadius: "4px", opacity: 0.4 }} />
                <div style={{ width: "100px", height: "12px", background: "#1f2937", borderRadius: "4px", opacity: 0.3 }} />
              </div>
            ))
          : logs.length === 0
          ? <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Log bulunamadı.</div>
          : logs.map(log => (
              <div key={log.id} style={{
                display: "flex", gap: "16px", alignItems: "flex-start",
                padding: "14px 20px", borderBottom: "1px solid #111827",
                transition: "background 0.1s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  background: actionColor(log.action), marginTop: "5px",
                  boxShadow: `0 0 6px ${actionColor(log.action)}80`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: "700",
                      color: actionColor(log.action),
                      background: `${actionColor(log.action)}15`,
                      padding: "1px 6px", borderRadius: "4px",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>{log.action}</span>
                    <span style={{ fontSize: "13px", color: "#e5e7eb" }}>{log.description}</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#6b7280" }}>
                    <span>👤 {log.admin?.display_name ?? "Sistem"}</span>
                    {log.entity_type && <span>🎯 {log.entity_type}</span>}
                    {log.ip_address  && <span>🌐 {log.ip_address}</span>}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {new Date(log.created_at).toLocaleString("tr-TR", {
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>
              </div>
            ))
        }
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
          <button disabled={page <= 1}         onClick={() => setPage(p => p - 1)} style={pageBtnStyle}>← Önceki</button>
          <span style={{ color: "#9ca3af", fontSize: "13px", alignSelf: "center" }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={pageBtnStyle}>Sonraki →</button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#1f2937", border: "1px solid #374151", borderRadius: "8px",
  padding: "8px 12px", color: "#f3f4f6", fontSize: "13px", outline: "none", minWidth: "280px",
};
const pageBtnStyle: React.CSSProperties = {
  padding: "6px 14px", borderRadius: "8px", border: "1px solid #1f2937",
  background: "#111827", color: "#9ca3af", cursor: "pointer", fontSize: "13px",
};
