"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

type Props={id:string;username:string;firstName:string;lastName:string;avatarUrl:string|null};
const allowed=["image/jpeg","image/png","image/webp"];

export default function ProfileEditor({id,username,firstName,lastName,avatarUrl}:Props){
  const[open,setOpen]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const router=useRouter();
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setMessage("");
    const supabase=createClient();if(!supabase){setMessage("Supabase bağlantısı yapılandırılmamış.");setBusy(false);return}
    const fd=new FormData(e.currentTarget),file=fd.get("avatar") as File,nextUsername=String(fd.get("username")).trim().toLowerCase();let nextAvatar=avatarUrl;
    if(!/^[a-z0-9_]{3,24}$/.test(nextUsername)){setMessage("Kullanıcı adı 3–24 karakter olmalı; yalnızca harf, rakam ve alt çizgi kullanılabilir.");setBusy(false);return}
    if(nextUsername!==username.toLowerCase()){
      const{data:existing}=await(supabase as any).from("profiles").select("id").ilike("username",nextUsername).neq("id",id).maybeSingle();
      if(existing){setMessage("Bu kullanıcı adı kullanılıyor. Başka bir kullanıcı adı seç.");setBusy(false);return}
    }
    if(file?.size){
      if(file.size>2*1024*1024||!allowed.includes(file.type)){setMessage("Avatar JPG, PNG veya WebP ve en fazla 2 MB olmalı.");setBusy(false);return}
      const ext=file.name.split(".").pop()?.toLowerCase()||"jpg",path=`${id}/avatar.${ext}`;
      const{error}=await supabase.storage.from("avatars").upload(path,file,{contentType:file.type,upsert:true});
      if(error){setMessage(error.message);setBusy(false);return}
      nextAvatar=supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl+`?v=${Date.now()}`;
    }
    const{error}=await(supabase as any).from("profiles").update({username:nextUsername,first_name:String(fd.get("first_name")).trim()||null,last_name:String(fd.get("last_name")).trim()||null,avatar_url:nextAvatar}).eq("id",id);
    if(error){setMessage(error.code==="23505"?"Bu kullanıcı adı kullanılıyor. Başka bir kullanıcı adı seç.":"Profil güncellenemedi. Lütfen tekrar dene.")}else{
      await supabase.auth.updateUser({data:{username:nextUsername}});
      setMessage("Profil güncellendi.");
      if(nextUsername!==username.toLowerCase())window.location.assign(`/profil/${nextUsername}`);else router.refresh();
    }
    setBusy(false);
  }
  if(!open)return <button className="button secondary profile-edit-toggle" onClick={()=>setOpen(true)}>Profili Düzenle</button>;
  return <form className="profile-editor" onSubmit={submit}><label>Kullanıcı adı<input name="username" defaultValue={username} minLength={3} maxLength={24} pattern="[a-zA-Z0-9_]+" autoComplete="username" required/></label><small>3–24 karakter; harf, rakam ve alt çizgi kullanabilirsin. Değiştirildiğinde profil bağlantın da yenilenir.</small><div className="form-row"><label>İsim<input name="first_name" defaultValue={firstName}/></label><label>Soyisim<input name="last_name" defaultValue={lastName}/></label></div><label>Profil fotoğrafı<input name="avatar" type="file" accept="image/jpeg,image/png,image/webp"/></label>{message&&<p className="form-message">{message}</p>}<div className="profile-editor-actions"><button className="button" disabled={busy}>{busy?"Kaydediliyor…":"Kaydet"}</button><button type="button" className="text-button" onClick={()=>setOpen(false)}>Vazgeç</button></div></form>
}
