"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { path: "/admin/dashboard",      label: "Gösterge Paneli", icon: "⬡" },
  { path: "/admin/stories",        label: "Hikâyeler",        icon: "📖" },
  { path: "/admin/comments",       label: "Yorumlar",         icon: "💬" },
  { path: "/admin/reports",        label: "Şikâyetler",       icon: "🚨" },
  { path: "/admin/users",          label: "Kullanıcılar",     icon: "👥" },
  { path: "/admin/categories",     label: "Kategoriler",      icon: "🏷️" },
  { path: "/admin/notifications",  label: "Bildirimler",      icon: "🔔" },
  { path: "/admin/analytics",      label: "İstatistikler",    icon: "📊" },
  { path: "/admin/settings",       label: "Ayarlar",          icon: "⚙️" },
  { path: "/admin/logs",           label: "Sistem Logları",   icon: "📋" },
];

interface AdminShellProps {
  children: React.ReactNode;
  adminName?: string;
}

export default function AdminShell({ children, adminName = "Admin" }: AdminShellProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    async function loadBadges() {
      const res = await fetch("/api/admin/reports?status=pending&count=1").catch(() => null);
      if (res?.ok) {
        const d = await res.json();
        setPendingReports(d.total ?? 0);
      }
    }
    loadBadges();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  }

  const pageTitle = NAV.find(n => pathname.startsWith(n.path))?.label ?? "Admin Panel";

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", color: "#fafafa" }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width:         sidebarOpen ? "240px" : "64px",
        transition:    "width 0.2s ease",
        flexShrink:    0,
        background:    "rgba(17,24,39,0.9)",
        backdropFilter:"blur(20px)",
        borderRight:   "1px solid #1f2937",
        display:       "flex",
        flexDirection: "column",
        position:      "fixed",
        top: 0, left: 0,
        height: "100vh",
        zIndex: 50,
        overflow:      "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding:        "20px 16px",
          display:        "flex",
          alignItems:     "center",
          gap:            "10px",
          borderBottom:   "1px solid #1f2937",
          flexShrink:     0,
        }}>
          <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", flexShrink: 0,
          }}>✦</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight: "800", fontSize: "15px", letterSpacing: "-0.3px", lineHeight: 1 }}>
                ANLATI
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {NAV.map(item => {
            const active = pathname.startsWith(item.path);
            const badge  = item.path === "/admin/reports" && pendingReports > 0 ? pendingReports : null;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display:     "flex",
                  alignItems:  "center",
                  gap:         "10px",
                  padding:     sidebarOpen ? "9px 16px" : "9px 16px",
                  margin:      "1px 8px",
                  borderRadius:"8px",
                  fontSize:    "13.5px",
                  fontWeight:  active ? "600" : "400",
                  color:       active ? "#c4b5fd" : "#9ca3af",
                  background:  active ? "rgba(124,58,237,0.15)" : "transparent",
                  textDecoration: "none",
                  transition:  "all 0.15s",
                  whiteSpace:  "nowrap",
                  overflow:    "hidden",
                  position:    "relative",
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "#e5e7eb";
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = active ? "#c4b5fd" : "#9ca3af";
                }}
              >
                <span style={{ fontSize: "15px", flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {badge && (
                      <span style={{
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "1px 6px",
                        borderRadius: "20px",
                        minWidth: "18px",
                        textAlign: "center",
                      }}>{badge > 99 ? "99+" : badge}</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #1f2937", padding: "12px 8px", flexShrink: 0 }}>
          {sidebarOpen && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px", marginBottom: "4px",
            }}>
              <div style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "700", color: "#fff", flexShrink: 0,
              }}>A</div>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#f3f4f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminName}</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>Sistem Yöneticisi</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 8px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              color: "#6b7280",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
              (e.currentTarget as HTMLElement).style.color = "#ef4444";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#6b7280";
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────── */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? "240px" : "64px",
        transition: "margin-left 0.2s ease",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: 0,
      }}>
        {/* Top header */}
        <header style={{
          position:      "sticky",
          top:            0,
          zIndex:         40,
          height:         "56px",
          background:     "rgba(9,9,11,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom:   "1px solid #1f2937",
          display:        "flex",
          alignItems:     "center",
          padding:        "0 24px",
          gap:            "12px",
        }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              background: "transparent",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "16px",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
            }}
            title="Menüyü Aç/Kapat"
          >☰</button>
          <span style={{ color: "#374151", fontSize: "14px" }}>/</span>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#e5e7eb" }}>{pageTitle}</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="/"
              target="_blank"
              style={{
                fontSize: "12px",
                color: "#6b7280",
                textDecoration: "none",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #1f2937",
                transition: "all 0.15s",
              }}
            >↗ Siteyi Gör</a>
          </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: "28px 28px",
          overflowY: "auto",
          maxWidth: "1400px",
          width: "100%",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
