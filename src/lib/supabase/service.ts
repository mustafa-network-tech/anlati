import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Service Role istemcisi — SADECE sunucu tarafında kullanılır.
 * RLS politikalarını atlar; istemci tarafına gönderilmemelidir.
 * .env.local'e SUPABASE_SERVICE_ROLE_KEY eklenmesi gerekir.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik. " +
      ".env.local dosyasına ekleyin."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Admin kimliğini doğrular — API route'larında kullanılır.
 * Mevcut Supabase oturum çerezini kullanır.
 */
export async function verifyAdmin(_req: Request): Promise<string | null> {
  const { createServerClient }  = await import("@supabase/ssr");
  const { cookies }             = await import("next/headers");

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user.id : null;
}
