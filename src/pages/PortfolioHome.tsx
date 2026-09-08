import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLenis } from '../hooks/useLenis';
import { Header } from '../components/Header/Header';
import { Hero } from '../sections/Hero/Hero';
import { Marquee } from '../components/Marquee/Marquee';
import { SelectedWorks } from '../sections/SelectedWorks/SelectedWorks';
import { Statement } from '../sections/Statement/Statement';
import { Skills } from '../sections/Skills/Skills';
import { Philosophy } from '../sections/Philosophy/Philosophy';
import { Services } from '../sections/Services/Services';
import { ExperimentalImage } from '../sections/ExperimentalImage/ExperimentalImage';
import { ContactCTA } from '../sections/ContactCTA/ContactCTA';
import { Footer } from '../components/Footer/Footer';
import { CustomCursor } from '../components/CustomCursor/CustomCursor';
import { AdminPreviewBanner } from '../components/AdminPreviewBanner/AdminPreviewBanner';
import { PublishReviewModal } from '../admin/components/PublishReviewModal';
import { useWebsiteData } from '../hooks/useWebsiteData';
import { useAuth } from '../admin/hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { SectionId } from '../types';

export const PortfolioHome: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: draftData, publishedData, diffSummary, publishDraft } = useWebsiteData();
  const { user } = useAuth();
  const { setTheme } = useTheme();

  // Preview Mode: Requires authenticated admin and ?preview=true
  const isPreviewRequested = searchParams.get('preview') === 'true';
  const isPreviewActive = isPreviewRequested && !!user;

  // Active content: Draft if previewing as authenticated admin, otherwise live published data
  const activeData = isPreviewActive ? draftData : publishedData;

  const [activeSection, setActiveSection] = useState('home');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const { settings } = activeData;
  const { sections, colors, animations, seo } = settings;
  const marquee = activeData.marquee;

  // Sync admin default theme if no explicit user override is stored
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (!savedTheme && settings?.defaultTheme) {
      if (settings.defaultTheme === 'system') {
        const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        setTheme(isLight ? 'light' : 'dark');
      } else {
        setTheme(settings.defaultTheme);
      }
    }
  }, [settings?.defaultTheme, setTheme]);

  // Initialize Lenis smooth scroll foundation with settings flag
  const isSmoothScrollEnabled =
    animations?.smoothScrollEnabled !== false && settings.enableSmoothScroll !== false;
  useLenis(isSmoothScrollEnabled);

  // Sync Metadata & Custom CSS Variables to DOM
  useEffect(() => {
    // 1. Title & SEO Metadata
    const siteTitle = seo?.metaTitle || settings.siteTitle || 'DARSHIL BHUVA — Principal Creative Technologist';
    document.title = isPreviewActive ? `[PREVIEW] ${siteTitle}` : siteTitle;

    const metaDescription = seo?.metaDescription || settings.siteDescription;
    if (metaDescription) {
      let descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!descEl) {
        descEl = document.createElement('meta');
        descEl.name = 'description';
        document.head.appendChild(descEl);
      }
      descEl.content = metaDescription;
    }

    if (seo?.favicon) {
      let iconEl = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!iconEl) {
        iconEl = document.createElement('link');
        iconEl.rel = 'icon';
        document.head.appendChild(iconEl);
      }
      iconEl.href = seo.favicon;
    }

    if (seo?.ogImage) {
      let ogEl = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
      if (!ogEl) {
        ogEl = document.createElement('meta');
        ogEl.setAttribute('property', 'og:image');
        document.head.appendChild(ogEl);
      }
      ogEl.content = seo.ogImage;
    }

    // 2. Dynamic Controlled Color Variables via <style id="custom-theme-variables">
    if (colors?.dark || colors?.light) {
      let styleEl = document.getElementById('custom-theme-variables') as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'custom-theme-variables';
        document.head.appendChild(styleEl);
      }

      const darkCss = colors.dark
        ? `
          :root, [data-theme="dark"], html.dark {
            --bg: ${colors.dark.background};
            --surface: ${colors.dark.surface || colors.dark.background};
            --text: ${colors.dark.text};
            --text-muted: ${colors.dark.muted};
            --border: ${colors.dark.border};
            --background: ${colors.dark.background};
            --foreground: ${colors.dark.text};
            --muted: ${colors.dark.muted};
          }
        `
        : '';

      const lightCss = colors.light
        ? `
          [data-theme="light"], html.light {
            --bg: ${colors.light.background};
            --surface: ${colors.light.surface || colors.light.background};
            --text: ${colors.light.text};
            --text-muted: ${colors.light.muted};
            --border: ${colors.light.border};
            --background: ${colors.light.background};
            --foreground: ${colors.light.text};
            --muted: ${colors.light.muted};
          }
        `
        : '';

      styleEl.innerHTML = `${darkCss}\n${lightCss}`;
    }
  }, [settings, seo, colors, isPreviewActive]);

  const isCursorEnabled =
    animations?.cursorEnabled !== false && settings.enableCustomCursor !== false;
  const isMarqueeEnabled =
    animations?.marqueeEnabled !== false && sections?.marquee?.visible !== false;

  // Section Component Map
  const sectionRenderMap: Record<SectionId, () => React.ReactNode> = {
    hero: () => <Hero key="hero" content={activeData.hero} />,
    marquee: () =>
      isMarqueeEnabled ? (
        <Marquee
          key="marquee"
          items={marquee.items}
          speed={marquee.speed || 30}
          direction={marquee.direction || 'left'}
          enableVelocity={marquee.enableVelocity ?? true}
          velocityMultiplier={1.2}
          size="display"
          separator={marquee.separator || '✦'}
        />
      ) : null,
    projects: () => <SelectedWorks key="projects" projects={activeData.projects} />,
    statement: () => <Statement key="statement" content={activeData.about} />,
    skills: () => <Skills key="skills" categories={activeData.skills} />,
    philosophy: () => <Philosophy key="philosophy" content={activeData.philosophy} />,
    services: () => <Services key="services" services={activeData.services} />,
    image: () => <ExperimentalImage key="image" content={activeData.image} />,
    contact: () => <ContactCTA key="contact" content={activeData.contact} />,
    footer: () => null, // Rendered as root terminal section
  };

  // Sort and filter active main body sections
  const mainSectionKeys = (Object.keys(sections || {}) as SectionId[])
    .filter((id) => id !== 'footer')
    .filter((id) => sections[id]?.visible !== false)
    .sort((a, b) => (sections[a]?.order ?? 0) - (sections[b]?.order ?? 0));

  const handleExitPreview = () => {
    searchParams.delete('preview');
    setSearchParams(searchParams);
  };

  return (
    <div className={`relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background ${isPreviewActive ? 'pt-10' : ''}`}>
      {/* Admin Floating Preview Mode Banner */}
      {isPreviewActive && (
        <AdminPreviewBanner
          onExitPreview={handleExitPreview}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
        />
      )}

      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:font-mono focus:text-xs focus:font-bold focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Reusable High-Performance Desktop Custom Cursor */}
      {isCursorEnabled && <CustomCursor />}

      {/* Premium Minimalist Fixed Header */}
      <Header
        activeSection={activeSection}
        onNavigate={(id) => {
          setActiveSection(id);
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main Dynamic Content in Configured Order */}
      <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
        {mainSectionKeys.map((sectionId) => sectionRenderMap[sectionId]?.())}
      </main>

      {/* Large Structural Editorial Footer */}
      {sections?.footer?.visible !== false && (
        <Footer content={activeData.footer} />
      )}

      {/* Publish Review Modal from Preview Mode */}
      <PublishReviewModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        diffSummary={diffSummary}
        onConfirmPublish={publishDraft}
      />
    </div>
  );
};

export default PortfolioHome;
