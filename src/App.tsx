import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrilloLoader } from './components/layout/ScrilloLoader';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/layout/CustomCursor';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { GrainOverlay } from './components/layout/GrainOverlay';
import { ScrollToTopOnRoute } from './components/layout/ScrollToTopOnRoute';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Router>
      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999999] focus:px-4 focus:py-2.5 focus:bg-[#FF3E00] focus:text-white focus:font-mono focus:text-xs focus:rounded-md focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="relative min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#FF3E00] selection:text-white overflow-x-hidden font-sans">
        {/* Full-Screen Signature Entry Loader */}
        <ScrilloLoader />

        {/* Ambient Film Grain Texture */}
        <GrainOverlay />

        {/* Top Scroll Progress Indicator */}
        <ScrollProgress />

        {/* Desktop Dynamic Contextual Cursor */}
        <CustomCursor />

        {/* Auto Scroll to Top on Navigation */}
        <ScrollToTopOnRoute />

        {/* Global Floating Editorial Navbar */}
        <Navbar />

        {/* Main Application Routes with Error Boundary Guard */}
        <main id="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:slug" element={<ProjectDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Large Editorial Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
