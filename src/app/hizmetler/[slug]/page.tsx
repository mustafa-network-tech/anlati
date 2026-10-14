import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/studio/ServicePage";
import { getService, services } from "@/lib/services";
import { siteUrl } from "@/lib/studio";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const url = `${siteUrl}/hizmetler/${s.slug}`;
  return {
    title: s.metaTitle,
    description: s.description,
    alternates: { canonical: `/hizmetler/${s.slug}` },
    openGraph: { title: `${s.metaTitle} | ANLATI`, description: s.description, type: "website", url, locale: "tr_TR", siteName: "ANLATI" },
    twitter: { card: "summary_large_image", title: `${s.metaTitle} | ANLATI`, description: s.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  return <ServicePage s={s} />;
}
