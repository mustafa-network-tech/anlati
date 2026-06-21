import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const db = createServiceClient();
  const { data, error } = await db
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { slug, label, icon, color, description, sort_order } = body;
  if (!slug || !label) return NextResponse.json({ error: "slug ve label gerekli" }, { status: 400 });

  const db = createServiceClient();
  const { data, error } = await db
    .from("categories")
    .insert({ slug, label, icon: icon ?? "📝", color: color ?? "#7c3aed", description, sort_order: sort_order ?? 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id: adminId, action: "category_create", entity_type: "category",
    entity_id: data.id, description: `Kategori oluşturuldu: ${label}`,
  });

  return NextResponse.json({ category: data });
}

export async function PATCH(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id, ...update } = await req.json();
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const db = createServiceClient();
  const { error } = await db.from("categories").update({
    ...update, updated_at: new Date().toISOString()
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id: adminId, action: "category_update", entity_type: "category",
    entity_id: id, description: "Kategori güncellendi",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const db = createServiceClient();
  const { error } = await db.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id: adminId, action: "category_delete", entity_type: "category",
    entity_id: id, description: "Kategori silindi",
  });

  return NextResponse.json({ ok: true });
}
