import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Users, User, WifiOff } from 'lucide-react';
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
        // In a real app, we might show a toast here
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
    { path: '/mentor', label: 'Mentor', icon: Users, badge: state.notifications.unreadMentor ? 'navy' : null },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-off-white relative overflow-x-hidden">
      <AnimatePresence>
        {state.isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-0 z-[100] bg-pale-yellow px-4 py-2 flex items-center justify-center gap-2 border-b border-yellow/20"
          >
            <WifiOff size={16} className="text-navy" />
            <span className="text-[13px] font-semibold text-navy">Offline — progress saving locally</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pb-20">
        {children}
      </main>

      {!shouldHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-2 h-20 flex items-center justify-around z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-full h-full pt-1 transition-colors ${
                  isActive ? 'text-navy' : 'text-grey'
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
                      className={isActive ? 'fill-navy' : ''}
                    />
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          item.badge === 'yellow' ? 'bg-yellow' : 'bg-navy'
                        }`}
                      />
                    )}
                  </div>
                  <span className={`text-[11px] font-poppins font-medium mt-1 ${isActive ? 'text-navy' : 'text-grey'}`}>
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
