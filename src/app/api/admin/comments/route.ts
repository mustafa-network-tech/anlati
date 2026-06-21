import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit  = 20;
  const offset = (page - 1) * limit;
  const search = searchParams.get("search");

  const db = createServiceClient();
  let query = db
    .from("comments")
    .select(`
      id, content, is_anonymous, created_at, story_id, author_id,
      author:profiles!comments_author_id_fkey(display_name, avatar_url),
      story:stories!comments_story_id_fkey(title)
    `, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (search) query = query.ilike("content", `%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ comments: data ?? [], total: count ?? 0, page, limit });
}

export async function DELETE(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const db = createServiceClient();
  const { error } = await db.from("comments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id:    adminId,
    action:      "comment_delete",
    entity_type: "comment",
    entity_id:   id,
    description: "Yorum silindi",
  });

  return NextResponse.json({ ok: true });
}
