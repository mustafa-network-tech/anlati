import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit  = 30;
  const offset = (page - 1) * limit;
  const action = searchParams.get("action");

  const db = createServiceClient();
  let query = db
    .from("admin_logs")
    .select(`
      id, action, entity_type, entity_id,
      description, ip_address, metadata, created_at,
      admin:profiles!admin_logs_admin_id_fkey(display_name)
    `, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (action) query = query.ilike("action", `%${action}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ logs: data ?? [], total: count ?? 0, page, limit });
}
