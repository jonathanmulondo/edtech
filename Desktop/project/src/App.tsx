import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from '@components/ui/Toast';
import { useToastStore } from '@lib/hooks/useToast';
import { Navigation } from '@components/layout/Navigation';
import { AuthProvider } from '@lib/auth/AuthContext';
import { ThemeProvider } from '@lib/theme/ThemeContext';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import './styles/globals.css';
import './i18n/config';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@pages/LoginPage').then(m => ({ default: m.LoginPage })));
const Dashboard = lazy(() => import('@pages/Dashboard').then(m => ({ default: m.Dashboard })));
const DevicePage = lazy(() => import('@pages/DevicePage').then(m => ({ default: m.DevicePage })));
const AIInsights = lazy(() => import('@pages/AIInsights').then(m => ({ default: m.AIInsights })));
const AutomationPage = lazy(() => import('@pages/AutomationPage').then(m => ({ default: m.AutomationPage })));
const FinancialDashboard = lazy(() => import('@pages/FinancialDashboard').then(m => ({ default: m.FinancialDashboard })));
const CommunityPage = lazy(() => import('@pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const SettingsPage = lazy(() => import('@pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

/**
 * Loading fallback component
 */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Main App component
 */
function App() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <Suspense fallback={<PageLoader />}>
              <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-insights"
                element={
                  <ProtectedRoute>
                    <AIInsights />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/automation"
                element={
                  <ProtectedRoute>
                    <AutomationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/financial"
                element={
                  <ProtectedRoute>
                    <FinancialDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <CommunityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/device/:deviceId"
                element={
                  <ProtectedRoute>
                    <DevicePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>

          {/* Persistent Bottom Navigation - Only show when authenticated */}
          <ProtectedRoute>
            <Navigation />
          </ProtectedRoute>

          {/* Global toast notifications */}
          <ToastContainer
            toasts={toasts.map((toast) => ({
              ...toast,
              onClose: removeToast,
            }))}
          />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
