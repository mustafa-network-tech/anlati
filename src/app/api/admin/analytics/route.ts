import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const db = createServiceClient();

  const days = 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [
    { data: topStories },
    { data: topCategories },
    { data: recentSignups },
  ] = await Promise.all([
    db.from("stories")
      .select("id,title,read_count,like_count,comment_count,category")
      .eq("admin_status", "approved")
      .order("read_count", { ascending: false })
      .limit(10),
    db.from("stories")
      .select("category")
      .eq("admin_status", "approved"),
    db.from("profiles")
      .select("created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true }),
  ]);

  // Kategori istatistikleri
  const catMap: Record<string, number> = {};
  (topCategories ?? []).forEach(s => {
    catMap[s.category] = (catMap[s.category] ?? 0) + 1;
  });
  const categoryStats = Object.entries(catMap)
    .map(([cat, count]) => ({ category: cat, count }))
    .sort((a, b) => b.count - a.count);

  // Günlük kayıt sayısı (son 30 gün)
  const dailySignups: Record<string, number> = {};
  (recentSignups ?? []).forEach(u => {
    const day = u.created_at.slice(0, 10);
    dailySignups[day] = (dailySignups[day] ?? 0) + 1;
  });

  return NextResponse.json({
    topStories:    topStories    ?? [],
    categoryStats,
    dailySignups,
  });
}
