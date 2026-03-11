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
import Mentor from './pages/Mentor';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
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
            state.user ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
          }
        />
        <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
        <Route path="/signin" element={<PageWrapper><SignIn /></PageWrapper>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><PageWrapper><Learn /></PageWrapper></ProtectedRoute>} />
        <Route path="/learn/:moduleId" element={<ProtectedRoute><PageWrapper><ModuleView /></PageWrapper></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
        <Route path="/mentor" element={<ProtectedRoute><PageWrapper><Mentor /></PageWrapper></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><PageWrapper><Goals /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
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
  if (!state.user) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

export default function App() {
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
