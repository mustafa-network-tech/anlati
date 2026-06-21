import { NextResponse } from "next/server";
import { verifyAdmin, createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const db = createServiceClient();
  const { data, error } = await db
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notifications: data ?? [] });
}

export async function POST(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { title, body: msgBody, target_type, target_id, scheduled_for } = body;

  if (!title || !msgBody) {
    return NextResponse.json({ error: "title ve body gerekli" }, { status: 400 });
  }

  const db = createServiceClient();
  const { data, error } = await db
    .from("notifications")
    .insert({
      title, body: msgBody,
      target_type: target_type ?? "all",
      target_id:   target_id   ?? null,
      scheduled_for: scheduled_for ?? null,
      created_by:  adminId,
      is_sent:     !scheduled_for,
      sent_at:     !scheduled_for ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_logs").insert({
    admin_id: adminId, action: "notification_send",
    description: `Bildirim gönderildi: ${title}`,
    metadata: { target_type, target_id },
  });

  return NextResponse.json({ notification: data });
}
