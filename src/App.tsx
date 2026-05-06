import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';
import Layout from './components/Layout';
import RoleRoute from './components/RoleRoute';
import { AnimatePresence, motion } from 'motion/react';
import { initPushNotifications, setAppStatusBar } from './lib/notifications';

// Eagerly load auth-critical pages
import SignIn from './pages/SignIn';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';

// Lazy-load all authenticated pages
const Dashboard       = lazy(() => import('./pages/Dashboard'));
const Learn           = lazy(() => import('./pages/Learn'));
const ModuleView      = lazy(() => import('./pages/ModuleView'));
const Chat            = lazy(() => import('./pages/Chat'));
const VoiceChat       = lazy(() => import('./pages/VoiceChat'));
const Mentor          = lazy(() => import('./pages/Mentor'));
const Goals           = lazy(() => import('./pages/Goals'));
const Profile         = lazy(() => import('./pages/Profile'));
const CareerMapper    = lazy(() => import('./pages/CareerMapper'));
const Opportunities   = lazy(() => import('./pages/Opportunities'));
const Circles         = lazy(() => import('./pages/Circles'));
const SessionCalendar = lazy(() => import('./pages/SessionCalendar'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const DSLDashboard    = lazy(() => import('./pages/DSLDashboard'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const ArticleDetail   = lazy(() => import('./pages/ArticleDetail'));
const PrivacyPolicy   = lazy(() => import('./pages/PrivacyPolicy'));
const MentorProfile   = lazy(() => import('./pages/MentorProfile'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center w-full h-full min-h-screen bg-off-white">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-10 h-10 rounded-full bg-navy"
    />
  </div>
);

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

// Reads role AFTER React flushes all batched state updates (dispatch + navigate race-condition safe)
const PostLoginRedirect: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user) { navigate('/signin', { replace: true }); return; }
    if (state.user.role === 'mentor') navigate('/mentor-dashboard', { replace: true });
    else if (state.user.role === 'admin')  navigate('/admin',            { replace: true });
    else if (state.user.role === 'dsl')    navigate('/dsl',              { replace: true });
    else                                   navigate('/dashboard',         { replace: true });
  }, [state.user?.role]);

  return <PageLoader />;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  const location = useLocation();
  if (!state.user && location.pathname !== '/onboarding' && location.pathname !== '/signin') {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const { state } = useAppContext();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="w-full h-full">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<PostLoginRedirect />} />
            <Route path="/redirect" element={<PostLoginRedirect />} />
            <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
            <Route path="/signin"     element={<PageWrapper><SignIn /></PageWrapper>} />

            <Route path="/dashboard"       element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
            <Route path="/learn"           element={<ProtectedRoute><PageWrapper><Learn /></PageWrapper></ProtectedRoute>} />
            <Route path="/learn/:moduleId" element={<ProtectedRoute><PageWrapper><ModuleView /></PageWrapper></ProtectedRoute>} />
            <Route path="/learn/article/:articleId" element={<ProtectedRoute><PageWrapper><ArticleDetail /></PageWrapper></ProtectedRoute>} />
            <Route path="/chat"            element={<ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
            <Route path="/chat/voice"      element={<ProtectedRoute><PageWrapper><VoiceChat /></PageWrapper></ProtectedRoute>} />
            <Route path="/circles"         element={<ProtectedRoute><PageWrapper><Circles /></PageWrapper></ProtectedRoute>} />
            <Route path="/career-mapper"   element={<ProtectedRoute><PageWrapper><CareerMapper /></PageWrapper></ProtectedRoute>} />
            <Route path="/opportunities"   element={<ProtectedRoute><PageWrapper><Opportunities /></PageWrapper></ProtectedRoute>} />
            <Route path="/mentor"          element={
              <ProtectedRoute>
                <PageWrapper>
                  {/* Mentors should see their dashboard, not the student browse view */}
                  {state.user?.role === 'mentor' ? <Navigate to="/mentor-dashboard" replace /> : <Mentor />}
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/mentor/:mentorId" element={<ProtectedRoute><PageWrapper><MentorProfile /></PageWrapper></ProtectedRoute>} />
            <Route path="/goals"           element={<ProtectedRoute><PageWrapper><Goals /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile"         element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
            <Route path="/calendar"        element={<ProtectedRoute><PageWrapper><SessionCalendar /></PageWrapper></ProtectedRoute>} />

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

export default function App() {
  React.useEffect(() => {
    setAppStatusBar();
    initPushNotifications().catch(() => {});
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
