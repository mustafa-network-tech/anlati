import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import "./admin.css";

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
      <main className="admin-denied"><div><span>403</span><h1>Yetkisiz erişim</h1><p>Bu alan yalnızca ANLATI yöneticilerine açıktır.</p><Link href="/">Ana sayfaya dön</Link></div></main>
    );
  }

  return <>{children}</>;
}
