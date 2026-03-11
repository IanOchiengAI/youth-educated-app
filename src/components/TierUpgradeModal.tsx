
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, ArrowRight } from 'lucide-react';
import { Tier } from '../utils/gamification';

interface TierUpgradeModalProps {
  tier: Tier;
  points: number;
  userName: string;
  onClose: () => void;
}

const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({ tier, points, userName, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center p-6 text-center overflow-hidden"
        onClick={onClose}
      >
        {/* Confetti Simulation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: '50%', 
                  y: '50%', 
                  scale: 0,
                  rotate: 0 
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`,
                  scale: Math.random() * 1 + 0.5,
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeOut",
                  delay: Math.random() * 0.2
                }}
                className={`absolute w-2 h-2 rounded-sm ${
                  ['bg-yellow', 'bg-white', 'bg-pale-yellow'][Math.floor(Math.random() * 3)]
                }`}
              />
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-poppins font-bold text-[#FFD700] text-[12px] tracking-[3px] uppercase mb-8"
        >
          You've Levelled Up
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.1, 1] }}
          transition={{ delay: 0.5, type: 'spring', damping: 12 }}
          className="w-[120px] h-[120px] bg-yellow rounded-full flex items-center justify-center text-6xl mb-6 shadow-[0_0_40px_rgba(255,215,0,0.3)]"
        >
          {tier.icon}
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-poppins font-bold text-[#FFD700] text-5xl mb-2"
        >
          {tier.swahili}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.9 }}
          className="font-nunito text-lg text-white font-medium mb-4"
        >
          {tier.name}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.0 }}
          className="font-nunito text-[15px] text-white max-w-[280px] mb-8"
        >
          {getTierDescription(tier.swahili)}
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1, type: 'spring' }}
          className="bg-yellow text-navy px-4 py-1 rounded-full font-bold text-sm mb-10"
        >
          +{points} PTS
        </motion.div>

        {/* Share Card Preview */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-xl p-4 w-full max-w-[240px] shadow-2xl mb-10 text-left relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow/10 rounded-bl-full" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-xl">
              {tier.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-navy/40 uppercase tracking-wider">New Rank</p>
              <p className="text-navy font-bold">{tier.swahili}</p>
            </div>
          </div>
          <p className="text-navy font-bold text-lg mb-1">{userName}</p>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-navy/60 font-medium italic">Youth Educated</p>
            <div className="w-6 h-6 bg-yellow rounded-full flex items-center justify-center text-[8px] font-bold text-navy">YE</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col w-full gap-3 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="bg-yellow text-navy font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
            <Share2 size={18} />
            Share to WhatsApp
          </button>
          <button 
            onClick={onClose}
            className="bg-transparent border-2 border-white/20 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Continue Learning
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function getTierDescription(swahili: string) {
  switch (swahili) {
    case 'MCHANGA': return "The seedling has broken through the soil. Your journey of growth has just begun.";
    case 'MWANZO': return "The spark is lit. You are taking your first bold steps toward a brighter future.";
    case 'MSIMAMO': return "Deep roots, strong character. You are standing firm in your values and vision.";
    case 'NGUVU': return "A force for good. Your strength is inspiring those around you to rise.";
    case 'KIONGOZI': return "The summit reached. You are now a beacon of hope and a guide for your community.";
    default: return "";
  }
}

export default TierUpgradeModal;
