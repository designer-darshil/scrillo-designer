import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTopOnRoute } from './components/layout/ScrollToTopOnRoute';

import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ExperimentsPage } from './pages/ExperimentsPage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#080808] text-[#F5F5F5] selection:bg-[#FF3E00] selection:text-white flex flex-col justify-between font-sans">
        
        {/* Auto Scroll to Top on Navigation */}
        <ScrollToTopOnRoute />

        {/* Quiet Clean Navbar */}
        <Navbar />

        {/* Main Application Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experiments" element={<ExperimentsPage />} />
            <Route path="/lab" element={<Navigate to="/experiments" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Direct Quiet Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
