-- ==============================================================================
-- SCRiLLO PORTFOLIO & CMS: COMPLETE NORMALIZED POSTGRESQL DATABASE SCHEMA
-- ==============================================================================
-- Database: PostgreSQL 15+ (Supabase)
-- Version: 3.0.0
--
-- ENTITY RELATIONSHIP ARCHITECTURE:
--   1. profiles           : RBAC User Accounts (admin, editor, viewer)
--   2. site_settings      : Global Configuration, SEO & Animation Defaults
--   3. media              : Digital Asset Registry & Storage Metadata
--   4. hero_content       : Hero Showcase & Primary Value Proposition
--   5. marquee_items      : Kinetic Ticker Phrase Sequences
--   6. projects           : Case Studies & Portfolio Showcase
--   7. project_images     : Relational Project Gallery Join Table
--   8. skill_categories   : Discipline Clusters
--   9. skills             : Categorized Competencies & Tools
--  10. services           : Commission Offerings & Tiers
--  11. philosophy         : Design Manifesto & Thesis
--  12. cta_content        : Final Collaboration Invitation Block
--  13. social_links       : Outbound Channels Directory
--  14. footer_content     : Structural Identity & Legal Metadata
--  15. section_settings   : Layout Pipeline Ordering & Visibility
--  16. activity_logs      : Audit Trail of CMS Event Log
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES (RBAC USER ACCOUNTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for authentication lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==============================================================================
-- 2. SITE SETTINGS (GLOBAL ENGINE CONFIGURATION)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'DARSHIL BHUVA',
  site_description TEXT DEFAULT 'Principal Creative Technologist & Digital Product Designer',
  default_theme TEXT NOT NULL DEFAULT 'dark' CHECK (default_theme IN ('dark', 'light', 'system')),
  animation_enabled BOOLEAN NOT NULL DEFAULT true,
  smooth_scroll_enabled BOOLEAN NOT NULL DEFAULT true,
  cursor_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. MEDIA (ASSET CDN REGISTRY)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  size BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_filename ON public.media(filename);

-- ==============================================================================
-- 4. HERO CONTENT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL DEFAULT '(About me)',
  title TEXT NOT NULL DEFAULT 'Building digital experiences that feel inevitable.',
  description TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '2026',
  scroll_label TEXT NOT NULL DEFAULT 'SCROLL',
  cta_text TEXT NOT NULL DEFAULT 'VIEW SELECTED WORKS',
  cta_link TEXT NOT NULL DEFAULT '#works',
  hero_image_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. MARQUEE ITEMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.marquee_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_marquee_order ON public.marquee_items("order");

-- ==============================================================================
-- 6. PROJECTS (PORTFOLIO CASE STUDIES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT,
  year TEXT NOT NULL DEFAULT '2026',
  category TEXT NOT NULL DEFAULT 'Product Design',
  description TEXT,
  client TEXT,
  role TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1,
  thumbnail_media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  cover_media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects("order");
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);

-- ==============================================================================
-- 7. PROJECT IMAGES (GALLERY RELATIONSHIP)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_project_images_pid ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_order ON public.project_images("order");

-- ==============================================================================
-- 8. SKILL CATEGORIES (DISCIPLINE CLUSTERS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL DEFAULT '01',
  title TEXT NOT NULL,
  description TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_skill_cat_order ON public.skill_categories("order");

-- ==============================================================================
-- 9. SKILLS (CATEGORIZED COMPETENCIES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_order ON public.skills("order");

-- ==============================================================================
-- 10. SERVICES (COMMISSION PACKAGES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL DEFAULT '01',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Briefcase',
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_services_order ON public.services("order");

-- ==============================================================================
-- 11. PHILOSOPHY (DESIGN THESIS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.philosophy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'DESIGN PHILOSOPHY',
  statement TEXT NOT NULL,
  supporting_text TEXT,
  visible BOOLEAN NOT NULL DEFAULT true
);

-- ==============================================================================
-- 12. CTA CONTENT (FINAL CONTACT INVITATION)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cta_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT 'HAVE SOMETHING WORTH BUILDING?',
  secondary_text TEXT DEFAULT 'Let''s make it real.',
  button_text TEXT NOT NULL DEFAULT 'START A PROJECT',
  button_link TEXT NOT NULL DEFAULT 'mailto:contact@darshilbhuva.com',
  visible BOOLEAN NOT NULL DEFAULT true
);

-- ==============================================================================
-- 13. SOCIAL LINKS (CHANNELS DIRECTORY)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL DEFAULT 'Other',
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'ArrowUpRight',
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links("order");

-- ==============================================================================
-- 14. FOOTER CONTENT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.footer_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL DEFAULT 'INDIA',
  working_globally TEXT NOT NULL DEFAULT 'WORKING GLOBALLY',
  email TEXT NOT NULL DEFAULT 'contact@darshilbhuva.com',
  brand_text TEXT NOT NULL DEFAULT 'DARSHIL BHUVA',
  copyright TEXT NOT NULL DEFAULT '© 2026 ALL RIGHTS RESERVED'
);

-- ==============================================================================
-- 15. SECTION SETTINGS (HOMEPAGE PIPELINE & REORDERING)
-- ==============================================================================
-- Pure architectural decoupling: sectionKey + order + visible
-- Section CONTENT is stored completely separately in website_content.
CREATE TABLE IF NOT EXISTS public.section_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  name TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL CHECK ("order" > 0),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_section_settings_order ON public.section_settings("order");
CREATE UNIQUE INDEX IF NOT EXISTS idx_section_settings_key ON public.section_settings(section_key);

-- ==============================================================================
-- 16. WEBSITE CONTENT (KEY-VALUE DOCUMENT STORE FOR SECTION COPY)
-- ==============================================================================
-- Holds raw editorial content for all sections (hero, about, marquee, philosophy,
-- contact, footer, profile, experience, education, tools, categories) completely
-- decoupled from layout ordering and visibility.
CREATE TABLE IF NOT EXISTS public.website_content (
  section TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 17. ACTIVITY LOGS (AUDIT TRAIL)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marquee_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.philosophy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper: Check if current user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Helper: Check if current user is Editor or Admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'editor') FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Trigger: Automatically create viewer profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'viewer', -- Default state: viewer
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- RLS POLICIES
-- ==============================================================================

-- Profiles
CREATE POLICY "Public profiles read self or admin" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Site Settings (Public read, Admin edit)
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- Media (Public read, Editor/Admin upload, Admin delete)
CREATE POLICY "Public read media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Editor/Admin insert media" ON public.media FOR INSERT WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Editor/Admin update media" ON public.media FOR UPDATE USING (public.is_editor_or_admin());
CREATE POLICY "Admin delete media" ON public.media FOR DELETE USING (public.is_admin());

-- Hero Content
CREATE POLICY "Public read hero" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Editor/Admin manage hero" ON public.hero_content FOR ALL USING (public.is_editor_or_admin());

-- Marquee Items
CREATE POLICY "Public read marquee" ON public.marquee_items FOR SELECT USING (visible = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage marquee" ON public.marquee_items FOR ALL USING (public.is_editor_or_admin());

-- Projects & Project Images
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (published = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage projects" ON public.projects FOR ALL USING (public.is_editor_or_admin());
CREATE POLICY "Public read project images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Editor/Admin manage project images" ON public.project_images FOR ALL USING (public.is_editor_or_admin());

-- Skill Categories & Skills
CREATE POLICY "Public read skill categories" ON public.skill_categories FOR SELECT USING (visible = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage skill categories" ON public.skill_categories FOR ALL USING (public.is_editor_or_admin());
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (visible = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage skills" ON public.skills FOR ALL USING (public.is_editor_or_admin());

-- Services
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (visible = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage services" ON public.services FOR ALL USING (public.is_editor_or_admin());

-- Philosophy
CREATE POLICY "Public read philosophy" ON public.philosophy FOR SELECT USING (visible = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage philosophy" ON public.philosophy FOR ALL USING (public.is_editor_or_admin());

-- CTA Content
CREATE POLICY "Public read cta" ON public.cta_content FOR SELECT USING (visible = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage cta" ON public.cta_content FOR ALL USING (public.is_editor_or_admin());

-- Social Links
CREATE POLICY "Public read social links" ON public.social_links FOR SELECT USING (visible = true OR public.is_editor_or_admin());
CREATE POLICY "Editor/Admin manage social links" ON public.social_links FOR ALL USING (public.is_editor_or_admin());

-- Footer Content
CREATE POLICY "Public read footer" ON public.footer_content FOR SELECT USING (true);
CREATE POLICY "Editor/Admin manage footer" ON public.footer_content FOR ALL USING (public.is_editor_or_admin());

-- Section Settings
CREATE POLICY "Public read section settings" ON public.section_settings FOR SELECT USING (true);
CREATE POLICY "Editor/Admin manage section settings" ON public.section_settings FOR ALL USING (public.is_editor_or_admin());

-- Website Content (Decoupled Section Copy)
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read website content" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Editor/Admin manage website content" ON public.website_content FOR ALL USING (public.is_editor_or_admin());

-- Activity Logs
CREATE POLICY "Editor/Admin read activity logs" ON public.activity_logs FOR SELECT USING (public.is_editor_or_admin());
CREATE POLICY "Editor/Admin insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (public.is_editor_or_admin());

-- ==============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Storage Read
DROP POLICY IF EXISTS "Public Read Media Objects" ON storage.objects;
CREATE POLICY "Public Read Media Objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Editor/Admin Upload Access
DROP POLICY IF EXISTS "Editor/Admin Upload Media Objects" ON storage.objects;
CREATE POLICY "Editor/Admin Upload Media Objects"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.is_editor_or_admin());

-- Admin Delete Media Objects
DROP POLICY IF EXISTS "Admin Delete Media Objects" ON storage.objects;
CREATE POLICY "Admin Delete Media Objects"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND public.is_admin());

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (id, site_name, site_description, default_theme, animation_enabled, smooth_scroll_enabled, cursor_enabled)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'DARSHIL BHUVA',
  'Principal Creative Technologist & Digital Product Designer',
  'dark',
  true,
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 2. Hero Content
INSERT INTO public.hero_content (id, eyebrow, title, description, year, scroll_label, cta_text, cta_link)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '(About me)',
  'Building digital experiences that feel inevitable.',
  'Digital product designer & creative developer focused on thoughtful interfaces, design systems, and spatial brand experiences. Balancing Swiss minimalism with technical rigor.',
  '2026',
  'SCROLL',
  'VIEW SELECTED WORKS',
  '#works'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Marquee Items
INSERT INTO public.marquee_items (id, text, visible, "order") VALUES
  ('00000000-0000-0000-0000-000000000011', 'DIGITAL PRODUCT DESIGN', true, 1),
  ('00000000-0000-0000-0000-000000000012', 'CREATIVE COMPUTING', true, 2),
  ('00000000-0000-0000-0000-000000000013', 'DESIGN SYSTEMS', true, 3),
  ('00000000-0000-0000-0000-000000000014', 'SPATIAL INTERACTION', true, 4),
  ('00000000-0000-0000-0000-000000000015', 'KINETIC TYPOGRAPHY', true, 5)
ON CONFLICT (id) DO NOTHING;

-- 4. Philosophy
INSERT INTO public.philosophy (id, label, statement, supporting_text, visible)
VALUES (
  '00000000-0000-0000-0000-000000000021',
  'DESIGN PHILOSOPHY',
  'Great design should feel obvious after you see it.',
  'PHILOSOPHY STATEMENT // 2026',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 5. CTA Content
INSERT INTO public.cta_content (id, heading, secondary_text, button_text, button_link, visible)
VALUES (
  '00000000-0000-0000-0000-000000000031',
  'HAVE SOMETHING WORTH BUILDING?',
  'Let''s make it real.',
  'START A PROJECT',
  'mailto:contact@darshilbhuva.com',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 6. Footer Content
INSERT INTO public.footer_content (id, location, working_globally, email, brand_text, copyright)
VALUES (
  '00000000-0000-0000-0000-000000000041',
  'INDIA',
  'WORKING GLOBALLY',
  'contact@darshilbhuva.com',
  'DARSHIL BHUVA',
  '© 2026 ALL RIGHTS RESERVED'
)
ON CONFLICT (id) DO NOTHING;

-- 7. Section Settings
INSERT INTO public.section_settings (id, section_key, visible, "order") VALUES
  ('00000000-0000-0000-0000-000000000051', 'hero', true, 1),
  ('00000000-0000-0000-0000-000000000052', 'marquee', true, 2),
  ('00000000-0000-0000-0000-000000000053', 'projects', true, 3),
  ('00000000-0000-0000-0000-000000000054', 'statement', true, 4),
  ('00000000-0000-0000-0000-000000000055', 'skills', true, 5),
  ('00000000-0000-0000-0000-000000000056', 'philosophy', true, 6),
  ('00000000-0000-0000-0000-000000000057', 'services', true, 7),
  ('00000000-0000-0000-0000-000000000058', 'image', true, 8),
  ('00000000-0000-0000-0000-000000000059', 'contact', true, 9),
  ('00000000-0000-0000-0000-000000000060', 'experience', true, 10),
  ('00000000-0000-0000-0000-000000000061', 'footer', true, 11)
ON CONFLICT (id) DO NOTHING;
