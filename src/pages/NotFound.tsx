import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import { useAppContext } from '../AppContext';

const SWAHILI_PHRASES = [
  { sw: 'Ukurasa huu hauko hapa.', en: 'This page isn\'t here.' },
  { sw: 'Umepotea kidogo.', en: 'You\'re a little lost.' },
  { sw: 'Njia hii haipo.', en: 'This path doesn\'t exist.' },
  { sw: 'Hakuna kitu hapa.', en: 'Nothing to see here.' },
];

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();
  const [phrase] = useState(() => SWAHILI_PHRASES[Math.floor(Math.random() * SWAHILI_PHRASES.length)]);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const destination = state.user ? '/dashboard' : '/signin';

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 overflow-hidden relative">

      {/* Background grid decoration */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-yellow/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '10%', right: '5%' }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-white/5 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '15%', left: '10%' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm"
      >
        {/* Compass icon animated */}
        <motion.div
          className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/10"
          animate={{ rotate: [0, 15, -10, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Compass size={52} className="text-yellow" strokeWidth={1.5} />
        </motion.div>

        {/* 404 */}
        <div className="relative mb-2">
          <span className="text-[96px] font-black leading-none text-white/10 select-none absolute -top-4 left-1/2 -translate-x-1/2 blur-sm">
            404
          </span>
          <span className="text-[96px] font-black leading-none text-white relative">
            404
          </span>
        </div>

        {/* Swahili phrase */}
        <p className="text-yellow font-black text-xl mb-1 tracking-wide">{phrase.sw}</p>
        <p className="text-white/50 font-medium text-sm mb-2">{phrase.en}</p>

        {/* Path attempted */}
        <p className="text-white/20 text-[11px] font-mono mb-10 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          {location.pathname}{dots}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(destination)}
            className="flex items-center justify-center gap-2 bg-yellow text-navy font-black px-6 py-4 rounded-2xl shadow-lg text-[15px]"
          >
            <Home size={20} />
            {state.user ? 'Back to Dashboard' : 'Go to Sign In'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-4 rounded-2xl border border-white/10 text-[15px]"
          >
            <ArrowLeft size={20} />
            Go Back
          </motion.button>
        </div>

        {/* Brand */}
        <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.2em] mt-12">
          Youth Educated
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
