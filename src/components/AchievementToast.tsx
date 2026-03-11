
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AchievementToastProps {
  name: string;
  icon: string;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ name, icon, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 left-4 right-4 z-[100] bg-navy rounded-2xl p-4 shadow-2xl border border-yellow/20 flex items-center gap-4"
    >
      <div className="w-12 h-12 bg-yellow rounded-xl flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-poppins font-semibold text-yellow text-sm flex items-center gap-1">
          <Sparkles size={12} />
          Achievement Unlocked!
        </p>
        <p className="text-white font-nunito text-sm">{name}</p>
      </div>
      <Link 
        to="/profile" 
        className="text-[10px] font-bold text-yellow uppercase tracking-wider underline"
        onClick={onClose}
      >
        View All
      </Link>
    </motion.div>
  );
};

export default AchievementToast;
