import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Phone } from 'lucide-react';

interface SafeguardingCardProps {
  message: string;
  onDismiss: () => void;
  showDismiss?: boolean;
}

const SafeguardingCard: React.FC<SafeguardingCardProps> = ({ message, onDismiss, showDismiss = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-2 border-red-400 bg-red-50 rounded-[28px] p-6 shadow-lg"
    >
      {/* Alert header */}
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={18} className="text-red-600" />
        <span className="text-xs font-black uppercase tracking-widest text-red-600">Priority Support</span>
      </div>

      {/* Escalation message */}
      <p className="text-[15px] leading-relaxed text-red-700 whitespace-pre-wrap">{message}</p>

      {/* Call Childline — anchor tag, NEVER auto-dial */}
      <a
        href="tel:116"
        className="mt-4 bg-red-600 text-white rounded-2xl py-4 font-bold w-full flex items-center justify-center gap-2 no-underline"
      >
        <Phone size={18} />
        Call Childline: 116
      </a>

      {/* Dismiss / "I'm safe" — only when showDismiss is true */}
      {showDismiss && (
        <button
          onClick={onDismiss}
          className="bg-white border-2 border-navy/10 text-navy rounded-2xl py-3 font-bold w-full mt-3"
        >
          I'm safe, continue
        </button>
      )}
    </motion.div>
  );
};

export default SafeguardingCard;
