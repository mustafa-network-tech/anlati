"use client";

import { useEffect, useState, useCallback } from "react";

interface Comment {
  id: string; content: string; is_anonymous: boolean;
  created_at: string; story_id: string; author_id: string;
  author: { display_name: string | null; avatar_url: string | null } | null;
  story: { title: string } | null;
}

type Toast = { id: number; msg: string; type: "ok" | "err" };

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [toasts,   setToasts]   = useState<Toast[]>([]);

  const addToast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    const res = await fetch(`/api/admin/comments?${p}`);
    const d   = await res.json();
    setComments(d.comments ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  async function doDelete(id: string) {
    if (!confirm("Yorumu silmek istiyor musunuz?")) return;
    const res = await fetch("/api/admin/comments", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { addToast("Yorum silindi ✓"); load(); }
    else        { addToast("Silinemedi", "err"); }
  }

  const totalPages = Math.ceil(total / 20);

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

      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb" }}>Yorum Yönetimi</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>
          Toplam {total.toLocaleString("tr-TR")} yorum
        </p>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Yorum içeriği ara…" style={inputStyle} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {loading
          ? Array(5).fill(0).map((_, i) => (
              <div key={i} style={{
                background: "#111827", border: "1px solid #1f2937",
                borderRadius: "12px", padding: "16px",
              }}>
                <div style={{ height: "14px", background: "#1f2937", borderRadius: "4px", width: "40%", marginBottom: "8px", opacity: 0.5 }} />
                <div style={{ height: "12px", background: "#1f2937", borderRadius: "4px", width: "70%", opacity: 0.3 }} />
              </div>
            ))
          : comments.length === 0
          ? <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Yorum bulunamadı.</div>
          : comments.map(c => (
              <div key={c.id} style={{
                background: "#111827", border: "1px solid #1f2937",
                borderRadius: "12px", padding: "16px",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#374151"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1f2937"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "700", color: "#fff",
                    }}>
                      {c.is_anonymous ? "?" : (c.author?.display_name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#e5e7eb" }}>
                        {c.is_anonymous ? "Anonim" : (c.author?.display_name ?? "—")}
                      </span>
                      <span style={{ fontSize: "11px", color: "#6b7280", marginLeft: "8px" }}>
                        {new Date(c.created_at).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => doDelete(c.id)} style={{
                    fontSize: "11px", padding: "4px 10px", borderRadius: "6px",
                    background: "rgba(239,68,68,0.15)", color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.3)", cursor: "pointer",
                  }}>Sil</button>
                </div>
                <p style={{ fontSize: "13px", color: "#d1d5db", lineHeight: "1.6", margin: "0 0 10px" }}>
                  {c.content}
                </p>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                  📖 {c.story?.title ?? "Silinmiş hikâye"}
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
