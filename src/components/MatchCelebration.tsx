import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, User as UserIcon, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchCelebrationProps {
  mentorName: string;
  mentorExpertise: string[];
  mentorIcon?: string;
  matchId: string;
  onClose: () => void;
  onChat: () => void;
  onViewProfile: () => void;
}

const MatchCelebration: React.FC<MatchCelebrationProps> = ({
  mentorName,
  mentorExpertise,
  mentorIcon,
  matchId,
  onClose,
  onChat,
  onViewProfile,
}) => {
  // Fire confetti burst on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // First burst — center
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#1a2e4a', '#FFD700', '#FFFFFF'],
        disableForReducedMotion: true,
      });
      // Second burst — left
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.55 },
        colors: ['#1a2e4a', '#FFD700', '#FFFFFF'],
        disableForReducedMotion: true,
      });
      // Third burst — right
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.55 },
        colors: ['#1a2e4a', '#FFD700', '#FFFFFF'],
        disableForReducedMotion: true,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Mark as celebrated in localStorage
  useEffect(() => {
    localStorage.setItem(`matched_celebrated_${matchId}`, 'true');
  }, [matchId]);

  const handleChat = useCallback(() => {
    onChat();
  }, [onChat]);

  const handleViewProfile = useCallback(() => {
    onViewProfile();
  }, [onViewProfile]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] backdrop-blur-sm bg-navy/60 flex items-center justify-center p-6"
        onClick={onClose}
      >
        {/* Card — enters from bottom with spring */}
        <motion.div
          initial={{ y: 200, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{
            type: 'spring',
            damping: 22,
            stiffness: 280,
          }}
          className="bg-white rounded-[40px] w-full max-w-md mx-auto overflow-hidden shadow-2xl shadow-navy/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top section — celebratory */}
          <div className="bg-navy px-8 pt-10 pb-8 text-center relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, type: 'spring', damping: 12 }}
              className="text-6xl mb-4 relative z-10"
            >
              🎉
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-poppins font-bold text-3xl text-yellow mb-2 relative z-10"
            >
              It's a Match!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7 }}
              className="font-nunito text-white text-sm relative z-10"
            >
              <span className="font-bold text-white/90">{mentorName}</span> has
              accepted your connection request.
            </motion.p>
          </div>

          {/* Mentor mini-card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="px-8 -mt-5 relative z-20"
          >
            <div className="bg-off-white border border-navy/5 rounded-[28px] p-5 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0 border border-navy/5 overflow-hidden">
                {mentorIcon && mentorIcon.length < 5 ? (
                  mentorIcon
                ) : mentorIcon ? (
                  <img src={mentorIcon} alt={mentorName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={24} className="text-navy/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-poppins font-bold text-navy truncate">
                  {mentorName}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mentorExpertise.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-navy/5 text-navy/50 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="px-8 pt-6 pb-8 space-y-3"
          >
            <button
              onClick={handleChat}
              className="w-full py-4 bg-yellow text-navy rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow/20 active:scale-95 transition-transform"
            >
              <MessageCircle size={18} />
              Say Hello
              <ArrowRight size={16} />
            </button>
            <button
              onClick={handleViewProfile}
              className="w-full py-4 bg-transparent border-2 border-navy/10 text-navy rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform hover:border-navy/20"
            >
              View Profile
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchCelebration;
