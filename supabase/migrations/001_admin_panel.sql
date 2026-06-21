-- ============================================================
-- ANLATI Admin Panel — Veritabanı Migrasyonu
-- Supabase SQL Editöründe çalıştırın (bir kez)
-- ============================================================

-- ── 1. profiles tablosuna admin alanları ─────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role         text    NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'moderator', 'admin')),
  ADD COLUMN IF NOT EXISTS status       text    NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'banned')),
  ADD COLUMN IF NOT EXISTS ban_reason   text,
  ADD COLUMN IF NOT EXISTS banned_until timestamptz,
  ADD COLUMN IF NOT EXISTS group_id     uuid,
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;

-- ── 2. stories tablosuna admin alanları ──────────────────────
ALTER TABLE public.stories
  ADD COLUMN IF NOT EXISTS admin_status      text    NOT NULL DEFAULT 'approved'
    CHECK (admin_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS is_featured       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_pinned         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_story_of_day   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rejection_reason  text,
  ADD COLUMN IF NOT EXISTS assigned_user_ids uuid[],
  ADD COLUMN IF NOT EXISTS group_id          uuid;

-- ── 3. reports (şikâyet) tablosu ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id  uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_type  text        NOT NULL CHECK (target_type IN ('story','comment','user')),
  target_id    uuid        NOT NULL,
  reason       text        NOT NULL CHECK (reason IN (
    'hakaret','spam','taciz','siddet',
    'yanlis_bilgi','mustehcen','kisisel_bilgi','diger'
  )),
  description  text,
  status       text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','resolved','rejected')),
  admin_note   text,
  resolved_by  uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── 4. admin_logs (işlem kaydı) tablosu ──────────────────────
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  action       text        NOT NULL,
  entity_type  text,
  entity_id    uuid,
  description  text        NOT NULL,
  ip_address   text,
  metadata     jsonb       NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── 5. categories tablosu ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  label       text        NOT NULL,
  icon        text        NOT NULL DEFAULT '📝',
  color       text        NOT NULL DEFAULT '#7c3aed',
  description text,
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  story_count integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ── 6. notifications tablosu ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  body           text        NOT NULL,
  target_type    text        NOT NULL DEFAULT 'all'
    CHECK (target_type IN ('all','user','mobile','web','category')),
  target_id      text,
  is_sent        boolean     NOT NULL DEFAULT false,
  sent_at        timestamptz,
  scheduled_for  timestamptz,
  created_by     uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── 7. RLS politikaları ───────────────────────────────────────
ALTER TABLE public.reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- is_admin() yardımcı fonksiyon
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin','moderator')
  );
$$;

-- reports: kimler okuyabilir/yazabilir
DROP POLICY IF EXISTS "reports_insert_own"      ON public.reports;
DROP POLICY IF EXISTS "reports_select_staff"    ON public.reports;

CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "reports_select_staff" ON public.reports
  FOR SELECT TO authenticated
  USING (public.is_moderator());

-- admin_logs: sadece admin okuyabilir
DROP POLICY IF EXISTS "admin_logs_select_admin" ON public.admin_logs;

CREATE POLICY "admin_logs_select_admin" ON public.admin_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- categories: herkes okuyabilir, admin/moderatör yönetebilir
DROP POLICY IF EXISTS "categories_select_all"    ON public.categories;
DROP POLICY IF EXISTS "categories_manage_staff"  ON public.categories;

CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_moderator());

CREATE POLICY "categories_manage_staff" ON public.categories
  FOR ALL TO authenticated
  USING (public.is_moderator());

-- notifications: admin
DROP POLICY IF EXISTS "notifications_manage_admin" ON public.notifications;

CREATE POLICY "notifications_manage_admin" ON public.notifications
  FOR ALL TO authenticated
  USING (public.is_admin());

-- ── 8. Varsayılan kategoriler ─────────────────────────────────
INSERT INTO public.categories (slug, label, icon, color, sort_order) VALUES
  ('iliskiler',       'İlişkiler',       '💕', '#e11d48', 1),
  ('annelik',         'Annelik',         '👶', '#f59e0b', 2),
  ('is_hayati',       'İş Hayatı',       '💼', '#3b82f6', 3),
  ('yalnizlik',       'Yalnızlık',       '🌙', '#8b5cf6', 4),
  ('aile',            'Aile',            '🏠', '#10b981', 5),
  ('yeniden_baslamak','Yeniden Başlamak', '🌱', '#22c55e', 6)
ON CONFLICT (slug) DO NOTHING;

-- ── 9. İndeksler ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reports_status       ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target       ON public.reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin     ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created   ON public.admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_admin_status ON public.stories(admin_status);
CREATE INDEX IF NOT EXISTS idx_profiles_role        ON public.profiles(role);
