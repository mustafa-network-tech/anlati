import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "ANLATI Admin Panel",
  description: "ANLATI yönetim paneli",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("role,display_name,avatar_url")
    .eq("id", user.id)
    .single();

  const profile = profileRaw as { role: string; display_name: string | null; avatar_url: string | null } | null;

  if (!profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: "#09090b" }}>
        <div style={{
          textAlign: "center",
          padding: "48px",
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "20px",
          maxWidth: "480px",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔒</div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#ef4444",
            margin: "0 0 8px",
          }}>403</h1>
          <h2 style={{ fontSize: "20px", color: "#fafafa", marginBottom: "12px" }}>
            Yetkisiz Erişim
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "32px", lineHeight: "1.6" }}>
            Bu alana erişim yetkiniz bulunmamaktadır.
            Admin hesabıyla giriş yapmanız gerekmektedir.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#7c3aed",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
