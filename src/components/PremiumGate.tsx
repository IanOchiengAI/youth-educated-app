import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
  moduleName: string;
  moduleIcon: string;
}

const WHAT_YOU_GET = [
  'Finance, Career, SRH & Healthy Choices modules',
  'African-accent AI voice (Jabari Premium)',
  'Career Mapper & advanced insights',
  'Priority mentor booking',
];

const PremiumGate: React.FC<PremiumGateProps> = ({ moduleName, moduleIcon }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14 }}
        className="w-24 h-24 bg-yellow rounded-[28px] flex items-center justify-center text-5xl mb-6 shadow-[0_0_40px_rgba(255,215,0,0.25)]"
      >
        {moduleIcon}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Lock size={14} className="text-yellow" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow">YE+ Content</span>
        </div>
        <h1 className="text-white text-3xl font-poppins font-bold leading-tight">
          {moduleName}
        </h1>
        <p className="text-white/50 font-nunito text-[15px] max-w-xs mx-auto leading-relaxed">
          This module is part of YE+. Upgrade to unlock all advanced content.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-5 mb-8 text-left space-y-3"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow/70 mb-3">What you unlock with YE+</p>
        {WHAT_YOU_GET.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <Sparkles size={14} className="text-yellow mt-0.5 flex-shrink-0" />
            <span className="text-white/80 text-sm font-nunito">{item}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm space-y-3"
      >
        <button
          onClick={() => navigate('/profile')}
          className="w-full h-14 bg-yellow text-navy font-poppins font-bold rounded-full flex items-center justify-center gap-2 text-[15px] shadow-xl shadow-yellow/20 active:scale-95 transition-transform"
        >
          <Sparkles size={18} />
          Upgrade to YE+
          <ArrowRight size={18} />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full h-12 text-white/40 font-bold text-sm"
        >
          Go back
        </button>
      </motion.div>
    </div>
  );
};

export default PremiumGate;
