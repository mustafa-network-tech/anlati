import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit    = 20;
  const offset   = (page - 1) * limit;
  const status   = searchParams.get("status");
  const search   = searchParams.get("search");
  const category = searchParams.get("category");

  const db = createServiceClient();
  let query = db
    .from("stories")
    .select(`
      id, title, summary, category, is_anonymous, is_published,
      admin_status, is_featured, is_pinned, is_story_of_day,
      like_count, comment_count, read_count,
      created_at, updated_at, author_id,
      author:profiles!stories_author_id_fkey(display_name, avatar_url)
    `, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (status)   query = query.eq("admin_status", status);
  if (category) query = query.eq("category", category);
  if (search)   query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ stories: data ?? [], total: count ?? 0, page, limit });
}

export async function PATCH(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { id, action, ...payload } = body;
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const db = createServiceClient();
  let update: Record<string, unknown> = {};

  switch (action) {
    case "approve":     update = { admin_status: "approved" };             break;
    case "reject":      update = { admin_status: "rejected",
                                   rejection_reason: payload.reason ?? null }; break;
    case "feature":     update = { is_featured: !payload.currentValue };   break;
    case "pin":         update = { is_pinned: !payload.currentValue };      break;
    case "story_of_day":update = { is_story_of_day: true };                break;
    case "publish":     update = { is_published: true, admin_status: "approved" }; break;
    case "unpublish":   update = { is_published: false };                  break;
    case "category":    update = { category: payload.category };           break;
    default:            update = payload;
  }

  const { error } = await db.from("stories").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id:    adminId,
    action:      `story_${action}`,
    entity_type: "story",
    entity_id:   id,
    description: `Hikâye güncellendi: ${action}`,
    metadata:    { update },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const db = createServiceClient();
  const { error } = await db.from("stories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id:    adminId,
    action:      "story_delete",
    entity_type: "story",
    entity_id:   id,
    description: "Hikâye silindi",
  });

  return NextResponse.json({ ok: true });
}
