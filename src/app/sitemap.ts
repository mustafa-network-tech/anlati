import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/studio";

// Yalnızca yeni stüdyo sayfaları. Topluluk konu URL'leri, envanter çıkarılana kadar bilerek dışarıda.
const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/hizmetler", priority: 0.9 },
  { path: "/hizmetler/marka-anlatisi", priority: 0.9 },
  { path: "/hizmetler/hakkimizda-ve-kurumsal-tanitim-metinleri", priority: 0.9 },
  { path: "/hizmetler/web-sitesi-metinleri", priority: 0.9 },
  { path: "/iletisim", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${siteUrl}${r.path}`, priority: r.priority }));
}
