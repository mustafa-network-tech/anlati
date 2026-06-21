"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashStats {
  totalUsers: number; totalStories: number; pendingStories: number;
  totalComments: number; pendingReports: number; todayUsers: number;
}
interface DashData {
  stats: DashStats;
  topStory: { id: string; title: string; read_count: number } | null;
  recentStories: { id: string; title: string; admin_status: string; created_at: string }[];
  recentUsers: { id: string; display_name: string | null; created_at: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending:  "#f59e0b",
  approved: "#22c55e",
  rejected: "#ef4444",
};

export default function DashboardPage() {
  const [data,    setData]    = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashSkeleton />;
  if (!data)   return <ErrorState />;

  const { stats, topStory, recentStories, recentUsers } = data;

  const STAT_CARDS = [
    { label: "Toplam Üye",       value: stats.totalUsers,     icon: "👥", color: "#3b82f6", href: "/admin/users" },
    { label: "Toplam Hikâye",    value: stats.totalStories,   icon: "📖", color: "#8b5cf6", href: "/admin/stories" },
    { label: "Bekleyen Hikâye",  value: stats.pendingStories, icon: "⏳", color: "#f59e0b", href: "/admin/stories?status=pending" },
    { label: "Toplam Yorum",     value: stats.totalComments,  icon: "💬", color: "#22c55e", href: "/admin/comments" },
    { label: "Bekleyen Şikâyet", value: stats.pendingReports, icon: "🚨", color: "#ef4444", href: "/admin/reports?status=pending" },
    { label: "Bugün Yeni Üye",   value: stats.todayUsers,     icon: "🌟", color: "#a855f7", href: "/admin/users" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "4px", color: "#f9fafb" }}>
        Gösterge Paneli
      </h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
        ANLATI platformuna genel bakış
      </p>

      {/* Stat kartları */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "32px",
      }}>
        {STAT_CARDS.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: "none" }}>
            <div style={{
              background:   "#111827",
              border:       "1px solid #1f2937",
              borderRadius: "14px",
              padding:      "20px",
              cursor:       "pointer",
              transition:   "border-color 0.15s, transform 0.15s",
              display:      "flex",
              flexDirection:"column",
              gap:          "12px",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = c.color;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#1f2937";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{
                  width: "36px", height: "36px",
                  background: `${c.color}20`,
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                }}>{c.icon}</div>
                <span style={{ fontSize: "11px", color: "#4b5563" }}>↗</span>
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#f9fafb", lineHeight: 1 }}>
                  {c.value.toLocaleString("tr-TR")}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{c.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alt bölüm: son hikayeler + son üyeler */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Son Hikâyeler */}
        <div style={{
          background: "#111827", border: "1px solid #1f2937",
          borderRadius: "14px", padding: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6" }}>Son Hikâyeler</h2>
            <Link href="/admin/stories" style={{ fontSize: "12px", color: "#7c3aed", textDecoration: "none" }}>
              Tümünü Gör →
            </Link>
          </div>
          {recentStories.length === 0
            ? <p style={{ color: "#6b7280", fontSize: "13px" }}>Henüz hikâye yok.</p>
            : recentStories.map(s => (
              <div key={s.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid #1f2937",
              }}>
                <span style={{ fontSize: "13px", color: "#e5e7eb", flex: 1, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "12px" }}>
                  {s.title}
                </span>
                <span style={{
                  fontSize: "11px", fontWeight: "600",
                  color: STATUS_COLORS[s.admin_status] ?? "#6b7280",
                  background: `${STATUS_COLORS[s.admin_status] ?? "#6b7280"}20`,
                  padding: "2px 8px", borderRadius: "20px", flexShrink: 0,
                }}>
                  {s.admin_status === "pending" ? "Bekliyor" : s.admin_status === "approved" ? "Onaylı" : "Reddedildi"}
                </span>
              </div>
            ))
          }
        </div>

        {/* Son Üyeler */}
        <div style={{
          background: "#111827", border: "1px solid #1f2937",
          borderRadius: "14px", padding: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6" }}>Son Kayıtlar</h2>
            <Link href="/admin/users" style={{ fontSize: "12px", color: "#7c3aed", textDecoration: "none" }}>
              Tümünü Gör →
            </Link>
          </div>
          {recentUsers.length === 0
            ? <p style={{ color: "#6b7280", fontSize: "13px" }}>Henüz üye yok.</p>
            : recentUsers.map(u => (
              <div key={u.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid #1f2937",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "28px", height: "28px",
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700", color: "#fff",
                  }}>{(u.display_name ?? "?").charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: "13px", color: "#e5e7eb" }}>
                    {u.display_name ?? "Anonim Üye"}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>
                  {new Date(u.created_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
            ))
          }
        </div>
      </div>

      {/* En çok okunan */}
      {topStory && (
        <div style={{
          marginTop: "20px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.1))",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: "14px", padding: "20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "11px", color: "#a855f7", fontWeight: "600", marginBottom: "4px" }}>
              🏆 EN ÇOK OKUNAN HİKÂYE
            </div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#f9fafb" }}>{topStory.title}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#a855f7" }}>
              {topStory.read_count.toLocaleString("tr-TR")}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>görüntülenme</div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashSkeleton() {
  return (
    <div style={{ animation: "pulse 2s infinite" }}>
      <div style={{ height: "28px", background: "#1f2937", borderRadius: "8px", width: "200px", marginBottom: "8px" }} />
      <div style={{ height: "16px", background: "#1f2937", borderRadius: "8px", width: "300px", marginBottom: "28px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ height: "110px", background: "#111827", border: "1px solid #1f2937", borderRadius: "14px" }} />
        ))}
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
      <p style={{ color: "#6b7280" }}>Veriler yüklenemedi. Sayfayı yenileyin.</p>
    </div>
  );
}
