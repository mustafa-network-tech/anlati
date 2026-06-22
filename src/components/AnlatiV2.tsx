"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

interface IReactions {
  empathy: number;
  sad: number;
  happy: number;
  inspiring: number;
  surprised: number;
}

interface IAuthor {
  name: string;
  initials: string;
  gradient: string;
  isAnonymous: boolean;
}

interface ICategory {
  name: string;
  color: string;
  bg: string;
  dot: string;
}

interface IStory {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: IAuthor;
  category: ICategory;
  readTime: number;
  viewCount: number;
  commentCount: number;
  reactions: IReactions;
  bookmarkCount: number;
  isBookmarked: boolean;
  myReaction: keyof IReactions | null;
  publishedAt: string;
  coverDesign: number; // 0-7
  tags: string[];
}

interface IComment {
  id: string;
  author: { name: string; initials: string; gradient: string };
  text: string;
  likes: number;
  time: string;
}

interface IToast {
  message: string;
  visible: boolean;
  type: "success" | "info" | "error";
}

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════ */

const CATEGORIES = {
  loneliness:    { name: "Yalnızlık",         color: "text-blue-300",    bg: "bg-blue-500/15",    dot: "#60a5fa" },
  family:        { name: "Aile",              color: "text-amber-300",   bg: "bg-amber-500/15",   dot: "#fbbf24" },
  work:          { name: "İş Hayatı",         color: "text-violet-300",  bg: "bg-violet-500/15",  dot: "#a78bfa" },
  relationships: { name: "İlişkiler",         color: "text-rose-300",    bg: "bg-rose-500/15",    dot: "#fb7185" },
  restart:       { name: "Yeniden Başlamak",  color: "text-emerald-300", bg: "bg-emerald-500/15", dot: "#6ee7b7" },
  motherhood:    { name: "Annelik",           color: "text-pink-300",    bg: "bg-pink-500/15",    dot: "#f9a8d4" },
  courage:       { name: "Cesaret",           color: "text-orange-300",  bg: "bg-orange-500/15",  dot: "#fdba74" },
  freedom:       { name: "Özgürlük",          color: "text-teal-300",    bg: "bg-teal-500/15",    dot: "#5eead4" },
} satisfies Record<string, ICategory>;

const COVER_STYLES = [
  { bg: "from-violet-950 via-purple-900/80 to-indigo-950",   glow: "bg-violet-500/25",  glow2: "bg-purple-400/15" },
  { bg: "from-rose-950 via-pink-900/80 to-rose-950",         glow: "bg-rose-500/25",    glow2: "bg-pink-400/15"   },
  { bg: "from-slate-900 via-blue-950 to-slate-950",          glow: "bg-blue-500/20",    glow2: "bg-cyan-400/10"   },
  { bg: "from-amber-950 via-orange-900/70 to-yellow-950",    glow: "bg-amber-500/25",   glow2: "bg-orange-400/15" },
  { bg: "from-emerald-950 via-teal-900/80 to-cyan-950",      glow: "bg-emerald-500/20", glow2: "bg-teal-400/15"   },
  { bg: "from-fuchsia-950 via-purple-900/80 to-pink-950",    glow: "bg-fuchsia-500/25", glow2: "bg-purple-400/15" },
  { bg: "from-slate-950 via-indigo-950 to-slate-900",        glow: "bg-indigo-500/20",  glow2: "bg-blue-400/10"   },
  { bg: "from-red-950 via-rose-900/70 to-orange-950",        glow: "bg-red-500/20",     glow2: "bg-orange-400/10" },
];

const REACTIONS_META = [
  { key: "empathy"   as const, emoji: "❤️",  label: "Empati"      },
  { key: "sad"       as const, emoji: "😢",  label: "Üzüldüm"     },
  { key: "happy"     as const, emoji: "😊",  label: "Sevindim"    },
  { key: "inspiring" as const, emoji: "💪",  label: "İlham Verdi" },
  { key: "surprised" as const, emoji: "😮",  label: "Şaşırttı"    },
];

const STORY_CIRCLES = [
  { id: "trending",  label: "Trend",             gradient: "from-violet-600 to-purple-600",   emoji: "🔥" },
  { id: "today",     label: "Bugünün Hikâyesi",  gradient: "from-rose-500 to-pink-600",       emoji: "✨" },
  { id: "editor",    label: "Editörün Seçimi",   gradient: "from-amber-500 to-orange-600",    emoji: "🏆" },
  { id: "courage",   label: "Cesaret",           gradient: "from-orange-500 to-red-600",      emoji: "💪" },
  { id: "happy",     label: "Mutlu Sonlar",      gradient: "from-emerald-500 to-teal-600",    emoji: "😊" },
  { id: "new",       label: "Yeni Eklenenler",   gradient: "from-blue-500 to-indigo-600",     emoji: "🆕" },
  { id: "anonymous", label: "Anonim",            gradient: "from-zinc-600 to-zinc-800",       emoji: "🎭" },
  { id: "popular",   label: "En Çok Okunan",     gradient: "from-fuchsia-500 to-violet-600",  emoji: "📖" },
];

const MOCK_STORIES: IStory[] = [
  {
    id: "1",
    title: "Her Sabah Aynaya Bakamıyordum",
    excerpt: "Yıllarca kendimden kaçtım. Aynaya baktığımda gördüğüm şey beni değildi — ya da öyle sanıyordum. Sonra bir gün, küçük kızım 'Anne sen çok güzelsin' dedi ve dünyam değişti.",
    content: `Yıllarca kendimden kaçtım. Aynaya baktığımda gördüğüm şey beni değildi — ya da öyle sanıyordum.

Otuz iki yıl boyunca her sabah uyanır, banyoya gider ve aynaya bakmaktan kaçınırdım. Dişlerimi fırçalarken başımı öne eğerdim. Saçlarımı tarayacak olsam duvarın yanında durur, yansımamı görmemeye çalışırdım.

Bu sadece fiziksel bir şey değildi. İçimdeki sesi duyamıyordum çünkü onu susturmak için her şeyi yapıyordum. Kitaplar, diziler, sosyal medya... Hepsi birer kaçış noktasıydı.

Sonra bir gün, küçük kızım banyoya girdi. Tam o an aynaya bakıyordum — ilk kez dürüstçe, öfkesiz, acısız.

"Anne, sen çok güzelsin" dedi.

Dört yaşında bir çocuk. Yalan söylemeyi bilmiyor henüz. Gözlerinde gerçeği gördüm.

O an ağladım. Uzun süre. Kızım yanıma geldi, küçük elleriyle yüzümü tuttu. "Anne ağlama, sen güzelsin" dedi yine.

O günden sonra her sabah aynaya bakıyorum. Hâlâ zor. Hâlâ bazen kaçmak istiyorum. Ama kızımın sesi kulaklarımda çınlıyor.

Belki de kendimizi sevmeyi öğrenmek için birisinin bizi sevmesine tanıklık etmemiz gerekiyor. Belki de en büyük ayna, bizi seven gözlerdir.`,
    author: { name: "Elif Y.", initials: "EY", gradient: "from-violet-500 to-purple-600", isAnonymous: false },
    category: CATEGORIES.loneliness,
    readTime: 4,
    viewCount: 12840,
    commentCount: 234,
    reactions: { empathy: 1820, sad: 445, happy: 312, inspiring: 678, surprised: 89 },
    bookmarkCount: 567,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "2 saat önce",
    coverDesign: 0,
    tags: ["özgüven", "annelik", "iyileşme", "ayna"],
  },
  {
    id: "2",
    title: "Annem Bana İlk Kez 'Seni Seviyorum' Dedi",
    excerpt: "Kırk üç yaşındayım. Annem seksen iki. Ve dün ilk kez 'seni seviyorum' dedi. Telefonda donup kaldım. Yaşlı kadın tekrarladı: 'Duydun mu kızım? Seni seviyorum.'",
    content: `Kırk üç yaşındayım. Annem seksen iki. Ve dün ilk kez 'seni seviyorum' dedi.

Telefonda donup kaldım. Sessizce ağladım. Annem tekrarladı: "Duydun mu kızım? Seni seviyorum."

Annem, duygularını ifade etmeyi bilmeyen bir kadındır. Bizi doyurdu, giydirdi, okuttu. Ama "seni seviyorum" kelimesi onun sözlüğünde yoktu. Anadolu kadını, Türk annesi, sevgisini ellerinin nasırlarıyla gösterirdi.

Neden şimdi? Neden kırk üç yıl sonra?

Sormak istedim ama sesim çıkmadı. Sadece "Ben de seni seviyorum anne" dedim.

O gece uyuyamadım. Kırk üç yıllık bir suskunluğun sona ermesini nasıl sindirirsiniz? Tüm o yıllar, tüm o "acaba beni seviyor mu?" soruları...

Ertesi gün araştırdım. Alzheimer'ın ilk evrelerinde olan insanlar zaman zaman duygusal blokajları aşabiliyormuş. İnhibisyonlar azalıyormuş.

Yani hastalığı onu daha çok kendisi yapıyor. Maskeler düşüyor.

Ağladım. Hem annem için, hem kendim için, hem de kırk üç yılımız için.

Şimdi her gün arıyorum. Çoğu zaman beni tanımıyor. Ama bazen, sesi duyduğunda "Kızım mısın?" diyor. Ve ben "Evet anne, benim" diyorum.

O yeterli.`,
    author: { name: "Anonim", initials: "A", gradient: "from-zinc-600 to-zinc-700", isAnonymous: true },
    category: CATEGORIES.family,
    readTime: 3,
    viewCount: 28900,
    commentCount: 512,
    reactions: { empathy: 4200, sad: 1890, happy: 780, inspiring: 445, surprised: 234 },
    bookmarkCount: 1240,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "5 saat önce",
    coverDesign: 1,
    tags: ["anne", "aile", "alzheimer", "sevgi", "kayıp"],
  },
  {
    id: "3",
    title: "İşten Atıldığım Gün Kendimi Keşfettim",
    excerpt: "On yedi yıl aynı masada. Sabah 7'de işte, gece 10'da evde. Sonra bir e-posta geldi. 'Hizmetlerinize ihtiyacımız kalmadı.' Dünyam yıkıldı sandım. Yanılmışım.",
    content: `On yedi yıl aynı masada oturdum. Kahvemi bile aynı fincanla içtim. Sabah 7'de işte, gece 10'da evde. Cumartesi de çalıştım. Bazen Pazar.

Sonra bir Salı sabahı, e-postayı gördüm.

"Hizmetlerinize ihtiyacımız kalmadı."

On yedi yıl. Tek cümle.

Ofisten çıkarken masaları, koltuğu, ekranımı bir daha gördüm. Bunlar benim dünyamdı. Bu dünya olmadan ben kimim?

Üç ay evden çıkmadım. Depresyon mu, korku mu, utanç mı — hepsini yaşadım. Ailem endişelendi. Arkadaşlarım uzaklaştı.

Sonra bir sabah, saat 3'te uyuyamıyorken fotoğraf albümlerime baktım. Hepsi iş toplantıları, konferanslar, sunum ekranları.

Yirmi yaşındaki ben yoktu. Hayaller kuran, kitap okuyan, denize giren ben yoktu.

Ertesi gün kütüphaneye gittim. İlk kez on yedi yılda. Saatlerce oturdum. Sonra yazmaya başladım. Sadece kendim için.

Şimdi bir hikaye blogu var. Küçük bir takipçi kitlesi var. Mutluyum.

Gerçekten mutluyum. İlk kez.

Bazen bir e-posta, bir kapının kapanması sizi kendinize açılan kapıya iter. Ben o kapıyı bulmak için on yedi yılımı verdim.

Ama buldum. Geç değil.`,
    author: { name: "Merve B.", initials: "MB", gradient: "from-blue-500 to-indigo-600", isAnonymous: false },
    category: CATEGORIES.work,
    readTime: 4,
    viewCount: 9450,
    commentCount: 178,
    reactions: { empathy: 1230, sad: 234, happy: 890, inspiring: 1560, surprised: 445 },
    bookmarkCount: 678,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "1 gün önce",
    coverDesign: 2,
    tags: ["iş", "işten çıkarılma", "yeniden başlangıç", "yazarlık"],
  },
  {
    id: "4",
    title: "Evliliğimde Görünmez Oldum",
    excerpt: "Kimse bana inanmıyor çünkü görünürde 'iyi' bir evliliğimiz var. Ama on iki yıldır kendim için tek bir karar alamıyorum. Her şey onun istediği gibi. Her şey.",
    content: `Kimse bana inanmıyor.

"Ama Kerem çok iyi bir adam" diyorlar. "Eve para getiriyor, içmiyor, vurmıyor."

Beni anlamıyorlar.

On iki yıldır hangi renk perdeler alacağıma, ne zaman annemleri ziyaret edeceğime, hangisi doğum gününü kutlayacağıma kadar her şeye o karar veriyor. Ben sadece "tamam" diyorum.

Çünkü "tamam" demediğimde gün boyu küsüyor. Yemek yemiyor. Konuşmuyor. Sonra "sen bana değer vermiyorsun" diyor.

Ve ben suçluluk duyuyorum.

Terapiste gittim. "Duygusal kontrol" dedi terapis. Bir isim verdi buna. Ama ben hâlâ "belki abartıyorumdur" diye düşünüyorum.

Geçen hafta kızıma "Anne ne istiyorsun?" diye sordu öğretmeni. Kızım "Annem ne istediğini bilmiyor" dedi.

Sekiz yaşında. Görüyor beni. Ben göremiyorum kendimi.

O gece Kerem uyuduktan sonra kalktım, not defteri aldım ve ilk kez "Ben ne istiyorum?" diye yazdım.

Saatlerce baktım o soruya. Cevap gelmedi.

Ama soruyu sormak, başlangıç sayılır mı?

Umarım.`,
    author: { name: "Anonim", initials: "A", gradient: "from-zinc-600 to-zinc-700", isAnonymous: true },
    category: CATEGORIES.relationships,
    readTime: 5,
    viewCount: 34200,
    commentCount: 891,
    reactions: { empathy: 5600, sad: 2340, happy: 234, inspiring: 1230, surprised: 678 },
    bookmarkCount: 2100,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "3 saat önce",
    coverDesign: 3,
    tags: ["evlilik", "duygusal şiddet", "görünmezlik", "özgürlük"],
  },
  {
    id: "5",
    title: "Otuz Yaşında Okula Başladım",
    excerpt: "Herkes 'çok geç' dedi. Ben de inandım bir süre. Sonra tek bir şeyi fark ettim: on yıl sonra da otuz dokuz yaşında olacaktım. Soru, ne yaparak olduğumdu.",
    content: `"Otuz yaşında ne yapacaksın okulda?" dedi annem. "Hem çalış hem oku olur mu?" dedi eşim. "Çok geç" dedi herkes.

Ve ben de bir süre inandım.

Sonra bir gece, bir arkadaşımın mezuniyet fotoğraflarını gördüm. Kıskandım. Utandım kıskanmaktan. Sonra bir şeyi fark ettim.

On yıl sonra da kırk yaşında olacaktım. Soru, kırk yaşında ne yaparak olduğumdu.

Kaydoldum. İlk günü kırk üç yaşındaki bir sınıf arkadaşım vardı. Gülümsedi. "Hoş geldin" dedi.

O gülümseme bütün "geç" fikirlerini sildi.

Şimdi ikinci yıldayım. Zorlanıyorum, evet. Yaşım, tempo, aile... Hepsi zor. Ama her sınav geçtiğimde, her ödev teslim ettiğimde içimde bir şey açılıyor.

"Geç" diye bir şey yok. Sadece "başlamak var" ve "başlamamak var".

Ben başladım.`,
    author: { name: "Selin K.", initials: "SK", gradient: "from-emerald-500 to-teal-600", isAnonymous: false },
    category: CATEGORIES.restart,
    readTime: 3,
    viewCount: 7890,
    commentCount: 145,
    reactions: { empathy: 890, sad: 45, happy: 1670, inspiring: 2340, surprised: 178 },
    bookmarkCount: 456,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "2 gün önce",
    coverDesign: 4,
    tags: ["eğitim", "geç kalmak", "motivasyon", "başlamak"],
  },
  {
    id: "6",
    title: "Bebeğim Geldiğinde Ben Gittim",
    excerpt: "Anneler hep mutlu olur derler. Benim için farklıydı. Bebeğimi koluma aldığımda ağlıyordum ama mutluluktan değil. Kimseye söyleyemedim yıllarca.",
    content: `Doğumdan sonraki ilk hafta.

Kocam seviniyor. Annem fotoğraf çekiyor. Hastane koridorunda herkes kutluyor. Ben ağlıyorum.

"Sevinçten ağlıyor" diyorlar.

Hayır. Korku. Boşluk. Ve sonra korkunç bir düşünce: "Bu çocuğu seviyor muyum?"

Söyleyemedim kimseye. Anneye söyle mi? "Nasıl sevmez ki?" derdi. Kocama söyle mi? Ayrılırdı belki. Doktora söyle mi? Ya hastaneye kaldırırlarsa?

Susdum.

Altı ay sustum.

Altı ay bebek büyüdü, ben küçüldüm. Altı ay gülümsedim, içimde ağladım. Altı ay "her şey harika" dedim.

Sonra bir gece bebek ağlarken ben de ağladım. Uzun süre. İkimiz birlikte. Ve o an, ilk kez gerçekten bağlandım ona.

Sonradan öğrendim: "Doğum Sonrası Depresyon." Çok yaygın. Çok gerçek. Çok yalnız yaşanan.

Şimdi bu hikayeyi yazıyorum çünkü o geceki yalnız anne, beni okusun. Sen yalnız değilsin. Ve sen kötü bir anne değilsin.`,
    author: { name: "Anonim", initials: "A", gradient: "from-zinc-600 to-zinc-700", isAnonymous: true },
    category: CATEGORIES.motherhood,
    readTime: 5,
    viewCount: 22100,
    commentCount: 445,
    reactions: { empathy: 3890, sad: 1780, happy: 567, inspiring: 890, surprised: 234 },
    bookmarkCount: 1560,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "4 saat önce",
    coverDesign: 5,
    tags: ["annelik", "depresyon", "doğum sonrası", "iyileşme"],
  },
  {
    id: "7",
    title: "Bir Yabancının İyiliği Hayatımı Değiştirdi",
    excerpt: "O gün ağlayarak otobüs durağında oturuyordum. Kimse bakmadı. Bir yaşlı kadın geldi, yanıma oturdu. 'Neden ağlıyorsun?' dedi. İlk kez birileri sormuştu.",
    content: `O gün iş mülakatından çıkmıştım. Reddedilmiştim. Üçüncü kez. Banka hesabımda iki günlük para kalmıştı.

Otobüs durağına oturdum. Ağladım. Cep telefonum pil üzeri olduğu için arayacak kimse de yoktu.

İnsanlar geçti. Kimse bakmadı. Ya da baktılar, yürümeye devam ettiler.

Sonra yaşlı bir kadın geldi. Yanıma oturdu. Bavuluyla seyahat ediyordu anlaşılan.

"Neden ağlıyorsun?" dedi.

Donup kaldım. Kimse sormamıştı bunu. Yabancı, yaşlı, yorgun bir kadın sormıştı.

Her şeyi anlattım. İşi. Parayı. Yorgunluğu. Kendimi yetersiz hissetttiğimi.

Dinledi. Hiç kesmedi. Sonra çantasından sandviç çıkardı. "Ye" dedi.

Yedim.

"Hayat bazen çok zor" dedi. "Ama durağa gelen her otobüs geçmiyor. Biri seni götürür."

Otobüsü geldi. Kalktı. "Hayırlı olsun" dedi.

Gitti.

Adını bilmiyorum. Nereden geldiğini bilmiyorum. Ama o sandviç, o "neden ağlıyorsun" sorusu, beni tuttu.

Hayattaki en güzel anlar bazen tam yabancılardan geliyor.`,
    author: { name: "Ayşe T.", initials: "AT", gradient: "from-pink-500 to-rose-600", isAnonymous: false },
    category: CATEGORIES.courage,
    readTime: 3,
    viewCount: 15600,
    commentCount: 312,
    reactions: { empathy: 2780, sad: 456, happy: 1890, inspiring: 2100, surprised: 678 },
    bookmarkCount: 890,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "1 gün önce",
    coverDesign: 6,
    tags: ["yabancı iyiliği", "umut", "yardım", "insan"],
  },
  {
    id: "8",
    title: "Şehirden Kaçtım ve Pişman Olmadım",
    excerpt: "Herkes 'şehirde kalmalısın, fırsat orada' dedi. Ben köye döndüm. Bir yıl oldu. Her sabah kalktığımda pencereden dağları görüyorum. Başka ne lazım?",
    content: `Sekiz yıl İstanbul. Sekiz yıl metro, trafik, KDK, AVM, deadline.

Annem "gel köye dön" derdi her yıl. "Köy mü?" derdim. "Emekli olmadan mı dönülür köye?"

Sonra pandemi geldi. Oradan da bakış açısı değişti.

Çevrimiçi toplantıdan toplantıya koşarken, ekran başında eğilip bükülürken, bir sabah aynaya baktım. Yorgun. Renksiz. Anlamsız bir koşturmaca.

Sözleşmem dolunca döndüm.

Herkes "ne yapacaksın orada?" dedi. Ben bilmiyordum.

Şimdi biliyorum.

Her sabah kalktığımda pencereden dağları görüyorum. Kahvemi bahçede içiyorum. Annemin bahçesinde domates yetiştiriyorum. Evet, domates.

Uzaktan çalışıyorum, makul maaşla. Kiram yok. Trafiğim yok. Stresi az.

Komşular sürpriz börek getiriyor bazen. Bunu İstanbul'da yaşamadım hiç.

Özgürlük pahalı değil. Bazen sadece yönü değiştirmekle oluyor.

Ve hayır, pişman değilim.`,
    author: { name: "Cansu A.", initials: "CA", gradient: "from-teal-500 to-cyan-600", isAnonymous: false },
    category: CATEGORIES.freedom,
    readTime: 3,
    viewCount: 11230,
    commentCount: 267,
    reactions: { empathy: 1120, sad: 89, happy: 2340, inspiring: 1890, surprised: 345 },
    bookmarkCount: 789,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "3 gün önce",
    coverDesign: 7,
    tags: ["şehir", "köy", "özgürlük", "uzaktan çalışma"],
  },
  {
    id: "9",
    title: "Kırk Yıl Sonra Babama Yazdığım Mektup",
    excerpt: "Babam on iki yıl önce vefat etti. Hâlâ konuşamadık. Bu mektubu yazdım. Belki bir gün ulaşır. Belki sadece benim için.",
    content: `Babacığım,

Mektup yazıyorum sana. Artık cevap beklemiyorum, biliyorum. Ama söylenmesi gereken şeyler var.

Seni anlayamadım. Küçükken uzak biri gibi görünürdün. Hep işte, hep yorgun, hep ciddi. Ben de senden uzak durdum çocukken.

Büyüyünce anladım. Sen de senin babandan böyle görmüştün. Ve sen de bilmiyordun başka türlü nasıl olunacağını.

Beni okutmak için neler çektiğini, gece nöbetlerini, sessizce yaptığın fedakarlıkları büyüyünce fark ettim.

Ama hiç söylemedik birbirimize.

O son yıl, hastanede yanında oturduğumda, elini tuttum. "Teşekkür ederim" dedim. Gözlerini açtı. Bir şey demedi. Ama sıktı elimi.

Yeterliydi.

Şimdi ben de babayım. Oğlumu her gece öpüyorum. "Seni seviyorum" diyorum. Her gün.

Senin yapamadığını yapıyorum, bana öğrettiklerinden.

Teşekkür ederim babacığım.`,
    author: { name: "Ece M.", initials: "EM", gradient: "from-slate-500 to-slate-600", isAnonymous: false },
    category: CATEGORIES.family,
    readTime: 4,
    viewCount: 18900,
    commentCount: 423,
    reactions: { empathy: 4560, sad: 2100, happy: 890, inspiring: 1230, surprised: 234 },
    bookmarkCount: 1780,
    isBookmarked: false,
    myReaction: null,
    publishedAt: "5 saat önce",
    coverDesign: 0,
    tags: ["baba", "mektup", "kayıp", "veda", "sevgi"],
  },
];

const MOCK_COMMENTS: IComment[] = [
  { id: "c1", author: { name: "Zeynep K.", initials: "ZK", gradient: "from-violet-500 to-purple-600" }, text: "Bu hikayeyi okurken ağladım. Benim de annem böyle bir kadın. Teşekkür ederim paylaştığın için.", likes: 45, time: "1 saat önce" },
  { id: "c2", author: { name: "Meral T.", initials: "MT", gradient: "from-rose-500 to-pink-600" }, text: "Sen yalnız değilsin. Ben de aynı şeyleri yaşadım. Bu platformun var olması çok önemli.", likes: 38, time: "2 saat önce" },
  { id: "c3", author: { name: "Anonim", initials: "A", gradient: "from-zinc-600 to-zinc-700" }, text: "Sizi anlıyorum. Gerçekten. Güçlü olun lütfen.", likes: 28, time: "3 saat önce" },
];

const STATS = [
  { label: "Hikâye", value: 87421, suffix: "" },
  { label: "Yorum", value: 352000, suffix: "" },
  { label: "Okunma", value: 2400000, suffix: "" },
  { label: "Aktif Kullanıcı", value: 18700, suffix: "" },
];

/* ══════════════════════════════════════════════════════════════
   UTILITY — ANIMATED COUNTER HOOK
   ══════════════════════════════════════════════════════════════ */

function useCountUp(end: number, duration = 2200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setValue(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
}

/* ══════════════════════════════════════════════════════════════
   FORMAT NUMBER
   ══════════════════════════════════════════════════════════════ */

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".0", "") + "K";
  return n.toLocaleString("tr-TR");
}

/* ══════════════════════════════════════════════════════════════
   STAT COUNTER COMPONENT
   ══════════════════════════════════════════════════════════════ */

function StatCounter({ label, value }: { label: string; value: number }) {
  const { value: count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center px-6 py-4">
      <div className="text-3xl sm:text-4xl font-bold text-gradient-vivid tabular-nums">
        {formatNum(count)}
      </div>
      <div className="text-sm text-zinc-500 mt-1 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COVER ART COMPONENT
   ══════════════════════════════════════════════════════════════ */

function CoverArt({ design, className = "" }: { design: number; className?: string }) {
  const s = COVER_STYLES[design % COVER_STYLES.length];
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${s.bg} ${className}`}>
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl ${s.glow}`} />
      <div className={`absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-3xl ${s.glow2}`} />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════════ */

function Toast({ toast }: { toast: IToast }) {
  if (!toast.visible) return null;
  const color = toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-red-500" : "bg-violet-500";
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-toast-in">
      <div className={`${color} text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl backdrop-blur-sm`}>
        {toast.message}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STORY MODAL
   ══════════════════════════════════════════════════════════════ */

function StoryModal({
  story,
  onClose,
  onReact,
  onBookmark,
  isGuest,
  requireAuth,
}: {
  story: IStory;
  onClose: () => void;
  onReact: (storyId: string, key: keyof IReactions) => void;
  onBookmark: (storyId: string) => void;
  isGuest: boolean;
  requireAuth: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [reactionAnim, setReactionAnim] = useState<keyof IReactions | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalReactions = Object.values(story.reactions).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight === clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(pct);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleReact = (key: keyof IReactions) => {
    if (isGuest) { requireAuth(); return; }
    setReactionAnim(key);
    onReact(story.id, key);
    setTimeout(() => setReactionAnim(null), 500);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-2xl sm:max-h-[90vh] h-full sm:h-auto sm:rounded-3xl overflow-hidden bg-zinc-950 border border-white/8 shadow-2xl animate-modal-in flex flex-col">

        {/* Reading progress */}
        <div className="absolute top-0 left-0 h-[3px] bg-zinc-800 w-full z-10">
          <div className="reading-progress-bar h-full" style={{ width: `${progress}%` }} />
        </div>

        {/* Cover */}
        <div className="relative flex-shrink-0">
          <CoverArt design={story.coverDesign} className="h-52 sm:h-64 w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Close */}
          <button type="button" onClick={onClose}
            className="absolute top-4 right-4 glass w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Category badge */}
          <div className="absolute bottom-4 left-6">
            <span className={`${story.category.bg} ${story.category.color} text-xs font-semibold px-3 py-1.5 rounded-full`}>
              {story.category.name}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-6 sm:px-8 pt-6 pb-8">

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 leading-tight mb-4">
            {story.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/6">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${story.author.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
              {story.author.initials}
            </div>
            <div>
              <div className="text-zinc-200 text-sm font-semibold">{story.author.name}</div>
              <div className="text-zinc-500 text-xs flex items-center gap-2">
                <span>{story.publishedAt}</span>
                <span>·</span>
                <span>{story.readTime} dk okuma</span>
                <span>·</span>
                <span>{formatNum(story.viewCount)} görüntülenme</span>
              </div>
            </div>
            <button type="button"
              onClick={() => { isGuest ? requireAuth() : onBookmark(story.id); }}
              className={`ml-auto p-2.5 rounded-xl transition-all ${story.isBookmarked ? "text-violet-400 bg-violet-500/15" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"}`}>
              <svg className="w-5 h-5" fill={story.isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed space-y-4">
            {story.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-[15px] sm:text-base leading-7 sm:leading-8 text-zinc-300">{para}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/6">
            {story.tags.map((tag) => (
              <span key={tag} className="text-xs text-zinc-400 bg-white/4 border border-white/6 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Reactions */}
          <div className="mt-8">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">
              {formatNum(totalReactions)} kişi duygularını paylaştı
            </p>
            <div className="flex flex-wrap gap-2">
              {REACTIONS_META.map((r) => (
                <button
                  type="button"
                  key={r.key}
                  onClick={() => handleReact(r.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all
                    ${story.myReaction === r.key
                      ? "bg-violet-500/20 border-violet-400/40 text-violet-300"
                      : "bg-white/3 border-white/6 text-zinc-400 hover:bg-white/6 hover:border-white/12 hover:text-zinc-200"
                    }
                    ${reactionAnim === r.key ? "animate-reaction-pop" : ""}
                  `}>
                  <span className="text-base">{r.emoji}</span>
                  <span>{r.label}</span>
                  <span className="text-xs opacity-70">{formatNum(story.reactions[r.key])}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="mt-10">
            <h3 className="text-zinc-200 font-bold text-base mb-4">
              Yorumlar <span className="text-zinc-500 font-normal text-sm">({formatNum(story.commentCount)})</span>
            </h3>

            {/* Comment input */}
            <div className="flex gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400 text-xs flex-shrink-0">
                {isGuest ? "?" : "S"}
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={() => { if (isGuest) requireAuth(); }}
                  placeholder={isGuest ? "Yorum yazmak için giriş yapın…" : "Düşüncelerini paylaş…"}
                  rows={2}
                  className="textarea-premium w-full rounded-2xl px-4 py-3 text-sm resize-none"
                />
                {comment.trim() && (
                  <button type="button"
                    className="absolute bottom-3 right-3 btn-primary px-3 py-1.5 rounded-xl text-xs text-white font-semibold">
                    Gönder
                  </button>
                )}
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-4">
              {MOCK_COMMENTS.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.author.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {c.author.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-zinc-200 text-sm font-semibold">{c.author.name}</span>
                      <span className="text-zinc-600 text-xs">{c.time}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{c.text}</p>
                    <button type="button" className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-xs mt-2 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {c.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   WRITE STORY MODAL
   ══════════════════════════════════════════════════════════════ */

function WriteModal({
  onClose,
  isGuest,
  requireAuth,
}: {
  onClose: () => void;
  isGuest: boolean;
  requireAuth: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [isAnon, setIsAnon] = useState(false);
  const [tags, setTags] = useState("");
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (isGuest) { onClose(); requireAuth(); return; }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isGuest, onClose, requireAuth]);

  if (isGuest) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl overflow-hidden bg-[#0d0d10] border border-white/8 shadow-2xl animate-modal-in flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-zinc-100 font-bold text-base">Hikâyeni Yaz</h2>
              <p className="text-zinc-500 text-xs">{wordCount} kelime · Otomatik kaydediliyor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-200 p-2 rounded-xl hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-6 sm:px-8 py-6 space-y-5">

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hikâyenin başlığı…"
              className="input-premium w-full text-2xl sm:text-3xl font-bold bg-transparent border-none px-0 py-2 placeholder:text-zinc-700 focus:shadow-none text-zinc-50"
              style={{ boxShadow: "none" }}
            />

            {/* Category row */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedCat(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${selectedCat === key
                      ? `${cat.bg} ${cat.color} border-current/30`
                      : "bg-white/3 text-zinc-500 border-white/6 hover:bg-white/6"
                    }`}>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Content editor */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hikâyeni buraya yaz… Kimse seni yargılamıyor. Sadece anlamak için buradalar."
              rows={14}
              className="textarea-premium w-full rounded-2xl px-4 py-4 text-[15px] leading-7 text-zinc-300 min-h-[280px]"
            />

            {/* Tags */}
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Etiketler: #aile #cesaret #iyileşme"
              className="input-premium w-full rounded-2xl px-4 py-3 text-sm"
            />

            {/* Bottom options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 pb-4">
              {/* Anonymous toggle */}
              <button
                type="button"
                onClick={() => setIsAnon(!isAnon)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isAnon ? "bg-zinc-700/40 border-zinc-500/30 text-zinc-200" : "bg-white/3 border-white/6 text-zinc-500 hover:bg-white/6"}`}>
                <span className="text-lg">{isAnon ? "🎭" : "👤"}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">{isAnon ? "Anonim Yayınla" : "İsimle Yayınla"}</div>
                  <div className="text-xs opacity-70">{isAnon ? "Kimliğin gizli kalır" : "Profilinde görünür"}</div>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${isAnon ? "bg-violet-500" : "bg-zinc-700"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isAnon ? "left-5" : "left-0.5"}`} />
                </div>
              </button>

              {/* AI helper */}
              <div className="flex items-center gap-2">
                <button type="button" className="text-xs text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-violet-500/8">
                  <span>✨</span> AI Geliştir
                </button>
                <button type="button" className="text-xs text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-violet-500/8">
                  <span>🔒</span> Anonimleştir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-white/6 flex items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">Tüm içerikler topluluğumuzun kurallarına tabidir.</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose}
              className="btn-ghost px-5 py-2.5 rounded-2xl text-sm text-zinc-400 font-medium">
              Kaydet & Kapat
            </button>
            <button
              type="button"
              disabled={!title.trim() || !content.trim()}
              className="btn-primary px-6 py-2.5 rounded-2xl text-sm text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
              Yayınla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STORY CARD
   ══════════════════════════════════════════════════════════════ */

function StoryCard({
  story,
  onOpen,
  onBookmark,
  onReact,
  isGuest,
  requireAuth,
}: {
  story: IStory;
  onOpen: (s: IStory) => void;
  onBookmark: (id: string) => void;
  onReact: (id: string, key: keyof IReactions) => void;
  isGuest: boolean;
  requireAuth: () => void;
}) {
  const totalReactions = Object.values(story.reactions).reduce((a, b) => a + b, 0);
  const topReaction = Object.entries(story.reactions).sort((a, b) => b[1] - a[1])[0];
  const topReactionMeta = REACTIONS_META.find(r => r.key === topReaction[0]);

  return (
    <div
      className="story-card break-inside-avoid mb-5 rounded-3xl overflow-hidden border border-white/6 cursor-pointer group"
      onClick={() => onOpen(story)}>

      {/* Cover */}
      <div className="relative overflow-hidden">
        <CoverArt design={story.coverDesign} className="h-40 w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`${story.category.bg} ${story.category.color} text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm`}>
            {story.category.name}
          </span>
        </div>

        {/* Bookmark button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); isGuest ? requireAuth() : onBookmark(story.id); }}
          className={`absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center transition-all
            ${story.isBookmarked ? "text-violet-400" : "text-zinc-400 hover:text-zinc-100"}`}>
          <svg className="w-4 h-4" fill={story.isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Top reaction */}
        {topReactionMeta && (
          <div className="absolute bottom-3 right-3 glass px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs text-zinc-300">
            <span>{topReactionMeta.emoji}</span>
            <span>{formatNum(topReaction[1])}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 bg-zinc-900/50">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${story.author.gradient} flex items-center justify-center text-white text-xs font-bold`}>
            {story.author.initials}
          </div>
          <span className="text-zinc-500 text-xs">{story.author.name}</span>
          <span className="text-zinc-700 text-xs ml-auto">{story.publishedAt}</span>
        </div>

        {/* Title */}
        <h3 className="text-zinc-100 font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-violet-200 transition-colors">
          {story.title}
        </h3>

        {/* Excerpt */}
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-4">
          {story.excerpt}
        </p>

        {/* Footer stats */}
        <div className="flex items-center gap-3 text-zinc-600 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {formatNum(story.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {formatNum(story.commentCount)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {formatNum(totalReactions)}
          </span>
          <span className="ml-auto flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {story.readTime} dk
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function AnlatiV2() {
  const { user, isGuest, signOut } = useAuth();

  const [stories, setStories] = useState<IStory[]>(MOCK_STORIES);
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [showWrite, setShowWrite] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeNav, setActiveNav] = useState<"home" | "discover" | "write" | "profile">("home");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<IToast>({ message: "", visible: false, type: "success" });
  const [navScrolled, setNavScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string, type: IToast["type"] = "success") => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const requireAuth = useCallback((mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setShowAuth(true);
  }, []);

  const openStory = useCallback((s: IStory) => setSelectedStory(s), []);

  const handleBookmark = useCallback((id: string) => {
    if (isGuest) { requireAuth(); return; }
    setStories((prev) =>
      prev.map((s) => s.id === id ? { ...s, isBookmarked: !s.isBookmarked, bookmarkCount: s.isBookmarked ? s.bookmarkCount - 1 : s.bookmarkCount + 1 } : s)
    );
    const story = stories.find(s => s.id === id);
    showToast(story?.isBookmarked ? "Kaydedilenlerden kaldırıldı" : "Kaydedildi ✓");
    if (selectedStory?.id === id) {
      setSelectedStory(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
    }
  }, [isGuest, requireAuth, stories, selectedStory, showToast]);

  const handleReact = useCallback((id: string, key: keyof IReactions) => {
    if (isGuest) { requireAuth(); return; }
    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const prev_reaction = s.myReaction;
        const newReactions = { ...s.reactions };
        if (prev_reaction) newReactions[prev_reaction] = Math.max(0, newReactions[prev_reaction] - 1);
        if (prev_reaction !== key) newReactions[key] += 1;
        return { ...s, reactions: newReactions, myReaction: prev_reaction === key ? null : key };
      })
    );
    if (selectedStory?.id === id) {
      setSelectedStory(prev => {
        if (!prev) return null;
        const prev_reaction = prev.myReaction;
        const newReactions = { ...prev.reactions };
        if (prev_reaction) newReactions[prev_reaction] = Math.max(0, newReactions[prev_reaction] - 1);
        if (prev_reaction !== key) newReactions[key] += 1;
        return { ...prev, reactions: newReactions, myReaction: prev_reaction === key ? null : key };
      });
    }
  }, [isGuest, requireAuth, selectedStory]);

  // Navbar scroll detection
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl+K search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredStories = activeCategory === "Tümü"
    ? stories
    : stories.filter((s) => s.category.name === activeCategory);

  const searchedStories = searchQuery.trim()
    ? filteredStories.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredStories;

  const categoryList = ["Tümü", ...Object.values(CATEGORIES).map(c => c.name)];

  /* ── Hero View ──────────────────────────────────────────────── */
  const HeroView = (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-[#0d0618] to-zinc-950" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-violet-600/12 blur-[100px] animate-float-orb pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] animate-float-orb-2 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-indigo-600/8 blur-[80px] animate-float-orb-3 pointer-events-none" />
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-fuchsia-500/8 blur-[60px] animate-float-orb pointer-events-none" style={{ animationDuration: "10s" }} />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-12">

        {/* Badge */}
        <div className="animate-fade-in-up delay-100 mb-6">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-300 font-medium animate-border-pulse border border-violet-500/30">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Premium Hikâye Platformu
          </div>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up delay-200 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 max-w-5xl">
          <span className="text-gradient-hero">Her Hikâyenin</span>
          <br />
          <span className="text-zinc-100">Bir Sesi Vardır.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-300 text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10">
          Kendini özgürce anlat. Binlerce insan seni yargılamak için değil,
          <span className="text-zinc-200"> anlamak </span>için burada.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            type="button"
            onClick={() => {
              if (isGuest) requireAuth("register");
              else setShowWrite(true);
            }}
            className="btn-primary px-8 py-4 rounded-2xl text-white font-semibold text-base flex items-center gap-2.5 min-w-48">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Hikâyeni Yaz
          </button>
          <button
            type="button"
            onClick={() => setActiveNav("discover")}
            className="btn-ghost px-8 py-4 rounded-2xl text-zinc-200 font-semibold text-base flex items-center gap-2.5 min-w-48">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Keşfet
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-500 w-full max-w-3xl">
          <div className="glass rounded-3xl border border-white/6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/6">
            {STATS.map((s) => (
              <StatCounter key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>
      </div>

      {/* Story Circles */}
      <div className="relative z-10 pb-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest mb-4 pl-2">Kategoriler</p>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {STORY_CIRCLES.map((circle, i) => (
              <button
                type="button"
                key={circle.id}
                onClick={() => setActiveNav("discover")}
                className={`flex-shrink-0 flex flex-col items-center gap-2 animate-fade-in-up`}
                style={{ animationDelay: `${0.6 + i * 0.06}s` }}>
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${circle.gradient} flex items-center justify-center text-2xl shadow-lg`}
                    style={{ boxShadow: `0 0 24px ${circle.gradient.includes("violet") ? "rgba(139,92,246,.35)" : circle.gradient.includes("rose") ? "rgba(244,63,94,.3)" : "rgba(0,0,0,.3)"}` }}>
                    {circle.emoji}
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                </div>
                <span className="text-zinc-500 text-xs text-center w-16 leading-tight">{circle.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-fade-in-up delay-900">
        <button type="button" onClick={() => setActiveNav("discover")} className="flex flex-col items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors">
          <span className="text-xs tracking-widest uppercase">Hikâyeleri Keşfet</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent animate-pulse" />
        </button>
      </div>
    </div>
  );

  /* ── Discover View ──────────────────────────────────────────── */
  const DiscoverView = (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-2">Hikâyeleri Keşfet</h2>
          <p className="text-zinc-500">Her hikâye gerçek. Her ses önemli.</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-2 animate-fade-in-up delay-100">
          {categoryList.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === cat
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-white/4 text-zinc-400 hover:bg-white/8 hover:text-zinc-200 border border-white/6"
                }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-zinc-600 text-sm mb-6">
          {searchQuery ? `"${searchQuery}" için ${searchedStories.length} sonuç` : `${searchedStories.length} hikâye`}
        </p>

        {/* Masonry grid */}
        {searchedStories.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 animate-fade-in-up delay-200">
            {searchedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onOpen={openStory}
                onBookmark={handleBookmark}
                onReact={handleReact}
                isGuest={isGuest}
                requireAuth={requireAuth}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-zinc-300 font-semibold mb-2">Hikâye bulunamadı</h3>
            <p className="text-zinc-600 text-sm">Farklı bir arama deneyin</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Profile View ───────────────────────────────────────────── */
  const ProfileView = (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-fade-in-up">
            <div className="w-24 h-24 rounded-full glass-card border border-white/8 flex items-center justify-center text-4xl">👤</div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">Profilin Seni Bekliyor</h2>
              <p className="text-zinc-500 max-w-sm">Hikâyelerini kaydet, rozet kazan, topluluğun bir parçası ol.</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => requireAuth("register")} className="btn-primary px-6 py-3 rounded-2xl text-white font-semibold text-sm">
                Ücretsiz Üye Ol
              </button>
              <button type="button" onClick={() => requireAuth("login")} className="btn-ghost px-6 py-3 rounded-2xl text-zinc-300 font-medium text-sm">
                Giriş Yap
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up space-y-6">
            {/* Cover + Avatar */}
            <div className="relative">
              <div className="h-40 rounded-3xl bg-gradient-to-br from-violet-900/50 via-purple-800/30 to-indigo-900/50 border border-white/6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-600/5" />
              </div>
              <div className="absolute -bottom-8 left-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-zinc-950 shadow-xl">
                  {user?.email?.charAt(0).toUpperCase() ?? "U"}
                </div>
              </div>
            </div>

            {/* User info */}
            <div className="pt-10 pl-2">
              <h2 className="text-2xl font-bold text-zinc-100">{user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Kullanıcı"}</h2>
              <p className="text-zinc-500 text-sm mt-0.5">{user?.email}</p>
              <p className="text-zinc-400 text-sm mt-3 max-w-sm">Henüz bir biyografi eklenmedi. Profilini düzenleyerek kendini tanıt.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[{ label: "Hikâye", val: "0" }, { label: "Kaydedilen", val: String(stories.filter(s => s.isBookmarked).length) }, { label: "Rozet", val: "1" }].map((item) => (
                <div key={item.label} className="glass-card rounded-2xl p-4 text-center border border-white/6">
                  <div className="text-2xl font-bold text-zinc-100">{item.val}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-zinc-300 font-semibold mb-3">Rozetler</h3>
              <div className="flex gap-3 flex-wrap">
                {[{ emoji: "🌱", name: "Yeni Üye", desc: "Platforma katıldı" }].map((b) => (
                  <div key={b.name} className="flex items-center gap-2 glass-card rounded-2xl px-4 py-3 border border-white/6">
                    <span className="text-2xl">{b.emoji}</span>
                    <div>
                      <div className="text-zinc-200 text-sm font-semibold">{b.name}</div>
                      <div className="text-zinc-500 text-xs">{b.desc}</div>
                    </div>
                  </div>
                ))}
                {[
                  { emoji: "✍️", name: "İlk Hikâye", locked: true },
                  { emoji: "👁️", name: "1K Görüntülenme", locked: true },
                  { emoji: "💬", name: "100 Yorum", locked: true },
                ].map((b) => (
                  <div key={b.name} className="flex items-center gap-2 glass-card rounded-2xl px-4 py-3 border border-white/6 opacity-40">
                    <span className="text-2xl grayscale">{b.emoji}</span>
                    <div>
                      <div className="text-zinc-400 text-sm font-semibold">{b.name}</div>
                      <div className="text-zinc-600 text-xs">Kilitli</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign out */}
            <button type="button" onClick={signOut}
              className="w-full py-3 rounded-2xl text-zinc-500 hover:text-red-400 border border-white/6 hover:border-red-500/20 text-sm font-medium transition-all hover:bg-red-500/5">
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Bookmarks View ─────────────────────────────────────────── */
  const BookmarksView = (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-zinc-50 mb-2">Kaydedilenler</h2>
          <p className="text-zinc-500">Okumak için kaydettiğin hikâyeler.</p>
        </div>
        {isGuest ? (
          <div className="flex flex-col items-center py-20 gap-4 text-center animate-fade-in-up">
            <span className="text-5xl">🔖</span>
            <h3 className="text-zinc-300 font-semibold">Hikâye kaydetmek için giriş yap</h3>
            <button type="button" onClick={() => requireAuth()} className="btn-primary px-6 py-2.5 rounded-2xl text-white text-sm font-semibold">Giriş Yap</button>
          </div>
        ) : (
          (() => {
            const saved = stories.filter(s => s.isBookmarked);
            return saved.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-4 text-center animate-fade-in-up">
                <span className="text-5xl">🔖</span>
                <h3 className="text-zinc-300 font-semibold">Henüz hikâye kaydetmedin</h3>
                <p className="text-zinc-600 text-sm">Hikâye kartlarındaki yer imi ikonuna tıkla</p>
                <button type="button" onClick={() => setActiveNav("discover")} className="btn-primary px-6 py-2.5 rounded-2xl text-white text-sm font-semibold">Hikâyeleri Keşfet</button>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 animate-fade-in-up">
                {saved.map(story => (
                  <StoryCard key={story.id} story={story} onOpen={openStory} onBookmark={handleBookmark} onReact={handleReact} isGuest={isGuest} requireAuth={requireAuth} />
                ))}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">

      {/* ── STICKY NAVBAR ─────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled || activeNav !== "home" ? "glass-nav shadow-2xl" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <button type="button" onClick={() => setActiveNav("home")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white text-sm font-black">A</span>
            </div>
            <span className="font-bold text-zinc-100 text-lg tracking-tight">anlati</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {([["home", "Ana Sayfa"], ["discover", "Keşfet"]] as const).map(([id, label]) => (
              <button
                type="button"
                key={id}
                onClick={() => setActiveNav(id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeNav === id ? "text-violet-300 bg-violet-500/12" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/4"}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Search trigger */}
            <button
              type="button"
              onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 50); }}
              className="text-zinc-400 hover:text-zinc-100 p-2.5 rounded-xl hover:bg-white/5 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isGuest ? (
              <>
                <button type="button" onClick={() => requireAuth("login")}
                  className="hidden sm:block btn-ghost px-4 py-2 rounded-xl text-zinc-300 text-sm font-medium">
                  Giriş Yap
                </button>
                <button type="button" onClick={() => requireAuth("register")}
                  className="btn-primary px-4 py-2 rounded-xl text-white text-sm font-semibold">
                  Üye Ol
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setShowWrite(true)}
                  className="hidden sm:flex btn-primary px-4 py-2 rounded-xl text-white text-sm font-semibold items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yaz
                </button>
                <button type="button" onClick={() => setActiveNav("profile")}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md hover:scale-105 transition-transform">
                  {user?.email?.charAt(0).toUpperCase() ?? "U"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-white/6 px-4 sm:px-6 py-3 animate-fade-in-up">
            <div className="max-w-3xl mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (activeNav === "home") setActiveNav("discover"); }}
                placeholder="Hikâye, yazar, etiket ara… (Ctrl+K)"
                className="input-premium w-full rounded-2xl pl-11 pr-10 py-3 text-sm"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 p-1 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <main>
        {activeNav === "home"     && HeroView}
        {activeNav === "discover" && DiscoverView}
        {activeNav === "profile"  && ProfileView}
        {activeNav === "write"    && BookmarksView}
      </main>

      {/* ── BOTTOM NAV (mobile) ───────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/6 md:hidden">
        <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
          {(
            [
              { id: "home" as const, icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              ), label: "Ana Sayfa" },
              { id: "discover" as const, icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
              ), label: "Keşfet" },
              { id: "write" as const, icon: null, label: "Yaz" },
              { id: "profile" as const, icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              ), label: "Profil" },
            ] as const
          ).map((item) => {
            if (item.id === "write") {
              return (
                <button
                  key="write"
                  type="button"
                  onClick={() => isGuest ? requireAuth("register") : setShowWrite(true)}
                  className="btn-primary w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-violet-500/30 animate-pulse-glow -mt-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              );
            }
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id as typeof activeNav)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive ? "text-violet-400" : "text-zinc-600 hover:text-zinc-400"}`}>
                <span className={`transition-transform ${isActive ? "scale-110" : ""}`}>{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MODALS ────────────────────────────────────────────── */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onReact={handleReact}
          onBookmark={handleBookmark}
          isGuest={isGuest}
          requireAuth={requireAuth}
        />
      )}

      {showWrite && (
        <WriteModal
          onClose={() => setShowWrite(false)}
          isGuest={isGuest}
          requireAuth={requireAuth}
        />
      )}

      {showAuth && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            showToast("Hoş geldin! 🎉", "success");
          }}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
