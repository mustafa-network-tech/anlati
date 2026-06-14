"use client";

import { useState, useCallback, useRef } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// TIPLER
// ══════════════════════════════════════════════════════════════════════════════

interface IComment {
  id: string;
  author: string;
  text: string;
  time: string;
  initial: string;
}

interface IStory {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  author: string;
  isAnonymous: boolean;
  time: string;
  category: string;
  categoryStyle: string;
  likes: number;
  commentCount: number;
  isLiked: boolean;
  isSaved: boolean;
  bgGradient: string;
  comments: IComment[];
}

interface IConfessionForm {
  isAnonymous: boolean;
  title: string;
  category: string;
  text: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// MOCK VERİLER
// ══════════════════════════════════════════════════════════════════════════════

const INITIAL_STORIES: IStory[] = [
  {
    id: "1",
    title: "Yıllarca güçlü görünmekten yoruldum",
    summary:
      "Herkes benden güçlü olmasını bekliyordu. İş yerinde lider, evde anne, ilişkide destek. Bir gün aynada kendime baktım ve tanıyamadım. O yüz artık benim değildi.",
    fullText:
      "Herkes benden güçlü olmasını bekliyordu. İş yerinde lider, evde anne, ilişkide destek. Toplantılarda en soğukkanlı olan bendim. Krizlerde çözüm üreten bendim.\n\nBir gün aynada kendime baktım ve tanıyamadım. Gözlerin altındaki halkalar, sıkıştırılmış dudaklar, yanaklardaki yorgunluk...\n\n\"Ne zaman ben ağlasam?\" diye sordum kendime. Cevap geldi: \"Kimse yokken. Duş alırken. Araba kullanırken.\"\n\nGüçlü görünmek bir performansa dönüşmüştü. Ve o performanstan delicesine bıkmıştım.\n\nBir terapiste gitmeye karar verdim. İlk seans sonunda terapistim dedi ki: \"Siz hiç kendinizi görünmez hissettiniz mi?\" Ben güldüm. Sonra ağladım. Uzun süre ağladım.\n\nO gün öğrendim ki güçlü olmak, asla kırılmamak değil. Kırılıp yeniden dikilmek. Ve bunu sessize almadan yaşamak.",
    author: "Anonim",
    isAnonymous: true,
    time: "3 saat önce",
    category: "İş Hayatı",
    categoryStyle:
      "bg-violet-500/15 text-violet-300 border border-violet-400/20",
    likes: 847,
    commentCount: 23,
    isLiked: false,
    isSaved: false,
    bgGradient: "from-violet-950 via-zinc-900 to-zinc-950",
    comments: [
      {
        id: "c1",
        author: "Zeynep K.",
        text: "Sanki benim içimden okudunuz. Teşekkürler.",
        time: "2 saat önce",
        initial: "Z",
      },
      {
        id: "c2",
        author: "Selin A.",
        text: "Bu kadar tanıdık gelmeseydi belki ağlamazdım.",
        time: "1 saat önce",
        initial: "S",
      },
    ],
  },
  {
    id: "2",
    title: "Annem olduğum gün kendimi kaybettim sandım",
    summary:
      "İlk geceler hem bebeğim hem ben ağlıyorduk. İkimiz de birbirimizi tanımaya çalışıyorduk. O beni mi bulmaya çalışıyordu, ben onu mu — yoksa ikimiz de kendimizi mi?",
    fullText:
      "Annem olduğum gün bir kayıp gibi hissettim. Kimse söylememişti bunu. Herkes mutlu ol, sevin dedi. Oysa içimde garip bir boşluk açılmıştı.\n\nİlk geceler, hem bebeğim hem ben ağlıyorduk. Onun ağlaması beni paramparça ediyordu çünkü ne yapacağımı bilmiyordum. Emzirme acı veriyordu. Uyuyamıyordum.\n\n\"Anneler böyle hissetmez\" diye düşündüm. \"Bu çocuğu sevmiyorum demek mi bu?\"\n\nDeğilmiş. Doğum sonrası depresyon gerçekmiş. Ve beni seven o minik gözler aslında beni kurtarıyormuş.\n\nÜç ay sonra, gece 3'te bebeğimi emzirirken bakışlarımız kilitlenince... O bakışta dünya durdu. Ve kendimi yeniden buldum. Daha güçlü, daha gerçek, daha ben.",
    author: "Elif Y.",
    isAnonymous: false,
    time: "6 saat önce",
    category: "Annelik",
    categoryStyle: "bg-rose-500/15 text-rose-300 border border-rose-400/20",
    likes: 1243,
    commentCount: 47,
    isLiked: false,
    isSaved: false,
    bgGradient: "from-rose-950 via-zinc-900 to-zinc-950",
    comments: [
      {
        id: "c3",
        author: "Merve T.",
        text: "Birinci bebekte tam bu hisleri yaşadım. Yalnız değilsiniz.",
        time: "5 saat önce",
        initial: "M",
      },
      {
        id: "c4",
        author: "Aylin S.",
        text: "Doğum sonrası depresyon hakkında konuşulması çok önemli.",
        time: "3 saat önce",
        initial: "A",
      },
    ],
  },
  {
    id: "3",
    title: "Kimse duymadan içimden geçenleri buraya bıraktım",
    summary:
      "On yıllık evliliğimin ortasında başka birini düşünmeye başladım. Sadakatsiz olmadım ama düşüncelerimin kendisi beni yetti. Bunu kimseye söyleyemedim.",
    fullText:
      "On yıllık evliliğimin ortasında başka birini düşünmeye başladım. Sadakatsiz olmadım. Fiziksel olarak hiçbir şey yaşanmadı. Ama zihinsel olarak... bir iş arkadaşımla konuşurken gülmekte o kadar zorlanmıyordum.\n\nBu düşünceler beni yedi.\n\nEvde bakışlarımı kaçırmaya başladım. Eşimin elini tuttuğumda kendimi yabancı hissediyordum. Ona ihanet etmemiştim ama kendime ihanet etmiş gibi hissediyordum.\n\nTerapiste gittim. O bana şunu sordu: \"Evliliğinizde doldurulmamış ne var?\"\n\nO soru beni yerle bir etti. Çünkü cevap vardı: Dinlenilmek. Görülmek. Sadece BEN olarak görülmek.\n\nEşimle konuştuk. Çok zor bir geceydi. Ama o geceden sonra, ilk kez beni dinledi.",
    author: "Anonim",
    isAnonymous: true,
    time: "1 gün önce",
    category: "İlişkiler",
    categoryStyle:
      "bg-purple-500/15 text-purple-300 border border-purple-400/20",
    likes: 2156,
    commentCount: 89,
    isLiked: false,
    isSaved: false,
    bgGradient: "from-purple-950 via-zinc-900 to-zinc-950",
    comments: [
      {
        id: "c5",
        author: "Aylin S.",
        text: "İlk kez bu kadar cesurca anlatılmış bir şey okudum.",
        time: "20 saat önce",
        initial: "A",
      },
      {
        id: "c6",
        author: "Canan M.",
        text: "Dinlenilmek... evet, tam olarak o.",
        time: "18 saat önce",
        initial: "C",
      },
    ],
  },
  {
    id: "4",
    title: "Bir sabah kendimi seçmeye karar verdim",
    summary:
      "37 yaşımda ilk kez 'ben ne istiyorum?' diye sordum. Cevap sessizlik, deniz kıyısı ve yazmak oldu. Başkalarını değil, sadece beni seçtim.",
    fullText:
      "37 yaşımda, bir sabah kahvaltı hazırlarken durdum. Kahve makinesi doldu, içim değil.\n\nİlk kez kendime sordum: \"Ben ne istiyorum?\"\n\nCevap beklenmedik geldi: Sessizlik. Deniz kıyısı. Yazmak. Kalabalığa değil, tek başıma bir şeylere gitmek.\n\nO ana kadar hayatım hep başkalarının istekleriyle şekillenmişti. Anne ol, iyi bir eş ol, kariyer yap, komşularla iyi geçin...\n\nO sabah çantama ufak bir defter koydum ve kahvemi alıp park yürüyüşüne çıktım. Tek başıma. Telefonsuz.\n\nŞimdi haftada bir sabah \"benim saatim\" var. Kimseye hesap vermiyorum. Bu seçim beni daha iyi bir anne, daha iyi bir eş yaptı. Çünkü artık yarım kalmış hissetmiyorum.",
    author: "Neslihan A.",
    isAnonymous: false,
    time: "2 gün önce",
    category: "Yeniden Başlamak",
    categoryStyle:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20",
    likes: 3421,
    commentCount: 134,
    isLiked: false,
    isSaved: false,
    bgGradient: "from-emerald-950 via-zinc-900 to-zinc-950",
    comments: [
      {
        id: "c7",
        author: "Derya K.",
        text: "Bu sabah ben de denedim. Teşekkürler.",
        time: "1 gün önce",
        initial: "D",
      },
      {
        id: "c8",
        author: "Anonim",
        text: "42'de buldum kendimi. Geç değil.",
        time: "1 gün önce",
        initial: "?",
      },
    ],
  },
  {
    id: "5",
    title: "Annemle ilk kez gerçekten konuştum",
    summary:
      "Kırk yıllık mesafemizi bir hastalık haberinde yıktık. Annem 'seni seviyorum' demesini bilmiyordu. Ben de dinlemeyi. İkimiz de geç öğrendik ama öğrendik.",
    fullText:
      "Annem her zaman mesafeliydi. Çocukluğumda sarmayı, öpmeyi, \"seni seviyorum\" demeyi bilmezdi. Ben de bunu bir eksiklik olarak taşıdım yıllarca.\n\nKırk yaşında, annemin kanser tanısı aldığını öğrendim.\n\nHastanede yan yana otururken ilk kez gerçekten konuştuk. O anlattı: Kendi annesi de severken göstermeyi bilmezmiş. Öğrenmemiş. Bilerek değil.\n\nBen de anlattım: Onun uzaklığının beni nasıl şekillendirdiğini.\n\nİkimiz de ağladık. İlk kez.\n\nAnnem dedi: \"Seni çok sevdim. Söylemesini bilmedim. Özür dilerim.\"\n\nO cümleyi duymak için kırk yıl beklemiştim. Şimdi her telefon görüşmesinin sonunda duyuyorum: \"Seni seviyorum.\"\n\nGeç öğrenilmiş sevgi, geç değil. Hâlâ sevgi.",
    author: "Anonim",
    isAnonymous: true,
    time: "3 gün önce",
    category: "Aile",
    categoryStyle:
      "bg-amber-500/15 text-amber-300 border border-amber-400/20",
    likes: 4892,
    commentCount: 201,
    isLiked: false,
    isSaved: false,
    bgGradient: "from-amber-950 via-zinc-900 to-zinc-950",
    comments: [
      {
        id: "c9",
        author: "Fatma G.",
        text: "Annem yok artık. Keşke konuşabilseydik.",
        time: "2 gün önce",
        initial: "F",
      },
      {
        id: "c10",
        author: "Hülya D.",
        text: "Bu sabah anneyi aradım. Sizin sayenizde.",
        time: "2 gün önce",
        initial: "H",
      },
    ],
  },
  {
    id: "6",
    title: "Yalnızlık beni öğretti",
    summary:
      "Otuzlarımın ortasında tüm arkadaşlarım evlenmiş, çocuk sahibi olmuştu. Kendime 'eksik' demeyi bırakıp 'seçimli' diyene kadar yıllarca mücadele ettim.",
    fullText:
      "Otuzlarımın ortasında tüm arkadaşlarım evlenmiş, çocuk sahibi olmuştu. Ben yoktum o listelerde.\n\nBaşlarda acıtıyordu. Pazar sabahları özellikle. Café'de çiftler görünce, annesiyle alışveriş yapan kızlar görünce...\n\nToplumun sesini içselleştirmiştim: \"Bir şeyin eksik.\"\n\nBir süre terapiye gittim. Terapistim sordu: \"Yalnız olmak mı sizi üzüyor, yoksa yalnız olduğunuzu başkalarının bilmesi mi?\"\n\nCevabı bulmak aylar sürdü.\n\nCevap: İkincisi.\n\nYalnızlığımla barıştım zamanla. Gece filmimi seçmek, sabah rutinlerimi kimseyle müzakere etmemek, haftasonunu istediğim gibi geçirmek...\n\nŞimdi kendime \"eksik\" demiyorum. \"Seçimli\" diyorum.\n\nVe ilk kez bu kadar kendim hissediyorum.",
    author: "Anonim",
    isAnonymous: true,
    time: "4 gün önce",
    category: "Yalnızlık",
    categoryStyle: "bg-blue-500/15 text-blue-300 border border-blue-400/20",
    likes: 2734,
    commentCount: 98,
    isLiked: false,
    isSaved: false,
    bgGradient: "from-blue-950 via-zinc-900 to-zinc-950",
    comments: [
      {
        id: "c11",
        author: "Sema A.",
        text: "Terapistin sorusu... o soruyu kendime de sordum.",
        time: "3 gün önce",
        initial: "S",
      },
      {
        id: "c12",
        author: "Anonim",
        text: "\"Seçimli\" kelimesi hayatımı değiştirdi.",
        time: "2 gün önce",
        initial: "?",
      },
    ],
  },
];

const CATEGORY_OPTIONS = [
  "İlişkiler",
  "Annelik",
  "İş Hayatı",
  "Yalnızlık",
  "Aile",
  "Yeniden Başlamak",
];

// ══════════════════════════════════════════════════════════════════════════════
// YARDIMCI BILEŞENLER
// ══════════════════════════════════════════════════════════════════════════════

/** Küçük bildirim toastı */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-toast-in">
      <div className="glass-dark px-5 py-3 rounded-2xl text-sm text-zinc-200 whitespace-nowrap shadow-xl">
        {message}
      </div>
    </div>
  );
}

/** Hikaye okuma modalı */
function StoryModal({
  story,
  isGuest,
  onClose,
  onLike,
  onSave,
  likeAnimating,
}: {
  story: IStory;
  isGuest: boolean;
  onClose: () => void;
  onLike: () => void;
  onSave: () => void;
  likeAnimating: string | null;
}) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<IComment[]>(story.comments);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        author: "Sen",
        text: commentText,
        time: "az önce",
        initial: "S",
      },
    ]);
    setCommentText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Arka plan blur overlay */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal paneli */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] md:max-h-[88vh] bg-zinc-900 border border-white/10 rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl animate-modal-in overflow-hidden">
        {/* Başlık çubuğu */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/8 shrink-0">
          <div className="flex-1 pr-4">
            <span className={`text-xs px-2.5 py-1 rounded-full ${story.categoryStyle} inline-block mb-3`}>
              {story.category}
            </span>
            <h2 className="text-xl font-bold text-zinc-100 leading-snug">
              {story.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
              <span>{story.isAnonymous ? "Anonim" : story.author}</span>
              <span>·</span>
              <span>{story.time}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-full bg-white/8 hover:bg-white/12 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Kaydırılabilir içerik */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Tam metin */}
          <div className="px-6 py-5">
            {story.fullText.split("\n\n").map((para, i) => (
              <p key={i} className="text-zinc-300 text-base leading-relaxed mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {/* Aksiyonlar */}
          <div className="flex items-center gap-4 px-6 py-4 border-t border-b border-white/6">
            <button
              onClick={onLike}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-rose-400 transition-colors"
            >
              <span
                className={`text-lg transition-transform inline-block ${
                  likeAnimating === story.id ? "animate-heart-pop" : ""
                } ${story.isLiked ? "text-rose-400" : ""}`}
              >
                {story.isLiked ? "❤️" : "🤍"}
              </span>
              <span>{story.likes.toLocaleString("tr-TR")}</span>
            </button>
            <button
              onClick={onSave}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                story.isSaved
                  ? "text-violet-400"
                  : "text-zinc-400 hover:text-violet-400"
              }`}
            >
              <span>{story.isSaved ? "🔖" : "🏷️"}</span>
              <span>{story.isSaved ? "Kaydedildi" : "Kaydet"}</span>
            </button>
          </div>

          {/* Yorumlar */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">
              Yorumlar ({comments.length})
            </h3>
            <div className="space-y-4 mb-5">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {comment.initial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-zinc-300">
                        {comment.author}
                      </span>
                      <span className="text-xs text-zinc-600">{comment.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Yorum girişi */}
            <div className="flex gap-3 items-end">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs shrink-0">
                {isGuest ? "?" : "S"}
              </div>
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isGuest}
                  placeholder={
                    isGuest
                      ? "Yorum yazmak için giriş yapmalısın."
                      : "Düşünceni paylaş..."
                  }
                  className="w-full bg-zinc-800/60 border border-white/8 rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
              {!isGuest && (
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="mb-0.5 w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
                >
                  <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Yeni itiraf yazma modalı */
function NewConfessionModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [form, setForm] = useState<IConfessionForm>({
    isAnonymous: true,
    title: "",
    category: "",
    text: "",
  });

  const isValid = form.title.trim() && form.category && form.text.trim().length > 20;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl max-h-[94vh] bg-zinc-900 border border-white/10 rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl animate-modal-in overflow-hidden">
        {/* Başlık */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/8 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Yeni İtiraf Yaz</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Güvenli, yargısız bir alanda paylaş
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/12 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-5">
          {/* Anonim / İsimle */}
          <div className="flex rounded-2xl overflow-hidden border border-white/8">
            <button
              onClick={() => setForm((f) => ({ ...f, isAnonymous: true }))}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                form.isAnonymous
                  ? "bg-violet-600/30 text-violet-300"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              🎭 Anonim Paylaş
            </button>
            <div className="w-px bg-white/8" />
            <button
              onClick={() => setForm((f) => ({ ...f, isAnonymous: false }))}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                !form.isAnonymous
                  ? "bg-violet-600/30 text-violet-300"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              ✨ İsimle Paylaş
            </button>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Güçlü ama sade bir başlık..."
              className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Kategori
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  className={`py-2.5 px-3 text-xs rounded-xl border transition-all ${
                    form.category === cat
                      ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                      : "border-white/8 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Hikaye metni */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Hikayeni anlat
            </label>
            <textarea
              rows={6}
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="Seni dinliyoruz. Güvende hissedebilirsin..."
              className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <p className="text-xs text-zinc-600 mt-1.5 text-right">
              {form.text.length} karakter
            </p>
          </div>
        </div>

        {/* Gönder butonu */}
        <div className="p-5 border-t border-white/8 shrink-0">
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all btn-glow"
          >
            {isValid ? "✨ İtirafı Paylaş" : "Lütfen tüm alanları doldur"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ANA COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function AnlatiWomenStoryFeed() {
  // Misafir kullanıcı mock kontrolü — gerçek uygulamada auth context'ten gelir
  const isGuest = true;

  const [stories, setStories] = useState<IStory[]>(INITIAL_STORIES);
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [showConfession, setShowConfession] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<
    { id: string; storyId: string }[]
  >([]);
  const [toast, setToast] = useState({ message: "", visible: false });

  // ── Toast bildirimi ────────────────────────────────────────────────────────
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    const t = setTimeout(
      () => setToast({ message: "", visible: false }),
      3000
    );
    return () => clearTimeout(t);
  }, []);

  // ── Beğeni aksiyonu ────────────────────────────────────────────────────────
  const handleLike = useCallback(
    (storyId: string) => {
      if (isGuest) {
        showToast("Beğeni yapmak için giriş yapmalısın.");
        return;
      }
      setLikeAnimating(storyId);
      setTimeout(() => setLikeAnimating(null), 600);

      // Uçan kalp efekti
      const heartId = `h-${Date.now()}`;
      setFloatingHearts((prev) => [...prev, { id: heartId, storyId }]);
      setTimeout(
        () => setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId)),
        900
      );

      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId
            ? {
                ...s,
                isLiked: !s.isLiked,
                likes: s.isLiked ? s.likes - 1 : s.likes + 1,
              }
            : s
        )
      );
    },
    [isGuest, showToast]
  );

  // ── Kaydetme aksiyonu ──────────────────────────────────────────────────────
  const handleSave = useCallback(
    (storyId: string) => {
      if (isGuest) {
        showToast("Kaydetmek için giriş yapmalısın.");
        return;
      }
      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId ? { ...s, isSaved: !s.isSaved } : s
        )
      );
    },
    [isGuest, showToast]
  );

  // ── Yorum aksiyonu ─────────────────────────────────────────────────────────
  const handleCommentClick = useCallback(
    (story: IStory) => {
      if (isGuest) {
        showToast("Yorum yazmak için giriş yapmalısın.");
        return;
      }
      setSelectedStory(story);
    },
    [isGuest, showToast]
  );

  // ── Yeni itiraf aksiyonu ───────────────────────────────────────────────────
  const handleNewConfession = () => {
    if (isGuest) {
      showToast("İtiraf yazmak için giriş yapmalısın.");
      return;
    }
    setShowConfession(true);
  };

  const handleSubmitConfession = () => {
    showToast("İtirafın başarıyla paylaşıldı! ✨");
    setShowConfession(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-zinc-100 relative">
      {/* ── Sabit Navbar ────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-40 glass-dark border-b border-white/6">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-sm mx-auto">
          {/* Sol: Logo */}
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-gradient-purple">
              ANLATI
            </span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-0.5">
              Kadınlar İçin
            </span>
          </div>

          {/* Sağ: Aksiyonlar */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewConfession}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-medium hover:bg-violet-600/30 transition-all"
            >
              ✍️ Yeni İtiraf
            </button>
            <button
              onClick={handleNewConfession}
              className="sm:hidden w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 flex items-center justify-center text-base"
              title="Yeni İtiraf Yaz"
            >
              ✍️
            </button>
            {/* Avatar placeholder */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-900 border border-violet-500/30 flex items-center justify-center">
              {isGuest ? (
                <svg className="w-5 h-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <span className="text-xs font-bold text-white">S</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Dikey Scroll Snap Feed ────────────────────────────────────────── */}
      <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="h-screen snap-start relative flex flex-col overflow-hidden"
          >
            {/* Arka plan gradyan */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${story.bgGradient}`}
            />
            {/* Ekstra derinlik için ikinci gradyan */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-transparent to-zinc-950/40" />

            {/* Kart içeriği */}
            <div className="relative z-10 flex flex-col h-full pt-16 pb-6 px-5 max-w-screen-sm mx-auto w-full">

              {/* ── Üst alan: meta bilgiler ──────────────────────────── */}
              <div className="pt-5 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  {/* Yazar avatarı */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-300">
                    {story.isAnonymous ? "?" : story.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {story.isAnonymous ? "Anonim" : story.author}
                    </p>
                    <p className="text-xs text-zinc-500">{story.time}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${story.categoryStyle}`}>
                      {story.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Orta alan: başlık ─────────────────────────────────── */}
              <div className="flex-1 flex flex-col justify-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 leading-tight tracking-tight mb-5">
                  {story.title}
                </h1>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed line-clamp-4">
                  {story.summary}
                </p>
              </div>

              {/* ── Alt alan: aksiyonlar ──────────────────────────────── */}
              <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                {/* Tamamını Oku butonu */}
                <button
                  onClick={() => setSelectedStory(story)}
                  className="w-full py-3.5 mb-4 rounded-2xl glass border border-white/10 text-zinc-200 text-sm font-semibold hover:border-violet-500/40 hover:text-violet-200 transition-all"
                >
                  Tamamını Oku →
                </button>

                {/* Alt aksiyon çubuğu */}
                <div className="flex items-center justify-between">
                  {/* Beğen */}
                  <button
                    onClick={() => handleLike(story.id)}
                    className="flex items-center gap-2 group relative"
                  >
                    <span
                      className={`text-2xl transition-transform inline-block ${
                        likeAnimating === story.id ? "animate-heart-pop" : ""
                      }`}
                    >
                      {story.isLiked ? "❤️" : "🤍"}
                    </span>
                    <span className={`text-sm font-medium ${story.isLiked ? "text-rose-400" : "text-zinc-400 group-hover:text-zinc-200"} transition-colors`}>
                      {story.likes.toLocaleString("tr-TR")}
                    </span>

                    {/* Uçan kalp efekti */}
                    {floatingHearts
                      .filter((h) => h.storyId === story.id)
                      .map((h) => (
                        <span
                          key={h.id}
                          className="absolute bottom-2 left-2 text-2xl pointer-events-none animate-float-up"
                        >
                          ❤️
                        </span>
                      ))}
                  </button>

                  {/* Yorum */}
                  <button
                    onClick={() => handleCommentClick(story)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors group"
                  >
                    <span className="text-xl">💬</span>
                    <span className="text-sm font-medium">{story.commentCount}</span>
                  </button>

                  {/* Kaydet */}
                  <button
                    onClick={() => handleSave(story.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      story.isSaved
                        ? "text-violet-400"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span className="text-xl">{story.isSaved ? "🔖" : "🏷️"}</span>
                    <span className="text-sm font-medium">
                      {story.isSaved ? "Kaydedildi" : "Kaydet"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sağ taraf TikTok aksiyonları (mobil) */}
            <div className="absolute right-4 bottom-28 z-20 flex flex-col gap-5 items-center animate-slide-in-right">
              {/* Beğen */}
              <button
                onClick={() => handleLike(story.id)}
                className="flex flex-col items-center gap-1 group relative"
              >
                <div className="w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center hover:border-rose-400/40 transition-all">
                  <span
                    className={`text-xl ${
                      likeAnimating === story.id ? "animate-heart-pop" : ""
                    }`}
                  >
                    {story.isLiked ? "❤️" : "🤍"}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {story.likes > 999
                    ? `${(story.likes / 1000).toFixed(1)}b`
                    : story.likes}
                </span>
              </button>

              {/* Yorum */}
              <button
                onClick={() => handleCommentClick(story)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center hover:border-violet-400/40 transition-all">
                  <span className="text-xl">💬</span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {story.commentCount}
                </span>
              </button>

              {/* Kaydet */}
              <button
                onClick={() => handleSave(story.id)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-11 h-11 rounded-full glass border flex items-center justify-center transition-all ${
                    story.isSaved
                      ? "border-violet-500/50"
                      : "border-white/10 hover:border-violet-400/40"
                  }`}
                >
                  <span className="text-xl">{story.isSaved ? "🔖" : "🏷️"}</span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {story.isSaved ? "Kaydedildi" : "Kaydet"}
                </span>
              </button>
            </div>

            {/* Hikaye sırası göstergesi */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20 flex gap-1.5">
              {stories.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === index
                      ? "w-5 bg-violet-400"
                      : "w-1 bg-zinc-600"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Modaller ──────────────────────────────────────────────────────── */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          isGuest={isGuest}
          onClose={() => setSelectedStory(null)}
          onLike={() => handleLike(selectedStory.id)}
          onSave={() => handleSave(selectedStory.id)}
          likeAnimating={likeAnimating}
        />
      )}

      {showConfession && (
        <NewConfessionModal
          onClose={() => setShowConfession(false)}
          onSubmit={handleSubmitConfession}
        />
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
