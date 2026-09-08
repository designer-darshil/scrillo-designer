import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './admin/hooks/useAuth';
import { WebsiteDataProvider } from './context/WebsiteDataContext';
import { PortfolioHome } from './pages/PortfolioHome';
import { AdminLayout } from './admin/layouts/AdminLayout';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { ContentManager } from './admin/pages/ContentManager';
import { SectionsManager } from './admin/pages/SectionsManager';
import { FooterContactManager } from './admin/pages/FooterContactManager';
import { ProjectsManager } from './admin/pages/ProjectsManager';
import { ProjectEditor } from './admin/pages/ProjectEditor';
import { SkillsManager } from './admin/pages/SkillsManager';
import { ServicesManager } from './admin/pages/ServicesManager';
import { MediaManager } from './admin/pages/MediaManager';
import { SettingsManager } from './admin/pages/SettingsManager';

import { AccessDenied } from './admin/pages/AccessDenied';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebsiteDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Route (Exact Unchanged Experience) */}
            <Route path="/" element={<PortfolioHome />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Explicit Access Denied Page */}
            <Route path="/admin/access-denied" element={<AccessDenied />} />

            {/* Protected Admin Routes (Requires 'editor' or 'admin' role) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="editor">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="content/sections" element={<SectionsManager />} />
              <Route path="content/footer" element={<FooterContactManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="projects/new" element={<ProjectEditor mode="create" />} />
              <Route path="projects/:id/edit" element={<ProjectEditor mode="edit" />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="media" element={<MediaManager />} />
              {/* Settings Route explicitly requires 'admin' role */}
              <Route
                path="settings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <SettingsManager />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback to Public Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </WebsiteDataProvider>
    </AuthProvider>
  );
};

export default App;
