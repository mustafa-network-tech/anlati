-- ============================================================================
-- ANLATI — Veritabanı Şeması
-- Çalıştırma: Supabase SQL Editor'de bu dosyayı çalıştır
-- URL: https://supabase.com/dashboard/project/mbydxsjvwgqxzudeceso/sql/new
-- ============================================================================

-- ── Uzantılar ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enum: Hikaye kategorileri ─────────────────────────────────────────────────
do $$ begin
  create type story_category as enum (
    'iliskiler',
    'annelik',
    'is_hayati',
    'yalnizlik',
    'aile',
    'yeniden_baslamak'
  );
exception
  when duplicate_object then null;
end $$;

-- ── Tablo: profiles ───────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  username              text unique,
  display_name          text,
  avatar_url            text,
  bio                   text,
  is_anonymous_default  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.profiles is 'Kullanıcı profilleri — auth.users ile 1:1 ilişki';

-- ── Tablo: stories ────────────────────────────────────────────────────────────
create table if not exists public.stories (
  id             uuid primary key default uuid_generate_v4(),
  author_id      uuid not null references public.profiles(id) on delete cascade,
  title          text not null check (char_length(title) between 5 and 200),
  summary        text not null check (char_length(summary) between 10 and 500),
  full_text      text not null check (char_length(full_text) >= 50),
  category       text not null,
  is_anonymous   boolean not null default false,
  is_published   boolean not null default true,
  like_count     integer not null default 0 check (like_count >= 0),
  comment_count  integer not null default 0 check (comment_count >= 0),
  read_count     integer not null default 0 check (read_count >= 0),
  share_count    integer not null default 0 check (share_count >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.stories is 'Hikayeler ve itiraflar';

-- ── Tablo: comments ───────────────────────────────────────────────────────────
create table if not exists public.comments (
  id           uuid primary key default uuid_generate_v4(),
  story_id     uuid not null references public.stories(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  content      text not null check (char_length(content) between 1 and 2000),
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now()
);

comment on table public.comments is 'Hikaye yorumları';

-- ── Tablo: likes ─────────────────────────────────────────────────────────────
create table if not exists public.likes (
  id         uuid primary key default uuid_generate_v4(),
  story_id   uuid not null references public.stories(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (story_id, user_id)
);

comment on table public.likes is 'Hikaye beğenileri — bir kullanıcı bir hikayeyi yalnızca bir kez beğenebilir';

-- ── Tablo: bookmarks ──────────────────────────────────────────────────────────
create table if not exists public.bookmarks (
  id         uuid primary key default uuid_generate_v4(),
  story_id   uuid not null references public.stories(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (story_id, user_id)
);

comment on table public.bookmarks is 'Kaydedilen hikayeler';

-- ── Index'ler ─────────────────────────────────────────────────────────────────
create index if not exists idx_stories_author_id    on public.stories(author_id);
create index if not exists idx_stories_category     on public.stories(category);
create index if not exists idx_stories_created_at   on public.stories(created_at desc);
create index if not exists idx_stories_like_count   on public.stories(like_count desc);
create index if not exists idx_comments_story_id    on public.comments(story_id);
create index if not exists idx_likes_story_id       on public.likes(story_id);
create index if not exists idx_likes_user_id        on public.likes(user_id);
create index if not exists idx_bookmarks_user_id    on public.bookmarks(user_id);

-- ── Otomatik updated_at güncellemesi ──────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_stories_updated_at
  before update on public.stories
  for each row execute function public.handle_updated_at();

create or replace trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ── Otomatik profil oluşturma (kayıt sonrası) ─────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Like sayacı otomatik güncelleme ───────────────────────────────────────────
create or replace function public.update_like_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.stories set like_count = like_count + 1 where id = new.story_id;
  elsif tg_op = 'DELETE' then
    update public.stories set like_count = greatest(like_count - 1, 0) where id = old.story_id;
  end if;
  return null;
end;
$$;

create or replace trigger trg_likes_count
  after insert or delete on public.likes
  for each row execute function public.update_like_count();

-- ── Yorum sayacı otomatik güncelleme ──────────────────────────────────────────
create or replace function public.update_comment_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.stories set comment_count = comment_count + 1 where id = new.story_id;
  elsif tg_op = 'DELETE' then
    update public.stories set comment_count = greatest(comment_count - 1, 0) where id = old.story_id;
  end if;
  return null;
end;
$$;

create or replace trigger trg_comments_count
  after insert or delete on public.comments
  for each row execute function public.update_comment_count();

-- ── Row Level Security (RLS) ──────────────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table public.stories   enable row level security;
alter table public.comments  enable row level security;
alter table public.likes     enable row level security;
alter table public.bookmarks enable row level security;

-- Profiles
create policy "Profiller herkese görünür"
  on public.profiles for select using (true);

create policy "Kullanici kendi profilini duzenleyebilir"
  on public.profiles for update using (auth.uid() = id);

-- Stories
create policy "Yayinlanmis hikayeler herkese gorunur"
  on public.stories for select using (is_published = true);

create policy "Giris yapmis kullanici hikaye ekleyebilir"
  on public.stories for insert with check (auth.uid() = author_id);

create policy "Yazar kendi hikayesini duzenleyebilir"
  on public.stories for update using (auth.uid() = author_id);

create policy "Yazar kendi hikayesini silebilir"
  on public.stories for delete using (auth.uid() = author_id);

-- Comments
create policy "Yorumlar herkese gorunur"
  on public.comments for select using (true);

create policy "Giris yapmis kullanici yorum ekleyebilir"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "Yazar kendi yorumunu silebilir"
  on public.comments for delete using (auth.uid() = author_id);

-- Likes
create policy "Begeniler herkese gorunur"
  on public.likes for select using (true);

create policy "Giris yapmis kullanici begeni ekleyebilir"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Kullanici kendi begenisini kaldirabilir"
  on public.likes for delete using (auth.uid() = user_id);

-- Bookmarks
create policy "Kullanici kendi favori hikayelerini gorebilir"
  on public.bookmarks for select using (auth.uid() = user_id);

create policy "Giris yapmis kullanici favori ekleyebilir"
  on public.bookmarks for insert with check (auth.uid() = user_id);

create policy "Kullanici kendi favorisini kaldirabilir"
  on public.bookmarks for delete using (auth.uid() = user_id);
