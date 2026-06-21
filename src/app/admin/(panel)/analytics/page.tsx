"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  topStories:    { id: string; title: string; read_count: number; like_count: number; comment_count: number; category: string }[];
  categoryStats: { category: string; count: number }[];
  dailySignups:  Record<string, number>;
}

const CAT_LABELS: Record<string, string> = {
  iliskiler: "İlişkiler", annelik: "Annelik", is_hayati: "İş Hayatı",
  yalnizlik: "Yalnızlık", aile: "Aile", yeniden_baslamak: "Yeniden Başlamak",
};
const CAT_COLORS: Record<string, string> = {
  iliskiler: "#e11d48", annelik: "#f59e0b", is_hayati: "#3b82f6",
  yalnizlik: "#8b5cf6", aile: "#10b981", yeniden_baslamak: "#22c55e",
};

export default function AnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb", marginBottom: "24px" }}>İstatistikler</h1>
      <div style={{ display: "grid", gap: "16px" }}>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} style={{ height: "160px", background: "#111827", border: "1px solid #1f2937", borderRadius: "14px" }} />
        ))}
      </div>
    </div>
  );

  if (!data) return <div style={{ color: "#6b7280" }}>Yüklenemedi.</div>;

  const maxReads = Math.max(...(data.topStories.map(s => s.read_count)), 1);
  const maxCat   = Math.max(...(data.categoryStats.map(c => c.count)), 1);
  const signupDays   = Object.keys(data.dailySignups).sort().slice(-14);
  const signupValues = signupDays.map(d => data.dailySignups[d] ?? 0);
  const maxSignup    = Math.max(...signupValues, 1);

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f9fafb", marginBottom: "8px" }}>İstatistikler</h1>
      <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "28px" }}>Son 30 günlük analitik veriler</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* En Çok Okunan Hikâyeler */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#f3f4f6", marginBottom: "20px" }}>
            🏆 En Çok Okunan Hikâyeler
          </h2>
          {data.topStories.slice(0, 8).map((s, i) => (
            <div key={s.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{
                  fontSize: "12px", color: "#e5e7eb",
                  flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "8px",
                }}>
                  <span style={{ color: "#6b7280", marginRight: "6px" }}>#{i + 1}</span>
                  {s.title}
                </span>
                <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0 }}>
                  {s.read_count.toLocaleString("tr-TR")}
                </span>
              </div>
              <div style={{ height: "4px", background: "#1f2937", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(s.read_count / maxReads) * 100}%`,
                  background: "linear-gradient(90deg,#7c3aed,#a855f7)",
                  borderRadius: "2px",
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Kategori Dağılımı */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#f3f4f6", marginBottom: "20px" }}>
            🏷️ Kategori Dağılımı
          </h2>
          {data.categoryStats.slice(0, 8).map(c => (
            <div key={c.category} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "#e5e7eb", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{
                    display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
                    background: CAT_COLORS[c.category] ?? "#7c3aed",
                  }} />
                  {CAT_LABELS[c.category] ?? c.category}
                </span>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>{c.count}</span>
              </div>
              <div style={{ height: "4px", background: "#1f2937", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(c.count / maxCat) * 100}%`,
                  background: CAT_COLORS[c.category] ?? "#7c3aed",
                  borderRadius: "2px",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Günlük Kayıt Grafiği (son 14 gün) */}
        <div style={{
          background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "24px",
          gridColumn: "1 / -1",
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#f3f4f6", marginBottom: "20px" }}>
            📈 Günlük Yeni Üye Grafiği (Son 14 Gün)
          </h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
            {signupDays.map((day, i) => (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
                <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div
                    title={`${day}: ${signupValues[i]}`}
                    style={{
                      width: "100%",
                      height: `${Math.max((signupValues[i] / maxSignup) * 100, 4)}%`,
                      background: "linear-gradient(180deg,#a855f7,#7c3aed)",
                      borderRadius: "3px 3px 0 0",
                      transition: "height 0.4s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                  />
                </div>
                <span style={{
                  fontSize: "9px", color: "#4b5563",
                  transform: "rotate(-45deg)", whiteSpace: "nowrap",
                }}>
                  {day.slice(5)}
                </span>
              </div>
            ))}
          </div>
          {signupDays.length === 0 && (
            <p style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
              Henüz kayıt verisi yok.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
