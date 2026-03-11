import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowRight, Star } from 'lucide-react';

interface TierUpgradeProps {
  isOpen: boolean;
  tierName: string;
  onClose: () => void;
}

const TierUpgrade: React.FC<TierUpgradeProps> = ({ isOpen, tierName, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-navy flex items-center justify-center p-6 text-center"
        >
          <div className="relative w-full max-w-sm">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-yellow/20 blur-[100px] rounded-full" />
            
            <div className="relative space-y-8">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                className="w-32 h-32 bg-yellow rounded-[32px] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.3)]"
              >
                <Trophy size={64} className="text-navy" />
              </motion.div>

              <div className="space-y-2">
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-yellow font-bold uppercase tracking-[0.2em] text-sm"
                >
                  New Rank Achieved
                </motion.h4>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-white text-5xl font-poppins"
                >
                  {tierName}
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center gap-2"
              >
                {[1, 2, 3].map((i) => (
                  <Star key={i} size={20} className="text-yellow fill-yellow" />
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/70 font-nunito text-lg"
              >
                Your influence is growing. You're now a recognized leader in the community.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onClose}
                className="btn-secondary w-full h-16 text-lg shadow-xl"
              >
                <span>Continue Journey</span>
                <ArrowRight size={20} className="ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TierUpgrade;
