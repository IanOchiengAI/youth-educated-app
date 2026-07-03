import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, ChevronRight, RefreshCw, ChevronDown, GraduationCap, Users, ShieldCheck } from 'lucide-react';
import { sendOTP, verifyOTP, signInWithGoogle } from '../lib/auth';
import { useAppContext } from '../AppContext';
import type { User } from '../AppContext';
import { supabase } from '../lib/supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { t, type Language } from '../lib/i18n';

const GOOGLE_SIGN_IN_TIMEOUT_MS = 25_000;
type SignInIntent = 'student' | 'mentor' | 'staff';
type AuthRole = 'student' | 'mentor' | 'admin' | 'dsl';

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

const SIGN_IN_OPTIONS: Array<{
  intent: SignInIntent;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}> = [
  {
    intent: 'student',
    title: 'Student',
    description: 'Learn, chat with Jabari, join circles, and track your goals.',
    icon: GraduationCap,
  },
  {
    intent: 'mentor',
    title: 'Mentor',
    description: 'Support assigned learners and manage mentorship sessions.',
    icon: Users,
  },
  {
    intent: 'staff',
    title: 'Admin / Staff',
    description: 'Access admin tools and safeguarding dashboards.',
    icon: ShieldCheck,
  },
];

const INTENT_COPY: Record<SignInIntent, { title: string; description: string }> = {
  student: {
    title: 'Student Sign In',
    description: 'Use your phone number to continue learning.',
  },
  mentor: {
    title: 'Mentor Sign In',
    description: 'Use the phone number registered by the Youth Educated team.',
  },
  staff: {
    title: 'Admin / Staff Sign In',
    description: 'Use your approved admin or safeguarding phone number.',
  },
};

const isRoleAllowedForIntent = (
  intent: SignInIntent,
  role: any,
  onboardingCompleted: boolean | undefined,
) => {
  if (role === 'admin') {
    return true;
  }
  if (intent === 'student') {
    return !onboardingCompleted || !role || role === 'student';
  }
  if (intent === 'mentor') {
    return onboardingCompleted === true && role === 'mentor';
  }
  return onboardingCompleted === true && (role === 'admin' || role === 'dsl');
};

const roleMismatchMessage = (intent: SignInIntent) => {
  if (intent === 'mentor') {
    return 'This number is not registered as a mentor yet. Ask an admin to approve your mentor profile first.';
  }
  if (intent === 'staff') {
    return 'This number is not registered for admin or DSL access. Use an approved staff account.';
  }
  return 'This number belongs to a mentor or staff account. Choose the matching sign-in path.';
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [step, setStep] = useState<'main' | 'phone' | 'otp'>('main');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('ye_signin_lang') as Language) || 'English';
  });

  const handleLangToggle = () => {
    const newLang = lang === 'English' ? 'Kiswahili' : 'English';
    setLang(newLang);
    localStorage.setItem('ye_signin_lang', newLang);
  };
  const [selectedIntent, setSelectedIntent] = useState<SignInIntent | null>(null);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('254');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const googleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const oauthProcessingRef = useRef(false);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0];
  const activeIntent = selectedIntent ?? 'student';
  const activeIntentCopy = INTENT_COPY[activeIntent];

  const goToIntent = (intent: SignInIntent) => {
    setSelectedIntent(intent);
    localStorage.setItem('ye_signin_intent', intent);
    setStep('phone');
    setError(null);
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      return;
    }
    if (step === 'phone') {
      setStep('main');
      setSelectedIntent(null);
      setError(null);
      return;
    }
    navigate('/');
  };

  const clearGoogleTimeout = () => {
    if (googleTimeoutRef.current) {
      clearTimeout(googleTimeoutRef.current);
      googleTimeoutRef.current = null;
    }
  };

  const startGoogleTimeout = (message = 'Sign-in timed out. Please try again.') => {
    clearGoogleTimeout();
    googleTimeoutRef.current = setTimeout(() => {
      oauthProcessingRef.current = false;
      setGoogleLoading(false);
      setError(message);
      googleTimeoutRef.current = null;
    }, GOOGLE_SIGN_IN_TIMEOUT_MS);
  };

  useEffect(() => {
    if (state.user) {
      clearGoogleTimeout();
      if (selectedIntent && !isRoleAllowedForIntent(selectedIntent, state.user.role, state.user.onboardingCompleted)) {
        void supabase.auth.signOut().then(() => {
          setStep('main');
          setSelectedIntent(null);
          setError(roleMismatchMessage(selectedIntent));
        });
        return;
      }
      navigate(state.user.onboardingCompleted ? '/redirect' : '/onboarding');
    }
  }, [state.user, navigate, selectedIntent]);

  useEffect(() => {
    const handleProcessing = () => {
      oauthProcessingRef.current = true;
      setGoogleLoading(true);
      setError(null);
      startGoogleTimeout('Google sign-in is taking too long. Please try again.');
    };

    const handleFinished = () => {
      oauthProcessingRef.current = false;
      setGoogleLoading(false);
      clearGoogleTimeout();
    };

    const handleError = (e: Event) => {
      oauthProcessingRef.current = false;
      const customEvent = e as CustomEvent<{ message: string }>;
      setError(customEvent.detail.message);
      setGoogleLoading(false);
      clearGoogleTimeout();
    };

    window.addEventListener('oauth-processing', handleProcessing);
    window.addEventListener('oauth-finished', handleFinished);
    window.addEventListener('oauth-error', handleError);

    return () => {
      window.removeEventListener('oauth-processing', handleProcessing);
      window.removeEventListener('oauth-finished', handleFinished);
      window.removeEventListener('oauth-error', handleError);
    };
  }, []);

  useEffect(() => {
    let handle: { remove: () => void } | null = null;
    if (Capacitor.isNativePlatform()) {
      Browser.addListener('browserFinished', () => {
        // Reset loading state if the user manually closes the in-app browser
        // and we are NOT currently processing a callback redirect
        if (!oauthProcessingRef.current) {
          clearGoogleTimeout();
          setTimeout(() => setGoogleLoading(false), 500);
        }
      }).then(l => { handle = l; });
    }
    return () => {
      handle?.remove();
      clearGoogleTimeout();
    };
  }, []);

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

  const handleGoogleSignIn = async () => {
    localStorage.setItem('ye_signin_intent', activeIntent);
    setGoogleLoading(true);
    setError(null);
    startGoogleTimeout();

    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
      clearGoogleTimeout();
      return;
    }
  };

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
      if (!isRoleAllowedForIntent(activeIntent, role as AuthRole | undefined, onboardingCompleted)) {
        await supabase.auth.signOut();
        setOtp(['', '', '', '', '', '']);
        setStep('main');
        setSelectedIntent(null);
        setError(roleMismatchMessage(activeIntent));
        setIsLoading(false);
        return;
      }
      navigate(onboardingCompleted ? '/redirect' : '/onboarding');
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
      <header className="p-6 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-navy transition-transform active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          onClick={handleLangToggle}
          className="text-[10px] font-black uppercase tracking-widest text-navy/50 hover:text-navy transition-colors px-2 py-0.5 rounded-full border border-navy/15 hover:border-navy/30 hover:bg-navy/5"
          aria-label="Switch language"
        >
          {lang === 'English' ? 'KSW' : 'ENG'}
        </button>
      </header>

      <main className="flex-1 px-6 pt-4 pb-12 flex flex-col max-w-md mx-auto w-full">
        <div className="mb-10">
          <motion.img
            src="/logo-full.png"
            alt="Youth Educated"
            className="w-28 h-auto mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-3xl font-poppins font-bold text-navy mb-2">
            {step === 'otp' ? t('signin.verify_title', lang) : step === 'phone' ? activeIntentCopy.title : t('signin.choose_title', lang)}
          </h1>
          <p className="text-grey leading-relaxed">
            {step === 'otp'
              ? `${t('signin.verify_desc', lang)} +${countryCode} ${phone}.`
              : step === 'phone'
              ? activeIntentCopy.description
              : t('signin.choose_access', lang)}
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Main sign-in options ─────────────────────────────── */}
          {step === 'main' && (
            <motion.div
              key="main-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {state.isOffline && !state.user && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-800 mb-2">
                  <div className="text-2xl flex-shrink-0">📵</div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-[13px]">Connect once to set up this device</p>
                    <p className="text-red-700/95 leading-relaxed">
                      You need internet to sign in for the first time.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
              )}

              {/* Google Sign In — primary */}
              <div className="space-y-3">
                {SIGN_IN_OPTIONS.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.intent}
                      type="button"
                      onClick={() => goToIntent(option.intent)}
                      className="w-full bg-white rounded-2xl shadow-sm border border-navy/10 p-4 text-left hover:shadow-md hover:border-navy/20 transition-all active:scale-[0.99]"
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-11 h-11 rounded-2xl bg-yellow/20 text-navy flex items-center justify-center shrink-0">
                          <Icon size={22} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-poppins font-bold text-navy text-[16px]">{option.title}</span>
                          <span className="block text-grey text-[13px] leading-snug mt-1">{option.description}</span>
                        </span>
                        <ChevronRight size={20} className="text-navy/40 shrink-0" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dev bypass options — only rendered in local dev environment */}
              {import.meta.env.DEV && (
                <div className="space-y-3 pt-4">
                  <p className="text-center text-grey text-[11px] font-bold uppercase tracking-wider">Dev Bypass Access</p>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({
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
                          aiPersona: 'amara',
                          isPremium: false,
                          mentorPairId: null
                        }
                      });
                      navigate('/dashboard');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-yellow/20 to-yellow/10 text-navy font-bold rounded-2xl border-2 border-yellow/40 hover:border-yellow hover:from-yellow/30 hover:to-yellow/20 transition-all flex items-center justify-center gap-2"
                  >
                    🎒 Enter as Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({
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
                          aiPersona: 'jabari',
                          isPremium: false,
                          mentorPairId: null
                        }
                      });
                      navigate('/mentor-dashboard');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-navy font-bold rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 hover:from-blue-500/15 hover:to-blue-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    🎓 Enter as Mentor (Adult)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({
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
                          aiPersona: 'amara',
                          isPremium: false,
                          mentorPairId: null
                        }
                      });
                      navigate('/admin');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-navy/10 to-navy/5 text-navy font-bold rounded-2xl border-2 border-navy/20 hover:border-navy/40 hover:from-navy/15 hover:to-navy/10 transition-all flex items-center justify-center gap-2"
                  >
                    ⚙️ Enter as Admin
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Phone entry ──────────────────────────────────────── */}
          {step === 'phone' && (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOTP}
              className="space-y-6 flex-1"
            >
              {true && (
                <>
                  <button
                    id="btn-google-signin"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full py-4 bg-white rounded-2xl shadow-sm border border-navy/10 flex items-center justify-center gap-3 font-bold text-navy text-[15px] hover:shadow-md hover:border-navy/20 transition-all active:scale-95 disabled:opacity-60"
                  >
                    {googleLoading ? (
                      <>
                        <RefreshCw className="animate-spin" size={20} />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-navy/10" />
                    <span className="text-[11px] font-bold text-navy/30 uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-navy/10" />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-navy uppercase tracking-wider ml-1">{t('signin.enter_phone', lang)}</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowCountryPicker(prev => !prev); }}
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
                              onClick={(e) => { e.stopPropagation(); setCountryCode(c.code); setShowCountryPicker(false); }}
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
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || phone.length < 8}
                className="w-full btn-yellow py-4 flex items-center justify-center gap-2 shadow-lg shadow-yellow/20"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    <span>{t('signin.sending_code', lang)}</span>
                  </>
                ) : (
                  <>
                    <span>{t('signin.send_code', lang)}</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* ── OTP verification ─────────────────────────────────── */}
          {step === 'otp' && (
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
