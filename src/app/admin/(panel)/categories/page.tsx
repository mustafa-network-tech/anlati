"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string; slug: string; label: string; icon: string; color: string;
  description: string | null; is_active: boolean; sort_order: number;
  story_count: number; created_at: string;
}

type Toast = { id: number; msg: string; type: "ok" | "err" };

const EMPTY: Partial<Category> = { slug: "", label: "", icon: "📝", color: "#7c3aed", description: "", is_active: true, sort_order: 0 };

export default function CategoriesPage() {
  const [cats,    setCats]    = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts,  setToasts]  = useState<Toast[]>([]);
  const [modal,   setModal]   = useState<"create" | "edit" | null>(null);
  const [form,    setForm]    = useState<Partial<Category>>(EMPTY);

  const addToast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const d   = await res.json();
    setCats(d.categories ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.slug || !form.label) { addToast("Slug ve etiket zorunlu", "err"); return; }
    const method = modal === "edit" ? "PATCH" : "POST";
    const res = await fetch("/api/admin/categories", {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { addToast(`Kategori ${modal === "edit" ? "güncellendi" : "oluşturuldu"} ✓`); load(); setModal(null); }
    else        { const e = await res.json(); addToast(e.error ?? "Hata", "err"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Kategoriyi silmek istiyor musunuz?")) return;
    const res = await fetch("/api/admin/categories", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { addToast("Kategori silindi"); load(); }
    else        { addToast("Silinemedi", "err"); }
  }

  async function toggleActive(cat: Category) {
    await fetch("/api/admin/categories", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, is_active: !cat.is_active }),
    });
    load();
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb" }}>Kategori Yönetimi</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>{cats.length} kategori</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal("create"); }} style={{
          padding: "10px 18px", borderRadius: "10px",
          background: "linear-gradient(135deg,#7c3aed,#a855f7)",
          color: "#fff", border: "none", cursor: "pointer",
          fontSize: "13px", fontWeight: "600",
        }}>+ Yeni Kategori</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {loading
          ? Array(6).fill(0).map((_, i) => (
              <div key={i} style={{
                height: "120px", background: "#111827", border: "1px solid #1f2937",
                borderRadius: "14px",
              }} />
            ))
          : cats.map(c => (
              <div key={c.id} style={{
                background: "#111827", border: "1px solid #1f2937",
                borderRadius: "14px", padding: "20px",
                borderLeft: `3px solid ${c.color}`,
                opacity: c.is_active ? 1 : 0.5,
                transition: "opacity 0.2s, transform 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: `${c.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px",
                    }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#f3f4f6" }}>{c.label}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>/{c.slug}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: "600",
                    color: c.is_active ? "#22c55e" : "#6b7280",
                    background: c.is_active ? "#052e16" : "#1f2937",
                    padding: "2px 6px", borderRadius: "20px",
                  }}>{c.is_active ? "Aktif" : "Pasif"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                    {c.story_count.toLocaleString("tr-TR")} hikâye
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={toggleActive.bind(null, c)} style={smBtnStyle("#f59e0b")}>
                      {c.is_active ? "Pasif" : "Aktif"} Yap
                    </button>
                    <button onClick={() => { setForm({ ...c }); setModal("edit"); }} style={smBtnStyle("#3b82f6")}>
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(c.id)} style={smBtnStyle("#ef4444")}>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Kategori Modal */}
      {modal && (
        <div style={overlayStyle} onClick={() => setModal(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#f9fafb" }}>
                {modal === "edit" ? "Kategori Düzenle" : "Yeni Kategori"}
              </h2>
              <button onClick={() => setModal(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <FormRow label="Slug (URL)">
                <input value={form.slug ?? ""} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="ornek-kategori" style={inputStyle} />
              </FormRow>
              <FormRow label="Etiket">
                <input value={form.label ?? ""} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="Kategori Adı" style={inputStyle} />
              </FormRow>
              <FormRow label="İkon (emoji)">
                <input value={form.icon ?? ""} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  placeholder="📝" style={{ ...inputStyle, width: "80px" }} />
              </FormRow>
              <FormRow label="Renk">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="color" value={form.color ?? "#7c3aed"}
                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    style={{ width: "40px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer" }} />
                  <input value={form.color ?? ""} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    style={{ ...inputStyle, width: "100px" }} />
                </div>
              </FormRow>
              <FormRow label="Sıra">
                <input type="number" value={form.sort_order ?? 0}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  style={{ ...inputStyle, width: "80px" }} />
              </FormRow>
              <button onClick={handleSave} style={{
                padding: "12px", borderRadius: "10px",
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "#fff", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: "600", marginTop: "8px",
              }}>
                {modal === "edit" ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>{label}</label>
      {children}
    </div>
  );
}

const smBtnStyle = (color: string): React.CSSProperties => ({
  fontSize: "10px", padding: "3px 8px", borderRadius: "6px",
  background: `${color}15`, color, border: `1px solid ${color}30`, cursor: "pointer",
});
const inputStyle: React.CSSProperties = {
  background: "#1f2937", border: "1px solid #374151", borderRadius: "8px",
  padding: "8px 12px", color: "#f3f4f6", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box",
};
const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
  zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
};
const modalStyle: React.CSSProperties = {
  background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
  padding: "28px", width: "100%", maxWidth: "440px",
};
const closeBtnStyle: React.CSSProperties = {
  background: "#1f2937", border: "none", borderRadius: "8px",
  color: "#9ca3af", cursor: "pointer", padding: "4px 8px", fontSize: "14px",
};
