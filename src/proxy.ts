import { NextResponse } from "next/server";

export function proxy() {
  return new NextResponse("Bu sayfa kaldırıldı.", {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

export const config = {
  matcher: [
    "/konu/:path*",
    "/konu-ac",
    "/kategori/:path*",
    "/kategoriler",
    "/erkeklere-sor",
    "/kadinlara-sor",
    "/profil/:path*",
    "/profil",
    "/feed",
    "/ara",
    "/auth",
    "/admin/:path*",
    "/admin",
    "/api/admin/:path*",
  ],
};
