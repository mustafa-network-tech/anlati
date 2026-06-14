"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

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

interface IGlow {
  color: string; // tam Tailwind sınıfı: "bg-rose-500/25"
  style: React.CSSProperties;
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
  readCount: number;
  shareCount: number;
  isLiked: boolean;
  isSaved: boolean;
  // Atmosferik görsel yapılandırması
  visual: {
    gradient: string;
    glows: IGlow[];
  };
  comments: IComment[];
}

interface IStoryCircle {
  id: string;
  label: string;
  emoji: string;
  count: number;
  ringClass: string;
}

interface IConfessionForm {
  isAnonymous: boolean;
  title: string;
  category: string;
  text: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// YARDIMCI FONKSİYON
// ══════════════════════════════════════════════════════════════════════════════

/** Büyük sayıları kısalt: 1234 → "1.2B", 1234567 → "1.2M" */
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}B`;
  return n.toString();
}

// ══════════════════════════════════════════════════════════════════════════════
// STORY CIRCLES (Instagram story bar)
// ══════════════════════════════════════════════════════════════════════════════

const STORY_CIRCLES: IStoryCircle[] = [
  { id: "trending",      label: "En Çok Beğenilen", emoji: "🔥", count: 142, ringClass: "from-orange-500 via-rose-500 to-pink-500" },
  { id: "today",         label: "Bugünün Hikayesi", emoji: "✨", count: 38,  ringClass: "from-violet-500 via-purple-500 to-indigo-500" },
  { id: "relationships", label: "İlişkiler",         emoji: "💑", count: 234, ringClass: "from-rose-500 via-pink-500 to-fuchsia-500" },
  { id: "motherhood",    label: "Annelik",            emoji: "🤱", count: 187, ringClass: "from-pink-500 via-rose-400 to-amber-500" },
  { id: "work",          label: "İş Hayatı",          emoji: "💼", count: 156, ringClass: "from-indigo-500 via-violet-500 to-purple-500" },
  { id: "loneliness",    label: "Yalnızlık",          emoji: "🌙", count: 143, ringClass: "from-blue-500 via-indigo-500 to-slate-500" },
  { id: "family",        label: "Aile",               emoji: "🏡", count: 198, ringClass: "from-amber-500 via-orange-500 to-yellow-500" },
  { id: "restart",       label: "Yeniden Başlamak",   emoji: "🌱", count: 112, ringClass: "from-emerald-500 via-teal-500 to-green-500" },
];

// ══════════════════════════════════════════════════════════════════════════════
// MOCK HİKAYELER (6 adet — tam metin dahil)
// ══════════════════════════════════════════════════════════════════════════════

const INITIAL_STORIES: IStory[] = [
  {
    id: "1",
    title: "Yıllarca güçlü görünmekten yoruldum",
    summary: "Herkes benden güçlü olmasını bekliyordu. İş yerinde lider, evde anne, ilişkide destek. Bir gün aynada kendime baktım ve tanıyamadım. O yüz artık benim değildi.",
    fullText: "Herkes benden güçlü olmasını bekliyordu. İş yerinde lider, evde anne, ilişkide destek. Toplantılarda en soğukkanlı olan bendim.\n\nBir gün aynada kendime baktım ve tanıyamadım. Gözlerin altındaki halkalar, sıkıştırılmış dudaklar...\n\n\"Ne zaman ben ağlasam?\" diye sordum kendime. Cevap geldi: \"Kimse yokken. Duş alırken. Araba kullanırken.\"\n\nBir terapiste gitmeye karar verdim. O gün öğrendim ki güçlü olmak, asla kırılmamak değil. Kırılıp yeniden dikilmek.",
    author: "Anonim", isAnonymous: true, time: "3 saat önce",
    category: "İş Hayatı",
    categoryStyle: "bg-violet-500/15 text-violet-300 border border-violet-400/20",
    likes: 847, commentCount: 23, readCount: 4821, shareCount: 156,
    isLiked: false, isSaved: false,
    visual: {
      gradient: "from-slate-950 via-indigo-950 to-violet-950",
      glows: [
        { color: "bg-indigo-500/25", style: { width: 360, height: 360, top: -60, right: -60, borderRadius: "50%", filter: "blur(80px)" } },
        { color: "bg-violet-500/20", style: { width: 280, height: 280, bottom: "25%", left: -40, borderRadius: "50%", filter: "blur(60px)" } },
        { color: "bg-blue-400/15",   style: { width: 180, height: 180, top: "35%", right: "25%", borderRadius: "50%", filter: "blur(40px)" } },
      ],
    },
    comments: [
      { id: "c1", author: "Zeynep K.", text: "Sanki benim içimden okudunuz.", time: "2 saat önce", initial: "Z" },
      { id: "c2", author: "Selin A.", text: "Bu kadar tanıdık gelmeseydi belki ağlamazdım.", time: "1 saat önce", initial: "S" },
    ],
  },
  {
    id: "2",
    title: "Annem olduğum gün kendimi kaybettim sandım",
    summary: "İlk geceler hem bebeğim hem ben ağlıyorduk. İkimiz de birbirimizi tanımaya çalışıyorduk. Yoksa ikimiz de kendimizi mi?",
    fullText: "Annem olduğum gün bir kayıp gibi hissettim. Kimse söylememişti bunu. Herkes mutlu ol dedi. Oysa içimde garip bir boşluk açılmıştı.\n\nİlk geceler, hem bebeğim hem ben ağlıyorduk. Emzirme acı veriyordu. Uyuyamıyordum.\n\n\"Anneler böyle hissetmez\" diye düşündüm.\n\nDeğilmiş. Doğum sonrası depresyon gerçekmiş. Ve beni seven o minik gözler aslında beni kurtarıyormuş.\n\nO bakışta dünya durdu. Ve kendimi yeniden buldum. Daha güçlü, daha gerçek, daha ben.",
    author: "Elif Y.", isAnonymous: false, time: "6 saat önce",
    category: "Annelik",
    categoryStyle: "bg-rose-500/15 text-rose-300 border border-rose-400/20",
    likes: 1243, commentCount: 47, readCount: 9210, shareCount: 389,
    isLiked: false, isSaved: false,
    visual: {
      gradient: "from-rose-950 via-pink-950 to-zinc-950",
      glows: [
        { color: "bg-rose-500/25",   style: { width: 380, height: 380, top: -40, left: -40, borderRadius: "50%", filter: "blur(80px)" } },
        { color: "bg-amber-500/20",  style: { width: 260, height: 260, bottom: "20%", right: -40, borderRadius: "50%", filter: "blur(60px)" } },
        { color: "bg-pink-400/15",   style: { width: 160, height: 160, top: "45%", left: "35%", borderRadius: "50%", filter: "blur(40px)" } },
      ],
    },
    comments: [
      { id: "c3", author: "Merve T.", text: "Birinci bebekte tam bu hisleri yaşadım. Yalnız değilsiniz.", time: "5 saat önce", initial: "M" },
      { id: "c4", author: "Aylin S.", text: "Doğum sonrası depresyon hakkında konuşulması çok önemli.", time: "3 saat önce", initial: "A" },
    ],
  },
  {
    id: "3",
    title: "Kimse duymadan içimden geçenleri buraya bıraktım",
    summary: "On yıllık evliliğimin ortasında başka birini düşünmeye başladım. Sadakatsiz olmadım ama düşüncelerimin kendisi beni yetti. Bunu kimseye söyleyemedim.",
    fullText: "On yıllık evliliğimin ortasında başka birini düşünmeye başladım. Sadakatsiz olmadım. Ama zihinsel olarak... bir iş arkadaşımla konuşurken gülmekte o kadar zorlanmıyordum.\n\nBu düşünceler beni yedi.\n\nTerapiste gittim. O bana şunu sordu: \"Evliliğinizde doldurulmamış ne var?\"\n\nO soru beni yerle bir etti. Çünkü cevap vardı: Dinlenilmek. Sadece BEN olarak görülmek.\n\nEşimle konuştuk. Ama o geceden sonra, ilk kez beni dinledi.",
    author: "Anonim", isAnonymous: true, time: "1 gün önce",
    category: "İlişkiler",
    categoryStyle: "bg-purple-500/15 text-purple-300 border border-purple-400/20",
    likes: 2156, commentCount: 89, readCount: 18340, shareCount: 724,
    isLiked: false, isSaved: false,
    visual: {
      gradient: "from-rose-950 via-rose-900 to-zinc-950",
      glows: [
        { color: "bg-rose-500/25",  style: { width: 320, height: 320, top: -60, right: 0, borderRadius: "50%", filter: "blur(80px)" } },
        { color: "bg-orange-500/15",style: { width: 260, height: 260, bottom: "25%", left: 0, borderRadius: "50%", filter: "blur(60px)" } },
        { color: "bg-pink-500/20",  style: { width: 200, height: 200, top: "40%", right: "25%", borderRadius: "50%", filter: "blur(50px)" } },
      ],
    },
    comments: [
      { id: "c5", author: "Aylin S.", text: "İlk kez bu kadar cesurca anlatılmış bir şey okudum.", time: "20 saat önce", initial: "A" },
      { id: "c6", author: "Canan M.", text: "Dinlenilmek... evet, tam olarak o.", time: "18 saat önce", initial: "C" },
    ],
  },
  {
    id: "4",
    title: "Bir sabah kendimi seçmeye karar verdim",
    summary: "37 yaşımda ilk kez 'ben ne istiyorum?' diye sordum. Cevap sessizlik, deniz kıyısı ve yazmak oldu.",
    fullText: "37 yaşımda, bir sabah kahvaltı hazırlarken durdum. Kahve makinesi doldu, içim değil.\n\nİlk kez kendime sordum: \"Ben ne istiyorum?\"\n\nCevap beklenmedik geldi: Sessizlik. Deniz kıyısı. Yazmak.\n\nO sabah çantama defter koydum ve telefonsuz park yürüyüşüne çıktım.\n\nŞimdi haftada bir sabah \"benim saatim\" var. Kimseye hesap vermiyorum. Bu seçim beni daha iyi bir anne, daha iyi bir eş yaptı. Artık yarım kalmış hissetmiyorum.",
    author: "Neslihan A.", isAnonymous: false, time: "2 gün önce",
    category: "Yeniden Başlamak",
    categoryStyle: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20",
    likes: 3421, commentCount: 134, readCount: 27650, shareCount: 1102,
    isLiked: false, isSaved: false,
    visual: {
      gradient: "from-amber-950 via-emerald-950 to-zinc-950",
      glows: [
        { color: "bg-amber-400/25",   style: { width: 360, height: 360, top: 0, left: 0, borderRadius: "50%", filter: "blur(80px)" } },
        { color: "bg-emerald-500/20", style: { width: 280, height: 280, bottom: 0, right: 0, borderRadius: "50%", filter: "blur(70px)" } },
        { color: "bg-yellow-300/15",  style: { width: 160, height: 160, top: "33%", right: "33%", borderRadius: "50%", filter: "blur(40px)" } },
      ],
    },
    comments: [
      { id: "c7", author: "Derya K.", text: "Bu sabah ben de denedim. Teşekkürler.", time: "1 gün önce", initial: "D" },
      { id: "c8", author: "Anonim",   text: "42'de buldum kendimi. Geç değil.", time: "1 gün önce", initial: "?" },
    ],
  },
  {
    id: "5",
    title: "Annemle ilk kez gerçekten konuştum",
    summary: "Kırk yıllık mesafemizi bir hastalık haberinde yıktık. Annem 'seni seviyorum' demesini bilmiyordu. Ben de dinlemeyi.",
    fullText: "Annem her zaman mesafeliydi. Çocukluğumda sarmayı, öpmeyi, \"seni seviyorum\" demeyi bilmezdi.\n\nKırk yaşında, annemin kanser tanısı aldığını öğrendim.\n\nHastanede ilk kez gerçekten konuştuk. O anlattı: Kendi annesi de severken göstermeyi bilmezmiş. Öğrenmemiş.\n\nİkimiz de ağladık. İlk kez.\n\nAnnem dedi: \"Seni çok sevdim. Söylemesini bilmedim. Özür dilerim.\"\n\nO cümleyi duymak için kırk yıl beklemiştim. Şimdi her telefon görüşmesinin sonunda duyuyorum.",
    author: "Anonim", isAnonymous: true, time: "3 gün önce",
    category: "Aile",
    categoryStyle: "bg-amber-500/15 text-amber-300 border border-amber-400/20",
    likes: 4892, commentCount: 201, readCount: 41200, shareCount: 2340,
    isLiked: false, isSaved: false,
    visual: {
      gradient: "from-amber-950 via-orange-950 to-zinc-950",
      glows: [
        { color: "bg-amber-500/25",  style: { width: 340, height: 340, top: -30, right: "25%", borderRadius: "50%", filter: "blur(80px)" } },
        { color: "bg-orange-500/20", style: { width: 260, height: 260, bottom: "30%", left: -30, borderRadius: "50%", filter: "blur(60px)" } },
        { color: "bg-yellow-400/15", style: { width: 180, height: 180, top: "50%", right: 0, borderRadius: "50%", filter: "blur(50px)" } },
      ],
    },
    comments: [
      { id: "c9",  author: "Fatma G.", text: "Annem yok artık. Keşke konuşabilseydik.", time: "2 gün önce", initial: "F" },
      { id: "c10", author: "Hülya D.", text: "Bu sabah anneyi aradım. Sizin sayenizde.", time: "2 gün önce", initial: "H" },
    ],
  },
  {
    id: "6",
    title: "Yalnızlık beni öğretti",
    summary: "Otuzlarımın ortasında tüm arkadaşlarım evlenmiş, çocuk sahibi olmuştu. Kendime 'eksik' demeyi bırakıp 'seçimli' diyene kadar yıllarca mücadele ettim.",
    fullText: "Otuzlarımın ortasında tüm arkadaşlarım evlenmiş, çocuk sahibi olmuştu. Ben yoktum o listelerde.\n\nBaşlarda acıtıyordu. Pazar sabahları özellikle.\n\nTerapistim sordu: \"Yalnız olmak mı sizi üzüyor, yoksa yalnız olduğunuzu başkalarının bilmesi mi?\"\n\nCevabı bulmak aylar sürdü. Cevap: İkincisi.\n\nYalnızlığımla barıştım zamanla. Şimdi kendime \"eksik\" demiyorum. \"Seçimli\" diyorum.\n\nVe ilk kez bu kadar kendim hissediyorum.",
    author: "Anonim", isAnonymous: true, time: "4 gün önce",
    category: "Yalnızlık",
    categoryStyle: "bg-blue-500/15 text-blue-300 border border-blue-400/20",
    likes: 2734, commentCount: 98, readCount: 22100, shareCount: 876,
    isLiked: false, isSaved: false,
    visual: {
      gradient: "from-slate-950 via-blue-950 to-zinc-950",
      glows: [
        { color: "bg-blue-500/20",    style: { width: 320, height: 320, top: 0, left: -40, borderRadius: "50%", filter: "blur(80px)" } },
        { color: "bg-slate-500/15",   style: { width: 280, height: 280, bottom: 0, right: 0, borderRadius: "50%", filter: "blur(70px)" } },
        { color: "bg-indigo-400/12",  style: { width: 200, height: 200, top: "50%", left: "50%", borderRadius: "50%", filter: "blur(50px)" } },
      ],
    },
    comments: [
      { id: "c11", author: "Sema A.", text: "Terapistin sorusu... o soruyu kendime de sordum.", time: "3 gün önce", initial: "S" },
      { id: "c12", author: "Anonim",  text: "\"Seçimli\" kelimesi hayatımı değiştirdi.", time: "2 gün önce", initial: "?" },
    ],
  },
];

const CATEGORY_OPTIONS = ["İlişkiler", "Annelik", "İş Hayatı", "Yalnızlık", "Aile", "Yeniden Başlamak"];

// ══════════════════════════════════════════════════════════════════════════════
// KÜÇÜK YARDIMCI BİLEŞENLER
// ══════════════════════════════════════════════════════════════════════════════

function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-toast-in">
      <div className="glass-dark px-5 py-3 rounded-2xl text-sm text-zinc-200 whitespace-nowrap shadow-2xl border border-white/10">
        {message}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HİKAYE OKUMA MODALI
// ══════════════════════════════════════════════════════════════════════════════

function StoryModal({
  story, isGuest, likeAnimating, onClose, onLike, onSave,
}: {
  story: IStory; isGuest: boolean; likeAnimating: string | null;
  onClose: () => void; onLike: () => void; onSave: () => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<IComment[]>(story.comments);

  const handleAdd = () => {
    if (!commentText.trim()) return;
    setLocalComments((p) => [...p, { id: `n-${Date.now()}`, author: "Sen", text: commentText, time: "az önce", initial: "S" }]);
    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] md:max-h-[86vh] bg-zinc-900 border border-white/10 rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl animate-modal-in overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4 border-b border-white/8 shrink-0">
          <div className="flex-1">
            <span className={`text-xs px-2.5 py-1 rounded-full ${story.categoryStyle} inline-block mb-3`}>{story.category}</span>
            <h2 className="text-xl font-bold text-zinc-100 leading-snug">{story.title}</h2>
            <div className="flex items-center gap-2.5 mt-2 text-xs text-zinc-500">
              <span>{story.isAnonymous ? "Anonim" : story.author}</span><span>·</span><span>{story.time}</span>
              <span>·</span><span>{fmt(story.readCount)} okunma</span>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/14 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors shrink-0">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Metin */}
          <div className="px-6 py-5 space-y-4">
            {story.fullText.split("\n\n").map((para, i) => (
              <p key={i} className="text-zinc-300 text-[15px] leading-relaxed">{para}</p>
            ))}
          </div>

          {/* Aksiyon çubuğu */}
          <div className="flex items-center gap-5 px-6 py-4 border-t border-b border-white/6">
            <button onClick={onLike} className="flex items-center gap-2 text-sm">
              <span className={`text-xl inline-block transition-transform ${likeAnimating === story.id ? "animate-heart-pop" : ""} ${story.isLiked ? "text-rose-400" : "text-zinc-400"}`}>
                {story.isLiked ? "❤️" : "🤍"}
              </span>
              <span className={story.isLiked ? "text-rose-400" : "text-zinc-400"}>{fmt(story.likes)}</span>
            </button>
            <button onClick={onSave} className={`flex items-center gap-2 text-sm transition-colors ${story.isSaved ? "text-violet-400" : "text-zinc-400 hover:text-violet-400"}`}>
              <span>{story.isSaved ? "🔖" : "🏷️"}</span>
              <span>{story.isSaved ? "Kaydedildi" : "Kaydet"}</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors ml-auto">
              <span>↗️</span><span>{fmt(story.shareCount)}</span>
            </button>
          </div>

          {/* Yorumlar */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">Yorumlar ({localComments.length})</h3>
            <div className="space-y-4 mb-5">
              {localComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-700 to-purple-900 flex items-center justify-center text-xs font-bold text-white shrink-0">{c.initial}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-zinc-300">{c.author}</span>
                      <span className="text-xs text-zinc-600">{c.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 items-end">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs shrink-0 border border-white/8">{isGuest ? "?" : "S"}</div>
              <div className="flex-1">
                <textarea
                  rows={2} value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isGuest}
                  placeholder={isGuest ? "Yorum yazmak için giriş yapmalısın." : "Düşünceni paylaş..."}
                  className="w-full bg-zinc-800/60 border border-white/8 rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
              {!isGuest && (
                <button onClick={handleAdd} disabled={!commentText.trim()} className="mb-0.5 w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0">
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

// ══════════════════════════════════════════════════════════════════════════════
// YENİ İTİRAF MODALI
// ══════════════════════════════════════════════════════════════════════════════

function NewConfessionModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [form, setForm] = useState<IConfessionForm>({ isAnonymous: true, title: "", category: "", text: "" });
  const isValid = form.title.trim() && form.category && form.text.trim().length > 20;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl max-h-[94vh] bg-zinc-900 border border-white/10 rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl animate-modal-in overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/8 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Yeni İtiraf Yaz</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Güvenli ve yargısız bir alanda paylaş</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/14 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-5">
          <div className="flex rounded-2xl overflow-hidden border border-white/8 bg-zinc-950/30">
            {[{ v: true, l: "🎭 Anonim" }, { v: false, l: "✨ İsimle" }].map(({ v, l }) => (
              <button key={String(v)} onClick={() => setForm((f) => ({ ...f, isAnonymous: v }))}
                className={`flex-1 py-3 text-sm font-medium transition-all ${form.isAnonymous === v ? "bg-violet-600/25 text-violet-300" : "text-zinc-500 hover:text-zinc-300"}`}>
                {l}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Başlık</label>
            <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Güçlü ama sade bir başlık..."
              className="w-full bg-zinc-800/50 border border-white/8 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Kategori</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button key={cat} onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  className={`py-2.5 px-3 text-xs rounded-xl border transition-all text-center ${form.category === cat ? "border-violet-500/60 bg-violet-500/15 text-violet-300" : "border-white/8 text-zinc-500 hover:border-white/20 hover:text-zinc-300"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Hikayeni anlat</label>
            <textarea rows={6} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="Seni dinliyoruz. Güvende hissedebilirsin..."
              className="w-full bg-zinc-800/50 border border-white/8 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 transition-colors" />
            <p className="text-xs text-zinc-600 mt-1.5 text-right">{form.text.length} karakter</p>
          </div>
        </div>
        <div className="p-5 border-t border-white/8 shrink-0">
          <button onClick={onSubmit} disabled={!isValid}
            className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all btn-glow">
            {isValid ? "✨ İtirafı Paylaş" : "Lütfen tüm alanları doldur"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ANA COMPONENT — ANLATI SOSYAL MEDYA PLATFORMU
// ══════════════════════════════════════════════════════════════════════════════

export default function AnlatiWomenWebsite() {
  // ── Gerçek Supabase Auth ────────────────────────────────────────────────
  const { user, isGuest, loading: authLoading, signOut } = useAuth();

  const [stories, setStories] = useState<IStory[]>(INITIAL_STORIES);
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [showConfession, setShowConfession] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [likeAnimating, setLikeAnimating] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: string; storyId: string }[]>([]);
  const [activeNav, setActiveNav] = useState("home");
  const [toast, setToast] = useState({ message: "", visible: false });

  /** Giriş gerektiren işlemlerde auth modal açar */
  const requireAuth = useCallback((mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  }, []);

  // ── Bildirim toastı ────────────────────────────────────────────────────────
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }, []);

  // ── Beğeni ────────────────────────────────────────────────────────────────
  const handleLike = useCallback((storyId: string) => {
    if (isGuest) { requireAuth(); return; }
    setLikeAnimating(storyId);
    setTimeout(() => setLikeAnimating(null), 600);
    const hId = `h-${Date.now()}`;
    setFloatingHearts((p) => [...p, { id: hId, storyId }]);
    setTimeout(() => setFloatingHearts((p) => p.filter((h) => h.id !== hId)), 900);
    setStories((prev) => prev.map((s) => s.id === storyId
      ? { ...s, isLiked: !s.isLiked, likes: s.isLiked ? s.likes - 1 : s.likes + 1 }
      : s));
  }, [isGuest, requireAuth]);

  // ── Kaydet ────────────────────────────────────────────────────────────────
  const handleSave = useCallback((storyId: string) => {
    if (isGuest) { requireAuth(); return; }
    setStories((prev) => prev.map((s) => s.id === storyId ? { ...s, isSaved: !s.isSaved } : s));
  }, [isGuest, requireAuth]);

  // ── Yorum ─────────────────────────────────────────────────────────────────
  const handleComment = useCallback((story: IStory) => {
    if (isGuest) { requireAuth(); return; }
    setSelectedStory(story);
  }, [isGuest, requireAuth]);

  // ── Yeni itiraf ───────────────────────────────────────────────────────────
  const handleNewConfession = () => {
    if (isGuest) { requireAuth(); return; }
    setShowConfession(true);
  };

  // ── Bottom nav ───────────────────────────────────────────────────────────
  const handleNavClick = (id: string) => {
    if (id === "create") { handleNewConfession(); return; }
    setActiveNav(id);
  };

  // ── Kaydedilen hikayeler ───────────────────────────────────────────────
  const savedStories = stories.filter((s) => s.isSaved);

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW BİLEŞENLERİ (inline, state'e erişebilir)
  // ══════════════════════════════════════════════════════════════════════════

  /** Ana Sayfa — Instagram story bar + TikTok snap feed */
  const HomeView = (
    <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {/* Story circles */}
      <div className="snap-start bg-zinc-950 pt-14 pb-4 border-b border-white/6">
        <div className="overflow-x-scroll scrollbar-hide px-4 pt-4">
          <div className="flex gap-4 w-max">
            {STORY_CIRCLES.map((circle) => (
              <button key={circle.id} className="flex flex-col items-center gap-2 shrink-0 group">
                <div className={`p-[2.5px] rounded-full bg-gradient-to-tr ${circle.ringClass} group-hover:scale-105 transition-transform`}>
                  <div className="w-14 h-14 rounded-full bg-zinc-950 border-[2px] border-zinc-950 flex items-center justify-center">
                    <span className="text-2xl">{circle.emoji}</span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 w-16 text-center leading-tight truncate group-hover:text-zinc-200 transition-colors">{circle.label}</span>
                <span className="text-[9px] text-zinc-600">{circle.count} hikaye</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TikTok feed kartları */}
      {stories.map((story, index) => {
        const visual = story.visual;
        return (
          <div key={story.id} className="h-screen snap-start relative overflow-hidden flex flex-col">
            <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`} />
            {visual.glows.map((glow, gi) => (
              <div key={gi} className={`absolute rounded-full ${glow.color}`} style={{ position: "absolute", ...glow.style }} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/98 via-zinc-950/40 to-zinc-950/60" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "200px" }} />
            <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full px-5 pt-16 pb-20">
              <div className="flex items-center gap-3 mt-4 mb-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/12 flex items-center justify-center text-sm font-bold text-zinc-300">
                  {story.isAnonymous ? "?" : story.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-100">{story.isAnonymous ? "Anonim" : story.author}</p>
                  <p className="text-xs text-zinc-500">{story.time}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${story.categoryStyle}`}>{story.category}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center py-6">
                <h2 className="text-[1.65rem] sm:text-4xl font-black text-zinc-50 leading-tight tracking-tight mb-5 drop-shadow-lg">{story.title}</h2>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3">{story.summary}</p>
              </div>
              <div>
                <button onClick={() => setSelectedStory(story)} className="w-full py-3.5 mb-4 rounded-2xl glass border border-white/10 text-zinc-200 text-sm font-semibold hover:border-violet-500/40 hover:text-violet-200 transition-all">
                  Tamamını Oku →
                </button>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs">{fmt(story.readCount)}</span>
                  </div>
                  <button onClick={() => handleLike(story.id)} className="flex items-center gap-1.5 relative">
                    <span className={`text-xl inline-block ${likeAnimating === story.id ? "animate-heart-pop" : ""}`}>
                      {story.isLiked ? "❤️" : "🤍"}
                    </span>
                    <span className={`text-xs ${story.isLiked ? "text-rose-400" : "text-zinc-400"}`}>{fmt(story.likes)}</span>
                    {floatingHearts.filter((h) => h.storyId === story.id).map((h) => (
                      <span key={h.id} className="absolute bottom-2 left-0 text-xl pointer-events-none animate-float-up">❤️</span>
                    ))}
                  </button>
                  <button onClick={() => handleComment(story)} className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors">
                    <span className="text-lg">💬</span>
                    <span className="text-xs">{fmt(story.commentCount)}</span>
                  </button>
                  <button onClick={() => showToast("Paylaşım özelliği yakında!")} className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors">
                    <span className="text-lg">↗️</span>
                    <span className="text-xs">{fmt(story.shareCount)}</span>
                  </button>
                  <button onClick={() => handleSave(story.id)} className={`flex items-center gap-1.5 transition-colors ${story.isSaved ? "text-violet-400" : "text-zinc-400 hover:text-zinc-200"}`}>
                    <span className="text-lg">{story.isSaved ? "🔖" : "🏷️"}</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Sağ TikTok aksiyonları */}
            <div className="absolute right-4 bottom-28 z-20 flex flex-col gap-4 items-center">
              {[
                { icon: story.isLiked ? "❤️" : "🤍", count: fmt(story.likes), action: () => handleLike(story.id), active: story.isLiked, animKey: story.id },
                { icon: "💬", count: fmt(story.commentCount), action: () => handleComment(story), active: false, animKey: "" },
                { icon: story.isSaved ? "🔖" : "🏷️", count: story.isSaved ? "✓" : "Kaydet", action: () => handleSave(story.id), active: story.isSaved, animKey: "" },
                { icon: "↗️", count: fmt(story.shareCount), action: () => showToast("Paylaşım özelliği yakında!"), active: false, animKey: "" },
              ].map((item, i) => (
                <button key={i} onClick={item.action} className="flex flex-col items-center gap-1">
                  <div className={`w-11 h-11 rounded-full glass border flex items-center justify-center text-xl transition-all ${item.active ? "border-violet-500/50" : "border-white/10 hover:border-violet-400/30"}`}>
                    <span className={item.animKey && likeAnimating === item.animKey ? "animate-heart-pop" : ""}>{item.icon}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{item.count}</span>
                </button>
              ))}
            </div>
            {/* Sıra göstergesi */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[4.5rem] z-20 flex gap-1.5">
              {stories.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === index ? "w-5 bg-violet-400" : "w-1 bg-zinc-700"}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  /** Hikayeler — tüm hikayeler liste+grid görünümü */
  const StoriesView = (
    <div className="h-full overflow-y-scroll scrollbar-hide pt-14 pb-20">
      <div className="px-4 pt-5 pb-4 max-w-lg mx-auto">
        <h2 className="text-xl font-black text-zinc-100 mb-1">Hikayeler</h2>
        <p className="text-xs text-zinc-500 mb-5">{stories.length} hikaye · Hepsi burada</p>

        {/* Kategori filtresi */}
        <div className="overflow-x-scroll scrollbar-hide mb-5">
          <div className="flex gap-2 w-max pb-1">
            {["Tümü", ...CATEGORY_OPTIONS].map((cat) => (
              <button key={cat}
                className="px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-zinc-400 hover:border-violet-500/40 hover:text-violet-300 whitespace-nowrap transition-all bg-zinc-900/60">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Hikaye listesi */}
        <div className="space-y-3">
          {stories.map((story) => (
            <button key={story.id} onClick={() => setSelectedStory(story)}
              className="w-full text-left glass rounded-2xl p-4 border border-white/6 hover:border-violet-500/25 transition-all group">
              <div className="flex items-start gap-3">
                {/* Mini atmosfer kutusu */}
                <div className={`w-14 h-14 rounded-xl shrink-0 bg-gradient-to-br ${story.visual.gradient} relative overflow-hidden`}>
                  {story.visual.glows.slice(0, 1).map((g, i) => (
                    <div key={i} className={`absolute rounded-full ${g.color}`}
                      style={{ width: 60, height: 60, top: -10, left: -10, filter: "blur(16px)" }} />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    {story.isAnonymous ? "🎭" : story.author.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${story.categoryStyle}`}>{story.category}</span>
                    <span className="text-[10px] text-zinc-600">{story.time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 leading-snug line-clamp-2 group-hover:text-white transition-colors mb-1.5">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                    <span>👁 {fmt(story.readCount)}</span>
                    <span>❤️ {fmt(story.likes)}</span>
                    <span>💬 {fmt(story.commentCount)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /** Favoriler — kaydedilen hikayeler */
  const FavoritesView = (
    <div className="h-full overflow-y-scroll scrollbar-hide pt-14 pb-20">
      <div className="px-4 pt-5 max-w-lg mx-auto">
        <h2 className="text-xl font-black text-zinc-100 mb-1">Favoriler</h2>
        <p className="text-xs text-zinc-500 mb-6">{isGuest ? "Kaydettiklerini görmek için giriş yap" : `${savedStories.length} kayıtlı hikaye`}</p>

        {isGuest ? (
          /* Misafir kullanıcı uyarısı */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full glass border border-white/8 flex items-center justify-center text-4xl mb-5">🔖</div>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">Favori hikayelerin burada</h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6 max-w-xs">
              Beğendiğin hikayeleri kaydetmek ve daha sonra okumak için giriş yapmalısın.
            </p>
            <button className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all btn-glow">
              Giriş Yap
            </button>
            <button className="mt-3 px-6 py-3 rounded-2xl border border-white/10 text-zinc-400 font-medium text-sm hover:text-zinc-200 transition-colors">
              Hesap Oluştur
            </button>
          </div>
        ) : savedStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔖</div>
            <p className="text-zinc-400 text-sm">Henüz kaydettiğin hikaye yok.</p>
            <p className="text-zinc-600 text-xs mt-1">Hikayeleri okurken 🏷️ simgesine bas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedStories.map((story) => (
              <button key={story.id} onClick={() => setSelectedStory(story)}
                className="w-full text-left glass rounded-2xl p-4 border border-violet-500/15 hover:border-violet-500/30 transition-all group">
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 rounded-xl shrink-0 bg-gradient-to-br ${story.visual.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                      {story.isAnonymous ? "🎭" : story.author.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${story.categoryStyle} inline-block mb-1`}>{story.category}</span>
                    <h3 className="text-sm font-bold text-zinc-200 line-clamp-2 group-hover:text-white transition-colors mb-1.5">{story.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                      <span>❤️ {fmt(story.likes)}</span>
                      <span>💬 {fmt(story.commentCount)}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleSave(story.id); }}
                    className="shrink-0 text-violet-400 hover:text-zinc-400 transition-colors text-lg">
                    🔖
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /** Profil sayfası */
  const displayName = (user?.user_metadata?.display_name as string | undefined)
    ?? user?.email?.split("@")[0]
    ?? "Kullanıcı";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })
    : "";

  const ProfileView = (
    <div className="h-full overflow-y-scroll scrollbar-hide pt-14 pb-20">
      <div className="max-w-lg mx-auto">
        {isGuest ? (
          /* ── Misafir: kayıt / giriş ekranı ── */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-800 to-purple-950 border border-violet-500/30 flex items-center justify-center mb-5">
              <svg className="w-12 h-12 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-zinc-100 mb-2">Profilini oluştur</h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8 max-w-xs">
              Kendi hikayelerini paylaş, topluluğa katıl, diğer kadınlarla bağlantı kur.
            </p>
            <div className="w-full space-y-3">
              <button
                onClick={() => requireAuth("login")}
                className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all btn-glow"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => requireAuth("register")}
                className="w-full py-3.5 rounded-2xl glass border border-white/10 text-zinc-300 font-semibold text-sm hover:border-violet-500/30 transition-all"
              >
                Hesap Oluştur — Ücretsiz
              </button>
            </div>
            <div className="mt-10 w-full space-y-3">
              {[
                { icon: "🎭", title: "Anonim paylaşım", desc: "Kimliğini gizleyerek özgürce anlat" },
                { icon: "🔖", title: "Hikayeleri kaydet", desc: "Beğendiklerini favori listene ekle" },
                { icon: "💬", title: "Topluluğa katıl", desc: "Yorum yap, destek ver, bağlantı kur" },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-4 glass rounded-2xl px-4 py-3.5 border border-white/6 text-left">
                  <span className="text-2xl shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{f.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Giriş yapılmış kullanıcı profili ── */
          <div>
            {/* Profil başlığı */}
            <div className="pt-8 pb-6 px-5 text-center border-b border-white/6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-purple-900 border-2 border-violet-500/40 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4">
                {avatarLetter}
              </div>
              <h3 className="text-lg font-black text-zinc-100">{displayName}</h3>
              <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
              {memberSince && (
                <p className="text-xs text-zinc-600 mt-0.5">Üye · {memberSince}</p>
              )}
              <div className="flex items-center justify-center gap-8 mt-5">
                {[
                  { label: "Hikaye",  count: "—" },
                  { label: "Beğeni",  count: fmt(stories.filter((s) => s.isLiked).length) },
                  { label: "Kaydedilen", count: fmt(savedStories.length) },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-black text-zinc-100">{s.count}</div>
                    <div className="text-[10px] text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aksiyon menüsü */}
            <div className="px-4 py-4 space-y-2">
              {[
                { icon: "📖", label: "Hikayelerim", action: () => {} },
                { icon: "🔖", label: "Kaydettiklerim", action: () => setActiveNav("favorites") },
                { icon: "⚙️", label: "Hesap Ayarları", action: () => showToast("Yakında geliyor...") },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 glass rounded-2xl px-4 py-3.5 border border-white/6 hover:border-violet-500/20 text-left transition-all group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors flex-1">
                    {item.label}
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              {/* Çıkış yap */}
              <button
                onClick={async () => {
                  await signOut();
                  setActiveNav("home");
                  showToast("Çıkış yapıldı. Görüşmek üzere 💜");
                }}
                className="w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 border border-rose-500/15 hover:border-rose-500/35 hover:bg-rose-950/20 text-left transition-all group mt-4"
              >
                <span className="text-xl">👋</span>
                <span className="text-sm font-medium text-rose-400 group-hover:text-rose-300 transition-colors">
                  Çıkış Yap
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 overflow-hidden relative">

      {/* ────────────────────────────────────────────────────────────────────
          ÜST BAR — Sabit, cam efekti overlay
      ──────────────────────────────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-50 glass-dark border-b border-white/6">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-sm mx-auto">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight text-gradient-purple">ANLATI</span>
            <span className="text-[9px] text-zinc-500 font-semibold tracking-[0.2em] uppercase">Kadınlar İçin</span>
          </div>

          {/* Sağ: bildirim + profil / giriş yap */}
          <div className="flex items-center gap-3">
            {isGuest ? (
              /* Misafir: Giriş Yap butonu */
              <button
                onClick={() => requireAuth("login")}
                className="px-3.5 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-600/35 transition-all"
              >
                Giriş Yap
              </button>
            ) : (
              /* Giriş yapılmış: bildirim + avatar + çıkış */
              <>
                <button className="relative w-9 h-9 rounded-full bg-white/6 border border-white/8 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveNav("profile")}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-900 border border-violet-500/30 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  title={user?.user_metadata?.display_name ?? user?.email ?? "Profil"}
                >
                  <span className="text-xs font-bold text-white">
                    {(user?.user_metadata?.display_name as string | undefined)?.charAt(0).toUpperCase()
                      ?? user?.email?.charAt(0).toUpperCase()
                      ?? "?"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          ANA İÇERİK ALANI — aktif sekmeye göre view değişir
      ──────────────────────────────────────────────────────────────────── */}
      {activeNav === "home"      && HomeView}
      {activeNav === "stories"   && StoriesView}
      {activeNav === "favorites" && FavoritesView}
      {activeNav === "profile"   && ProfileView}

      {/* ────────────────────────────────────────────────────────────────────
          ALT NAVİGASYON — Instagram benzeri sabit bar
      ──────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 glass-dark border-t border-white/6 pb-safe">
        <div className="flex items-center justify-around max-w-screen-sm mx-auto px-2 py-2">

          {/* Ana Sayfa */}
          <button onClick={() => handleNavClick("home")} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${activeNav === "home" ? "text-violet-400" : "text-zinc-500 hover:text-zinc-300"}`}>
            <svg className="w-6 h-6" fill={activeNav === "home" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Ana Sayfa</span>
          </button>

          {/* Hikayeler */}
          <button onClick={() => handleNavClick("stories")} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${activeNav === "stories" ? "text-violet-400" : "text-zinc-500 hover:text-zinc-300"}`}>
            <svg className="w-6 h-6" fill={activeNav === "stories" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-3.5-3.5A2 2 0 0015.5 4H15" />
            </svg>
            <span className="text-[10px] font-medium">Hikayeler</span>
          </button>

          {/* Anlat — merkez büyük buton */}
          <button onClick={() => handleNavClick("create")} className="flex flex-col items-center gap-1 -mt-5">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 hover:bg-violet-500 border-2 border-zinc-950 shadow-xl flex items-center justify-center text-2xl transition-all btn-glow hover:scale-105">
              ✍️
            </div>
            <span className="text-[10px] font-semibold text-violet-400 mt-0.5">Anlat</span>
          </button>

          {/* Favoriler */}
          <button onClick={() => handleNavClick("favorites")} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${activeNav === "favorites" ? "text-violet-400" : "text-zinc-500 hover:text-zinc-300"}`}>
            <svg className="w-6 h-6" fill={activeNav === "favorites" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-[10px] font-medium">Favoriler</span>
          </button>

          {/* Profil */}
          <button onClick={() => handleNavClick("profile")} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${activeNav === "profile" ? "text-violet-400" : "text-zinc-500 hover:text-zinc-300"}`}>
            <svg className="w-6 h-6" fill={activeNav === "profile" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Profil</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          MODALLER & TOAST
      ──────────────────────────────────────────────────────────────────── */}
      {selectedStory && (
        <StoryModal
          story={selectedStory} isGuest={isGuest} likeAnimating={likeAnimating}
          onClose={() => setSelectedStory(null)}
          onLike={() => handleLike(selectedStory.id)}
          onSave={() => handleSave(selectedStory.id)}
        />
      )}

      {showConfession && (
        <NewConfessionModal
          onClose={() => setShowConfession(false)}
          onSubmit={() => { showToast("İtirafın başarıyla paylaşıldı! ✨"); setShowConfession(false); }}
        />
      )}

      {/* Auth Modal — giriş / kayıt */}
      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            showToast("Hoş geldin! 💜");
          }}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
