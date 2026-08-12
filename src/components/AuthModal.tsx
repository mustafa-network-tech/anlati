"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {createClient} from "@/lib/supabase/client";

type AuthMode="login"|"register";
type Props={onClose?:()=>void;onSuccess?:()=>void;initialMode?:AuthMode;embedded?:boolean};

function translateError(message:string){
  const map:Record<string,string>={
    "Invalid login credentials":"E-posta veya şifre hatalı.",
    "Email not confirmed":"E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et.",
    "User already registered":"Bu e-posta zaten kayıtlı.",
    "already been registered":"Bu e-posta zaten kayıtlı.",
    "duplicate key":"Bu kullanıcı adı kullanılıyor.",
    "Password should be at least 6 characters":"Şifre en az 6 karakter olmalı.",
    "invalid format":"Geçerli bir e-posta adresi gir.",
    "rate limit":"Çok fazla deneme yaptın. Lütfen biraz bekle.",
    "signup is disabled":"Şu anda yeni kayıt kabul edilmiyor."
  };
  for(const[key,value]of Object.entries(map))if(message.toLowerCase().includes(key.toLowerCase()))return value;
  return "İşlem tamamlanamadı. Lütfen bilgilerini kontrol edip tekrar dene.";
}

export default function AuthModal({onClose,onSuccess,initialMode="login",embedded=false}:Props){
  const[mode,setMode]=useState<AuthMode>(initialMode),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[username,setUsername]=useState(""),[gender,setGender]=useState<"male"|"female"|null>(null),[showPassword,setShowPassword]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState<string|null>(null),[success,setSuccess]=useState<string|null>(null);
  const router=useRouter(),isLogin=mode==="login";
  function changeMode(next:AuthMode){setMode(next);setError(null);setSuccess(null)}
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setError(null);setSuccess(null);
    if(!email.trim()||!password){setError("E-posta ve şifre zorunlu.");return}
    if(!isLogin&&!/^[a-zA-Z0-9_]{3,24}$/.test(username.trim())){setError("Kullanıcı adı 3–24 karakter olmalı; yalnızca harf, rakam ve alt çizgi kullanılabilir.");return}
    if(!isLogin&&!gender){setError("Devam etmek için kadın veya erkek seçeneklerinden birini işaretle.");return}
    if(password.length<6){setError("Şifre en az 6 karakter olmalı.");return}
    const supabase=createClient();if(!supabase){setError("Kimlik doğrulama şu anda kullanılamıyor.");return}
    setLoading(true);
    try{
      if(isLogin){
        const{error:authError}=await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(authError){setError(translateError(authError.message));return}
        onSuccess?.();onClose?.();router.push("/");router.refresh();
      }else{
        const cleanUsername=username.trim().toLowerCase();
        const{error:authError}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{username:cleanUsername,display_name:cleanUsername,gender}}});
        if(authError){setError(translateError(authError.message));return}
        setSuccess("Hesabın oluşturuldu. Giriş yapmak için e-postana gönderilen doğrulama bağlantısına tıkla.");
      }
    }finally{setLoading(false)}
  }
  async function resetPassword(){
    if(!email.trim()){setError("Önce e-posta adresini gir.");return}
    const supabase=createClient();if(!supabase){setError("Kimlik doğrulama şu anda kullanılamıyor.");return}
    setLoading(true);setError(null);const{error:resetError}=await supabase.auth.resetPasswordForEmail(email.trim());setLoading(false);
    if(resetError)setError(translateError(resetError.message));else setSuccess("Şifre sıfırlama bağlantısı e-postana gönderildi.");
  }
  return <div className={embedded?"auth-embedded":"auth-overlay"}>
    {!embedded&&<button className="auth-backdrop" aria-label="Giriş penceresini kapat" onClick={onClose}/>} 
    <section className="auth-card" aria-labelledby="auth-title">
      {!embedded&&<button className="auth-close" aria-label="Kapat" onClick={onClose}>×</button>}
      <header className="auth-card-head"><span className="auth-brand">ANLATI<span>.</span></span><h2 id="auth-title">Konuşmaya katıl.</h2><p>Sor, cevapla, deneyimini paylaş.</p>{isLogin&&<small>Tekrar hoş geldin.</small>}</header>
      <div className="auth-tabs" role="tablist" aria-label="Üyelik işlemleri"><Link href="/auth?mode=login" role="tab" aria-selected={isLogin} className={isLogin?"active":""} onClick={()=>changeMode("login")}>Giriş Yap</Link><Link href="/auth?mode=register" role="tab" aria-selected={!isLogin} className={!isLogin?"active":""} onClick={()=>changeMode("register")}>Üye Ol</Link></div>
      <form className="auth-form" onSubmit={submit}>
        {error&&<div className="auth-message error" role="alert">{error}</div>}
        {success&&<div className="auth-message success" role="status">{success}</div>}
        {!isLogin&&<label>Kullanıcı adı<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" placeholder="ornek_kullanici" required/></label>}
        <label>E-posta<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="ornek@email.com" required/></label>
        <label>Şifre<div className="password-field"><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={isLogin?"current-password":"new-password"} placeholder={isLogin?"Şifreni gir":"En az 6 karakter"} required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Şifreyi gizle":"Şifreyi göster"}>{showPassword?"Gizle":"Göster"}</button></div></label>
        {!isLogin&&<fieldset className="gender-select"><legend>Cinsiyet <span>*</span></legend><div><label className={gender==="male"?"active":""}><input type="radio" name="gender" value="male" checked={gender==="male"} onChange={()=>setGender("male")} required/><i aria-hidden="true">{gender==="male"?"✓":""}</i>Erkek</label><label className={gender==="female"?"active":""}><input type="radio" name="gender" value="female" checked={gender==="female"} onChange={()=>setGender("female")} required/><i aria-hidden="true">{gender==="female"?"✓":""}</i>Kadın</label></div><small>Bir seçim yapman zorunludur. Bu bilgi, hedeflenen sorulara kimlerin cevap verebileceğini belirler.</small></fieldset>}
        <button className="auth-submit" disabled={loading||!!success}>{loading?"Lütfen bekle…":isLogin?"Giriş Yap":"Hesap Oluştur"}</button>
        {isLogin&&<button className="auth-reset" type="button" onClick={resetPassword}>Şifremi unuttum</button>}
      </form>
      <footer className="auth-switch">{isLogin?"Henüz hesabın yok mu? ":"Zaten hesabın var mı? "}<Link href={isLogin?"/auth?mode=register":"/auth?mode=login"} onClick={()=>changeMode(isLogin?"register":"login")}>{isLogin?"Üye Ol":"Giriş Yap"}</Link></footer>
    </section>
  </div>
}
