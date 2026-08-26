import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/layout/CustomCursor';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { GrainOverlay } from './components/layout/GrainOverlay';
import { ScrollToTopOnRoute } from './components/layout/ScrollToTopOnRoute';

import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#FF3E00] selection:text-white overflow-x-hidden font-sans">
        {/* Ambient Film Grain Texture */}
        <GrainOverlay />

        {/* Top Scroll Indicator */}
        <ScrollProgress />

        {/* Desktop Dynamic Cursor */}
        <CustomCursor />

        {/* Auto Scroll to Top on Page Navigation */}
        <ScrollToTopOnRoute />

        {/* Global Floating Editorial Navbar */}
        <Navbar />

        {/* Main Application Routes */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Large Editorial Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
