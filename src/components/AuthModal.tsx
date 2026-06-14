"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

interface AuthModalProps {
  onClose: () => void;
  /** Modal kapanınca çağrılır, giriş başarılıysa user objesi gelir */
  onSuccess?: () => void;
  /** Başlangıç modu: giriş mi kayıt mı */
  initialMode?: AuthMode;
}

// Supabase hata mesajlarını Türkçe'ye çevir
function translateError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-posta veya şifre hatalı.",
    "Email not confirmed": "E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et.",
    "User already registered": "Bu e-posta zaten kayıtlı. Giriş yapmayı dene.",
    "Password should be at least 6 characters": "Şifre en az 6 karakter olmalı.",
    "Unable to validate email address: invalid format": "Geçerli bir e-posta adresi gir.",
    "Email rate limit exceeded": "Çok fazla deneme. Lütfen birkaç dakika bekle.",
    "signup is disabled": "Şu an yeni kayıt kabul edilmiyor.",
    "over_email_send_rate_limit": "Çok fazla e-posta gönderildi. Biraz bekle.",
  };
  for (const [key, val] of Object.entries(map)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "Bir hata oluştu. Lütfen tekrar dene.";
}

export default function AuthModal({
  onClose,
  onSuccess,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError("E-posta ve şifre zorunlu.");
      return;
    }
    if (!isLogin && !displayName.trim()) {
      setError("İsim alanı zorunlu.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (isLogin) {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) { setError(translateError(err.message)); return; }
        onSuccess?.();
        onClose();
      } else {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: displayName.trim() },
          },
        });
        if (err) { setError(translateError(err.message)); return; }
        // E-posta doğrulama gerekiyorsa bildir
        setSuccessMsg(
          "Hesabın oluşturuldu! 🎉 Giriş yapmak için e-posta adresine gelen doğrulama linkine tıkla."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Arka plan */}
      <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-modal-in overflow-hidden">

        {/* Üst çizgi (mobil) */}
        <div className="sm:hidden w-10 h-1 bg-white/15 rounded-full mx-auto mt-3 mb-1" />

        {/* Başlık */}
        <div className="px-6 pt-5 pb-4 border-b border-white/8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400">
                ANLATI · Kadınlar İçin
              </span>
              <h2 className="text-xl font-black text-zinc-100 mt-1">
                {isLogin ? "Tekrar hoş geldin 💜" : "Topluluğa katıl ✨"}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {isLogin
                  ? "E-posta adresinle giriş yap."
                  : "Ücretsiz hesap oluştur, hikayelerini paylaş."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/14 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Başarı mesajı */}
          {successMsg && (
            <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl px-4 py-3 text-sm text-emerald-300 leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Hata mesajı */}
          {error && (
            <div className="bg-rose-900/30 border border-rose-500/30 rounded-2xl px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          {/* İsim (sadece kayıt modunda) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Adın
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="İsmini gir (veya takma ad)"
                autoComplete="name"
                className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors"
              />
            </div>
          )}

          {/* E-posta */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              autoComplete="email"
              className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors"
            />
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Şifreni gir" : "En az 6 karakter"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors"
            />
          </div>

          {/* Gönder butonu */}
          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all btn-glow flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Lütfen bekle...</span>
              </>
            ) : isLogin ? (
              "Giriş Yap →"
            ) : (
              "Hesap Oluştur ✨"
            )}
          </button>

          {/* Şifremi unuttum (sadece giriş modunda) */}
          {isLogin && (
            <button
              type="button"
              onClick={async () => {
                if (!email.trim()) { setError("Önce e-posta adresini gir."); return; }
                setLoading(true);
                const supabase = createClient();
                await supabase.auth.resetPasswordForEmail(email.trim());
                setSuccessMsg("Şifre sıfırlama bağlantısı e-postana gönderildi.");
                setLoading(false);
              }}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-1"
            >
              Şifremi unuttum
            </button>
          )}
        </form>

        {/* Mod değiştirme */}
        <div className="px-6 pb-6 border-t border-white/6 pt-4">
          <p className="text-center text-sm text-zinc-500">
            {isLogin ? "Henüz hesabın yok mu?" : "Zaten hesabın var mı?"}
            {" "}
            <button
              type="button"
              onClick={() => { setMode(isLogin ? "register" : "login"); setError(null); setSuccessMsg(null); }}
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              {isLogin ? "Ücretsiz Kaydol" : "Giriş Yap"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
