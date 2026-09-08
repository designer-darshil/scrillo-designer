import React, { useState, useEffect } from 'react';
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
import { useWebsiteData } from '../hooks/useWebsiteData';

export const PortfolioHome: React.FC = () => {
  const { data } = useWebsiteData();
  const [activeSection, setActiveSection] = useState('home');

  const { settings } = data;
  const { sections, colors, animations, seo } = settings;
  const marquee = data.marquee;

  // Initialize Lenis smooth scroll foundation with settings flag
  const isSmoothScrollEnabled =
    animations?.smoothScrollEnabled !== false && settings.enableSmoothScroll !== false;
  useLenis(isSmoothScrollEnabled);

  // Sync Metadata & Custom CSS Variables to DOM
  useEffect(() => {
    // 1. Title & SEO Metadata
    const siteTitle = seo?.metaTitle || settings.siteTitle || 'DARSHIL BHUVA — Principal Creative Technologist';
    document.title = siteTitle;

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
  }, [settings, seo, colors]);

  const isCursorEnabled =
    animations?.cursorEnabled !== false && settings.enableCustomCursor !== false;
  const isMarqueeEnabled =
    animations?.marqueeEnabled !== false && sections.marquee?.visible !== false;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
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

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
        {/* 1. Hero Section */}
        {sections.hero?.visible !== false && <Hero content={data.hero} />}

        {/* 2. Reusable Marquee Divider */}
        {isMarqueeEnabled && (
          <Marquee
            items={marquee.items}
            speed={marquee.speed || 30}
            direction={marquee.direction || 'left'}
            enableVelocity={marquee.enableVelocity ?? true}
            velocityMultiplier={1.2}
            size="display"
            separator={marquee.separator || '✦'}
          />
        )}

        {/* 3. Selected Works Section */}
        {sections.projects?.visible !== false && (
          <SelectedWorks projects={data.projects} />
        )}

        {/* 4. Creative Statement Section */}
        {sections.statement?.visible !== false && (
          <Statement content={data.about} />
        )}

        {/* 5. Discipline & Skills Section */}
        {sections.skills?.visible !== false && (
          <Skills categories={data.skills} />
        )}

        {/* 6. Design Philosophy Section */}
        {sections.philosophy?.visible !== false && (
          <Philosophy content={data.philosophy} />
        )}

        {/* 7. Services Section */}
        {sections.services?.visible !== false && (
          <Services services={data.services} />
        )}

        {/* 8. Experimental Cinematic Visual Break */}
        {sections.image?.visible !== false && (
          <ExperimentalImage content={data.image} />
        )}

        {/* 9. Final Contact CTA Climax */}
        {sections.contact?.visible !== false && (
          <ContactCTA content={data.contact} />
        )}
      </main>

      {/* 10. Large Editorial Footer */}
      {sections.footer?.visible !== false && (
        <Footer content={data.footer} />
      )}
    </div>
  );
};

export default PortfolioHome;
