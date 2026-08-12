import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let adminName = user?.email?.split("@")[0] ?? "Admin";
  let adminUsername = user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "admin";
  let adminAvatar: string | null = null;
  if (user) {
    const { data: profileRaw } = await supabase
      .from("profiles")
      .select("username,display_name,first_name,last_name,avatar_url")
      .eq("id", user.id)
      .single();
    const profile = profileRaw as { username: string | null; display_name: string | null; first_name: string | null; last_name: string | null; avatar_url: string | null } | null;
    const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
    if (profile?.username) adminUsername = profile.username;
    adminAvatar = profile?.avatar_url ?? null;
    adminName = fullName || profile?.display_name || adminUsername;
  }

  return <AdminShell adminName={adminName} adminUsername={adminUsername} adminAvatar={adminAvatar}>{children}</AdminShell>;
}
