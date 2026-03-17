/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import ModuleView from './pages/ModuleView';
import Chat from './pages/Chat';
import VoiceChat from './pages/VoiceChat';
import Mentor from './pages/Mentor';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import CareerMapper from './pages/CareerMapper';
import Opportunities from './pages/Opportunities';
import Circles from './pages/Circles';
import AdminDashboard from './pages/AdminDashboard';
import DSLDashboard from './pages/DSLDashboard';
import MentorDashboard from './pages/MentorDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import RoleRoute from './components/RoleRoute';
import { AnimatePresence, motion } from 'motion/react';

const AnimatedRoutes = () => {
  const { state } = useAppContext();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="w-full h-full">
        <Routes location={location}>
          <Route
            path="/"
            element={
              state.user ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />
            }
          />
          <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
          <Route path="/signin" element={<PageWrapper><SignIn /></PageWrapper>} />
          <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><PageWrapper><Learn /></PageWrapper></ProtectedRoute>} />
          <Route path="/learn/:moduleId" element={<ProtectedRoute><PageWrapper><ModuleView /></PageWrapper></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
          <Route path="/chat/voice" element={<ProtectedRoute><PageWrapper><VoiceChat /></PageWrapper></ProtectedRoute>} />
          <Route path="/circles" element={<ProtectedRoute><PageWrapper><Circles /></PageWrapper></ProtectedRoute>} />
          <Route path="/career-mapper" element={<ProtectedRoute><PageWrapper><CareerMapper /></PageWrapper></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><PageWrapper><Opportunities /></PageWrapper></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute><PageWrapper><Mentor /></PageWrapper></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><PageWrapper><Goals /></PageWrapper></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
          <Route path="/mentor-dashboard" element={<RoleRoute allowedRoles={['mentor']}><PageWrapper><MentorDashboard /></PageWrapper></RoleRoute>} />
          <Route path="/admin" element={<RoleRoute allowedRoles={['admin']}><PageWrapper><AdminDashboard /></PageWrapper></RoleRoute>} />
          <Route path="/dsl" element={<RoleRoute allowedRoles={['admin', 'dsl']}><PageWrapper><DSLDashboard /></PageWrapper></RoleRoute>} />
          <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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

import { initPushNotifications, setAppStatusBar } from './lib/notifications';

export default function App() {
  React.useEffect(() => {
    // Initialize native features
    setAppStatusBar();
    initPushNotifications();
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
