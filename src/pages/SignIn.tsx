import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, ChevronRight, RefreshCw, ChevronDown } from 'lucide-react';
import { sendOTP, verifyOTP } from '../lib/auth';
import { useAppContext } from '../AppContext';

const COUNTRY_CODES = [
  { code: '254', flag: '🇰🇪', name: 'Kenya' },
  { code: '256', flag: '🇺🇬', name: 'Uganda' },
  { code: '255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '250', flag: '🇷🇼', name: 'Rwanda' },
  { code: '251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '233', flag: '🇬🇭', name: 'Ghana' },
  { code: '27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '265', flag: '🇲🇼', name: 'Malawi' },
  { code: '260', flag: '🇿🇲', name: 'Zambia' },
  { code: '263', flag: '🇿🇼', name: 'Zimbabwe' },
  { code: '243', flag: '🇨🇩', name: 'DR Congo' },
  { code: '44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: '1',   flag: '🇺🇸', name: 'United States' },
  { code: '49',  flag: '🇩🇪', name: 'Germany' },
];

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('254');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const handleClickOutside = () => setShowCountryPicker(false);
    if (showCountryPicker) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showCountryPicker]);

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { success, error: authError } = await sendOTP(phone, countryCode);

    if (success) {
      setStep('otp');
      setCountdown(60);
    } else {
      setError(authError?.message || 'Failed to send code. Check the number and try again.');
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = otp.join('');
    if (token.length < 6) return;

    setIsLoading(true);
    setError(null);

    const { success, onboardingCompleted, role, error: authError } = await verifyOTP(phone, token, countryCode);

    if (success) {
      if (onboardingCompleted) {
        navigate('/redirect');  // PostLoginRedirect handles role-based routing after state settles
      } else {
        navigate('/onboarding');
      }
    } else {
      setError(authError?.message || 'Invalid code. Please try again.');
    }
    setIsLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (newOtp.every(digit => digit !== '') && index === 5) {
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
          <motion.img
            src="/logo-full.png"
            alt="Youth Educated"
            className="w-28 h-auto mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-3xl font-poppins font-bold text-navy mb-2">
            {step === 'phone' ? 'Welcome Back' : 'Verify Code'}
          </h1>
          <p className="text-grey leading-relaxed">
            {step === 'phone'
              ? 'Enter your phone number to continue your journey.'
              : `We sent a 6-digit code to +${countryCode} ${phone}.`}
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
                <div className="flex gap-2">
                  {/* Country code picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCountryPicker(prev => !prev);
                      }}
                      className="h-14 px-3 bg-white rounded-2xl shadow-sm border border-navy/10 flex items-center gap-1 text-navy font-bold text-[14px] whitespace-nowrap"
                    >
                      <span>{selectedCountry.flag}</span>
                      <span>+{selectedCountry.code}</span>
                      <ChevronDown size={14} className="text-grey" />
                    </button>

                    <AnimatePresence>
                      {showCountryPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute top-16 left-0 z-50 bg-white rounded-2xl shadow-xl border border-navy/10 w-52 max-h-64 overflow-y-auto"
                        >
                          {COUNTRY_CODES.map(c => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation();
                                setCountryCode(c.code); 
                                setShowCountryPicker(false); 
                              }}
                              className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-navy/5 transition-colors text-[14px] font-nunito ${countryCode === c.code ? 'bg-yellow/20 font-bold text-navy' : 'text-navy/80'}`}
                            >
                              <span>{c.flag}</span>
                              <span>{c.name}</span>
                              <span className="ml-auto text-grey text-[12px]">+{c.code}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Phone number input */}
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Phone className="text-grey" size={18} />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="input-field pl-11 text-[15px] font-nunito w-full"
                      placeholder="712345678"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
              )}

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

                {/* Trial Access — available during trial phase */}
                <div className="space-y-3 pt-2">
                  <p className="text-center text-grey text-[11px] font-bold uppercase tracking-wider">Trial Access</p>
                  <button
                    type="button"
                    onClick={() => {
                      flushSync(() => dispatch({
                        type: 'SET_USER',
                        payload: {
                          id: 'trial-student-001',
                          name: 'Trial Student',
                          ageBracket: '16-18',
                          gender: 'female',
                          county: 'Nairobi',
                          language: 'English',
                          goals: ['Learn Tech', 'Build Confidence'],
                          guardianConsent: true,
                          onboardingCompleted: true,
                          joinedAt: new Date().toISOString(),
                          role: 'student',
                          jabariVoice: 'default_female',
                          mentorPairId: null
                        }
                      }));
                      navigate('/dashboard');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-yellow/20 to-yellow/10 text-navy font-bold rounded-2xl border-2 border-yellow/40 hover:border-yellow hover:from-yellow/30 hover:to-yellow/20 transition-all flex items-center justify-center gap-2"
                  >
                    🎒 Enter as Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      flushSync(() => dispatch({
                        type: 'SET_USER',
                        payload: {
                          id: 'trial-mentor-001',
                          name: 'Coach Kevin',
                          ageBracket: '25+',
                          gender: 'male',
                          county: 'Kiambu',
                          language: 'English',
                          goals: ['Community Growth', 'Mentorship'],
                          guardianConsent: true,
                          onboardingCompleted: true,
                          joinedAt: new Date().toISOString(),
                          role: 'mentor',
                          jabariVoice: 'default_male',
                          mentorPairId: null
                        }
                      }));
                      navigate('/mentor-dashboard');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-navy font-bold rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 hover:from-blue-500/15 hover:to-blue-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    🎓 Enter as Mentor (Adult)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      flushSync(() => dispatch({
                        type: 'SET_USER',
                        payload: {
                          id: 'trial-admin-001',
                          name: 'Admin User',
                          ageBracket: '25+',
                          gender: 'prefer_not_to_say',
                          county: 'Nairobi',
                          language: 'English',
                          goals: ['Platform Management'],
                          guardianConsent: true,
                          onboardingCompleted: true,
                          joinedAt: new Date().toISOString(),
                          role: 'admin',
                          jabariVoice: 'default_female',
                          mentorPairId: null
                        }
                      }));
                      navigate('/admin');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-navy/10 to-navy/5 text-navy font-bold rounded-2xl border-2 border-navy/20 hover:border-navy/40 hover:from-navy/15 hover:to-navy/10 transition-all flex items-center justify-center gap-2"
                  >
                    ⚙️ Enter as Admin
                  </button>
                </div>
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

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
              )}

              <div className="text-center space-y-4 pt-4">
                <button
                  type="button"
                  disabled={countdown > 0 || isLoading}
                  onClick={() => handleSendOTP()}
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
