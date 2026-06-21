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
  const role   = searchParams.get("role");
  const status = searchParams.get("status");

  const db = createServiceClient();
  let query = db
    .from("profiles")
    .select(`
      id, display_name, username, avatar_url, bio,
      role, status, ban_reason, banned_until,
      created_at, last_seen_at
    `, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (role)   query = query.eq("role", role);
  if (status) query = query.eq("status", status);
  if (search) query = query.or(
    `display_name.ilike.%${search}%,username.ilike.%${search}%`
  );

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data ?? [], total: count ?? 0, page, limit });
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
    case "make_admin":     update = { role: "admin" };                break;
    case "make_moderator": update = { role: "moderator" };            break;
    case "make_user":      update = { role: "user" };                 break;
    case "suspend": {
      const until = new Date();
      until.setDate(until.getDate() + (payload.days ?? 7));
      update = { status: "suspended", ban_reason: payload.reason ?? null, banned_until: until.toISOString() };
      break;
    }
    case "ban":      update = { status: "banned", ban_reason: payload.reason ?? null }; break;
    case "unban":    update = { status: "active", ban_reason: null, banned_until: null }; break;
    case "hide":     update = { status: "suspended" };                break;
    default:         update = payload;
  }

  const { error } = await db.from("profiles").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id:    adminId,
    action:      `user_${action}`,
    entity_type: "user",
    entity_id:   id,
    description: `Kullanıcı güncellendi: ${action}`,
    metadata:    { update },
  });

  return NextResponse.json({ ok: true });
}
