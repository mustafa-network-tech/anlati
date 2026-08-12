-- ANLATI: sureli sorular ve opsiyonel konu gorselleri
alter table public.topics add column if not exists image_url text,add column if not exists is_timed boolean not null default false,add column if not exists timed_duration_hours smallint,add column if not exists expires_at timestamptz;
insert into public.categories(slug,label,description,icon,color,sort_order) values
('futbol','Futbol','Maçlar, takımlar ve oyunun kendisi','', '#173642',0),
('teknoloji-oyun','Teknoloji & Oyun','Cihazlar, yazılım, oyun ve dijital hayat','', '#173642',6),
('spor-fitness','Spor & Fitness','Antrenman, beslenme ve iyi yaşam','', '#173642',9)
on conflict(slug) do update set label=excluded.label,description=excluded.description,sort_order=excluded.sort_order,is_active=true;
update public.categories set is_active=false where slug in('teknoloji','spor-saglikli-yasam','oyun-eglence');
alter table public.topics drop constraint if exists topics_timed_duration_check;
alter table public.topics add constraint topics_timed_duration_check check((is_timed=false and timed_duration_hours is null and expires_at is null) or (is_timed=true and timed_duration_hours in(24,48,72)));

create or replace function public.start_timed_topic_on_approval() returns trigger language plpgsql security definer set search_path=public as $$begin if new.status='published' and old.status is distinct from 'published' and new.is_timed then new.expires_at=now()+make_interval(hours=>new.timed_duration_hours);end if;return new;end;$$;
drop trigger if exists start_timed_topic on public.topics;create trigger start_timed_topic before update of status on public.topics for each row execute function public.start_timed_topic_on_approval();

-- Audience ve zaman siniri ayni RLS kontrolunde; dogrudan API istegi de gecemez.
drop policy if exists answers_insert_audience on public.answers;
create policy answers_insert_audience on public.answers for insert to authenticated with check(user_id=auth.uid() and status='pending' and exists(select 1 from public.topics t join public.profiles p on p.id=auth.uid() where t.id=topic_id and t.status='published' and (not t.is_timed or t.expires_at>now()) and (t.audience='all' or t.audience=p.gender)));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('topic-images','topic-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists topic_images_public_read on storage.objects;drop policy if exists topic_images_owner_insert on storage.objects;drop policy if exists topic_images_owner_update on storage.objects;drop policy if exists topic_images_owner_delete on storage.objects;
create policy topic_images_public_read on storage.objects for select using(bucket_id='topic-images');
create policy topic_images_owner_insert on storage.objects for insert to authenticated with check(bucket_id='topic-images' and (storage.foldername(name))[1]=auth.uid()::text and lower(storage.extension(name)) in('jpg','jpeg','png','webp'));
create policy topic_images_owner_update on storage.objects for update to authenticated using(bucket_id='topic-images' and owner_id=auth.uid()::text) with check(bucket_id='topic-images' and owner_id=auth.uid()::text);
create policy topic_images_owner_delete on storage.objects for delete to authenticated using(bucket_id='topic-images' and owner_id=auth.uid()::text);
create index if not exists topics_active_timed_idx on public.topics(expires_at) where status='published' and is_timed=true;
