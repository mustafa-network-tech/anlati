import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit      = 20;
  const offset     = (page - 1) * limit;
  const status     = searchParams.get("status");
  const targetType = searchParams.get("target_type");
  const countOnly  = searchParams.get("count") === "1";

  const db = createServiceClient();
  let query = db
    .from("reports")
    .select(`
      id, target_type, target_id, reason, description,
      status, admin_note, created_at, resolved_at,
      reporter:profiles!reports_reporter_id_fkey(display_name),
      resolver:profiles!reports_resolved_by_fkey(display_name)
    `, { count: "exact" });

  if (status)     query = query.eq("status", status);
  if (targetType) query = query.eq("target_type", targetType);

  if (!countOnly) {
    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (countOnly) return NextResponse.json({ total: count ?? 0 });

  return NextResponse.json({ reports: data ?? [], total: count ?? 0, page, limit });
}

export async function PATCH(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { id, action, note, targetId, targetType } = body;
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const db = createServiceClient();

  const statusMap: Record<string, string> = {
    resolve: "resolved",
    reject:  "rejected",
  };

  if (statusMap[action]) {
    const { error } = await db.from("reports").update({
      status:      statusMap[action],
      admin_note:  note ?? null,
      resolved_by: adminId,
      resolved_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (action === "hide_content" && targetId && targetType === "story") {
    await db.from("stories").update({ is_published: false }).eq("id", targetId);
  }

  if (action === "delete_content" && targetId) {
    if (targetType === "story")   await db.from("stories").delete().eq("id", targetId);
    if (targetType === "comment") await db.from("comments").delete().eq("id", targetId);
  }

  if (action === "ban_user" && targetId) {
    await db.from("profiles").update({ status: "banned", ban_reason: note ?? "Şikâyet" }).eq("id", targetId);
  }

  await db.from("admin_logs").insert({
    admin_id:    adminId,
    action:      `report_${action}`,
    entity_type: "report",
    entity_id:   id,
    description: `Şikâyet işlendi: ${action}`,
    metadata:    { action, note, targetId },
  });

  return NextResponse.json({ ok: true });
}
