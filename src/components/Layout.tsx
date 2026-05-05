import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, MessageCircle, Globe, User, WifiOff, Users, ShieldAlert, LayoutDashboard, CalendarDays } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { useGamification } from '../hooks/useGamification';
import { motion, AnimatePresence } from 'motion/react';
import { t, type Language } from '../lib/i18n';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  const { checkAndUpdateStreak } = useGamification();
  const location = useLocation();
  const lang: Language = state.user?.language ?? 'English';

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

  // Role-based nav — mentors get their own focused set
  let navItems: { path: string; label: string; icon: React.ElementType; badge?: string | null }[];

  if (state.user?.role === 'mentor') {
    navItems = [
      { path: '/mentor-dashboard', label: t('nav.mypanel', lang), icon: LayoutDashboard },
      { path: '/calendar',         label: t('nav.calendar', lang), icon: CalendarDays },
      { path: '/mentor',           label: t('nav.mentor', lang),   icon: Users },
      { path: '/profile',          label: 'Profile',               icon: User },
    ];
  } else {
    // Student nav
    navItems = [
      { path: '/dashboard', label: t('nav.home', lang), icon: Home },
      { path: '/learn', label: t('nav.lifekit', lang), icon: Sparkles },
      { path: '/chat', label: t('nav.chat', lang), icon: MessageCircle, badge: state.notifications.unreadChat ? 'yellow' : null },
      { path: '/circles', label: t('nav.circles', lang), icon: Globe },
      { path: '/mentor', label: t('nav.mentor', lang), icon: User },
      { path: '/calendar', label: t('nav.calendar', lang), icon: CalendarDays },
    ];

    if (state.user?.role === 'admin') {
      navItems.push({ path: '/admin', label: t('nav.admin', lang), icon: Users });
    } else if (state.user?.role === 'dsl') {
      navItems.push({ path: '/dsl', label: 'DSL', icon: ShieldAlert });
    }
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
            <span className="text-[11px] font-black uppercase tracking-widest text-navy">{t('app.offline', lang)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pb-20">
        {!shouldHideNav && (
          <div className="sticky top-0 z-40 bg-off-white/90 backdrop-blur-md border-b border-navy/5 px-4 py-2 flex items-center gap-2">
            <img src="/logo-mark.png" alt="YE" className="w-6 h-6 object-contain" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-navy/50">{t('app.name', lang)}</span>
            {state.user?.role === 'mentor' && (
              <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-yellow bg-navy/10 px-2 py-0.5 rounded-full">
                {t('app.mentor_badge', lang)}
              </span>
            )}
          </div>
        )}
        {children}
      </main>

      {!shouldHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-navy/5 px-1 h-20 flex items-center justify-around z-50">
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
                      className="absolute top-0 w-10 h-[3px] bg-yellow rounded-b-full"
                    />
                  )}
                  <div className="relative">
                    <item.icon size={22} className={isActive ? 'text-navy' : ''} />
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          item.badge === 'yellow' ? 'bg-yellow' : 'bg-navy'
                        }`}
                      />
                    )}
                  </div>
                  <span className={`text-[9px] font-bold mt-1 uppercase tracking-widest ${isActive ? 'text-navy' : 'text-navy/30'}`}>
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
