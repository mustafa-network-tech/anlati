import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Tarayıcı (client component) ortamı için Supabase istemcisi.
 * Her render'da yeni instance oluşturmamak için singleton pattern.
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}
