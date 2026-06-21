import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

// Basit in-memory settings (production'da veritabanına alınmalı)
// Bu örnek implementasyon gerçek settings tablosu eklenene kadar çalışır
const DEFAULT_SETTINGS = {
  site_name:         "ANLATI",
  site_description:  "Her Hikâyenin Bir Sesi Vardır",
  contact_email:     "",
  social_twitter:    "",
  social_instagram:  "",
  kvkk_url:          "",
  terms_url:         "",
  cookie_policy_url: "",
  ga_tracking_id:    "",
  search_console_id: "",
};

export async function GET(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  return NextResponse.json({ settings: DEFAULT_SETTINGS });
}

export async function POST(req: Request) {
  const adminId = await verifyAdmin(req);
  if (!adminId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  // TODO: veritabanına kaydet
  const body = await req.json();
  return NextResponse.json({ ok: true, settings: { ...DEFAULT_SETTINGS, ...body } });
}
