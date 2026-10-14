export type Service = {
  slug: string;
  nav: string;
  metaTitle: string;
  description: string;
  h1: string;
  lede: string;
  audience: string[];
  deliverables: string[];
  example: { context: string; before: string; after: string; note: string };
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  pkg: string;
};

export const services: Service[] = [
  {
    slug: "marka-anlatisi",
    nav: "Marka hikâyesi yazımı",
    metaTitle: "Marka Hikâyesi Yazımı ve Marka Anlatısı",
    description:
      "İşletmenizin ana mesajını, marka hikâyesini ve marka dilini netleştiren marka hikâyesi yazımı hizmeti. Kapsam, süre ve revizyonlar açık paketlerle.",
    h1: "Marka hikâyesi yazımı",
    lede: "Ne yaptığınızı, kim için yaptığınızı ve neden farklı yaptığınızı anlatan marka hikâyesini görüşmeyle birlikte kuruyor, web sitenizde ve sunumlarınızda kullanabileceğiniz metinlere dönüştürüyoruz.",
    audience: [
      "Ne yaptığını tek cümlede anlatmakta zorlanan işletmeler",
      "Hakkımızda ve ana sayfa metni yıllardır güncellenmemiş markalar",
      "Yeni web sitesi öncesinde mesajını netleştirmek isteyen kurucular",
      "Kanallar arasında tutarlı bir marka dili kurmak isteyen ekipler",
    ],
    deliverables: [
      "Keşif görüşmesi ve ana mesaj",
      "Konumlandırma özeti",
      "Kısa marka hikâyesi",
      "Ana sayfa akışı ve metinleri",
      "Hakkımızda sayfası",
      "Slogan seçenekleri ve 1 sayfalık ton rehberi (marka dili)",
    ],
    example: {
      context: "Örnek · Otel yazılımı",
      before: "Kaliteli ve yenilikçi çözümler sunuyoruz.",
      after: "Küçük otellerin rezervasyonlarını, odalarını ve günlük işlerini tek ekranda topluyoruz.",
      note: "Değişen: kime hitap edildiği, hangi işin kolaylaştığı ve nasıl bir çözüm sunulduğu artık açık.",
    },
    faqs: [
      {
        q: "Marka hikâyesi ile Hakkımızda sayfası aynı şey mi?",
        a: "Hakkımızda sayfası, marka hikâyesinin sitedeki en görünür kullanımıdır. Önce hikâyeyi kurar, sonra Hakkımızda dahil farklı yerlerde kullanırız.",
      },
      {
        q: "Mevcut metinlerimiz var; sıfırdan mı yazarsınız?",
        a: "Mevcut metinleri görüşmede birlikte inceleriz. Neyin korunacağına ve neyin yeniden kurulacağına birlikte karar veririz.",
      },
      {
        q: "Marka dili çalışması pakete dahil mi?",
        a: "Marka Anlatısı paketinde 1 sayfalık ton rehberi bulunur. Ayrıntılı bir marka kimliği veya görsel kimlik çalışması kapsam dışıdır.",
      },
    ],
    ctaTitle: "Markanızı nasıl anlattığınızı birlikte değerlendirelim.",
    pkg: "marka",
  },
  {
    slug: "hakkimizda-ve-kurumsal-tanitim-metinleri",
    nav: "Hakkımızda ve kurumsal tanıtım metni",
    metaTitle: "Hakkımızda Yazısı ve Kurumsal Tanıtım Metni Yazımı",
    description:
      "Şirketinizin Hakkımızda sayfasını ve kurumsal tanıtım metnini görüşmeyle, açık kapsam ve revizyon haklarıyla hazırlıyoruz.",
    h1: "Hakkımızda yazısı ve kurumsal tanıtım metni",
    lede: "Yıllardır yaptığınız işi, sizi tanımayan birinin de anlayacağı ve güvenebileceği bir tanıtım metnine dönüştürüyoruz.",
    audience: [
      "Köklü ama sitesi bunu anlatmayan üretici ve aile işletmeleri",
      "Hakkımızda sayfasında yalnızca kuruluş yılı ve vizyon yazan firmalar",
      "Teklif, sunum ve profil için kısa bir tanıtım metni isteyen kurumlar",
    ],
    deliverables: [
      "Keşif görüşmesi",
      "Kısa kurumsal tanıtım metni (yaklaşık 150 kelime)",
      "Hakkımızda sayfası metni",
      "Başlık ve çağrı (CTA) önerileri",
    ],
    example: {
      context: "Örnek · B2B hizmet firması",
      before: "20 yıllık tecrübemizle sektörün önde gelen firmalarından biriyiz.",
      after: "Fabrikanızın üretim hattı durduğunda arayacağınız ilk numara olmayı hedefliyoruz. Bu yüzden her müşteriye tek bir sorumlu mühendis atıyoruz.",
      note: "Değişen: genel övgü yerine, işletmenin gerçekten uygulayacağı somut çalışma biçimi.",
    },
    faqs: [
      {
        q: "Hakkımızda yazısı kaç kelime olmalı?",
        a: "Sabit bir sayı yok; hedef kitleye ve kullanıma göre belirlenir. Kısa tanıtım yaklaşık 150 kelimedir, Hakkımızda sayfası ise sitenin akışına göre şekillenir.",
      },
      {
        q: "Bilgileri siz mi toplarsınız?",
        a: "Keşif görüşmesinde soruları biz sorarız; sizden belge yığını beklemeyiz. Doğrulanamayan iddiaları metne eklemeyiz.",
      },
      {
        q: "Metni sitemize siz mi yerleştirirsiniz?",
        a: "Metin teslimi paketlere dahildir. Yerleştirme ve tasarım için Anlatı + Dijital Deneyim kapsamını konuşuruz.",
      },
    ],
    ctaTitle: "Şirketinizi nasıl anlattığınızı birlikte değerlendirelim.",
    pkg: "netlik",
  },
  {
    slug: "web-sitesi-metinleri",
    nav: "Web sitesi metinleri",
    metaTitle: "Web Sitesi Metin Yazarlığı ve Kurumsal Site İçeriği",
    description:
      "Kurumsal web sitenizin ana sayfa, Hakkımızda ve hizmet metinlerini ziyaretçinin ihtiyacına göre kuruyoruz. İsterseniz sitenizi MK Digital Systems ile hayata geçiriyoruz.",
    h1: "Web sitesi metin yazarlığı",
    lede: "Yeni veya yenilenen kurumsal siteniz için sayfa akışını ve metinleri, ziyaretçinin ilk bakışta ne yaptığınızı ve neden sizi seçmesi gerektiğini anlayacağı şekilde kuruyoruz.",
    audience: [
      "Web sitesini yenilemek üzere olan firmalar",
      "Siteleri güzel ama mesajı belirsiz olan işletmeler",
      "Tasarıma başlamadan önce içeriği netleştirmek isteyen ekipler",
    ],
    deliverables: [
      "Konumlandırma özeti",
      "Ana sayfa akışı ve metinleri",
      "Hakkımızda sayfası",
      "Slogan seçenekleri ve ton rehberi",
      "İsteğe bağlı: tasarım ve geliştirme (Anlatı + Dijital Deneyim)",
    ],
    example: {
      context: "Örnek · Ahşap atölyesi",
      before: "2015 yılında kurulduk. Kaliteli ürünler üretiyoruz.",
      after: "Dedemin tezgâhından kalan üç alet ve bir hata: ilk sipariş yanlış ölçüyle kesildi. Atölyeyi bu hatadan öğrendiğimiz şeyle kurduk.",
      note: "Değişen: tarih ve övgü yerine, işletmeye özgü bir başlangıç hikâyesi.",
    },
    faqs: [
      {
        q: "Sitemiz hazır; yalnızca metinleri yeniletebilir miyiz?",
        a: "Evet. Mevcut sayfaların metinleri görüşmede incelenir ve kapsam netleştirilir. Tasarım değişikliği gerekiyorsa ayrıca konuşuruz.",
      },
      {
        q: "Hangi sayfaların metnini yazıyorsunuz?",
        a: "Marka Anlatısı paketi ana sayfa akışı ve metinleri ile Hakkımızda sayfasını kapsar. Ek sayfalar için kapsam görüşmede belirlenir.",
      },
      {
        q: "Tasarımı ve yazılımı da yapıyor musunuz?",
        a: "Evet, MK Digital Systems ile Anlatı + Dijital Deneyim kapsamında. Kapsam ve fiyat, keşif görüşmesinden sonra yazılı teklifle netleşir.",
      },
    ],
    ctaTitle: "Sitenizin metinlerini birlikte planlayalım.",
    pkg: "marka",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
