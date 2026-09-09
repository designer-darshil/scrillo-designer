-- ==============================================================================
-- SCRiLLO CMS: MASTER PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Execute this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New query -> Paste & Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. PUBLISHED SNAPSHOT TABLE (LIVE PUBLIC WEBSITE DATA SOURCE OF TRUTH)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.website_published (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  published_by TEXT DEFAULT 'admin@scrillo.design'
);

ALTER TABLE public.website_published ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read website_published" ON public.website_published;
CREATE POLICY "Public read website_published"
  ON public.website_published FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write website_published" ON public.website_published;
CREATE POLICY "Admin write website_published"
  ON public.website_published FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 3. SITE SETTINGS TABLE (THEME, ANIMATIONS, SEO, SECTION SETTINGS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write site_settings" ON public.site_settings;
CREATE POLICY "Admin write site_settings"
  ON public.site_settings FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 4. SECTION SETTINGS (NORMALIZED ORDER & VISIBILITY)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.section_settings (
  section_key TEXT PRIMARY KEY,
  name TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.section_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read section_settings" ON public.section_settings;
CREATE POLICY "Public read section_settings"
  ON public.section_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write section_settings" ON public.section_settings;
CREATE POLICY "Admin write section_settings"
  ON public.section_settings FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 5. WEBSITE CONTENT TABLE (KEY-VALUE SECTION COPY)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.website_content (
  section TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read website_content" ON public.website_content;
CREATE POLICY "Public read website_content"
  ON public.website_content FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write website_content" ON public.website_content;
CREATE POLICY "Admin write website_content"
  ON public.website_content FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 6. PROJECTS (PORTFOLIO CASE STUDIES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT,
  year TEXT,
  category TEXT,
  client TEXT,
  role TEXT,
  description TEXT,
  services TEXT[],
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  thumbnail TEXT,
  cover_image TEXT,
  image TEXT,
  gallery TEXT[],
  "order" INTEGER DEFAULT 1,
  number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
CREATE POLICY "Admin write projects"
  ON public.projects FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 7. SKILL CATEGORIES & SKILLS MATRIX
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id TEXT PRIMARY KEY,
  number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  visible BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 1,
  items JSONB DEFAULT '[]'::jsonb,
  count TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read skill_categories" ON public.skill_categories;
CREATE POLICY "Public read skill_categories"
  ON public.skill_categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write skill_categories" ON public.skill_categories;
CREATE POLICY "Admin write skill_categories"
  ON public.skill_categories FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 8. SERVICES & CAPABILITIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Briefcase',
  deliverables TEXT[],
  visible BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write services" ON public.services;
CREATE POLICY "Admin write services"
  ON public.services FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 9. MEDIA ASSETS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT,
  size BIGINT DEFAULT 0,
  size_formatted TEXT,
  format TEXT,
  dimensions TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read media_assets" ON public.media_assets;
CREATE POLICY "Public read media_assets"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write media_assets" ON public.media_assets;
CREATE POLICY "Admin write media_assets"
  ON public.media_assets FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 10. ACTIVITY AUDIT LOG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  item TEXT NOT NULL,
  section TEXT,
  user_email TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read activity_log" ON public.activity_log;
CREATE POLICY "Public read activity_log"
  ON public.activity_log FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write activity_log" ON public.activity_log;
CREATE POLICY "Admin write activity_log"
  ON public.activity_log FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 11. STORAGE BUCKET INITIALIZATION ('portfolio-media' & 'media')
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read portfolio-media" ON storage.objects;
CREATE POLICY "Public read portfolio-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('portfolio-media', 'media'));

DROP POLICY IF EXISTS "Admin write portfolio-media" ON storage.objects;
CREATE POLICY "Admin write portfolio-media"
  ON storage.objects FOR ALL
  TO anon, authenticated
  USING (bucket_id IN ('portfolio-media', 'media'))
  WITH CHECK (bucket_id IN ('portfolio-media', 'media'));
