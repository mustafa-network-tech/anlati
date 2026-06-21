import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const db = createServiceClient();

  const [
    { count: totalUsers },
    { count: totalStories },
    { count: pendingStories },
    { count: totalComments },
    { count: pendingReports },
    { data: topStory },
    { data: recentUsers },
    { data: recentStories },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("stories").select("*", { count: "exact", head: true }),
    db.from("stories").select("*", { count: "exact", head: true }).eq("admin_status", "pending"),
    db.from("comments").select("*", { count: "exact", head: true }),
    db.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    db.from("stories").select("id,title,read_count").order("read_count", { ascending: false }).limit(1),
    db.from("profiles").select("id,display_name,email:id,created_at").order("created_at", { ascending: false }).limit(5),
    db.from("stories").select("id,title,admin_status,created_at,author_id").order("created_at", { ascending: false }).limit(5),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayUsers } = await db
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString());

  return NextResponse.json({
    stats: {
      totalUsers:     totalUsers    ?? 0,
      totalStories:   totalStories  ?? 0,
      pendingStories: pendingStories ?? 0,
      totalComments:  totalComments ?? 0,
      pendingReports: pendingReports ?? 0,
      todayUsers:     todayUsers    ?? 0,
    },
    topStory:     topStory?.[0]  ?? null,
    recentUsers:  recentUsers    ?? [],
    recentStories:recentStories  ?? [],
  });
}
