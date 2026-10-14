export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.anlati.com.tr").replace(/\/$/, "");

export const ogImages = [
  { url: "/og/anlati-studyo.png", width: 1200, height: 630, alt: "ANLATI: marka hikâyesi ve kurumsal metin hizmetleri" },
];

export const contactEmail = "iletisim@mk-digitalsystems.com";
export const whatsappNumber = "905456597551";
export const whatsappDisplay = "+90 545 659 75 51";
export const whatsappLink = (text?: string) =>
  `https://wa.me/${whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const launch = { endsAt: "2027-01-15T23:59:59+03:00", label: "15 Ocak 2027" };

export const isLaunchActive = (now: number = Date.now()) => now <= Date.parse(launch.endsAt);

export const launchNote = `Lansman fiyatları ${launch.label}’ye kadar geçerlidir.`;

export type Pkg = {
  id: string;
  name: string;
  tagline: string;
  launchPrice: number | null;
  postLaunchPrice: number | null;
  priceNote: string;
  duration: string;
  revisions: string;
  includes: string[];
  excludes: string[];
  featured?: boolean;
};

// Fiyatlar test önerisidir; onaylanana kadar canlıya alınmamalıdır. Tek yerden değişir.
export const packages: Pkg[] = [
  {
    id: "netlik",
    name: "Anlatı Netlik",
    tagline: "Ne yaptığınızı tek net hikâyeye indirir.",
    launchPrice: 7900,
    postLaunchPrice: null,
    priceNote: "+ KDV",
    duration: "5 iş günü",
    revisions: "1 revizyon turu",
    includes: [
      "60 dakikalık keşif görüşmesi",
      "Ana mesaj cümlesi",
      "Kısa marka hikâyesi (yaklaşık 150 kelime)",
      "3 başlık alternatifi",
      "1 çağrı (CTA) önerisi",
    ],
    excludes: ["Web sitesi tasarımı veya geliştirme", "Görsel, fotoğraf, video üretimi", "Birden fazla marka"],
  },
  {
    id: "marka",
    name: "Marka Anlatısı",
    tagline: "Markanızın mesajını web sitenize hazır metinlere çevirir.",
    launchPrice: 19900,
    postLaunchPrice: null,
    priceNote: "+ KDV",
    duration: "10–12 iş günü",
    revisions: "2 revizyon turu",
    featured: true,
    includes: [
      "90 dakikalık keşif görüşmesi ve kısa ön form",
      "Konumlandırma özeti",
      "Ana sayfa akışı ve metinleri",
      "Hakkımızda sayfası",
      "5 slogan seçeneği",
      "1 sayfalık ton rehberi",
    ],
    excludes: ["Web sitesi tasarımı veya geliştirme", "Fotoğraf, video, çeviri", "Reklam ve kampanya yönetimi"],
  },
  {
    id: "dijital",
    name: "Anlatı + Dijital Deneyim",
    tagline: "Anlatıyı MK Digital Systems ile çalışan bir web sitesine veya ürüne dönüştürür.",
    launchPrice: null,
    postLaunchPrice: null,
    priceNote: "Keşif sonrası teklif",
    duration: "Kapsama göre",
    revisions: "Teklifte belirlenir",
    includes: [
      "Marka Anlatısı çalışması",
      "Web sitesi veya dijital ürün tasarımı ve geliştirmesi (MK Digital Systems)",
      "Yayına alma ve teslim sonrası destek planı",
    ],
    excludes: ["Kapsam ve fiyat, keşif görüşmesinden sonra yazılı teklifle netleşir"],
  },
];

export const tl = (n: number) => `${n.toLocaleString("tr-TR")} TL`;

export const solutions = [
  {
    id: "marka",
    title: "Marka anlatısı",
    text: "İşletmenizin neyi, kim için ve neden farklı yaptığını anlaşılır bir mesaja ve web sitesi metinlerine çevirir.",
  },
  {
    id: "kurucu",
    title: "Kurucu anlatısı",
    text: "Kurucunun yolculuğunu, güven veren ve hatırlanır bir hikâyeye dönüştürür. Hakkımızda, LinkedIn ve sunumlar için.",
  },
  {
    id: "kurum",
    title: "Kurum anlatısı",
    text: "Köklü şirket, dernek veya okulun geçmişini ve değerlerini ekip, müşteri ve paydaşlar için tek bir anlatıda toplar.",
  },
];

export const examples = [
  {
    key: "otel",
    sector: "Otel yazılımı",
    before: "Kaliteli ve yenilikçi çözümler sunuyoruz.",
    after: "Küçük otellerin rezervasyonlarını, odalarını ve günlük işlerini tek ekranda topluyoruz.",
    notes: [
      ["Kimin için?", "Küçük oteller"],
      ["Hangi ihtiyaç?", "Dağınık günlük işler"],
      ["Nasıl bir çözüm?", "Tek ekranda toplama"],
    ],
  },
  {
    key: "atolye",
    sector: "Ahşap atölyesi",
    before: "2015 yılında kurulduk. Kaliteli ürünler üretiyoruz.",
    after: "Dedemin tezgâhından kalan üç alet ve bir hata: ilk sipariş yanlış ölçüyle kesildi. Atölyeyi bu hatadan öğrendiğimiz şeyle kurduk.",
    notes: [
      ["Kimin için?", "Elden çıkan işe değer verenler"],
      ["Hangi ihtiyaç?", "Güven ve karakter"],
      ["Nasıl bir çözüm?", "Hatadan doğan bir kuruluş hikâyesi"],
    ],
  },
  {
    key: "uretim",
    sector: "B2B hizmet firması",
    before: "20 yıllık tecrübemizle sektörün önde gelen firmalarından biriyiz.",
    after: "Fabrikanızın üretim hattı durduğunda arayacağınız ilk numara olmayı hedefliyoruz. Bu yüzden her müşteriye tek bir sorumlu mühendis atıyoruz.",
    notes: [
      ["Kimin için?", "Üretim hattı sorumluları"],
      ["Hangi ihtiyaç?", "Kesinti anında hızlı çözüm"],
      ["Nasıl bir çözüm?", "Tek sorumlu mühendis"],
    ],
  },
];

const baseFaqs = [
  {
    q: "Hazır bir metnim yok, yine de başlayabilir miyiz?",
    a: "Evet. Hazır metin gerekmez; bir görüşmeyle başlarız. Sizi dinler, notlarımızı çıkarır ve metni birlikte kurarız.",
  },
  {
    q: "Yalnızca metin mi yazıyorsunuz?",
    a: "Önce anlatıyı kurarız. İsterseniz aynı anlatıyı MK Digital Systems ile web sitesine veya dijital ürüne dönüştürürüz; mesaj ile ekran arasında kayıp olmaz.",
  },
  {
    q: "Süreç ne kadar sürer?",
    a: "Anlatı Netlik yaklaşık 5 iş günü, Marka Anlatısı 10–12 iş günü sürer. Dijital deneyim projelerinde süre kapsama göre keşif görüşmesinden sonra netleşir.",
  },
  {
    q: "Kaç revizyon hakkım var?",
    a: "Anlatı Netlik paketinde 1, Marka Anlatısı paketinde 2 revizyon turu bulunur. Kapsam dışı işler baştan açıkça belirtilir.",
  },
  {
    q: "Fiyatlara KDV dahil mi?",
    a: "__KDV__",
  },
  {
    q: "Başarıyı nasıl tanımlıyorsunuz?",
    a: "Keşif görüşmesinde başarı ölçütünü birlikte yazarız: ana mesajın anlaşılması, metinlerin kullanıma hazır olması ve hedef kitlenin ilk bakışta ne yaptığınızı ve neden sizi seçmesi gerektiğini kavraması.",
  },
];

export function getFaqs(now: number = Date.now()) {
  const kdv = isLaunchActive(now)
    ? `Hayır, paket fiyatlarına KDV eklenir. ${launchNote}`
    : "Hayır, paket fiyatlarına KDV eklenir. Güncel fiyatlar için teklif alabilirsiniz.";
  return baseFaqs.map((f) => (f.a === "__KDV__" ? { ...f, a: kdv } : f));
}

export const posters = ["Dinle.", "Netleştir.", "Yaz.", "Bağla."];

export const steps = [
  { title: "Dinle", text: "Keşif görüşmesinde işinizi, müşterinizi ve neyin sizi farklı kıldığını konuşuruz." },
  { title: "Netleştir", text: "Ana mesajı ve anlatının omurgasını çıkarır, onayınıza sunarız." },
  { title: "Yaz", text: "Onaylanan omurgayla metinleri yazar, revizyon turlarında birlikte düzeltiriz." },
  { title: "Teslim et ve bağla", text: "Metinleri teslim ederiz. İsterseniz MK Digital Systems ile web sitenize dönüştürürüz." },
];
