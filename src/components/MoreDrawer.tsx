import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Globe, User, CalendarDays, Target, Settings, X } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { t, type Language } from '../lib/i18n';

interface MoreDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MoreDrawer: React.FC<MoreDrawerProps> = ({ open, onClose }) => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const lang: Language = state.user?.language ?? 'English';

  const items = [
    { path: '/circles',  icon: Globe,        label: t('nav.circles', lang),                        color: 'bg-blue-500/10 text-blue-700' },
    { path: '/goals',    icon: Target,       label: lang === 'Kiswahili' ? 'Malengo' : 'My Goals', color: 'bg-green-500/10 text-green-700' },
    { path: '/calendar', icon: CalendarDays, label: t('nav.calendar', lang),                       color: 'bg-orange-500/10 text-orange-700' },
    { path: '/profile',  icon: Settings,     label: lang === 'Kiswahili' ? 'Wasifu' : 'Profile',   color: 'bg-navy/10 text-navy' },
  ];

  const go = (path: string) => { onClose(); navigate(path); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-navy/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-20 left-0 right-0 max-w-md mx-auto z-[70] bg-white rounded-t-[32px] shadow-2xl px-5 pt-4 pb-6"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40">
                {lang === 'Kiswahili' ? 'Zaidi' : 'More'}
              </p>
              <button onClick={onClose} className="p-1.5 rounded-full bg-navy/5 text-navy/40 hover:text-navy transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {items.map(item => (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-navy/5 bg-off-white hover:bg-white hover:border-navy/10 active:scale-95 transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-navy leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoreDrawer;
