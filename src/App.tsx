/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';
import Layout from './components/Layout';
import RoleRoute from './components/RoleRoute';
import { AnimatePresence, motion } from 'motion/react';
import { initPushNotifications, setAppStatusBar } from './lib/notifications';

// Eagerly load auth-critical pages shown immediately on cold start
import SignIn from './pages/SignIn';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';

// Lazy-load all authenticated pages — each becomes its own JS chunk
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Learn         = lazy(() => import('./pages/Learn'));
const ModuleView    = lazy(() => import('./pages/ModuleView'));
const Chat          = lazy(() => import('./pages/Chat'));
const VoiceChat     = lazy(() => import('./pages/VoiceChat'));
const Mentor        = lazy(() => import('./pages/Mentor'));
const Goals         = lazy(() => import('./pages/Goals'));
const Profile       = lazy(() => import('./pages/Profile'));
const CareerMapper  = lazy(() => import('./pages/CareerMapper'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const Circles       = lazy(() => import('./pages/Circles'));
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard'));
const DSLDashboard     = lazy(() => import('./pages/DSLDashboard'));
const MentorDashboard  = lazy(() => import('./pages/MentorDashboard'));
const PrivacyPolicy    = lazy(() => import('./pages/PrivacyPolicy'));

// Minimal pulse shown while a lazy chunk is downloading
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center w-full h-full min-h-screen bg-off-white">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-10 h-10 rounded-full bg-navy"
    />
  </div>
);

const AnimatedRoutes = () => {
  const { state } = useAppContext();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="w-full h-full">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                state.user ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />
              }
            />
            <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
            <Route path="/signin"     element={<PageWrapper><SignIn /></PageWrapper>} />

            <Route path="/dashboard"       element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
            <Route path="/learn"           element={<ProtectedRoute><PageWrapper><Learn /></PageWrapper></ProtectedRoute>} />
            <Route path="/learn/:moduleId" element={<ProtectedRoute><PageWrapper><ModuleView /></PageWrapper></ProtectedRoute>} />
            <Route path="/chat"            element={<ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
            <Route path="/chat/voice"      element={<ProtectedRoute><PageWrapper><VoiceChat /></PageWrapper></ProtectedRoute>} />
            <Route path="/circles"         element={<ProtectedRoute><PageWrapper><Circles /></PageWrapper></ProtectedRoute>} />
            <Route path="/career-mapper"   element={<ProtectedRoute><PageWrapper><CareerMapper /></PageWrapper></ProtectedRoute>} />
            <Route path="/opportunities"   element={<ProtectedRoute><PageWrapper><Opportunities /></PageWrapper></ProtectedRoute>} />
            <Route path="/mentor"          element={<ProtectedRoute><PageWrapper><Mentor /></PageWrapper></ProtectedRoute>} />
            <Route path="/goals"           element={<ProtectedRoute><PageWrapper><Goals /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile"         element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />

            <Route path="/mentor-dashboard" element={<RoleRoute allowedRoles={['mentor']}><PageWrapper><MentorDashboard /></PageWrapper></RoleRoute>} />
            <Route path="/admin"            element={<RoleRoute allowedRoles={['admin']}><PageWrapper><AdminDashboard /></PageWrapper></RoleRoute>} />
            <Route path="/dsl"              element={<RoleRoute allowedRoles={['admin', 'dsl']}><PageWrapper><DSLDashboard /></PageWrapper></RoleRoute>} />

            <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
            <Route path="*"        element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.22 }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  const location = useLocation();

  if (!state.user && location.pathname !== '/onboarding' && location.pathname !== '/signin') {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  React.useEffect(() => {
    setAppStatusBar();
    initPushNotifications().catch(() => {
      // Push notifications unavailable in web/browser context — non-fatal
    });
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
