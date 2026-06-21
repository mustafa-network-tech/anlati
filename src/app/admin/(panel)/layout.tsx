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
  if (user) {
    const { data: profileRaw } = await supabase
      .from("profiles")
      .select("display_name,avatar_url")
      .eq("id", user.id)
      .single();
    const profile = profileRaw as { display_name: string | null } | null;
    if (profile?.display_name) adminName = profile.display_name;
  }

  return <AdminShell adminName={adminName}>{children}</AdminShell>;
}
