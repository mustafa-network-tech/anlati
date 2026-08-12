-- ANLATI: temel kullanıcı profili ve güvenli avatar alanı
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;

-- Mevcut profil update politikasını hem USING hem WITH CHECK ile sınırla.
drop policy if exists "Kullanici kendi profilini duzenleyebilir" on public.profiles;
create policy "Kullanici kendi profilini duzenleyebilir"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('avatars','avatars',true,2097152,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Avatarlar herkese gorunur" on storage.objects;
create policy "Avatarlar herkese gorunur" on storage.objects for select using (bucket_id='avatars');
drop policy if exists "Kullanici kendi avatarini yukler" on storage.objects;
create policy "Kullanici kendi avatarini yukler" on storage.objects for insert to authenticated
with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Kullanici kendi avatarini gunceller" on storage.objects;
create policy "Kullanici kendi avatarini gunceller" on storage.objects for update to authenticated
using (bucket_id='avatars' and owner_id=auth.uid()::text)
with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Kullanici kendi avatarini siler" on storage.objects;
create policy "Kullanici kendi avatarini siler" on storage.objects for delete to authenticated
using (bucket_id='avatars' and owner_id=auth.uid()::text);
