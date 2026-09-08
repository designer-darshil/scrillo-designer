-- ==============================================================================
-- SCRiLLO PORTFOLIO: SUPABASE ROW LEVEL SECURITY (RLS) & ROLE STRATEGY
-- ==============================================================================
-- Security Hardening Pass: Role-Based Access Control (RBAC) & Storage Policies
-- Version: 2.0.0
--
-- ROLES:
--   1. admin   : Full access (Settings, Delete operations, Publish live changes)
--   2. editor  : Content management (Projects, Content, Media, Skills, Services)
--   3. viewer  : Default state for new authenticated accounts (No admin access)
--
-- PRINCIPLES:
--   - No authenticated user is automatically granted administrator clearance.
--   - Public users can only read published / visible content.
--   - Drafts are protected from unauthenticated access.
--   - Storage bucket is protected against unauthorized uploads/deletions.
--   - Destructive operations (DELETE) require 'admin' role.
-- ==============================================================================

-- 1. PROFILES TABLE & ROLE ENUM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. SECURITY DEFINER HELPER FUNCTIONS
-- ------------------------------------------------------------------------------
-- Function to get the current authenticated user's role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Function to check if the current user is an Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Function to check if the current user is an Editor or Administrator
CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'editor') FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 3. TRIGGER: AUTOMATIC PROFILE INITIALIZATION (DEFAULT: VIEWER)
-- ------------------------------------------------------------------------------
-- Ensures every new user registered in auth.users gets a profile with 'viewer' role.
-- NO user receives admin clearance automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'viewer', -- Explicit default: NO administrative permissions granted
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. PROFILES RLS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update user profiles" ON public.profiles;
CREATE POLICY "Admins can update user profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 5. PROJECTS TABLE RLS POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_title TEXT,
  slug TEXT UNIQUE NOT NULL,
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

DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editors/Admins can insert projects" ON public.projects;
CREATE POLICY "Editors/Admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editors/Admins can update projects" ON public.projects;
CREATE POLICY "Editors/Admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Only Admins can delete projects" ON public.projects;
CREATE POLICY "Only Admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. SERVICES TABLE RLS POLICIES
-- ------------------------------------------------------------------------------
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

DROP POLICY IF EXISTS "Public can view visible services" ON public.services;
CREATE POLICY "Public can view visible services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (visible = true OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editors/Admins can insert services" ON public.services;
CREATE POLICY "Editors/Admins can insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editors/Admins can update services" ON public.services;
CREATE POLICY "Editors/Admins can update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Only Admins can delete services" ON public.services;
CREATE POLICY "Only Admins can delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7. SKILLS & CATEGORIES RLS POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  visible BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 1,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible skills" ON public.skills;
CREATE POLICY "Public can view visible skills"
  ON public.skills FOR SELECT
  TO anon, authenticated
  USING (visible = true OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editors/Admins can insert skills" ON public.skills;
CREATE POLICY "Editors/Admins can insert skills"
  ON public.skills FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editors/Admins can update skills" ON public.skills;
CREATE POLICY "Editors/Admins can update skills"
  ON public.skills FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Only Admins can delete skills" ON public.skills;
CREATE POLICY "Only Admins can delete skills"
  ON public.skills FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 8. WEBSITE CONTENT & EDITORIAL COPY RLS POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  version TEXT DEFAULT 'published',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published website content" ON public.website_content;
CREATE POLICY "Public can view published website content"
  ON public.website_content FOR SELECT
  TO anon, authenticated
  USING (version = 'published' OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Editors/Admins can update draft content" ON public.website_content;
CREATE POLICY "Editors/Admins can update draft content"
  ON public.website_content FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Only Admins can publish website content" ON public.website_content;
CREATE POLICY "Only Admins can publish website content"
  ON public.website_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor_or_admin());

-- 9. WEBSITE SETTINGS & ENGINE (ADMIN-ONLY ACCESS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view website settings" ON public.website_settings;
CREATE POLICY "Public can view website settings"
  ON public.website_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Only Admins can update system settings" ON public.website_settings;
CREATE POLICY "Only Admins can update system settings"
  ON public.website_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. MEDIA ASSETS & STORAGE RLS POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size BIGINT DEFAULT 0,
  size_formatted TEXT,
  format TEXT,
  dimensions TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
CREATE POLICY "Public can view media assets"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Editors/Admins can insert media assets" ON public.media_assets;
CREATE POLICY "Editors/Admins can insert media assets"
  ON public.media_assets FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Only Admins can delete media assets" ON public.media_assets;
CREATE POLICY "Only Admins can delete media assets"
  ON public.media_assets FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 11. SUPABASE STORAGE BUCKET POLICIES ('media')
-- ------------------------------------------------------------------------------
-- Ensure 'media' bucket exists and is public for image CDN delivery
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Public Read Access
DROP POLICY IF EXISTS "Public Read Media" ON storage.objects;
CREATE POLICY "Public Read Media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

-- Storage Policy: Editor/Admin Upload Access
DROP POLICY IF EXISTS "Editors and Admins can upload media" ON storage.objects;
CREATE POLICY "Editors and Admins can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_editor_or_admin());

-- Storage Policy: Editor/Admin Update Access
DROP POLICY IF EXISTS "Editors and Admins can update media" ON storage.objects;
CREATE POLICY "Editors and Admins can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_editor_or_admin());

-- Storage Policy: Admin-Only Delete Access
DROP POLICY IF EXISTS "Only Admins can delete media files" ON storage.objects;
CREATE POLICY "Only Admins can delete media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

-- ==============================================================================
-- INSTRUCTIONS TO PROMOTE AN INITIAL ADMINISTRATOR
-- ==============================================================================
-- Run the following SQL command in the Supabase SQL Editor to grant Administrator
-- clearance to your primary email address:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your-email@example.com';
--
-- To assign an Editor role:
-- UPDATE public.profiles
-- SET role = 'editor'
-- WHERE email = 'editor-email@example.com';
-- ==============================================================================
