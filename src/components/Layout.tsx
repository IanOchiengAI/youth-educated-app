import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Users, User, WifiOff, Globe, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { useGamification } from '../hooks/useGamification';
import { motion, AnimatePresence } from 'motion/react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  const { checkAndUpdateStreak } = useGamification();
  const location = useLocation();

  useEffect(() => {
    if (state.user) {
      const result = checkAndUpdateStreak();
      if (result?.milestoneMessage) {
        console.log(result.milestoneMessage);
      }
    }
  }, [state.user, checkAndUpdateStreak]);

  const hideNavRoutes = ['/onboarding', '/signin'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname) || !state.user;

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/chat', label: 'Chat', icon: MessageCircle, badge: state.notifications.unreadChat ? 'yellow' : null },
    { path: '/circles', label: 'Circles', icon: Globe },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (state.user?.role === 'admin') {
    // Replace circles slot with Admin for admins, to keep it clean, or just append
    navItems.push({ path: '/admin', label: 'Admin', icon: Users });
  } else if (state.user?.role === 'dsl') {
    navItems.push({ path: '/dsl', label: 'DSL', icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-off-white relative overflow-x-hidden shadow-2xl">
      <AnimatePresence>
        {state.isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-0 z-[100] bg-yellow px-4 py-2 flex items-center justify-center gap-2 border-b border-navy/10"
          >
            <WifiOff size={14} className="text-navy" />
            <span className="text-[11px] font-black uppercase tracking-widest text-navy">Offline Mode</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pb-20">
        {children}
      </main>

      {!shouldHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-navy/5 px-2 h-20 flex items-center justify-around z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-full h-full pt-1 transition-colors ${
                  isActive ? 'text-navy' : 'text-navy/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute top-0 w-12 h-[3px] bg-yellow rounded-b-full"
                    />
                  )}
                  <div className="relative">
                    <item.icon
                      size={24}
                      className={isActive ? 'text-navy' : ''}
                    />
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          item.badge === 'yellow' ? 'bg-yellow' : 'bg-navy'
                        }`}
                      />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${isActive ? 'text-navy' : 'text-navy/30'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
