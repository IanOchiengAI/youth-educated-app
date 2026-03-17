import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, ChevronRight, RefreshCw } from 'lucide-react';
import { sendOTP, verifyOTP } from '../lib/auth';
import { useAppContext } from '../AppContext';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('0');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Supabase uses 6 digits by default
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { success, error: authError } = await sendOTP(phone);

    if (success) {
      setStep('otp');
      setCountdown(60);
    } else {
      setError(authError?.message || 'Failed to send code');
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = otp.join('');
    if (token.length < 6) return;

    setIsLoading(true);
    setError(null);

    const { success, onboardingCompleted, role, error: authError } = await verifyOTP(phone, token);

    if (success) {
      // In a real app, the session is managed by Supabase
      // We'll update the context in AppContext.tsx's useEffect
      if (onboardingCompleted) {
        if (role === 'mentor') {
          navigate('/mentor-dashboard');
        } else if (role === 'dsl') {
          navigate('/dsl');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/onboarding');
      }
    } else {
      setError(authError?.message || 'Invalid code');
    }
    setIsLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-verify if full
    if (newOtp.every(digit => digit !== '') && index === 5) {
      // Small timeout to allow the last digit to render
      setTimeout(() => handleVerifyOTP(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-nunito">
      <header className="p-6">
        <button 
          onClick={() => step === 'otp' ? setStep('phone') : navigate('/')} 
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-navy transition-transform active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      <main className="flex-1 px-6 pt-4 pb-12 flex flex-col max-w-md mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-3xl font-poppins font-bold text-navy mb-2">
            {step === 'phone' ? 'Welcome Back' : 'Verify Code'}
          </h1>
          <p className="text-grey leading-relaxed">
            {step === 'phone' 
              ? 'Enter your phone number to continue your journey.'
              : `We've sent a 6-digit code to ${phone}.`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form 
              key="phone-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP} 
              className="space-y-6 flex-1"
            >
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-navy uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <Phone className="text-grey" size={18} />
                    <span className="text-navy font-bold text-[15px] border-r border-grey/20 pr-2">+254</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone.startsWith('0') ? phone.slice(1) : phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="input-field pl-24 text-[15px] font-nunito"
                    placeholder="712345678"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

              <div className="pt-8 space-y-4">
                <button 
                  type="submit" 
                  disabled={isLoading || !phone}
                  className="btn-primary w-full disabled:opacity-50 flex items-center justify-center group"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <>
                      Send Code
                      <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                {/* Temporary Dev Bypass */}
                {import.meta.env.DEV && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: 'SET_USER',
                          payload: {
                            id: 'dev-mock-user-123',
                            name: 'Test Scholar',
                            ageBracket: '16-18',
                            gender: 'female',
                            county: 'Nairobi',
                            language: 'English',
                            goals: ['Learn Tech', 'Build Confidence'],
                            guardianConsent: true,
                            onboardingCompleted: true,
                            joinedAt: new Date().toISOString(),
                            role: 'student'
                          }
                        });
                        navigate('/dashboard');
                      }}
                      className="w-full py-3 bg-red-100 text-red-700 font-bold rounded-2xl border-2 border-red-200 border-dashed hover:bg-red-200 transition-colors"
                    >
                      🛠️ STUDENT BYPASS
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: 'SET_USER',
                          payload: {
                            id: 'dev-mock-mentor-456',
                            name: 'Coach Kevin',
                            ageBracket: '25-30',
                            gender: 'male',
                            county: 'Kiambu',
                            language: 'English',
                            goals: ['Community Growth'],
                            guardianConsent: true,
                            onboardingCompleted: true,
                            joinedAt: new Date().toISOString(),
                            role: 'mentor'
                          }
                        });
                        navigate('/mentor-dashboard');
                      }}
                      className="w-full py-3 bg-blue-100 text-blue-700 font-bold rounded-2xl border-2 border-blue-200 border-dashed hover:bg-blue-200 transition-colors"
                    >
                      🎓 MENTOR BYPASS (Phase 3)
                    </button>
                  </div>
                )}
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP} 
              className="space-y-8 flex-1"
            >
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="number"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-16 text-center text-3xl font-poppins font-bold bg-white border-2 border-transparent focus:border-yellow-500 rounded-2xl shadow-sm focus:outline-none transition-all"
                    disabled={isLoading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

              <div className="text-center space-y-4 pt-4">
                <button
                  type="button"
                  disabled={countdown > 0 || isLoading}
                  onClick={handleSendOTP}
                  className="text-navy font-bold text-sm disabled:text-grey transition-colors"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                </button>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isLoading || otp.some(d => !d)}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="animate-spin mx-auto" size={20} /> : 'Verify & Continue'}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-auto text-center pt-8">
          <p className="text-grey text-[11px]">
            By continuing, you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy</span>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
