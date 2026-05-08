import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete } from 'lucide-react';
import { isPinSet, verifyPin } from '../lib/pin';
import { useAppContext } from '../AppContext';
import AIAvatar from './AIAvatar';

const LOCK_AFTER_MS = 5 * 60 * 1000; // 5 minutes idle

const PinLock: React.FC = () => {
  const { state } = useAppContext();
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const hiddenAt = useRef<number | null>(null);

  const persona = state.user?.aiPersona ?? 'amara';
  const aiName = persona === 'jabari' ? 'Jabari' : 'Amara';

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt.current = Date.now();
      } else if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - (hiddenAt.current ?? 0);
        if (elapsed > LOCK_AFTER_MS && isPinSet()) {
          setIsLocked(true);
          setPin('');
          setError(false);
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Lockout countdown
  useEffect(() => {
    if (!lockoutUntil) return;
    const id = setInterval(() => {
      const left = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (left <= 0) {
        setLockoutUntil(null);
        setFailCount(0);
        setRemaining(0);
      } else {
        setRemaining(left);
      }
    }, 500);
    return () => clearInterval(id);
  }, [lockoutUntil]);

  const handleDigit = useCallback((d: string) => {
    if (lockoutUntil) return;
    setError(false);
    setPin(prev => {
      const next = prev + d;
      return next.length > 4 ? prev : next;
    });
  }, [lockoutUntil]);

  const handleDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      verifyPin(pin).then(ok => {
        if (ok) {
          setIsLocked(false);
          setPin('');
          setFailCount(0);
        } else {
          setError(true);
          const next = failCount + 1;
          setFailCount(next);
          if (next >= 5) {
            setLockoutUntil(Date.now() + 30_000);
          }
          setTimeout(() => setPin(''), 400);
        }
      });
    }
  }, [pin]);

  // Keyboard support
  useEffect(() => {
    if (!isLocked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      if (e.key === 'Backspace') handleDelete();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLocked, handleDigit, handleDelete]);

  if (!isLocked) return null;

  const KEYPAD = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[500] bg-navy flex flex-col items-center justify-center px-8 select-none"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <AIAvatar persona={persona} size={72} />
        <div className="text-center">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            {aiName} is waiting for you
          </p>
          <h2 className="text-white text-2xl font-bold mt-1">Enter your PIN</h2>
        </div>

        {/* Dots */}
        <div className="flex gap-4 my-2">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.35 }}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length
                  ? error ? 'bg-red-400 border-red-400' : 'bg-yellow border-yellow'
                  : 'border-white/20 bg-transparent'
              }`}
            />
          ))}
        </div>

        {lockoutUntil ? (
          <p className="text-red-400 text-sm font-bold">
            Too many attempts. Try in {remaining}s
          </p>
        ) : error ? (
          <p className="text-red-400 text-sm font-bold">Incorrect PIN</p>
        ) : (
          <div className="h-5" />
        )}

        {/* Keypad */}
        <div className="w-full space-y-3">
          {KEYPAD.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-3">
              {row.map((key, ki) => {
                if (key === '') return <div key={ki} className="w-20 h-14" />;
                if (key === 'del') {
                  return (
                    <motion.button
                      key="del"
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDelete}
                      className="w-20 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center"
                    >
                      <Delete size={20} />
                    </motion.button>
                  );
                }
                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleDigit(key)}
                    disabled={!!lockoutUntil}
                    className="w-20 h-14 rounded-2xl bg-white/10 text-white text-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-30"
                  >
                    {key}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PinLock;
